/*==================== Import necessary components and libraries ====================*/
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useParams } from 'react-router-dom';
import { Suspense, useContext, useEffect, useState } from 'react';
import {
  getHackathonDetailForAdmin,
  updateHackathon,
} from '../../../store/slices/hackathonSlice';
import {
  HackathonStateProps,
  HackathonUpdateProps,
} from '../../../store/interfaces/hackathon.interface';
import { HomeNavbar, MetaTags } from '../../../reusable/components';
import PageLoader from '../../../reusable/components/PageLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  resetErrMsg,
  resetUpdated,
} from '../../../store/slices/hackathonSlice';
import { supportedTokens } from '../../../utils/tokens';
import moment from 'moment';
import { useNetwork, useBalance, useAccount } from 'wagmi';
import { GetWalletContext } from '../../../store/contextProviders/connectWallet';
import { chains } from '../../../utils/config';
const { VITE_MIN_HACKATHON_AMOUNT } = import.meta.env;

/*====================  Define AdminEditOffChainHackathon function ====================*/
function AdminEditOffChainHackathon() {
  /*==================== Define variables and states ====================*/

  const dispatch = useDispatch();
  const toast = useToast();
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { id: hackathonId } = useParams();
  const [hackathonName, setHackathonName] = useState<any>('');
  const [description, setDescription] = useState<any>('');
  const [submissionCriteria, setSubmissionCriteria] = useState<any>('');
  const [events, setEvents] = useState<any>('');
  const [startDate, setStartDate] = useState<any>('');
  const [submissionDeadline, setSubmissionDeadline] = useState<any>('');
  const [endDate, setEndDate] = useState<any>('');
  const [numInputs, setNumInputs] = useState<any>(0);
  const [equalDistribution, setEqualDistribution] = useState<any>('no');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [logo, setLogo] = useState<string | undefined>('');
  const userSlice = useSelector<RootState, UserStateProps>(
    (state: any) => state.user,
  );
  const [equalDistributionAmount, setEqualDistributionAmount] =
    useState<any>(0);

  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const [inputData, setInputData] = useState(
    (numInputs && Array(numInputs).fill('')) || [''],
  );

  const [rewardTokenAddress, setRewardTokenAddress] = useState<any>(
    supportedTokens[0].address,
  );

  /*==================== Get Token Info ====================*/
  //web3
  const { getTokenInfo, wonOpen } = useContext(GetWalletContext);

  /*==================== Get balance ====================*/
  const { data: balanceData } = useBalance({ address: rewardTokenAddress! });

  /*====================  Number input Change functions  ====================*/
  const handleNumInputChange = (value: any) => {
    const num = parseInt(value);

    if (num <= 0) return alert('Values is less than 1');

    setNumInputs(num);
    setInputData((num > 0 && Array(num).fill('')) || ['']);
  };

  /*==================== Handle input change ====================*/
  const handleInputChange = (index: any, value: any) => {
    const newData = [...inputData];
    newData[index] = value;
    setInputData(newData);
  };

  /*==================== inputs ====================*/
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
            isDisabled={hackathonSlice?.sending || hackathonSlice?.initializing}
            _focus={{
              outline: 'none',
              boxShadow: 'none',
            }}
          />
        </Flex>
      </Flex>,
    );
  }

  /*==================== Calculate total reward ====================*/
  const totalRewardinUsd = inputData
    .filter((data: string) => data !== '')
    .reduce(
      (totalCount: string, nextCount: string) =>
        parseInt(totalCount) + parseInt(nextCount),
      0,
    );

  /*==================== Calculate token amounts ====================*/
  const tokenAmounts =
    equalDistribution === 'yes' ? equalDistributionAmount : totalRewardinUsd;

  /*==================== onSend function to send hackathon ====================*/
  const onSend = async () => {
    if (
      !hackathonName ||
      !description ||
      !submissionCriteria ||
      !events ||
      !logo
    ) {
      return toast({
        description: 'Please fill all the fields to proceed',
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

    if (!equalDistribution) {
      return toast({
        description: 'Should winners get rewarded with same amount?',
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

      if (totalRewardinUsd < parseInt(VITE_MIN_HACKATHON_AMOUNT)) {
        return toast({
          title: 'Reward too small',
          description: `Minimum reward is ${VITE_MIN_HACKATHON_AMOUNT} USD`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
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
    }

    /*==================== Data to send ====================*/
    const data: HackathonUpdateProps = {
      hackathonName,
      logo: onSetLogo(),
      description,
      submissionCriteria,
      events,
      startDate: `${startDate}Z`,
      submissionDeadline: `${submissionDeadline}Z`,
      endDate: `${endDate}Z`,
      hackathonId: Number(hackathonId),
      totalRewardinUsd: tokenAmounts,
      tokenAmounts,
      rewardsArrayInUSD: inputData,
      rewardCount,
      equalDistribution,
    };

    dispatch(updateHackathon(data));
  };

  /*==================== myTokenBalance ====================*/
  const myTokenBalance = (
    Number(balanceData?.value) / tokenInfo?.decimals
  ).toFixed(3);

  /*==================== rewardCount ====================*/
  const rewardCount = inputData.filter(
    (amount: string) => amount !== '',
  ).length;

  /*==================== displayErrorToasts ====================*/
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

  /*==================== useEffect ====================*/
  useEffect(() => {
    // @ts-ignore
    dispatch(getHackathonDetailForAdmin(hackathonId));
  }, [hackathonId]);

  /*==================== useEffect  to set hackathon info ====================*/
  useEffect(() => {
    setHackathonName(hackathonSlice?.adminHackInfo?.hackathonName || '');

    setLogo(hackathonSlice?.adminHackInfo?.company?.logo || '');

    setDescription(hackathonSlice?.adminHackInfo?.description || '');

    setSubmissionCriteria(
      hackathonSlice?.adminHackInfo?.submissionCriteria || '',
    );

    setEvents(hackathonSlice?.adminHackInfo?.events || '');

    setStartDate(
      moment(hackathonSlice?.adminHackInfo?.startDate).format(
        'YYYY-MM-DDTHH:mm:ss',
      ) || '',
    );

    setSubmissionDeadline(
      submissionDeadline ||
        moment(hackathonSlice?.adminHackInfo?.submissionDeadline).format(
          'YYYY-MM-DDTHH:mm:ss',
        ) ||
        '',
    );

    setEndDate(
      endDate ||
        moment(hackathonSlice?.adminHackInfo?.endDate).format(
          'YYYY-MM-DDTHH:mm:ss',
        ) ||
        '',
    );

    setNumInputs(hackathonSlice?.adminHackInfo?.rewardCount || '');

    setEqualDistribution(
      hackathonSlice?.adminHackInfo?.equalDistribution || '',
    );

    setEqualDistributionAmount(
      hackathonSlice?.adminHackInfo?.totalRewardinUsd || '',
    );

    setRewardTokenAddress(
      hackathonSlice?.adminHackInfo?.rewardTokenAddress || '',
    );

    setInputData(hackathonSlice?.adminHackInfo?.rewardsArrayInUSD || '');

    (async () => {
      const _tokenChain = chains.find(
        (c) => c.chainId === hackathonSlice?.adminHackInfo?.chainId,
      );

      const info = await getTokenInfo(
        _tokenChain?.providerUrl,
        hackathonSlice?.adminHackInfo?.rewardTokenAddress!,
      );

      setTokenInfo(info);
    })();
  }, [hackathonSlice?.adminHackInfo, isConnected]);

  /*==================== useEffect to display error toasts ====================*/
  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'UPDATE_HACKATHON_ERROR'
    ) {
      displayErrorToasts();
    }

    if (hackathonSlice?.updatedHackathon) {
      toast({
        title: 'Success',
        description: 'Your hackathon has been updated',
        status: 'success',
        duration: 10000,
        onCloseComplete: () => dispatch(resetUpdated()),
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [hackathonSlice?.updatedHackathon, hackathonSlice?.errMsg]);

  /*==================== onSetLogo ====================*/
  const onSetLogo = () => {
    if (!logo) return;

    const updatedLogo = logo.startsWith('www.')
      ? logo.replace(/^www\./i, 'https://')
      : logo.startsWith('http://')
      ? logo.replace(/^http:/i, 'https:')
      : logo.startsWith('https://')
      ? logo
      : 'https://' + logo;

    return updatedLogo;
  };

  /*==================== useEffect to get token info ====================*/
  useEffect(() => {
    (async () => {
      const _tokenChain = chains.find(
        (c) => c.chainId === hackathonSlice?.adminHackInfo?.chainId,
      );

      setRewardTokenAddress(hackathonSlice?.adminHackInfo?.rewardTokenAddress);

      const info = await getTokenInfo(
        _tokenChain?.providerUrl,
        hackathonSlice?.adminHackInfo?.rewardTokenAddress!,
      );

      setTokenInfo(info);
    })();
  }, [hackathonSlice?.adminHackInfo?.rewardTokenAddress, isConnected]);

  return (
    <Suspense fallback={<PageLoader />}>
      {/*==================== ConditionalRoute ====================*/}
      <ConditionalRoute
        redirectTo="/404"
        condition={(hackathonId && true) || false}
      >
        <ConditionalRoute
          redirectTo="/login"
          condition={userSlice?.isAuthenticated || false}
        >
          <ConditionalRoute
            redirectTo="/404"
            condition={
              userSlice.user && userSlice.user.roles.includes(Role.Admin)
                ? true
                : false
            }
          >
            <>
              {/*==================== BodyWrapper ====================*/}
              <BodyWrapper>
                <>
                  {/*==================== MetaTags ====================*/}
                  <MetaTags
                    title={`${hackathonSlice?.adminHackInfo?.hackathonName} | Hackathon | techFiesta`}
                    description={`${hackathonSlice?.adminHackInfo?.description.slice(
                      0,
                      100,
                    )}`}
                    pageUrl={window.location.href}
                  />
                  {/*==================== ConditionalRoute ====================*/}
                  {hackathonSlice?.fetchingHackInfo ? (
                    <Flex
                      alignItems={'center'}
                      justifyContent={'center'}
                      h="100vh"
                    >
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="brand.primary"
                        size="xl"
                      />
                    </Flex>
                  ) : (
                    <>
                      <HomeNavbar />

                      <Box
                        w={{ lg: '800px' }}
                        mx="auto"
                        mb={'100px'}
                        mt={{ lg: '6rem', base: '8rem' }}
                        px={{ base: '1rem', lg: 'unset' }}
                      >
                        {!hackathonSlice?.fetchingHacks ? (
                          <>
                            {isConnected ? (
                              <>
                                <Box mb={'24px'}>
                                  <Box mb={'40px'}>
                                    <Text
                                      fontWeight={'700'}
                                      fontSize={{ base: '24px', lg: '36px' }}
                                      color="brand.secondary"
                                    >
                                      Edit Hackathon
                                    </Text>
                                  </Box>

                                  <Box
                                    px="24px"
                                    display={'flex'}
                                    alignItems={'center'}
                                    flexDirection={'column'}
                                  >
                                    <Avatar
                                      name={
                                        hackathonSlice?.adminHackInfo?.company
                                          ?.companyName
                                      }
                                      size={{ base: 'md', lg: 'lg' }}
                                      borderRadius={'none'}
                                      rounded={'none'}
                                      src={logo}
                                    />
                                  </Box>
                                </Box>

                                {/*==================== Chakra Css for form label ====================*/}
                                <Box
                                  display={'flex'}
                                  flexDirection={'column'}
                                  gap={'6'}
                                  textColor="brand.secondary"
                                >
                                  {/*==================== Formlabel and control ====================*/}
                                  <FormControl>
                                    <FormLabel
                                      fontSize="16px"
                                      fontWeight={'500'}
                                    >
                                      Hackathon Name
                                    </FormLabel>
                                    <Input
                                      onChange={(e) => {
                                        setHackathonName(e.target.value);
                                      }}
                                      value={hackathonName}
                                      fontSize="14px"
                                      fontWeight={'400'}
                                      outline={'unset'}
                                      boxShadow="none"
                                      borderColor="black"
                                      type="text"
                                      borderRadius={'none'}
                                    />
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontSize="16px"
                                      fontWeight={'500'}
                                    >
                                      Company Logo Link
                                    </FormLabel>
                                    <Input
                                      value={logo}
                                      fontSize="14px"
                                      fontWeight={'400'}
                                      outline={'unset'}
                                      boxShadow="none"
                                      borderColor="black"
                                      type="text"
                                      borderRadius={'none'}
                                      onChange={(e) => setLogo(e.target.value)}
                                    />
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontSize="16px"
                                      fontWeight={'500'}
                                    >
                                      Hackathon Overview
                                    </FormLabel>

                                    <div
                                      style={{
                                        height: '200px',
                                        minHeight: '200px',
                                        maxHeight: '100%',
                                        position: 'relative',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        marginBottom: '24px',
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
                                        onChange={(value) =>
                                          setDescription(value)
                                        }
                                      />
                                    </div>
                                  </FormControl>

                                  <FormControl>
                                    <FormLabel
                                      fontSize="16px"
                                      fontWeight={'500'}
                                    >
                                      Hackathon Submission Criteria
                                    </FormLabel>

                                    <div
                                      style={{
                                        height: '200px',
                                        minHeight: '200px',
                                        maxHeight: '100%',
                                        position: 'relative',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        marginBottom: '24px',
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

                                  <FormControl>
                                    <FormLabel
                                      fontSize="16px"
                                      fontWeight={'500'}
                                    >
                                      Hackathon Events
                                    </FormLabel>

                                    <div
                                      style={{
                                        height: '200px',
                                        minHeight: '200px',
                                        maxHeight: '100%',
                                        position: 'relative',
                                        fontSize: '14px',
                                        fontWeight: '400',
                                        marginBottom: '24px',
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

                                  <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    gap={'6'}
                                    maxW={{ base: 'full', md: '50%' }}
                                  >
                                    <FormControl mt="17px" isRequired>
                                      <FormLabel fontSize={'14px'}>
                                        How many participants do you want to
                                        reward
                                      </FormLabel>
                                      <NumberInput
                                        boxShadow={'none'}
                                        outline={'none'}
                                        max={250}
                                        clampValueOnBlur={false}
                                        size={'sm'}
                                        bg="white"
                                        value={numInputs}
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
                                        (equalDistribution === 'no' &&
                                          'none') ||
                                        ''
                                      }
                                      mt="1rem"
                                      isRequired
                                    >
                                      <FormLabel fontSize={'14px'}>
                                        How much do you want participants to
                                        share?
                                      </FormLabel>
                                      <Flex
                                        mr="12px"
                                        direction={'column'}
                                        mb="1rem"
                                      >
                                        <Flex alignItems={'center'}>
                                          <Flex
                                            alignItems={'center'}
                                            mr="0.2rem"
                                          >
                                            <Avatar
                                              size={'xs'}
                                              src={tokenInfo?.symbol}
                                            />
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
                                              setEqualDistributionAmount(
                                                e.target.value,
                                              )
                                            }
                                            defaultValue={
                                              equalDistributionAmount
                                            }
                                          />
                                        </Flex>
                                      </Flex>
                                    </FormControl>

                                    <FormControl>
                                      <FormLabel
                                        fontSize="16px"
                                        fontWeight={'500'}
                                      >
                                        Start Date
                                      </FormLabel>
                                      <Flex gap={'4'} flexDirection={'row'}>
                                        <Input
                                          fontSize="14px"
                                          fontWeight={'400'}
                                          outline={'unset'}
                                          boxShadow="none"
                                          borderColor="black"
                                          placeholder=""
                                          size="md"
                                          borderRadius={'none'}
                                          value={startDate}
                                          type="datetime-local"
                                          onChange={(e) =>
                                            setStartDate(e.target.value)
                                          }
                                        />
                                      </Flex>
                                    </FormControl>

                                    <FormControl>
                                      <FormLabel
                                        fontSize="16px"
                                        fontWeight={'500'}
                                      >
                                        Submission deadline
                                      </FormLabel>
                                      <Flex gap={'4'} flexDirection={'row'}>
                                        <Input
                                          fontSize="14px"
                                          fontWeight={'400'}
                                          outline={'unset'}
                                          boxShadow="none"
                                          borderColor="black"
                                          placeholder=""
                                          size="md"
                                          type="datetime-local"
                                          borderRadius={'none'}
                                          onChange={(e) =>
                                            setSubmissionDeadline(
                                              e.target.value,
                                            )
                                          }
                                          value={submissionDeadline}
                                        />
                                      </Flex>
                                    </FormControl>

                                    <FormControl>
                                      <FormLabel
                                        fontSize="16px"
                                        fontWeight={'500'}
                                      >
                                        End Date
                                      </FormLabel>
                                      <Flex gap={'4'} flexDirection={'row'}>
                                        <Input
                                          fontSize="14px"
                                          fontWeight={'400'}
                                          outline={'unset'}
                                          boxShadow="none"
                                          borderColor="black"
                                          placeholder=""
                                          size="md"
                                          borderRadius={'none'}
                                          value={endDate}
                                          type="datetime-local"
                                          onChange={(e) =>
                                            setEndDate(e.target.value)
                                          }
                                        />
                                      </Flex>
                                    </FormControl>
                                  </Box>
                                </Box>
                                <Flex
                                  alignItems={'center'}
                                  justifyContent={'flex-end'}
                                  mt={'40px'}
                                >
                                  <Button
                                    onClick={onSend}
                                    disabled={
                                      (myTokenBalance <= '1' && true) || false
                                    }
                                    borderRadius={'none'}
                                    bg="brand.primary"
                                    color="white"
                                    fontSize={'16px'}
                                    fontWeight="700"
                                    _hover={{
                                      bg: 'white',
                                      color: 'brand.primary',
                                    }}
                                    borderWidth={'1px'}
                                    borderColor={'brand.primary'}
                                    isLoading={
                                      hackathonSlice?.updatingHackathon
                                    }
                                  >
                                    Save changes
                                  </Button>
                                </Flex>
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
                          </>
                        ) : (
                          <Flex
                            h="full"
                            w="full"
                            justifyContent={'center'}
                            alignItems={'center'}
                            mt="2rem"
                          >
                            <PageLoader />
                          </Flex>
                        )}
                      </Box>
                    </>
                  )}
                </>
              </BodyWrapper>
              {/*==================== BodyWrapper ====================*/}
            </>
          </ConditionalRoute>
        </ConditionalRoute>
      </ConditionalRoute>
    </Suspense>
  );
}

export default AdminEditOffChainHackathon;
