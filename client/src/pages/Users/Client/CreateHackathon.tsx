import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { SideMenu } from '.';
import { AddIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { Suspense, useContext, useEffect, useState } from 'react';
import { GetWalletContext } from '../../../store/contextProviders/connectWallet';
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import {
  createOffChainHackathon,
  initHackathon,
  resetErrMsg,
  resetInitialized,
  resetIsCreatedOffChainHackathon,
  resetSent,
  sendHackathon,
} from '../../../store/slices/hackathonSlice';
import {
  HackathonInitProps,
  HackathonStateProps,
} from '../../../store/interfaces/hackathon.interface';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ExternalLink } from '../../../utils/Link';
import { useNavigate } from 'react-router-dom';
import { HomeNavbar, MetaTags } from '../../../reusable/components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HackathonSendProps } from '../../../store/interfaces/hackathon.interface';
import { supportedTokens } from '../../../utils/tokens';
import { chains } from '../../../utils/config';
import { getEventSelector, parseEther } from 'viem';
import { isScientificNotation } from '../../../utils/utils';

const { VITE_MIN_HACKATHON_AMOUNT } = import.meta.env;

function hexToBigNumber(hexString: string | any) {
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }

  const base10Number = parseInt(hexString, 16);

  const bigNumber = {
    toString: () => base10Number.toString(),
    toNumber: () => base10Number,
  };

  return bigNumber;
}

