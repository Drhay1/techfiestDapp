import moment from 'moment';
import { Formik, Form } from 'formik';
import { PlusIcon } from '../../../assets/icons';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { supportedTokens } from '../../../utils/tokens';
import { SubmitResultSchema } from '../../../utils/Yup';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTab from '../../../reusable/components/CustomTab';
import NewFooter from '../../../reusable/components/NewFooter';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import PageLoader from '../../../reusable/components/PageLoader';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthInput, FormattingWrapper } from '../../../reusable/styled';
import CustomTabPanel from '../../../reusable/components/CustomTabPanel';
import ConcordiumModal from '../../../reusable/components/ConcordiumModal';
import {
  ExternalLink,
  IDBackendApi,
  InternalLink,
  proxyAddress,
} from '../../../utils/Link';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { GetWalletContext } from '../../../store/contextProviders/connectWallet';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
// import { HomeNavbar, MetaTags } from '../../../reusable/components';

const HomeNavbar = React.lazy(
  () => import('../../../reusable/components/HomeNavbar'),
);

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

import {
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';
import {
  getHackathonDetail,
  registerForAHack,
  resetErrMsg,
  resetRegistered,
  resetSubmitted,
  submitHackResult,
} from '../../../store/slices/hackathonSlice';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { authorize, getChallenge, getStatement } from '../../../utils/utils';
import { AiOutlineLink } from 'react-icons/ai';
import { BsTelegram } from 'react-icons/bs';
import { RiTwitterXFill } from 'react-icons/ri';
import LazyLoad from 'react-lazyload';

function UserHackathonDetail() {
  const today = moment();
  const toast = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { wonOpen, caccount, authToken, setAuthToken } =
    useContext(GetWalletContext);
  const { address: account, isConnected } = useAccount();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const {
    isOpen: isOpenConcordiumWalletConnect,
    onOpen: onOpenConcordiumWalletConnect,
    onClose: onCloseConcordiumWalletConnect,
  } = useDisclosure();

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const onCta = useCallback(() => {
    if (hackathonSlice?.hackathonInfo?.requiresCountry && !caccount)
      return toast({
        description: 'Connect your concordium wallet to submit',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });

    if (!account)
      return toast({
        description: 'Connect your wallet to submit',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });

    if (!userSlice?.user?.firstname) {
      navigate(
        `/settings?joiningid=${hackathonSlice?.hackathonInfo?.hackathonId}&&slug=${hackathonSlice?.hackathonInfo?.slug}&msg=Provide at least your firstname to join&type=user`,
      );
    } else if (userSlice?.isAuthenticated && userSlice?.user?.firstname) {
      dispatch(
        registerForAHack({
          id: params?.id,
          userWalletAddress: account,
          caccount,
        }),
      );
    } else {
      navigate('/login');
    }
  }, [
    account,
    userSlice,
    navigate,
    dispatch,
    params,
    isConnected,
    caccount,
    hackathonSlice?.hackathonInfo?.requiresCountry,
  ]);

  const onSubmitResult: any = async (result: string) => {
    const userWalletAddress = account;

    if (!userWalletAddress) {
      return toast({
        title: 'Connect your wallet to proceed',
        description:
          'Connect your wallet or refresh your browser after you connect your wallet to proceed',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (chain?.id !== hackathonSlice?.hackathonInfo?.chainId)
      return switchNetwork?.(hackathonSlice?.hackathonInfo?.chainId);

    dispatch(
      submitHackResult({
        result,
        isConnected,
        userWalletAddress,
        chainId: hackathonSlice?.hackathonInfo?.chainId,
        hackathonId: hackathonSlice?.hackathonInfo?.hackathonId,
      }),
    );
  };

  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top-right',
          onCloseComplete() {
            dispatch(resetErrMsg());
          },
        }),
      ),
    );
  };

  useEffect(() => {
    dispatch(getHackathonDetail(params?.id));
  }, [params?.id]);

  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg.Id === 'REGISTER_FOR_HACKATHON_ERROR'
    ) {
      displayErrorToasts();
    }

    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg.Id === 'SUBMIT_HACKATHON_ERROR'
    ) {
      displayErrorToasts();
    }

    if (hackathonSlice?.registered) {
      toast({
        title: `You're registered`,
        description: `You're registered for this hackathon`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetRegistered());
        },
      });
    }

    if (hackathonSlice?.submitted) {
      toast({
        title: `Result submitted`,
        description: `You have submitted your result`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetSubmitted());
        },
      });
    }
  }, [
    hackathonSlice?.submitted,
    hackathonSlice?.registered,
    hackathonSlice?.errMsg,
  ]);

  const timestamp: any = hackathonSlice?.hackathonInfo?.submissionDeadline;
  const isUtc = timestamp?.endsWith('Z');
  const utcDateTime = isUtc
    ? moment.utc(timestamp)
    : moment.utc(timestamp + 'Z');

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(
      `${proxyAddress}/hacks/${hackathonSlice?.hackathonInfo?.hackathonId}`,
    );
    setIsTooltipOpen(true);

    //close the tooltip after a short delay
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 2000);
  };

  const socialMediaLinks = [
    {
      socialMedia: 'twitter',
      link: `http://x.com/share?text=${hackathonSlice?.hackathonInfo?.hackathonName}&url=${proxyAddress}/hacks/${hackathonSlice?.hackathonInfo?.hackathonId}`,
    },
    {
      socialMedia: 'telegram',
      link: `https://t.me/share?url=${proxyAddress}/hacks/${hackathonSlice?.hackathonInfo?.hackathonId}&text=${hackathonSlice?.hackathonInfo?.hackathonName}`,
    },
  ];

  const handleAuthorize = useCallback(async () => {
    if (!caccount) {
      throw new Error('Unreachable');
    }

    const provider = await detectConcordiumProvider();
    const challenge = await getChallenge(IDBackendApi, caccount);
    const statement = await getStatement(IDBackendApi);
    const proof = await provider.requestIdProof(caccount, statement, challenge);
    const newAuthToken = await authorize(IDBackendApi, challenge, proof);
    setAuthToken(newAuthToken);
  }, [caccount, detectConcordiumProvider, getChallenge]);

  useEffect(() => {
    if (isOpenConcordiumWalletConnect && caccount) {
      onCloseConcordiumWalletConnect();
    }
  }, [caccount]);

  const userResult = userSlice?.stats?.submissions
    ?.filter(
      (h: any) => h?.hackathon?._id === hackathonSlice?.hackathonInfo?._id,
    )
    ?.find((h: any) => h.user._id === userSlice?.user?._id);

  return (
    <ConditionalRoute
      redirectTo="/404"
      condition={(params?.id && true) || false}
    >
      <>
        <>
          <MetaTags
            title={`${hackathonSlice?.hackathonInfo?.hackathonName}`}
            description={`${hackathonSlice?.hackathonInfo?.description.slice(
              0,
              100,
            )}`}
            pageUrl={window.location.href}
          />
          {hackathonSlice?.fetchingHackInfo ? (
            <Flex alignItems={'center'} justifyContent={'center'} h="100vh">
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
              <BodyWrapper>
                <>
                  <Stack px={{ base: '1rem' }} overflow={'hidden'}>
                    {!hackathonSlice?.fetchingHacks ? (
                      <Box>
                        <VStack
                          mt={{ base: '92px' }}
                          w="100%"
                          justifyContent="center"
                          borderRadius={{ base: '8px', lg: '40px', md: '24px' }}
                          boxShadow="0px 3px 4px rgba(60, 77, 109, 0.25)"
                          background="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%)"
                          py={{ base: '1.5rem' }}
                        >
                          <LazyLoad offset={100}>
                            <Avatar
                              name={
                                hackathonSlice?.hackathonInfo?.company
                                  ?.companyName
                              }
                              src={hackathonSlice?.hackathonInfo?.company?.logo}
                              size={{ base: 'md', md: 'lg', lg: 'xl' }}
                              rounded={'none'}
                              borderRadius={'unset'}
                              mb={{ base: '20px' }}
                            />
                          </LazyLoad>

                          <Text
                            textAlign="center"
                            color="brand.secondary"
                            fontSize={{ lg: '44px', base: '18px', md: '24px' }}
                            fontWeight="700"
                          >
                            {hackathonSlice?.hackathonInfo?.hackathonName}
                          </Text>

                          <HStack
                            mt={{ lg: '63px', base: '20px' }}
                            alignItems={'center'}
                          >
                            <Text
                              color="#001131"
                              textAlign="center"
                              fontSize={{
                                lg: '24px',
                                base: '16px',
                                md: '24px',
                              }}
                              fontWeight="700"
                            >
                              Share on :
                            </Text>

                            {socialMediaLinks &&
                              socialMediaLinks.map((socialMediaLink) => (
                                <Flex
                                  alignItems={'center'}
                                  justifyContent={'center'}
                                  pt="0.3rem"
                                >
                                  <ExternalLink href={socialMediaLink.link}>
                                    <Icon
                                      as={
                                        socialMediaLink.socialMedia ===
                                        'twitter'
                                          ? RiTwitterXFill
                                          : socialMediaLink.socialMedia ===
                                            'telegram'
                                          ? BsTelegram
                                          : socialMediaLink.socialMedia ===
                                            'discord'
                                          ? AiOutlineLink
                                          : AiOutlineLink
                                      }
                                      boxSize={'24px'}
                                    />
                                  </ExternalLink>
                                </Flex>
                              ))}
                            <Tooltip
                              label="Link Copied!"
                              isOpen={isTooltipOpen}
                              placement="bottom"
                            >
                              <Icon
                                as={AiOutlineLink}
                                boxSize={'24px'}
                                cursor={'pointer'}
                                onClick={copyLinkToClipboard}
                              />
                            </Tooltip>
                          </HStack>
                        </VStack>
                        {/* Detail box */}

                        <Grid
                          px={{ lg: '1rem' }}
                          mt={{ base: '24px', lg: '32px' }}
                          gap={'16px'}
                          gridTemplateColumns={{
                            lg: 'repeat(4, 1fr)',
                            base: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)',
                          }}
                          w="full"
                        >
                          <GridItem
                            border="1px"
                            borderColor={'brand.primary'}
                            borderRadius="10px"
                            p="16px"
                            bg="white"
                          >
                            <VStack alignItems={'flex-start'}>
                              <Text
                                fontSize={{ lg: '16px' }}
                                color="#001131"
                                fontWeight="400"
                              >
                                Bounty
                              </Text>
                              <Text
                                fontSize={{ lg: '20px' }}
                                color="#001131"
                                fontWeight="700"
                              >
                                {
                                  hackathonSlice?.hackathonInfo
                                    ?.totalRewardinUsd
                                }{' '}
                                {
                                  supportedTokens.find(
                                    (tk) =>
                                      tk.address ===
                                      hackathonSlice?.hackathonInfo
                                        ?.rewardTokenAddress,
                                  )?.symbol
                                }
                              </Text>
                            </VStack>
                          </GridItem>
                          <GridItem
                            p="16px"
                            border="1px"
                            borderColor={'brand.primary'}
                            borderRadius="10px"
                            bg="white"
                          >
                            <VStack display="flex" alignItems={'flex-start'}>
                              <Text
                                fontSize={{ lg: '16px' }}
                                color="#001131"
                                fontWeight="400"
                              >
                                Start date
                              </Text>
                              <Text
                                fontSize={{ lg: '20px' }}
                                color="#001131"
                                fontWeight="700"
                              >
                                {moment
                                  .utc(hackathonSlice?.hackathonInfo?.startDate)
                                  .local()
                                  .format('MMMM Do, YYYY HH:mm')}
                              </Text>
                            </VStack>
                          </GridItem>
                          <GridItem
                            border="1px"
                            borderColor={'brand.primary'}
                            borderRadius="10px"
                            p="16px"
                            bg="white"
                          >
                            <VStack alignItems={'flex-start'}>
                              <Text
                                fontSize={{ lg: '16px' }}
                                color="#001131"
                                fontWeight="400"
                              >
                                Submission Deadline
                              </Text>
                              <Text
                                fontSize={{ lg: '20px' }}
                                color="#001131"
                                fontWeight="700"
                              >
                                {utcDateTime
                                  .local()
                                  .format('MMMM Do, YYYY HH:mm')}
                              </Text>
                            </VStack>
                          </GridItem>
                          <GridItem
                            bg="white"
                            border="1px"
                            borderColor={'brand.primary'}
                            borderRadius="10px"
                            p="16px"
                          >
                            <VStack alignItems={'flex-start'}>
                              <Text
                                fontSize={{ lg: '16px' }}
                                color="#001131"
                                fontWeight="400"
                              >
                                End date
                              </Text>
                              <Text
                                fontSize={{ lg: '18px' }}
                                color="#001131"
                                fontWeight="700"
                              >
                                {moment
                                  .utc(hackathonSlice?.hackathonInfo?.endDate)
                                  .local()
                                  .format('MMMM Do, YYYY HH:mm')}
                              </Text>
                            </VStack>
                          </GridItem>
                        </Grid>

                        {/* Tabs */}
                        <Tabs
                          w="full"
                          variant="enclosed"
                          mt={{ base: '24px', lg: '56px' }}
                        >
                          <TabList px="10px">
                            <Tab
                              _selected={{
                                color: 'white',
                                bg: 'brand.primary',
                              }}
                              fontSize={{ base: '12px', lg: '16px' }}
                            >
                              Overview
                            </Tab>
                            <Tab
                              _selected={{
                                color: 'white',
                                bg: 'brand.primary',
                              }}
                              fontSize={{ base: '12px', lg: '16px' }}
                            >
                              Submission Criteria
                            </Tab>
                            <Tab
                              _selected={{
                                color: 'white',
                                bg: 'brand.primary',
                              }}
                              fontSize={{ base: '12px', lg: '16px' }}
                            >
                              Events
                            </Tab>
                            {userSlice?.isAuthenticated &&
                              userSlice?.user?.roles.includes(Role.User) && (
                                <CustomTab>Submit your result</CustomTab>
                              )}
                          </TabList>
                          <TabPanels
                            border="1px"
                            borderRadius="18px"
                            py="1rem"
                            bg="white"
                          >
                            {/*========================= Overview Panel =========================*/}
                            <TabPanel bg="white">
                              <Flex
                                gap={'8px'}
                                flexDirection={'column'}
                                justifyContent={'flex-start'}
                              >
                                {!moment(
                                  hackathonSlice?.hackathonInfo &&
                                    hackathonSlice?.hackathonInfo
                                      .submissionDeadline,
                                ).isBefore(today) && (
                                  <>
                                    {userSlice?.isAuthenticated ? (
                                      <>
                                        {userSlice?.user?.roles.includes(
                                          Role.User,
                                        ) && (
                                          <>
                                            <>
                                              {(hackathonSlice?.hackathonInfo
                                                ?.participants &&
                                                hackathonSlice?.hackathonInfo?.participants.includes(
                                                  userSlice?.user?._id,
                                                ) && <Text></Text>) || (
                                                <>
                                                  {isConnected ||
                                                  (hackathonSlice?.hackathonInfo
                                                    ?.requiresCountry &&
                                                    account) ? (
                                                    <Button
                                                      onClick={onCta}
                                                      borderRadius={'12px'}
                                                      leftIcon={<PlusIcon />}
                                                      bg="brand.primary !important"
                                                      color="white"
                                                      fontSize={{
                                                        base: '14px',
                                                        lg: '16px',
                                                      }}
                                                      fontWeight="700"
                                                      isLoading={
                                                        hackathonSlice?.registering
                                                      }
                                                      borderWidth={'1px'}
                                                      borderColor={
                                                        'brand.primary'
                                                      }
                                                    >
                                                      {(userSlice?.isAuthenticated && (
                                                        <>Register</>
                                                      )) || (
                                                        <Text>
                                                          Participate Now
                                                        </Text>
                                                      )}
                                                    </Button>
                                                  ) : hackathonSlice
                                                      ?.hackathonInfo
                                                      ?.requiresCountry &&
                                                    caccount &&
                                                    !authToken ? (
                                                    <Button
                                                      bg="brand.primary !important"
                                                      color="white"
                                                      borderRadius={'5px'}
                                                      onClick={handleAuthorize}
                                                    >
                                                      Check Eligibility
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      bg="brand.primary !important"
                                                      onClick={
                                                        hackathonSlice
                                                          ?.hackathonInfo
                                                          ?.requiresCountry &&
                                                        !caccount
                                                          ? onOpenConcordiumWalletConnect
                                                          : wonOpen
                                                      }
                                                      color="white"
                                                      borderRadius={'5px'}
                                                    >
                                                      Connect Your wallet to
                                                      register
                                                    </Button>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <InternalLink
                                        to={`/login`}
                                        style={{
                                          textDecoration: 'unset',
                                        }}
                                      >
                                        <Button
                                          w={{
                                            base: 'full',
                                            lg: 'unset',
                                          }}
                                          borderRadius={'12px'}
                                          leftIcon={<PlusIcon />}
                                          bg="brand.primary !important"
                                          color="white"
                                          fontSize={{
                                            base: '14px',
                                            lg: '16px',
                                          }}
                                          fontWeight="700"
                                          isLoading={
                                            hackathonSlice?.registering
                                          }
                                          borderWidth={'1px'}
                                          borderColor={'brand.primary'}
                                        >
                                          <Text>Participate Now</Text>
                                        </Button>
                                      </InternalLink>
                                    )}
                                  </>
                                )}
                              </Flex>

                              <FormattingWrapper>
                                <Box
                                  borderColor={'brand.secondary'}
                                  color="black"
                                  p={{ lg: '1rem' }}
                                  // @ts-ignore
                                  dangerouslySetInnerHTML={{
                                    // @ts-ignore
                                    __html:
                                      hackathonSlice?.hackathonInfo?.description?.replace(
                                        /<a\b([^>]*)>(.*?)<\/a>/g,
                                        `<a $1 style='color: #0F5EFE;'>$2</a>`,
                                      ),
                                  }}
                                />
                              </FormattingWrapper>
                            </TabPanel>
                            {/* <CustomTabPanel
                              data={hackathonSlice?.hackathonInfo?.description}
                            /> */}

                            {/*========================= Submission Criteria Panel =========================*/}
                            <CustomTabPanel
                              data={
                                hackathonSlice?.hackathonInfo
                                  ?.submissionCriteria ||
                                'No Submission Criteria Available'
                              }
                            />

                            {/*========================= Events Criteria =========================*/}
                            <CustomTabPanel
                              data={
                                hackathonSlice?.hackathonInfo?.events ||
                                'No Events Available'
                              }
                            />

                            <TabPanel>
                              <Box>
                                {
                                  <>
                                    {moment(
                                      hackathonSlice?.hackathonInfo &&
                                        hackathonSlice?.hackathonInfo
                                          .submissionDeadline,
                                    ).isBefore(today) && (
                                      <h2>
                                        <Text color="brand.primary">
                                          Submission deadline is passed
                                        </Text>
                                      </h2>
                                    )}

                                    {(!moment(
                                      hackathonSlice?.hackathonInfo &&
                                        hackathonSlice?.hackathonInfo
                                          .submissionDeadline,
                                    ).isBefore(today) && (
                                      <Box>
                                        {!userResult ? (
                                          hackathonSlice?.hackathonInfo?.participants.includes(
                                            userSlice?.user?._id,
                                          ) ? (
                                            <>
                                              {hackathonSlice?.hackathonInfo
                                                .status ===
                                                HackathonStatus.published &&
                                              isConnected ? (
                                                <>
                                                  <Formik
                                                    initialValues={{
                                                      result: '',
                                                    }}
                                                    validationSchema={
                                                      SubmitResultSchema
                                                    }
                                                    onSubmit={(values) => {
                                                      onSubmitResult(values);
                                                    }}
                                                  >
                                                    {({
                                                      errors,
                                                      values,
                                                      setFieldValue,
                                                    }) => (
                                                      <Form>
                                                        <Box
                                                          my="1rem"
                                                          w={{
                                                            lg: '600px',
                                                          }}
                                                        >
                                                          <Text>
                                                            Submit Assignment:
                                                          </Text>
                                                          <Text
                                                            fontSize={'0.7rem'}
                                                            mb="1rem"
                                                          >
                                                            Link to Github
                                                            Google Document,
                                                            Onedrive e.t.c.
                                                          </Text>

                                                          <Text color="brand.danger">
                                                            You only submit once
                                                          </Text>

                                                          {errors &&
                                                          errors.result ? (
                                                            <Text
                                                              fontSize={'12px'}
                                                              mt="0.2rem"
                                                              color="brand.danger"
                                                            >
                                                              {errors.result}
                                                            </Text>
                                                          ) : null}

                                                          <Flex
                                                            alignItems={
                                                              'center'
                                                            }
                                                          >
                                                            <AuthInput
                                                              name="result"
                                                              type="text"
                                                              value={
                                                                values['result']
                                                              }
                                                              onChange={(e) =>
                                                                setFieldValue(
                                                                  'result',
                                                                  e.target
                                                                    .value,
                                                                )
                                                              }
                                                              placeholder="Enter link to your submission"
                                                            />

                                                            <Button
                                                              isLoading={
                                                                hackathonSlice?.submitting
                                                              }
                                                              ml="1rem"
                                                              type="submit"
                                                              bg="brand.primary "
                                                              _hover={{
                                                                bg: 'brand.secondary',
                                                                color: 'white',
                                                              }}
                                                              color="white"
                                                              _focus={{
                                                                bg: 'brand.secondary',
                                                                color: 'white',
                                                              }}
                                                            >
                                                              Submit
                                                            </Button>
                                                          </Flex>
                                                        </Box>
                                                      </Form>
                                                    )}
                                                  </Formik>
                                                </>
                                              ) : (
                                                <Box my="1rem">
                                                  <Button
                                                    bg="brand.primary"
                                                    onClick={() => {
                                                      wonOpen();
                                                    }}
                                                    color="white"
                                                    _hover={{
                                                      bg: 'brand.primary',
                                                    }}
                                                  >
                                                    Connect your wallet to
                                                    submit your result
                                                  </Button>
                                                </Box>
                                              )}
                                            </>
                                          ) : (
                                            <Text>
                                              Register to submit your result
                                            </Text>
                                          )
                                        ) : (
                                          <Box>
                                            <h1>
                                              <Text color="brand.danger">
                                                You already submitted your
                                                result
                                              </Text>
                                            </h1>

                                            <Text
                                              mt="1.5rem"
                                              fontSize={'14px'}
                                              fontStyle={'italic'}
                                              color="brand.primary"
                                            >
                                              Your submission:{' '}
                                              <Text
                                                display={'inline'}
                                                fontWeight={'bold'}
                                              >
                                                {userResult?.result}
                                              </Text>
                                            </Text>
                                          </Box>
                                        )}
                                      </Box>
                                    )) ||
                                      null}
                                  </>
                                }
                              </Box>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </Box>
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

                    {/* Concordium wallet manager */}
                  </Stack>

                  <NewFooter />
                  <ConcordiumModal
                    {...{
                      onCloseConcordiumWalletConnect,
                      isOpenConcordiumWalletConnect,
                    }}
                  />
                </>
              </BodyWrapper>
            </>
          )}
        </>
      </>
    </ConditionalRoute>
  );
}

export default UserHackathonDetail;
