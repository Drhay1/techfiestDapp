import {
  Avatar,
  Box,
  Button,
  Center,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { SideMenu } from '.';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { UserStateProps } from '../../../store/interfaces/user.interface';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import React, { Suspense, useContext, useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HackathonSendProps } from '../../../store/interfaces/hackathon.interface';
import { supportedTokens } from '../../../utils/tokens';
import { chains } from '../../../utils/config';
import { getEventSelector, parseEther } from 'viem';
import { isScientificNotation } from '../../../utils/utils';
import AuthNavbar from '../../../reusable/components/AuthNavbar';
import { TimePicker } from 'antd';
import { DatePicker } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { BiSave } from 'react-icons/bi';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

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
  const steps = [
    { title: 'Launch' },
    { title: 'Details' },
    { title: 'Rewards' },
    { title: 'Criteria' },
    { title: 'Events' },
  ];

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

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [size] = useState<SizeType>('small');
  const [hackathonName, setHackathonName] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submissionCriteria, setSubmissionCriteria] = useState('');
  const [events, setEvents] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [submissionDeadline, setSubmissionDeadline] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [numInputs, setNumInputs] = useState(0);
  const [equalDistribution /*setEqualDistribution*/] = useState('no');
  const [equalDistributionAmount /*setEqualDistributionAmount*/] =
    useState<any>(0);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [created, setCreated] = useState(false);
  const [alertName, setAlertName] = useState<string>('');
  const [alertStartDate, setAlertStartDate] = useState<string>('');
  const [alertSubDeadline, setAlertSubDeadline] = useState<string>('');
  const [alertEndDate, setAlertEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [documentations /*setDocumentations*/] = useState<any[]>([]);
  // const [documentation, setDocumentation] = useState<string>('');
  const [rewardTokenAddress, setRewardTokenAddress] = useState<any>(
    supportedTokens[0].address,
  );
  const [launchOnChain, setLaunchOnChain] = useState(false);
  const [offChain, setOffChain] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number | undefined>();

  //Sets date and time properties
  const [adate, setAdate] = useState<any>(null);
  const [atime, setAtime] = useState<any>(null);
  // Sets deadline time and date
  const [ddate, setDDate] = useState<any>(null);
  const [dtime, setDTime] = useState<any>(null);
  // Sets end time and date
  const [edate, setEDate] = useState<any>(null);
  const [etime, setETime] = useState<any>(null);

  /* sets time and dates */
  const onGetDDate = (_: any, date: string) => setDDate(date);
  const onGetDTime = (_: any, time: string) => setDTime(time);
  const onGetEDate = (_: any, date: string) => setEDate(date);
  const onGetETime = (_: any, time: string) => setETime(time);
  const onGetStartDate = (_: any, date: string) => setAdate(date);
  const onGetStartTime = (_: any, time: string) => setAtime(time);

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

  // const handleDecide = (e: any) => {
  //   const value = e.target.value;
  //   setEqualDistribution(value === equalDistribution ? null : value);
  // };

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

  // const onSetDocumentations = () => {

  //   if (!documentation) return;

  //   const updatedDocumentation = documentation.startsWith('www.')
  //     ? documentation.replace(/^www\./i, 'https://')
  //     : documentation.startsWith('http://')
  //     ? documentation.replace(/^http:/i, 'https:')
  //     : documentation.startsWith('https://')
  //     ? documentation
  //     : 'https://' + documentation;

  //   const updatedDocumentations = [
  //     ...documentations.filter((value) => value),
  //     { documentation: updatedDocumentation, id: uuidv4() },
  //   ];

  //   setDocumentations(updatedDocumentations);
  //   setDocumentation('');
  // };

  // const onDeleteDocumentation = (id: string) => {
  //   const update = documentations.filter((doc) => doc.id !== id);
  //   setDocumentations(update);
  // };

  const onSend = async () => {
    // const isDescriptionEmpty = !description || /^\s*$/.test(description);
    // const isValueLessThan50Chars = description.length < 50;

    if (!chain?.id) {
      return toast({
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
        render: () => (
          <Center color="white" p={3} bg="brand.primary" borderRadius={'10px'}>
            <Text>Connect your wallet to proceed</Text>
          </Center>
        ),
      });
    }

    if (!hackathonName || !description || !submissionCriteria || !events) {
      return toast({
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
        render: () => (
          <Center color="white" p={3} bg="brand.primary" borderRadius={'10px'}>
            <Text>Please fill all the fields to proceed</Text>
          </Center>
        ),
      });
    }

    // const filteredDocumentations =
    //   documentations.filter((documentation) => documentation).length < 1;

    // if (filteredDocumentations) {
    //   return toast({
    //     description: 'Please provide documentation(s)',
    //     status: 'warning',
    //     duration: 2000,
    //     isClosable: true,
    //     position: 'bottom-left',
    //   });
    // }

    if (!equalDistribution) {
      return toast({
        description: 'Should winners get rewarded with same amount?',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

    if (!startDate) {
      return toast({
        description: `Please select the start date`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

    if (!endDate) {
      return toast({
        description: `Please select the end date`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

    if (!submissionDeadline) {
      return toast({
        description: `Please select the submission deadline`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-left',
      });
    }

    if (equalDistribution === 'no') {
      if (rewardCount <= 0) {
        return toast({
          description: 'Provide amount of reward',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: 'bottom-left',
        });
      }

      if (rewardCount < numInputs) {
        return toast({
          description: 'Provide rewards amount',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position: 'bottom-left',
        });
      }

      if (
        launchOnChain &&
        tokenInfo &&
        tokenInfo.balance < totalRewardinUsdWithPercent
      ) {
        return toast({
          render: () => (
            <Center
              color="white"
              p={3}
              bg="brand.primary"
              borderRadius={'10px'}
            >
              <Text>Balance is less than rewards provider</Text>
            </Center>
          ),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
      }

      if (
        totalRewardinUsd < parseInt(VITE_MIN_HACKATHON_AMOUNT && launchOnChain)
      ) {
        return toast({
          title: 'Reward too small',
          description: `Minimum reward is ${VITE_MIN_HACKATHON_AMOUNT} USD`,
          status: 'warning',
          duration: 3000,
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

  // const handleBeforeUnload = (event: any) => {
  //   event.preventDefault();
  //   event.returnValue = '';

  //   return 'You have unsaved changes. Are you sure you want to leave this page?';
  // };

  // const handleLinkClick = (event: any) => {
  //   if (event.target.tagName === 'A') {
  //     const shouldLeave = window.confirm(
  //       'You have unsaved changes. Are you sure you want to leave this page?',
  //     );

  //     if (!shouldLeave) {
  //       event.preventDefault();
  //     }
  //   }
  // };

  //================================ effects for dates and times ================================
  useEffect(() => {
    if (adate && atime) {
      setStartDate(`${adate}T${atime}`);
    }
  }, [adate, atime]);

  useEffect(() => {
    if (ddate && dtime) {
      setSubmissionDeadline(`${ddate}T${dtime}`);
      console.log(`${ddate}T${dtime}`);
    }
  }, [ddate, dtime]);

  useEffect(() => {
    if (edate && etime) {
      setEndDate(`${edate}T${etime}`);
      console.log(`${edate}T${etime}`);
    }
  }, [edate, etime]);

  useEffect(() => {
    if (hackathonSlice?.initialized) {
      toast({
        title: 'Hackathon initialized successfully',
        description: 'Proceed to fund your Hackathon',
        position: 'bottom-left',
        status: 'success',
        duration: 3000,
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
        duration: 3000,
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
        duration: 3000,
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

  // useEffect(() => {
  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     document.removeEventListener('click', handleLinkClick);
  //   };
  // }, []);
  useEffect(() => {
    if (hackathonSlice?.createdOffChainHackathon) {
    }
  }, [
    hackathonSlice?.createdOffChainHackathon,
    hackathonSlice?.isCreatingOffChainHackathonLoading,
  ]);

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/settings?creating=yes&msg=Update your company information&type=settings"
        condition={userSlice?.user?.company ? true : false}
      >
        <BodyWrapper>
          <>
            <MetaTags
              title={'Create your Hackathon'}
              description={'Create hackathon'}
              pageUrl={window.location.href}
            />
            <AuthNavbar />
            <Flex minH="100vh">
              <Box
                transform={{ base: 'translateX(-1000%)', lg: 'none' }}
                position="fixed"
                h="100vh"
                w="280px"
                zIndex="1"
                className="side-menu"
                transition="transform 0.3s"
                overflow={'hidden'}
                bg="white"
                px="20px"
              >
                <SideMenu />
              </Box>
              <Box
                flex="1"
                overflowX="auto"
                ml={{ base: '0', lg: '280px' }}
                px={{ base: '1rem', md: '0rem', lg: '2rem' }}
              >
                <Box my={{ base: '80px', lg: '90px' }} py="1rem">
                  <Box
                    borderRadius={'0.5rem'}
                    bg={'#FFFFFF'}
                    boxShadow={' 0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
                    backdropFilter={'blur(20px)'}
                    px="1.25rem"
                    py={'1.25rem'}
                    gap={'2.25rem'}
                    display={'flex'}
                    flexDirection={'column'}
                    w={{ lg: '80%' }}
                    margin={'auto'}
                  >
                    <Stepper
                      size="xs"
                      index={activeStep}
                      bg={'rgba(60, 77, 109, 0.05)'}
                      border={'0.5px solid rgba(60, 77, 109, 0.50)'}
                      borderRadius={'0.5rem'}
                      p={'1rem'}
                      color={'#3C4D6D'}
                      flexWrap={'wrap'}
                      fontSize={{ base: '14px', md: '1rem' }}
                    >
                      {steps.map((step, index) => (
                        <Step key={index}>
                          <StepIndicator borderRadius={'0.5rem'}>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box flexShrink="0">
                            <StepTitle>
                              <Text color="brand.secondary">{step.title}</Text>
                            </StepTitle>
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>

                    {!isConnected ? (
                      <Stack>
                        <Flex alignItems={'cetner'} justifyContent={'center'}>
                          <Box
                            as={Button}
                            w="200px"
                            h="100px"
                            bg="brand.primary"
                            onClick={wonOpen}
                            color="white"
                            _hover={{
                              bg: 'white',
                              color: 'brand.primary',
                              borderWidth: '1px',
                              borderColor: 'brand.primary',
                            }}
                          >
                            Connect your wallet
                          </Box>
                        </Flex>
                      </Stack>
                    ) : (
                      <Stack>
                        <Stack display={activeStep === 0 ? 'block' : 'none'}>
                          <Flex
                            w="full"
                            h="full"
                            flexWrap={'wrap'}
                            gap={'1rem'}
                            justifyContent={'center'}
                          >
                            <Box
                              as={Button}
                              w={'220px'}
                              h={'100px'}
                              bg={
                                !launchOnChain
                                  ? 'brand.secondary !important'
                                  : 'white !important'
                              }
                              color={
                                !launchOnChain
                                  ? 'white !important'
                                  : 'brand.secondary !important'
                              }
                              border={
                                !launchOnChain
                                  ? 'none !important'
                                  : '1px solid black !important'
                              }
                              onClick={handleOffChainChange}
                            >
                              <Text fontSize="1rem">
                                Launch{' '}
                                <Text
                                  as="span"
                                  display={'block'}
                                  fontSize={'inherit'}
                                >
                                  Off-chain Hackathon
                                </Text>
                              </Text>
                            </Box>

                            <Box
                              as={Button}
                              w={'220px'}
                              h={'100px'}
                              bg={
                                launchOnChain
                                  ? 'brand.secondary !important'
                                  : 'white !important'
                              }
                              color={
                                launchOnChain
                                  ? 'white !important'
                                  : 'brand.secondary !important'
                              }
                              border={
                                launchOnChain
                                  ? 'none !important'
                                  : '1px solid black !important'
                              }
                              onClick={handleLaunchOnChainChange}
                            >
                              <Text fontSize="1rem">
                                Launch{' '}
                                <Text
                                  as="span"
                                  display={'block'}
                                  fontSize={'inherit'}
                                >
                                  On-chain Hackathon
                                </Text>
                              </Text>
                            </Box>
                          </Flex>

                          <Flex w="full" justifyContent={'center'} mt="2rem">
                            <Box mt={{ base: '17px', sm: '10px' }}>
                              <FormControl>
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
                            </Box>
                          </Flex>

                          <Flex
                            w={'full'}
                            justifyContent={'flex-end'}
                            mt="1rem"
                          >
                            <Button
                              size={'xs'}
                              bg="#0F5EFE"
                              color="#FFFFFF"
                              px="2rem"
                              fontSize={{ lg: '1rem', base: '0.75rem' }}
                              borderRadius={'0.5rem'}
                              transition={'all 0.2s ease-in-out'}
                              _hover={{ filter: 'brightness(105%)' }}
                              borderColor={'#0F5EFE'}
                              rightIcon={<ArrowForwardIcon />}
                              onClick={() => setActiveStep(activeStep + 1)}
                            >
                              Next
                            </Button>
                          </Flex>
                        </Stack>

                        <Stack display={activeStep === 1 ? 'block' : 'none'}>
                          <Text
                            fontSize={{ lg: '1.5rem' }}
                            fontWeight={'700'}
                            mb={'2.25rem'}
                            color={'#3C4D6D'}
                          >
                            Provide your details
                          </Text>

                          <Flex flexDirection={'column'} gap={'1.25rem'}>
                            <Input
                              boxShadow="none"
                              bg="white"
                              borderColor="rgba(60, 77, 109, 0.80)"
                              borderWidth={'0.5px'}
                              w={'100%'}
                              h={'3rem'}
                              fontSize={'1rem'}
                              color={'brand.secondary'}
                              p="1.12rem 0.75rem"
                              outline="none"
                              borderRadius={'0.5rem'}
                              name="name"
                              type={'text'}
                              placeholder={'Hackathon Name'}
                              onChange={(e) => setHackathonName(e.target.value)}
                              value={hackathonName}
                            />
                            <Box mb={{ lg: '4rem', md: '4rem', sm: '7rem' }}>
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
                                  placeholder={'Give techFiesta details'}
                                />
                              </div>
                            </Box>
                            <Grid gridTemplateColumns={'repeat(3,1fr)'}>
                              <GridItem
                                display={'flex'}
                                flexDirection={'column'}
                                gap={'0.6rem'}
                                pr={'1rem'}
                                borderRight={{
                                  lg: '1px solid rgba(60, 77, 109, 0.50)',
                                }}
                              >
                                <Text fontSize={'1rem'} color={'#3C4D6D'}>
                                  Start Date
                                </Text>
                                <DatePicker
                                  size={size}
                                  placeholder="Select a date"
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetStartDate}
                                />

                                <TimePicker
                                  size={size}
                                  placeholder="Select a time"
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetStartTime}
                                />
                              </GridItem>{' '}
                              <GridItem
                                display={'flex'}
                                flexDirection={'column'}
                                gap={'0.6rem'}
                                pl={'1rem'}
                              >
                                <Text fontSize={'1rem'} color={'#3C4D6D'}>
                                  Submission Deadline
                                </Text>
                                <DatePicker
                                  placeholder="Select a date"
                                  size={size}
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetDDate}
                                />
                                <TimePicker
                                  size={size}
                                  placeholder="Select a time"
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetDTime}
                                />
                              </GridItem>
                              <GridItem
                                display={'flex'}
                                flexDirection={'column'}
                                gap={'0.6rem'}
                                borderRight={{
                                  lg: '1px solid rgba(60, 77, 109, 0.50)',
                                }}
                                px={'1rem'}
                              >
                                <Text fontSize={'1rem'} color={'#3C4D6D'}>
                                  End Date
                                </Text>
                                <DatePicker
                                  placeholder="Select a date"
                                  size={size}
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetEDate}
                                />
                                <TimePicker
                                  placeholder="Select a time"
                                  size={size}
                                  style={{ minHeight: '48px' }}
                                  onChange={onGetETime}
                                />
                              </GridItem>{' '}
                            </Grid>
                            <Flex w={'full'} justifyContent={'flex-end'}>
                              <Button
                                mr="1rem"
                                bg={'rgba(60, 77, 109, 0.05)'}
                                borderRadius={'0.5rem'}
                                px={'1rem'}
                                transition={'all 0.2s ease-in-out'}
                                _hover={{ filter: 'brightness(105%)' }}
                                borderWidth={'1px'}
                                borderColor={'#3C4D6D'}
                                backdropFilter={'blur(20px)'}
                                color={'#3C4D6D'}
                                cursor={'pointer'}
                                leftIcon={<ArrowBackIcon />}
                                onClick={() => setActiveStep(activeStep - 1)}
                                size={'sm'}
                              >
                                Previous
                              </Button>

                              <Button
                                bg="#0F5EFE"
                                color="#FFFFFF"
                                fontWeight={'500'}
                                fontSize={{ lg: '1rem', base: '0.75rem' }}
                                borderRadius={'0.5rem'}
                                transition={'all 0.2s ease-in-out'}
                                _hover={{ filter: 'brightness(105%)' }}
                                borderWidth={'1px'}
                                borderColor={'#0F5EFE'}
                                rightIcon={<ArrowForwardIcon />}
                                onClick={() => setActiveStep(activeStep + 1)}
                              >
                                Next
                              </Button>
                            </Flex>
                          </Flex>
                        </Stack>

                        <Stack display={activeStep === 2 ? 'block' : 'none'}>
                          <Box w="full">
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
                          </Box>

                          <Flex w={'full'} justifyContent={'flex-end'}>
                            <Button
                              mr="1rem"
                              bg={'rgba(60, 77, 109, 0.05)'}
                              borderRadius={'0.5rem'}
                              px={'1rem'}
                              transition={'all 0.2s ease-in-out'}
                              _hover={{ filter: 'brightness(105%)' }}
                              borderWidth={'1px'}
                              borderColor={'#3C4D6D'}
                              backdropFilter={'blur(20px)'}
                              color={'#3C4D6D'}
                              cursor={'pointer'}
                              leftIcon={<ArrowBackIcon />}
                              onClick={() => setActiveStep(activeStep - 1)}
                              size={'sm'}
                            >
                              Previous
                            </Button>

                            <Button
                              bg="#0F5EFE"
                              color="#FFFFFF"
                              fontWeight={'500'}
                              fontSize={{ lg: '1rem', base: '0.75rem' }}
                              borderRadius={'0.5rem'}
                              transition={'all 0.2s ease-in-out'}
                              _hover={{ filter: 'brightness(105%)' }}
                              borderWidth={'1px'}
                              borderColor={'#0F5EFE'}
                              rightIcon={<ArrowForwardIcon />}
                              onClick={() => setActiveStep(activeStep + 1)}
                            >
                              Next
                            </Button>
                          </Flex>
                        </Stack>

                        <Stack display={activeStep === 3 ? 'block' : 'none'}>
                          <Text
                            fontSize={{ lg: '1.5rem' }}
                            fontWeight={'700'}
                            mb={'2.25rem'}
                            color={'#3C4D6D'}
                          >
                            Provide a submission criteria
                          </Text>

                          <Flex flexDirection={'column'} gap={'1.25rem'}>
                            <Box mb={{ lg: '4rem', md: '4rem', sm: '7rem' }}>
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
                                  placeholder={
                                    'Write your submission criteria here'
                                  }
                                  value={submissionCriteria}
                                  onChange={(value) =>
                                    setSubmissionCriteria(value)
                                  }
                                />
                              </div>
                            </Box>

                            <Flex
                              justifyContent={'flex-end'}
                              w={'full'}
                              alignItems={'center'}
                            >
                              <Flex gap={'1rem'}>
                                <Button
                                  bg={'rgba(60, 77, 109, 0.05)'}
                                  borderRadius={'0.5rem'}
                                  px={'1rem'}
                                  transition={'all 0.2s ease-in-out'}
                                  _hover={{ filter: 'brightness(105%)' }}
                                  borderWidth={'1px'}
                                  borderColor={'#3C4D6D'}
                                  backdropFilter={'blur(20px)'}
                                  color={'#3C4D6D'}
                                  cursor={'pointer'}
                                  leftIcon={<ArrowBackIcon />}
                                  onClick={() => setActiveStep(activeStep - 1)}
                                >
                                  Previous
                                </Button>
                                <Button
                                  bg="#0F5EFE"
                                  color="#FFFFFF"
                                  fontWeight={'500'}
                                  fontSize={{ lg: '1rem', base: '0.75rem' }}
                                  borderRadius={'0.5rem'}
                                  px={{ lg: '1.25rem', base: '2rem' }}
                                  transition={'all 0.2s ease-in-out'}
                                  _hover={{ filter: 'brightness(105%)' }}
                                  borderWidth={'1px'}
                                  borderColor={'#0F5EFE'}
                                  rightIcon={<ArrowForwardIcon />}
                                  onClick={() => setActiveStep(activeStep + 1)}
                                >
                                  Next
                                </Button>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Stack>

                        <Stack display={activeStep === 4 ? 'block' : 'none'}>
                          <Text
                            fontSize={{ lg: '1.5rem' }}
                            fontWeight={'700'}
                            mb={'2.25rem'}
                            color={'#3C4D6D'}
                          >
                            Hackathon Events
                          </Text>

                          <Flex flexDirection={'column'} gap={'1.25rem'}>
                            <Box mb={{ lg: '4rem', md: '4rem', sm: '7rem' }}>
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
                                  placeholder={'Provided event dates.'}
                                  value={events}
                                  onChange={(value) => setEvents(value)}
                                />
                              </div>
                            </Box>

                            <Flex
                              justifyContent={'flex-end'}
                              w={'full'}
                              alignItems={'center'}
                            >
                              <Flex gap={'1rem'}>
                                <Button
                                  bg={'rgba(60, 77, 109, 0.05)'}
                                  borderRadius={'0.5rem'}
                                  px={'1rem'}
                                  transition={'all 0.2s ease-in-out'}
                                  _hover={{ filter: 'brightness(105%)' }}
                                  borderWidth={'1px'}
                                  borderColor={'#3C4D6D'}
                                  backdropFilter={'blur(20px)'}
                                  color={'#3C4D6D'}
                                  cursor={'pointer'}
                                  leftIcon={<ArrowBackIcon />}
                                  onClick={() => setActiveStep(activeStep - 1)}
                                >
                                  Previous
                                </Button>
                                <Button
                                  bg="#0F5EFE"
                                  color="#FFFFFF"
                                  fontWeight={'500'}
                                  fontSize={{ lg: '1rem', base: '0.75rem' }}
                                  borderRadius={'0.5rem'}
                                  px={{ lg: '1.25rem', base: '2rem' }}
                                  transition={'all 0.2s ease-in-out'}
                                  _hover={{ filter: 'brightness(105%)' }}
                                  borderWidth={'1px'}
                                  borderColor={'#0F5EFE'}
                                  rightIcon={<BiSave />}
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
                                >
                                  Save
                                </Button>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                </Box>
              </Box>
            </Flex>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default CreateHackathon;
