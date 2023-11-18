import { Avatar } from '@chakra-ui/react';

const ConnectorIcon = ({ connector }: any) => {
  return (
    <Avatar
      size={'sm'}
      rounded={'none'}
      src={
        connector.id === 'metaMask'
          ? '/icons/Metamask.svg'
          : connector.id === 'coinbaseWallet'
          ? '/icons/Coinbase.svg'
          : connector.id === 'walletConnect'
          ? '/icons/WalletConnect.svg'
          : ''
      }
      title={connector.name}
    />
  );
};

export default ConnectorIcon;
