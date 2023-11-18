import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import {
  useConnect,
  useDisconnect,
  useAccount,
  useWalletClient,
  usePublicClient,
} from 'wagmi';
import { useDisclosure } from '@chakra-ui/react';
import { GetWalletContextInterface } from '../models/interfaces';

//contracts abstraction
import EscrowAbi from '../../contracts/Escrow.json';
import HMTokenAbi from '../../contracts/HMToken.json';
import EscrowFactoryAbi from '../../contracts/EscrowFactory.json';
import WalletConnectModal from '../../components/Modals/WalletConnectModal';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';

//environment variables
const { VITE_ESCROWFACTORYADDRESS } = import.meta.env;

// @ts-ignore
export const GetWalletContext = React.createContext<GetWalletContextInterface>(
  // @ts-ignore
  {},
);

export async function web3Provider(connString: string): Promise<Web3> {
  const web3Instance = new Web3(connString);
  await web3Instance.eth.net.isListening();
  return web3Instance;
}

export const GetWalletProvider: React.FC<any> = ({ children }) => {
  const { error } = useConnect();
  const { ethereum }: any = window;
  const publicClient = usePublicClient();
  const { disconnect } = useDisconnect();
  const [web3error, setError] = useState<any>('');
  const { data: walletClient } = useWalletClient();
  const [caccount, setCAccount] = useState<string | undefined>();
  const { address: account, isConnected } = useAccount();
  const [isConnectable, setIsConnectable] = useState(false);
  const [web3loading, setLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>();

  const {
    isOpen: wisOpen,
    onOpen: wonOpen,
    onClose: wonClose,
  } = useDisclosure();

  const minABI: any = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    },
  ];

  async function getToken(
    tokenAddress: string,
    providerUrl: string,
  ): Promise<any> {
    setLoading(true);
    let metadataRaw = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      headers: {
        'Content-Type': 'application/json',
      },
      params: [`${tokenAddress}`],
      id: 42,
    });

    let metadataRequestOptions: any = {
      method: 'POST',
      body: metadataRaw,
      redirect: 'follow',
    };

    return await fetch(providerUrl, metadataRequestOptions)
      .then(async (response) => {
        const res: any = await response.json();

        return res?.result;
      })
      .catch((e: any | unknown) => {
        console.log('error', e);
        setError({ ...error, e });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function getTokenInfo(providerUrl: string, tokenAddress: any) {
    if (!isConnected) return;

    const web3 = await web3Provider(providerUrl);
    const contract = new web3.eth.Contract(minABI, tokenAddress);
    setLoading(true);

    try {
      const bal = await contract.methods.balanceOf(account).call();
      const tokenInfo = await getToken(tokenAddress, providerUrl);

      return {
        balance: bal / 10 ** tokenInfo?.decimals,
        logo: tokenInfo?.logo,
        tokenName: tokenInfo?.name,
        symbol: tokenInfo?.symbol,
        decimals: tokenInfo?.decimals,
        tokenAddress,
      };
    } catch (e: any | unknown) {
      setLoading(false);
      console.log(e, 'getBalanceErr');
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  async function getTokenRate(id: string) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/${id}`;
    return axios
      .get(apiUrl)
      .then((response) => response.data)
      .catch((error) => console.error('Error:', error));
  }

  const handleCConnect = useCallback(() => {
    if (account) return;
    detectConcordiumProvider()
      .then((provider) => provider.connect())
      .then(setCAccount);
  }, []);

  useEffect(() => {
    detectConcordiumProvider()
      .then((provider) => {
        // Listen for relevant events from the wallet.
        provider.on('accountChanged', setCAccount);
        provider.on('accountDisconnected', () =>
          provider.getMostRecentlySelectedAccount().then(setCAccount),
        );
        // Check if you are already connected
        provider.getMostRecentlySelectedAccount().then(setCAccount);
      })
      .catch(() => setCAccount(undefined));

    if (!ethereum) return setIsConnectable(false);
  }, []);

  return (
    <GetWalletContext.Provider
      value={{
        publicClient,
        isConnectable,
        isConnected,
        account,
        disconnect,
        getTokenInfo,
        web3loading,
        web3error,
        EscrowFactoryAbi,
        EscrowAbi,
        VITE_ESCROWFACTORYADDRESS,
        HMTokenAbi,
        web3Provider,
        walletClient,
        wonOpen,
        getTokenRate,
        caccount,
        handleCConnect,
        authToken,
        setAuthToken,
      }}
    >
      {children}

      <WalletConnectModal {...{ wisOpen, wonClose, wonOpen }} />
    </GetWalletContext.Provider>
  );
};