function CreateHackathon() {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { address: account, isConnected } = useAccount();
  const { chain } = useNetwork();

  const {
    isLoading: wagmiSwitchLoading,
    pendingChainId: wagmiSwitchPendingChainId,
    switchNetwork,
  } = useSwitchNetwork();

  const [hackathonName, setHackathonName] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submissionCriteria, setSubmissionCriteria] = useState('');
  const [events, setEvents] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [submissionDeadline, setSubmissionDeadline] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [numInputs, setNumInputs] = useState(0);
  const [equalDistribution, setEqualDistribution] = useState('no');
  const [equalDistributionAmount, setEqualDistributionAmount] =
    useState<any>(0);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [created, setCreated] = useState(false);
  const [alertName, setAlertName] = useState<string>('');
  const [alertStartDate, setAlertStartDate] = useState<string>('');
  const [alertSubDeadline, setAlertSubDeadline] = useState<string>('');
  const [alertEndDate, setAlertEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [documentations, setDocumentations] = useState<any[]>([]);
  const [documentation, setDocumentation] = useState<string>('');
  const [rewardTokenAddress, setRewardTokenAddress] = useState<any>(
    supportedTokens[0].address,
  );
  const [launchOnChain, setLaunchOnChain] = useState(false);
  const [offChain, setOffChain] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | undefined>();

  const handleLaunchOnChainChange = () => {
    setLaunchOnChain(true);
    setOffChain(false);
  };

  const handleOffChainChange = () => {
    setLaunchOnChain(false);
    setOffChain(true);
  };

  const handleSelectRewardTokenAddress = (event: any) => {
    const _address = event.target.value;
    if (!_address) return;
    setRewardTokenAddress(_address);
  };

  useEffect(() => {
    setCurrentChainId(chain?.id);
  }, [chain?.id]);

  const handleNetworkChange = (chainId: number) => {
    if (currentChainId === chainId) return;
    switchNetwork?.(chainId);
  };

  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const { HMTokenAbi, getTokenInfo, publicClient, walletClient, wonOpen } =
    useContext(GetWalletContext);

  const rewardTokenContract = new ethers.Contract(
    rewardTokenAddress!,
    HMTokenAbi,
    walletClient,
  );

  const { data: balanceData } = useBalance({
    address: rewardTokenAddress!,
  });

  const myTokenBalance = (
    Number(balanceData?.value) / tokenInfo?.decimals
  ).toFixed(3);

  const [inputData, setInputData] = useState(
    (numInputs && Array(numInputs).fill('')) || [''],
  );

  const handleNumInputChange = (value: any) => {
    const num = parseInt(value);

    if (num <= 0) {
      return alert('Values is less than 1');
    }

    setNumInputs(num);
    setInputData((num > 0 && Array(num).fill('')) || ['']);
  };

  const handleInputChange = (index: any, value: any) => {
    const newData = [...inputData];
    newData[index] = value;
    setInputData(newData);
  };

  const handleDecide = (e: any) => {
    const value = e.target.value;
    setEqualDistribution(value === equalDistribution ? null : value);
  };

  useEffect(() => {
    if (alertName) {
      setTimeout(() => {
        setAlertName('');
        // setAlertAudience('');
        setAlertStartDate('');
        setAlertEndDate('');
        setAlertSubDeadline('');
      }, 3000);
    }
  }, [alertName, alertStartDate, alertEndDate, alertSubDeadline]);

  const rewardCount = inputData.filter((amount) => amount !== '').length;

  const inputs = [];
  for (let i = 0; i < numInputs; i++) {
    const key = i + 1;
    inputs.push(
      <Flex mr="12px" direction={'column'} mb="1rem" key={key}>
        <Flex
          alignItems={'center'}
          borderWidth={'1px'}
          borderColor={'brand.primary'}
          px={'0.5rem'}
          py="0.5rem"
          borderRadius={'4px'}
        >
          <Flex alignItems={'center'} mr="0.2rem">
            <Avatar
              size={'xs'}
              src={tokenInfo?.logo}
              title={tokenInfo?.symbol}
            />
          </Flex>
          <Input
            bg="white"
            type="number"
            h="18px"
            borderRadius={'4px'}
            width={'70px'}
            size={'xs'}
            p="0.8rem"
            paddingLeft="0.5rem"
            key={i}
            value={inputData[i]}
            onChange={(e) => handleInputChange(i, e.target.value)}
            borderColor="brand.secondary"
            borderWidth={'1px'}
            outline={'none'}
            boxShadow="none"
            // isDisabled={
            //   loading || hackathonSlice?.sending || hackathonSlice?.initializing
            // }
            _focus={{
              outline: 'none',
              boxShadow: 'none',
            }}
          />
        </Flex>
      </Flex>,
    );
  }

  const totalRewardinUsd = inputData
    .filter((data) => data !== '')
    .reduce(
      (totalCount, nextCount) => parseInt(totalCount) + parseInt(nextCount),
      0,
    );

  const amountToChargeClient: any = 0;
  const totalRewardinUsdWithPercent = totalRewardinUsd;

  const tokenAmounts =
    equalDistribution === 'yes' ? equalDistributionAmount : totalRewardinUsd;

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const onSetDocumentations = () => {
    //TODO: verify its a link and from google drive, dropbox

    if (!documentation) return;

    const updatedDocumentation = documentation.startsWith('www.')
      ? documentation.replace(/^www\./i, 'https://')
      : documentation.startsWith('http://')
      ? documentation.replace(/^http:/i, 'https:')
      : documentation.startsWith('https://')
      ? documentation
      : 'https://' + documentation;

    const updatedDocumentations = [
      ...documentations.filter((value) => value),
      { documentation: updatedDocumentation, id: uuidv4() },
    ];

    setDocumentations(updatedDocumentations);
    setDocumentation('');
  };

  const onDeleteDocumentation = (id: string) => {
    const update = documentations.filter((doc) => doc.id !== id);
    setDocumentations(update);
  };

  const onSend = async () => {
    // const isDescriptionEmpty = !description || /^\s*$/.test(description);
    // const isValueLessThan50Chars = description.length < 50;

    if (!chain?.id) {
      return toast({
        title: 'Connection Error',
        description: 'Connect your wallet to proceed',
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!hackathonName || !description || !submissionCriteria || !events) {
      return toast({
        description: 'Please fill all the fields to proceed',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    const filteredDocumentations =
      documentations.filter((documentation) => documentation).length < 1;

    if (filteredDocumentations) {
      return toast({
        description: 'Please provide documentation(s)',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!equalDistribution) {
      return toast({
        description: 'Should winners get rewarded with same amount?',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!startDate) {
      return toast({
        description: `Please select the start date`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!endDate) {
      return toast({
        description: `Please select the end date`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!submissionDeadline) {
      return toast({
        description: `Please select the submission deadline`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (equalDistribution === 'no') {
      if (rewardCount <= 0) {
        return toast({
          description: 'Provide amount of reward',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }

      if (rewardCount < numInputs) {
        return toast({
          description: 'Provide rewards amount',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }

      if (
        launchOnChain &&
        tokenInfo &&
        tokenInfo.balance < totalRewardinUsdWithPercent
      ) {
        return toast({
          description: 'Balance is Less than rewards provided',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }

      if (
        totalRewardinUsd < parseInt(VITE_MIN_HACKATHON_AMOUNT && launchOnChain)
      ) {
        return toast({
          title: 'Reward too small',
          description: `Minimum reward is ${VITE_MIN_HACKATHON_AMOUNT} USD`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }

      // if (isDescriptionEmpty || isValueLessThan50Chars) {
      //   return toast({
      //     title: 'Describe your hackathon',
      //     description: `Please describe your hackathon properly`,
      //     status: 'warning',
      //     duration: 5000,
      //     isClosable: true,
      //     position: 'top-right',
      //   });
      // }

      const initialRewardAmount =
        parseInt(tokenAmounts) + parseInt(amountToChargeClient);

      const data: HackathonInitProps = {
        hackathonName,
        description,
        submissionCriteria,
        events,
        startDate,
        submissionDeadline,
        endDate,
        equalDistribution,
        initialRewardAmount,
        account,
        chainId: chain?.id,
        rewardTokenAddress,
        isOnchain: launchOnChain ? launchOnChain : false,
      };

      //launch on chain hackathon
      if (launchOnChain) return dispatch(initHackathon(data));

      //launch offchain hackathon
      return dispatch(
        createOffChainHackathon({
          ...data,
          totalRewardinUsd: tokenAmounts,
          rewardsArrayInUSD: inputData,
          hackathonName,
          description,
          submissionCriteria,
          events,
          rewardCount,
          escrowAddress: hackathonSlice?.escrowProps?.escrow,
          account,
          networkName: chains.find((c) => c.chainId === chain?.id)?.name,
          chainId: chain?.id,
          endDate,
          equalDistribution,
          documentations,
          startDate,
          submissionDeadline,
        }),
      );
    } else if (equalDistribution === 'yes') {
      if (numInputs <= 0) {
        return toast({
          description: 'How many participants do you want to reward?',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }

      if (equalDistributionAmount <= 10) {
        return toast({
          description: `Reward is too small`,
          status: 'warning',
          position: 'top-right',
          duration: 5000,
          isClosable: true,
        });
      }

      const initialRewardAmount =
        parseInt(tokenAmounts) + parseInt(amountToChargeClient);

      const data: HackathonInitProps = {
        hackathonName,
        description,
        submissionCriteria,
        events,
        startDate,
        submissionDeadline,
        endDate,
        equalDistribution,
        initialRewardAmount,
        account,
        chainId: chain?.id,
        rewardTokenAddress,
        isOnchain: launchOnChain ? launchOnChain : offChain,
      };

      dispatch(initHackathon(data));
    }
  };

  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          position: 'top-right',
          duration: 10000,
          onCloseComplete: () => dispatch(resetErrMsg()),
          isClosable: true,
        }),
      ),
    );
  };

  useEffect(() => {
    if (hackathonSlice?.initialized) {
      toast({
        title: 'Hackathon initialized successfully',
        description: 'Proceed to fund your Hackathon',
        position: 'top-right',
        status: 'success',
        duration: 19000,
        isClosable: true,
        onCloseComplete() {
          dispatch(resetInitialized());
        },
      });
    }

    if (hackathonSlice?.createdOffChainHackathon) {
      toast({
        title: 'Hackathon Created',
        description:
          'Your Hackathon was created successfully and will be published after reviewed',
        position: 'top-right',
        status: 'success',
        duration: 19000,
        isClosable: true,
        onCloseComplete() {
          dispatch(resetIsCreatedOffChainHackathon());
        },
      });
    }
  }, [hackathonSlice?.initialized, hackathonSlice?.createdOffChainHackathon]);

  useEffect(() => {
    if (hackathonSlice?.initialized) {
      (async () => {
        setLoading(true);

        const values = {
          hackathonName,
          description,
          submissionCriteria,
          events,
          rewardCount: equalDistribution === 'yes' ? numInputs : rewardCount,
          escrowAddress: hackathonSlice?.escrowProps?.escrow,
          account,
          totalRewardinUsd: tokenAmounts,
          rewardsArrayInUSD: equalDistribution === 'yes' ? [] : inputData,
          submissionDeadline,
          networkName: chains.find((c) => c.chainId === chain?.id)?.name,
          chainId: chain?.id,
          endDate,
          equalDistribution,
          documentations,
          startDate,
          escrowId: hackathonSlice?.escrowProps?.id,
        };

        const amountToDeposit =
          hackathonSlice?.escrowProps &&
          hackathonSlice.escrowProps.initialRewardAmount;

        const amount = ethers.parseUnits(
          `${amountToDeposit?.toString()}`,
          parseInt(tokenInfo?.decimals),
        );

        try {
          const data = rewardTokenContract.interface.encodeFunctionData(
            'transfer',
            [hackathonSlice?.escrowProps?.escrow, amount],
          );

          const gasEstimate = await publicClient.estimateGas({
            account: account,
            from: account,
            to: rewardTokenAddress!,
            value: parseEther('0.00'),
            data: data,
          });

          const hash = await walletClient.sendTransaction({
            to: rewardTokenAddress!,
            from: account,
            value: parseEther('0.00'),
            data: data,
            gas: Number(gasEstimate),
          });

          const rc = await publicClient.waitForTransactionReceipt({ hash });

          const transferEvent: any = rc.logs.find((log: any) => {
            return (
              log.topics[0] ===
              getEventSelector('Transfer(address,address,uint256)')
            );
          });

          if (transferEvent) {
            // const from = transferEvent.topics[1];
            // const to = transferEvent.topics[2];
            const amount = transferEvent.data;
            const bigNumber = hexToBigNumber(amount).toString();

            let value;
            const isSci = isScientificNotation(bigNumber);

            value = isSci ? tokenAmounts : parseFloat(bigNumber);

            const dpt = (
              Number(value) /
              10 ** tokenInfo?.decimals
            ).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 6,
            });

            const depositedTokenAmount = dpt.replace(',', '');

            const sendData: HackathonSendProps = {
              ...values,
              tokenAmounts,
              depositedTokenAmount,
              rewardTokenAddress: rewardTokenAddress!,
            };

            dispatch(
              // @ts-ignore
              sendHackathon(sendData),
            );

            setLoading(false);
            setCreated(true);
          }
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      })();
    }

    // fund the escrow address
  }, [hackathonSlice?.initialized]);

  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'CREATE_HACKATHON_ERROR'
    ) {
      displayErrorToasts();
    }

    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'INIT_ESCROW_ERROR'
    ) {
      displayErrorToasts();
    }

    if (hackathonSlice?.sent) {
      setLoading(false);
      toast({
        title: 'Your hackathon is sent for review',
        description:
          'Your hackathon has been sent for review, once approved, it will display for participants to register and participate',
        status: 'success',
        duration: 10000,
        onCloseComplete: () => dispatch(resetSent()),
        isClosable: true,
        position: 'top-right',
      });

      navigate('/cdashboard', { replace: true });
    }

    if (hackathonSlice?.createdOffChainHackathon) {
      navigate('/cdashboard', { replace: true });
    }
  }, [
    hackathonSlice?.sent,
    created,
    hackathonSlice?.errMsg,
    hackathonSlice?.createdOffChainHackathon,
  ]);

  useEffect(() => {
    (async () => {
      const _tokenChain = chains.find((c) => c.chainId === chain?.id);

      const info = await getTokenInfo(
        _tokenChain?.providerUrl,
        rewardTokenAddress!,
      );

      setTokenInfo(info);
    })();
  }, [rewardTokenAddress]);

  useEffect(() => {
    (async () => {
      const _tokenChain = chains.find((c) => c.chainId === chain?.id);
      const chainTokens = supportedTokens.filter(
        (token) => token.chainId === chain?.id,
      );

      setRewardTokenAddress(chainTokens[0].address);

      const info = await getTokenInfo(
        _tokenChain?.providerUrl,
        chainTokens[0].address,
      );

      setTokenInfo(info);
    })();
  }, [isConnected, wagmiSwitchLoading]);

  useEffect(() => {
    if (hackathonSlice?.createdOffChainHackathon) {
    }
  }, [
    hackathonSlice?.createdOffChainHackathon,
    hackathonSlice?.isCreatingOffChainHackathonLoading,
  ]);

  const ChainToken = ({ _chainId, supportedTokens }: any) => {
    const _tokens = supportedTokens.filter(
      (token: any) => token.chainId === _chainId,
    );

    return (
      <>
        {_tokens.length > 0 ? (
          <>
            <FormLabel fontSize={'14px'}>Select Reward Token</FormLabel>
            <Select
              value={rewardTokenAddress!}
              onChange={handleSelectRewardTokenAddress}
            >
              {_tokens.map(({ symbol, address }: any) => (
                <option value={address} key={symbol}>
                  {symbol}
                </option>
              ))}
            </Select>
          </>
        ) : (
          <Text my="2rem" color="brand.danger">
            No tokens for the selected network
          </Text>
        )}
      </>
    );
  };

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/settings?creating=yes&msg=Update your company information&type=settings"
        condition={userSlice?.user?.company ? true : false}
      >
        <>
          <MetaTags
            title={'Create your Hackathon'}
            description={'Create hackathon'}
            pageUrl={window.location.href}
          />
          <HomeNavbar />
          <BodyWrapper>
            <>
              <Box
                w={{ base: 'full' }}
                maxW={{ lg: '1199px' }}
                mx="auto"
                mb={'50px'}
                mt={{ lg: '6rem', base: '8rem' }}
                px={{ base: '1rem', lg: 'unset' }}
              >
                <Grid
                  mt={{ lg: '3rem' }}
                  templateAreas={`"nav main"
                "nav footer"`}
                  gridTemplateColumns={'200px 1fr'}
                  gap="10"
                  color="blackAlpha.700"
                >
                  <GridItem bg="white" area={'nav'}>
                    <SideMenu />
                  </GridItem>

                  <GridItem
                    bg="white"
                    area={'main'}
                    color="brand.secondary"
                    fontSize={{ lg: '16px' }}
                  >
                    <Breadcrumb
                      mb={{ lg: '1rem' }}
                      spacing="8px"
                      separator={<ChevronRightIcon color="gray.500" />}
                      fontSize={'12px'}
                    >
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={
                            userSlice?.user?.roles.includes(Role.Admin)
                              ? '/adashboard'
                              : userSlice?.user?.roles.includes(Role.Client)
                              ? '/cdashboard'
                              : '/dashboard'
                          }
                        >
                          Dashboard
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          isCurrentPage
                          color="brand.primary"
                        >
                          Create Hackathon
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Breadcrumb>

                    {isConnected ? (
                      <>
                        <Box
                          px="1rem"
                          py={'1rem'}
                          borderRadius={'lg'}
                          bg="#F3FAFF"
                          shadow={'0 2px 4px rgba(243, 250, 255, 0.5)'}
                        >
                          <Text fontSize={{ lg: '48px' }} fontWeight={'bold'}>
                            Create your Hackathon
                          </Text>

                          <Text fontSize={'16px'} my="0.5rem" display={'none'}>
                            Create your hackathon
                          </Text>

                          <UnorderedList color={'brand.danger'} mt="1rem">
                            <ListItem>
                              Do not close or refresh this page when you start
                              the process.
                            </ListItem>
                          </UnorderedList>
                        </Box>

                        <Box
                          p="1rem"
                          boxShadow={'rgba(16, 24, 40, 0.03)'}
                          mt="32px"
                          borderWidth={'1px'}
                          borderRadius={'lg'}
                        >
                          <FormControl mb="1rem" isRequired>
                            <FormLabel fontSize="14px">
                              Hackathon Name
                            </FormLabel>
                            <Input
                              onChange={(e) => setHackathonName(e.target.value)}
                              value={hackathonName}
                              outline={'unset'}
                              boxShadow="none"
                              borderColor="black"
                              type="text"
                            />
                          </FormControl>
                          <FormControl mt="17px" isRequired>
                            <FormLabel fontSize={'14px'}>
                              Hackathon Description
                            </FormLabel>

                            <div
                              style={{
                                height: '200px',
                                minHeight: '200px',
                                maxHeight: '100%',
                                position: 'relative',
                              }}
                            >
                              <ReactQuill
                                style={{
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                }}
                                theme="snow"
                                value={description}
                                onChange={(value) => setDescription(value)}
                              />
                            </div>
                          </FormControl>
                          <FormControl
                            mt={{ lg: '4rem', md: '4rem', sm: '7rem' }}
                            isRequired
                          >
                            <FormLabel fontSize={'14px'}>
                              Hackathon Submission Criteria
                            </FormLabel>

                            <div
                              style={{
                                height: '200px',
                                minHeight: '200px',
                                maxHeight: '100%',
                                position: 'relative',
                              }}
                            >
                              <ReactQuill
                                style={{
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                }}
                                theme="snow"
                                value={submissionCriteria}
                                onChange={(value) =>
                                  setSubmissionCriteria(value)
                                }
                              />
                            </div>
                          </FormControl>
                          <FormControl
                            mt={{ lg: '4rem', md: '4rem', sm: '7rem' }}
                            isRequired
                          >
                            <FormLabel fontSize={'14px'}>
                              Hackathon Events
                            </FormLabel>

                            <div
                              style={{
                                height: '200px',
                                minHeight: '200px',
                                maxHeight: '100%',
                                position: 'relative',
                              }}
                            >
                              <ReactQuill
                                style={{
                                  height: '100%',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                }}
                                theme="snow"
                                value={events}
                                onChange={(value) => setEvents(value)}
                              />
                            </div>
                          </FormControl>

                          <FormControl
                            isRequired
                            mt={{ lg: '4rem', md: '4rem', sm: '7rem' }}
                          >
                            <Stack spacing={5} direction="row">
                              <Checkbox
                                defaultChecked={launchOnChain}
                                isChecked={launchOnChain}
                                onChange={handleLaunchOnChainChange}
                              >
                                Launch On Chain With Escrow
                              </Checkbox>
                              <Checkbox
                                defaultChecked={offChain}
                                isChecked={offChain}
                                onChange={handleOffChainChange}
                              >
                                Off Chain
                              </Checkbox>
                            </Stack>
                          </FormControl>

                          <FormControl
                            mt={{ md: '1.5rem', sm: '7rem' }}
                            isRequired
                          >
                            <FormLabel fontSize={'14px'}>
                              Add Documentation Links
                            </FormLabel>
                            <Flex alignItems={'center'}>
                              <Input
                                onChange={(e) =>
                                  setDocumentation(e.target.value)
                                }
                                placeholder="Insert link"
                                maxW={'374px'}
                                mr="1rem"
                                size={'sm'}
                                value={documentation}
                              />
                              <Button
                                size={'sm'}
                                bg="white"
                                color="brand.primary"
                                borderWidth={'0.5px'}
                                borderColor={'brand.primary'}
                                _hover={{
                                  bg: 'brand.primary',
                                  color: 'white',
                                }}
                                leftIcon={<AddIcon />}
                                onClick={onSetDocumentations}
                              >
                                Add
                              </Button>
                            </Flex>
                          </FormControl>
                          <UnorderedList
                            spacing={'1'}
                            flexDirection={'row'}
                            mt="1rem"
                          >
                            {documentations.filter((doc) => doc).length > 0 &&
                              documentations.map((doc, index: number) => (
                                <Flex
                                  key={index}
                                  padding={'none'}
                                  flexDirection={'row'}
                                  alignItems={'center'}
                                >
                                  <Button
                                    size={'xs'}
                                    mr="0.5rem"
                                    bg="unset !important"
                                    onClick={() =>
                                      onDeleteDocumentation(doc.id)
                                    }
                                  >
                                    <DeleteIcon color="brand.danger" />
                                  </Button>
                                  <Text color="brand.primary">
                                    <ExternalLink href={doc.documentation}>
                                      {doc.documentation}
                                    </ExternalLink>
                                  </Text>
                                </Flex>
                              ))}
                          </UnorderedList>
                          <Box mb="1rem" display={'none'}>
                            <FormControl mt="17px" isRequired>
                              <Flex direction="column">
                                <FormLabel fontSize={'14px'}>
                                  Do you want winners to be rewarded equally
                                </FormLabel>
                                <Stack spacing={5} direction="row">
                                  <Checkbox
                                    size={'sm'}
                                    colorScheme="green"
                                    value="yes"
                                    isChecked={
                                      equalDistribution == 'yes' && true
                                    }
                                    onChange={handleDecide}
                                  >
                                    Yes
                                  </Checkbox>
                                  <Checkbox
                                    size={'sm'}
                                    colorScheme="red"
                                    value="no"
                                    isChecked={
                                      equalDistribution == 'no' && true
                                    }
                                    onChange={handleDecide}
                                  >
                                    No
                                  </Checkbox>
                                </Stack>
                              </Flex>
                            </FormControl>
                          </Box>
                          <FormControl mt="17px" isRequired>
                            <FormLabel fontSize={'14px'}>
                              How many participants do you want to reward
                            </FormLabel>
                            <NumberInput
                              boxShadow={'none'}
                              outline={'none'}
                              max={250}
                              clampValueOnBlur={false}
                              size={'sm'}
                              bg="white"
                              defaultValue={numInputs}
                              onChange={handleNumInputChange}
                              width={'100px'}
                              name="reward_count"
                              borderRadius={'md'}
                              borderColor="black"
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper
                                  bg="gray.300"
                                  color={'black'}
                                />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          {equalDistribution === 'no' ? (
                            <FormControl mt="17px">
                              <Flex flexWrap={'wrap'}>
                                {inputs.length > 0 && inputs}
                              </Flex>
                            </FormControl>
                          ) : null}
                          <FormControl
                            display={
                              (equalDistribution === 'no' && 'none') || ''
                            }
                            mt="1rem"
                            isRequired
                          >
                            <FormLabel fontSize={'14px'}>
                              How much do you want participants to share?
                            </FormLabel>
                            <Flex mr="12px" direction={'column'} mb="1rem">
                              <Flex alignItems={'center'}>
                                <Flex alignItems={'center'} mr="0.2rem">
                                  <Avatar size={'xs'} src={tokenInfo?.symbol} />
                                </Flex>
                                <Input
                                  bg="white"
                                  h="18px"
                                  type={'number'}
                                  width={'80px'}
                                  size={'xs'}
                                  borderRadius={'md'}
                                  p="0.8rem"
                                  paddingLeft="0.5rem"
                                  borderColor="black"
                                  borderWidth={'1px'}
                                  outline={'none'}
                                  boxShadow="none"
                                  _focus={{
                                    outline: 'none',
                                    boxShadow: 'none',
                                  }}
                                  onChange={(e) =>
                                    setEqualDistributionAmount(e.target.value)
                                  }
                                  defaultValue={equalDistributionAmount}
                                />
                              </Flex>
                            </Flex>
                          </FormControl>
                          <FormControl
                            isRequired
                            mt="17px"
                            maxW={{ base: '100%', sm: '350px' }}
                          >
                            <FormLabel fontSize={'14px'}>Start Date</FormLabel>
                            <Input
                              defaultValue={startDate}
                              placeholder="Select Date and Time"
                              size="md"
                              type="datetime-local"
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </FormControl>
                          <FormControl
                            isRequired
                            mt="17px"
                            maxW={{ base: '100%', sm: '350px' }}
                          >
                            <FormLabel fontSize={{ base: '12px', sm: '14px' }}>
                              Submission Deadline (UTC)
                            </FormLabel>
                            <Input
                              defaultValue={submissionDeadline}
                              placeholder="Select Date and Time"
                              size="md"
                              type="datetime-local"
                              onChange={(e) =>
                                setSubmissionDeadline(e.target.value)
                              }
                              fontSize={{ base: '12px', sm: '14px' }}
                            />
                          </FormControl>
                          <FormControl
                            isRequired
                            mt="17px"
                            maxW={{ base: '100%', sm: '350px' }}
                          >
                            <FormLabel fontSize={'14px'}>End Date</FormLabel>
                            <Input
                              defaultValue={endDate}
                              placeholder="Select Date and Time"
                              size="md"
                              type="datetime-local"
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </FormControl>

                          <Box
                            mt={{ base: '17px', sm: '10px' }}
                            display={
                              launchOnChain || offChain ? 'block' : 'none'
                            }
                          >
                            <FormControl isRequired>
                              <FormLabel
                                fontSize={{ base: '12px', sm: '14px' }}
                              >
                                Select chain
                              </FormLabel>
                              <CheckboxGroup colorScheme="green">
                                <Stack
                                  spacing={2}
                                  direction={{
                                    base: 'column',
                                    sm: 'column',
                                    md: 'row',
                                  }}
                                >
                                  {chains.map((_chain) => (
                                    <Button
                                      key={_chain.chainId}
                                      pr={{ md: '20px' }}
                                      disabled={_chain.chainId === chain?.id}
                                      isLoading={
                                        wagmiSwitchLoading &&
                                        _chain.chainId ===
                                          wagmiSwitchPendingChainId
                                      }
                                      borderWidth={'1px'}
                                      borderColor="brand.primary"
                                      color={
                                        _chain.chainId === chain?.id
                                          ? 'white'
                                          : 'brand.primary'
                                      }
                                      bg={
                                        _chain.chainId === chain?.id
                                          ? 'brand.primary'
                                          : 'white'
                                      }
                                      _hover={{
                                        bg: 'brand.secondary',
                                        color: 'white',
                                        borderColor: 'unset',
                                      }}
                                      size={'sm'}
                                      leftIcon={
                                        <Suspense fallback={null}>
                                          <Avatar
                                            size="xs"
                                            src={`/icons/${_chain.logo}`}
                                          />
                                        </Suspense>
                                      }
                                      colorScheme="teal"
                                      variant="solid"
                                      onClick={() =>
                                        handleNetworkChange(_chain.chainId)
                                      }
                                    >
                                      {_chain.name}
                                    </Button>
                                  ))}
                                </Stack>
                              </CheckboxGroup>
                            </FormControl>

                            <FormControl isRequired mt="17px">
                              <ChainToken
                                _chainId={chain?.id}
                                supportedTokens={supportedTokens}
                              />
                            </FormControl>

                            {launchOnChain && tokenInfo && (
                              <Flex align="center" mt="2rem">
                                <Avatar
                                  size={'xs'}
                                  src={tokenInfo?.logo}
                                  boxSize={6}
                                  title={tokenInfo?.name}
                                />
                                <Text ml={2} fontWeight={'bold'}>
                                  {tokenInfo?.balance?.toFixed(0)}
                                  <Text display={'inline'} ml="0.5rem">
                                    {tokenInfo?.symbol}
                                  </Text>
                                </Text>
                              </Flex>
                            )}

                            {launchOnChain ? (
                              tokenInfo?.balance >=
                              parseInt(VITE_MIN_HACKATHON_AMOUNT) ? (
                                <Flex
                                  alignItems={'center'}
                                  justifyContent={'flex-end'}
                                >
                                  <Button
                                    size={'lg'}
                                    isLoading={
                                      hackathonSlice?.initializing ||
                                      loading ||
                                      hackathonSlice?.sending ||
                                      hackathonSlice?.isCreatingOffChainHackathonLoading
                                    }
                                    onClick={onSend}
                                    disabled={
                                      (myTokenBalance <= '1' && true) || false
                                    }
                                    _hover={{
                                      backgroundColor: 'white',
                                      color: 'brand.primary',
                                      borderColor: 'brand.primary',
                                      borderWidth: '1px',
                                    }}
                                    color="white"
                                    fontSize={'14px'}
                                    my="1rem"
                                    bg="brand.primary"
                                  >
                                    Save
                                  </Button>
                                </Flex>
                              ) : (
                                tokenInfo && (
                                  <Text
                                    color="brand.danger"
                                    mt="1rem"
                                    fontWeight={'bold'}
                                  >
                                    You need at least{' '}
                                    {VITE_MIN_HACKATHON_AMOUNT}{' '}
                                    {tokenInfo?.symbol} to launch a hackathon
                                  </Text>
                                )
                              )
                            ) : (
                              <Flex
                                alignItems={'center'}
                                justifyContent={'flex-end'}
                              >
                                <Button
                                  size={'lg'}
                                  isLoading={
                                    hackathonSlice?.initializing ||
                                    loading ||
                                    hackathonSlice?.sending ||
                                    hackathonSlice?.isCreatingOffChainHackathonLoading
                                  }
                                  onClick={onSend}
                                  disabled={
                                    (myTokenBalance <= '1' && true) || false
                                  }
                                  _hover={{
                                    backgroundColor: 'white',
                                    color: 'brand.primary',
                                    borderColor: 'brand.primary',
                                    borderWidth: '1px',
                                  }}
                                  color="white"
                                  fontSize={'14px'}
                                  my="1rem"
                                  bg="brand.primary"
                                >
                                  Save
                                </Button>
                              </Flex>
                            )}
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button
                          color={'white'}
                          bg="brand.primary"
                          onClick={wonOpen}
                        >
                          Connect your wallet
                        </Button>
                      </>
                    )}
                  </GridItem>
                </Grid>
              </Box>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default CreateHackathon;
