import moment from 'moment';
import { Formik, Form } from 'formik';
import { PlusIcon } from '../../../assets/icons';
import { RootState } from '../../../store/store';
import { ChevronRightIcon } from '@chakra-ui/icons';
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
import { useCallback, useContext, useEffect, useState } from 'react';
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
import {
  HackathonStatusComponent,
  HomeNavbar,
  MetaTags,
} from '../../../reusable/components';
import {
  HackathonProps,
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SideMenu } from '../Client';
import { authorize, getChallenge, getStatement } from '../../../utils/utils';

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
        duration: 5000,
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
          duration: 5000,
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
        duration: 10000,
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
        duration: 10000,
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
                  <Box
                    w={{ base: 'full' }}
                    maxW={{ lg: '1199px' }}
                    mx="auto"
                    mb={'50px'}
                    mt={{ lg: '6rem', base: '8rem' }}
                    px={{ base: '1rem', lg: 'unset' }}
                  >
                    {!hackathonSlice?.fetchingHacks ? (
                      <>
                        <Box>
                          <Flex
                            justifyContent={'center'}
                            px="24px"
                            display={'flex'}
                            alignItems={'flex-start'}
                          >
                            <Avatar
                              name={
                                hackathonSlice?.hackathonInfo?.company
                                  ?.companyName
                              }
                              ignoreFallback={true}
                              src={hackathonSlice?.hackathonInfo?.company?.logo}
                              size={{ base: 'xl', lg: 'lg' }}
                              rounded={'none'}
                              borderRadius={'none'}
                            />
                          </Flex>
                        </Box>

                        <Box
                          mt={{ lg: '6rem', base: '8rem' }}
                          w={{ base: 'full' }}
                          maxW={{ lg: '1199px' }}
                          mx="auto"
                          mb={'50px'}
                        >
                          <Grid
                            display={{ base: 'block', lg: 'grid' }}
                            mt={{ lg: '3rem' }}
                            templateAreas={{
                              lg: `"nav main" "nav footer"`,
                            }}
                            gridTemplateColumns={{ lg: '200px 1fr' }}
                            gap={{ lg: '10' }}
                            color="blackAlpha.700"
                            fontWeight="bold"
                          >
                            <GridItem
                              bg="white"
                              area={'nav'}
                              display={{ base: 'none', lg: 'inline-grid' }}
                            >
                              <SideMenu />
                            </GridItem>
                            <GridItem bg="white" area={'main'}>
                              <Breadcrumb
                                mb="0.8rem"
                                spacing="8px"
                                separator={
                                  <ChevronRightIcon color="gray.500" />
                                }
                                fontSize={'12px'}
                              >
                                <BreadcrumbItem>
                                  <BreadcrumbLink href={'/hackathons'}>
                                    Hackathons
                                  </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                  <BreadcrumbLink
                                    href="#"
                                    isCurrentPage
                                    color="brand.primary"
                                  >
                                    {
                                      hackathonSlice?.hackathonInfo
                                        ?.hackathonName
                                    }
                                  </BreadcrumbLink>
                                </BreadcrumbItem>
                              </Breadcrumb>
                              <Box
                                py="1rem"
                                px="24px"
                                mb="24px"
                                bg="var(--bg-linear-2, linear-gradient(135deg, #F0F9FF 0%, #FFF 100%));"
                                borderRadius={'20px'}
                              >
                                <Box>
                                  <Grid
                                    gridTemplateColumns={{
                                      base: '100%',
                                      lg: '75% 25%',
                                    }}
                                    gridTemplateRows={{
                                      base: 'auto auto',
                                      lg: '1fr',
                                    }}
                                    overflow={'hidden'}
                                    mb={'40px'}
                                    rowGap={4}
                                  >
                                    <GridItem>
                                      <Flex
                                        gap={'16px'}
                                        flexDirection={'column'}
                                      >
                                        <Flex flexDirection={'column'}>
                                          <Flex
                                            flexDirection={'row'}
                                            gap={'16px'}
                                            alignItems={'center'}
                                          >
                                            <Text
                                              fontWeight={'700'}
                                              fontSize={{
                                                base: '1.5rem',
                                                lg: '2rem',
                                              }}
                                              color="brand.secondary"
                                            >
                                              {
                                                hackathonSlice?.hackathonInfo
                                                  ?.hackathonName
                                              }
                                            </Text>
                                            <Box>
                                              <HackathonStatusComponent
                                                status={
                                                  hackathonSlice?.hackathonInfo
                                                    ?.status
                                                }
                                              />
                                            </Box>
                                          </Flex>
                                        </Flex>
                                        <Flex
                                          flexDirection={'row'}
                                          gap={'10px'}
                                          mb={'10px'}
                                          alignItems={'center'}
                                        >
                                          <Text
                                            fontSize={{
                                              base: '14px',
                                              lg: '16px',
                                            }}
                                            fontWeight={'500'}
                                            lineHeight={'24px'}
                                            color="brand.secondary"
                                          >
                                            Share on:
                                          </Text>
                                          {socialMediaLinks &&
                                            socialMediaLinks.map(
                                              (socialMediaLink) => (
                                                <ExternalLink
                                                  href={socialMediaLink.link}
                                                >
                                                  <Box
                                                    h="24px"
                                                    w="24px"
                                                    display="flex"
                                                    p="4px"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    borderColor={
                                                      'brand.primary'
                                                    }
                                                    borderWidth={'1px'}
                                                    bg={'white'}
                                                    boxShadow="0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset"
                                                    overflow={'hidden'}
                                                  >
                                                    <Image
                                                      src={
                                                        socialMediaLink.socialMedia ===
                                                        'twitter'
                                                          ? '/icons/twitterIcon.svg'
                                                          : socialMediaLink.socialMedia ===
                                                            'telegram'
                                                          ? '/icons/telegramIcon.svg'
                                                          : socialMediaLink.socialMedia ===
                                                            'discord'
                                                          ? '/icons/discordIcon.svg'
                                                          : '/icons/linkIcon.svg'
                                                      }
                                                      cursor={'pointer'}
                                                      h="100%"
                                                      w="100%"
                                                      objectFit={'cover'}
                                                      alt={'Social Media Icon'}
                                                    />
                                                  </Box>
                                                </ExternalLink>
                                              ),
                                            )}
                                          <Tooltip
                                            label="Link Copied!"
                                            isOpen={isTooltipOpen}
                                            placement="bottom"
                                          >
                                            <Box
                                              h="24px"
                                              w="24px"
                                              display="flex"
                                              ml={'10px'}
                                              p="4px"
                                              justifyContent="center"
                                              alignItems="center"
                                              borderColor={'brand.primary'}
                                              borderWidth={'1px'}
                                              bg={'white'}
                                              boxShadow="0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset"
                                              onClick={copyLinkToClipboard}
                                            >
                                              <Image
                                                src={'/icons/linkIcon.svg'}
                                                cursor={'pointer'}
                                                h="100%"
                                                w="100%"
                                                objectFit={'cover'}
                                                alt={'Social Media Icon'}
                                              />
                                            </Box>
                                          </Tooltip>
                                        </Flex>
                                      </Flex>
                                    </GridItem>

                                    <GridItem>
                                      <Flex
                                        gap={'8px'}
                                        flexDirection={'column'}
                                        alignItems={{
                                          base: 'center',
                                          lg: 'flex-end',
                                        }}
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
                                                      {(hackathonSlice
                                                        ?.hackathonInfo
                                                        ?.participants &&
                                                        hackathonSlice?.hackathonInfo?.participants.includes(
                                                          userSlice?.user?._id,
                                                        ) && <Text></Text>) || (
                                                        <>
                                                          {isConnected ||
                                                          (hackathonSlice
                                                            ?.hackathonInfo
                                                            ?.requiresCountry &&
                                                            account) ? (
                                                            <Button
                                                              w={{
                                                                base: 'full',
                                                                lg: 'unset',
                                                              }}
                                                              onClick={onCta}
                                                              borderRadius={
                                                                '12px'
                                                              }
                                                              leftIcon={
                                                                <PlusIcon />
                                                              }
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
                                                              borderWidth={
                                                                '1px'
                                                              }
                                                              borderColor={
                                                                'brand.primary'
                                                              }
                                                            >
                                                              {(userSlice?.isAuthenticated && (
                                                                <>Register</>
                                                              )) || (
                                                                <Text>
                                                                  Participate
                                                                  Now
                                                                </Text>
                                                              )}
                                                            </Button>
                                                          ) : hackathonSlice
                                                              ?.hackathonInfo
                                                              ?.requiresCountry &&
                                                            caccount &&
                                                            !authToken ? (
                                                            <Button
                                                              w={{
                                                                base: 'full',
                                                                lg: 'unset',
                                                              }}
                                                              bg="brand.primary !important"
                                                              color="white"
                                                              borderRadius={
                                                                '5px'
                                                              }
                                                              onClick={
                                                                handleAuthorize
                                                              }
                                                            >
                                                              Check Eligibility
                                                            </Button>
                                                          ) : (
                                                            <Button
                                                              w={{
                                                                base: 'full',
                                                                lg: 'unset',
                                                              }}
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
                                                              borderRadius={
                                                                '5px'
                                                              }
                                                            >
                                                              Connect Your
                                                              wallet to register
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
                                    </GridItem>
                                  </Grid>
                                </Box>
                                <Box>
                                  <Grid
                                    templateColumns={{
                                      base: 'repeat(2,1fr)',
                                      lg: 'repeat(4,1fr)',
                                    }}
                                    rowGap={4}
                                  >
                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
                                        fontSize={'1rem'}
                                        px={'24px'}
                                        flexDirection={'column'}
                                        gap={'8px'}
                                      >
                                        <Text
                                          lineHeight={'24px'}
                                          fontWeight={'400'}
                                          color="brand.lightsecondary"
                                          fontSize={'1rem'}
                                        >
                                          Bounty
                                        </Text>
                                        <Text
                                          fontWeight={'700'}
                                          color="brand.secondary"
                                          fontSize={'14px'}
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
                                      </Flex>
                                    </Box>

                                    {hackathonSlice?.hackathonInfo
                                      ?.startDate && (
                                      <Box
                                        borderLeftWidth={'2px'}
                                        borderColor={'brand.secondary'}
                                      >
                                        <Flex
                                          fontSize={'1rem'}
                                          px={'24px'}
                                          flexDirection={'column'}
                                          gap={'8px'}
                                        >
                                          <Text
                                            lineHeight={'24px'}
                                            fontWeight={'400'}
                                            color="brand.lightsecondary"
                                          >
                                            Start date
                                          </Text>
                                          <Text
                                            fontWeight={'700'}
                                            color="brand.secondary"
                                            fontSize={'14px'}
                                          >
                                            {moment
                                              .utc(
                                                hackathonSlice?.hackathonInfo
                                                  ?.startDate,
                                              )
                                              .local()
                                              .format('MMMM Do, YYYY HH:mm')}
                                          </Text>
                                        </Flex>
                                      </Box>
                                    )}

                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
                                        fontSize={'1rem'}
                                        px={'24px'}
                                        flexDirection={'column'}
                                        gap={'8px'}
                                      >
                                        <Text
                                          lineHeight={'24px'}
                                          fontWeight={'400'}
                                          color="brand.lightsecondary"
                                        >
                                          Submission Deadline
                                        </Text>
                                        <Text
                                          fontWeight={'700'}
                                          color="brand.secondary"
                                          fontSize={'14px'}
                                        >
                                          {utcDateTime
                                            .local()
                                            .format('MMMM Do, YYYY HH:mm')}
                                        </Text>
                                      </Flex>
                                    </Box>

                                    {hackathonSlice?.hackathonInfo?.endDate && (
                                      <Box
                                        borderLeftWidth={'2px'}
                                        borderColor={'brand.secondary'}
                                      >
                                        <Flex
                                          fontSize={'1rem'}
                                          px={'24px'}
                                          flexDirection={'column'}
                                          gap={'8px'}
                                        >
                                          <Text
                                            lineHeight={'24px'}
                                            fontWeight={'400'}
                                            color="brand.lightsecondary"
                                          >
                                            End date
                                          </Text>
                                          <Text
                                            fontWeight={'700'}
                                            color="brand.secondary"
                                            fontSize={'14px'}
                                          >
                                            {moment
                                              .utc(
                                                hackathonSlice?.hackathonInfo
                                                  ?.endDate,
                                              )
                                              .local()
                                              .format('MMMM Do, YYYY HH:mm')}
                                          </Text>
                                        </Flex>
                                      </Box>
                                    )}

                                    <Box
                                      display={'none'}
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
                                        fontSize={'1rem'}
                                        px={'24px'}
                                        flexDirection={'column'}
                                        gap={'8px'}
                                      >
                                        <Text
                                          fontSize={'16px'}
                                          lineHeight={'24px'}
                                          fontWeight={'400'}
                                          color="brand.lightsecondary"
                                        >
                                          Duration
                                        </Text>
                                        <Text
                                          fontWeight={'700'}
                                          color="brand.secondary"
                                        >
                                          {moment('2023-11-2').diff(
                                            moment('2023-09-2'),
                                            'months',
                                          )}{' '}
                                          months
                                        </Text>
                                      </Flex>
                                    </Box>
                                  </Grid>
                                </Box>
                                <Tabs mt="48px">
                                  <TabList borderBottom={'none'}>
                                    <CustomTab>Overview</CustomTab>
                                    <CustomTab>Submission Criteria</CustomTab>
                                    <CustomTab>Events</CustomTab>
                                    {userSlice?.isAuthenticated &&
                                      userSlice?.user?.roles.includes(
                                        Role.User,
                                      ) && (
                                        <CustomTab>
                                          Submit your result
                                        </CustomTab>
                                      )}
                                  </TabList>

                                  <TabPanels>
                                    <CustomTabPanel>
                                      <FormattingWrapper>
                                        <Box
                                          borderColor={'brand.secondary'}
                                          p={'1rem'}
                                          // @ts-ignore
                                          dangerouslySetInnerHTML={{
                                            // @ts-ignore
                                            __html:
                                              hackathonSlice?.hackathonInfo?.description?.replace(
                                                /<a\b([^>]*)>(.*?)<\/a>/g,
                                                `<a $1 style='color: #0BA5EC;'>$2</a>`,
                                              ),
                                          }}
                                        />
                                      </FormattingWrapper>
                                    </CustomTabPanel>
                                    <CustomTabPanel>
                                      <FormattingWrapper>
                                        <Box
                                          borderColor={'brand.secondary'}
                                          p={'1rem'}
                                          // @ts-ignore
                                          dangerouslySetInnerHTML={{
                                            // @ts-ignore
                                            __html:
                                              hackathonSlice?.hackathonInfo?.submissionCriteria?.replace(
                                                /<a\b([^>]*)>(.*?)<\/a>/g,
                                                `<a $1 style='color: #0BA5EC;'>$2</a>`,
                                              ),
                                          }}
                                        />
                                      </FormattingWrapper>
                                    </CustomTabPanel>
                                    <CustomTabPanel>
                                      <FormattingWrapper>
                                        <Box
                                          borderColor={'brand.secondary'}
                                          p={'1rem'}
                                          // @ts-ignore
                                          dangerouslySetInnerHTML={{
                                            // @ts-ignore
                                            __html:
                                              hackathonSlice?.hackathonInfo?.events?.replace(
                                                /<a\b([^>]*)>(.*?)<\/a>/g,
                                                `<a $1 style='color: #0BA5EC;'>$2</a>`,
                                              ),
                                          }}
                                        />
                                      </FormattingWrapper>
                                    </CustomTabPanel>
                                    <CustomTabPanel>
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
                                                      {hackathonSlice
                                                        ?.hackathonInfo
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
                                                            onSubmit={(
                                                              values,
                                                            ) => {
                                                              onSubmitResult(
                                                                values,
                                                              );
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
                                                                    Submit
                                                                    Assignment:
                                                                  </Text>
                                                                  <Text
                                                                    fontSize={
                                                                      '0.7rem'
                                                                    }
                                                                    mb="1rem"
                                                                  >
                                                                    Link to
                                                                    Github
                                                                    Google
                                                                    Document,
                                                                    Onedrive
                                                                    e.t.c.
                                                                  </Text>

                                                                  <Text color="brand.danger">
                                                                    You only
                                                                    submit once
                                                                  </Text>

                                                                  {errors &&
                                                                  errors.result ? (
                                                                    <Text
                                                                      fontSize={
                                                                        '12px'
                                                                      }
                                                                      mt="0.2rem"
                                                                      color="brand.danger"
                                                                    >
                                                                      {
                                                                        errors.result
                                                                      }
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
                                                                        values[
                                                                          'result'
                                                                        ]
                                                                      }
                                                                      onChange={(
                                                                        e,
                                                                      ) =>
                                                                        setFieldValue(
                                                                          'result',
                                                                          e
                                                                            .target
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
                                                                        color:
                                                                          'white',
                                                                      }}
                                                                      color="white"
                                                                      _focus={{
                                                                        bg: 'brand.secondary',
                                                                        color:
                                                                          'white',
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
                                                            onClick={wonOpen}
                                                            color="white"
                                                            _hover={{
                                                              bg: 'brand.primary',
                                                            }}
                                                          >
                                                            Connect your wallet
                                                            to submit your
                                                            result
                                                          </Button>
                                                        </Box>
                                                      )}
                                                    </>
                                                  ) : null
                                                ) : (
                                                  <Box>
                                                    <h1>
                                                      <Text color="brand.danger">
                                                        You already submitted
                                                        your result
                                                      </Text>
                                                    </h1>

                                                    <Text
                                                      mt="1.5rem"
                                                      fontSize={'12px'}
                                                      fontStyle={'italic'}
                                                      color="brand.primary"
                                                    >
                                                      Your submission:{' '}
                                                      {userResult?.result}
                                                    </Text>
                                                  </Box>
                                                )}
                                              </Box>
                                            )) ||
                                              null}
                                          </>
                                        }
                                      </Box>
                                    </CustomTabPanel>
                                  </TabPanels>
                                </Tabs>
                              </Box>
                            </GridItem>
                          </Grid>
                        </Box>
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
                  <NewFooter />

                  {/* Concordium wallet manager */}
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
