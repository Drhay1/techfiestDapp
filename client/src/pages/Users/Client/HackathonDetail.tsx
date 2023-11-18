import moment from 'moment';
import { SideMenu } from '.';
import { useEffect, useState } from 'react';
import { RootState } from '../../../store/store';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { supportedTokens } from '../../../utils/tokens';
import { useNavigate, useParams } from 'react-router-dom';
import { FormattingWrapper } from '../../../reusable/styled';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import CustomTab from '../../../reusable/components/CustomTab';
import NewFooter from '../../../reusable/components/NewFooter';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { ExternalLink, proxyAddress } from '../../../utils/Link';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Grid,
  GridItem,
  Spinner,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Link,
  Tag,
  TagLabel,
  Checkbox,
  Stack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardHeader,
  Heading,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';

import {
  acceptParticipantResult,
  getHackathonDetailForClient,
  getHackathonSubmissionsDownloadForClient,
  resetErrMsg,
  resetIsPayingOut,
  resetPayed,
  resetScored,
  setParticipantScore,
} from '../../../store/slices/hackathonSlice';

import { Role, UserStateProps } from '../../../store/interfaces/user.interface';

import {
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';

import {
  HackathonStatusComponent,
  HomeNavbar,
} from '../../../reusable/components';
import ConfirmPayment from '../../../components/Modals/ConfirmPayment';
import { MetaTags } from '../../../reusable/components';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import PageLoader from '../../../reusable/components/PageLoader';

import CustomTabPanel from '../../../reusable/components/CustomTabPanel';

function HackathonDetail() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [scoringUserId, setScoringId] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();
  const today = moment();
  const { id } = useParams();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const navigate = useNavigate();

  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          position: 'top-right',
          status: 'error',
          duration: 5000,
          isClosable: true,
          onCloseComplete() {
            dispatch(resetErrMsg());
            dispatch(resetIsPayingOut());
          },
        }),
      ),
    );
  };

  const handleDowloadSubmission = (id: number | undefined) => {
    dispatch(getHackathonSubmissionsDownloadForClient(id));
  };

  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'PAYOUT_REQUEST_ERROR'
    ) {
      displayErrorToasts();
    }
  }, [hackathonSlice?.errMsg]);

  const onPayout = async () => {
    const { submissions, equalDistribution, rewardCount }: any =
      hackathonSlice?.clientHackInfo;

    const scores = submissions.filter((obj: any) => obj.score && obj.score > 0);
    const _scores = scores.length;

    const acceptedParticiPants = submissions.filter((obj: any) => obj.accepted);
    const _acceptedParticiPants = acceptedParticiPants.length;

    if (equalDistribution === 'yes') {
      if (!(_acceptedParticiPants === rewardCount)) {
        return toast({
          description: `Accept least ${rewardCount} participants that you wish to reward`,
          position: 'top-right',
          status: 'info',
          duration: 5000,
        });
      }

      // open payment modal
      onOpen();
    } else if (equalDistribution === 'no') {
      if (_scores < rewardCount) {
        return toast({
          description: `Score  at least ${rewardCount} participants that you wish to reward`,
          position: 'top-right',
          status: 'info',
          duration: 2000,
        });
      }

      // open payment modal
      if (hackathonSlice?.clientHackInfo?.escrow) return onOpen();
      navigate({ pathname: 'payout' });
    }
  };

  const onScore = async (score: number, _id: any, userID: string) => {
    if (!score)
      return toast({
        description: `No score provided`,
        position: 'bottom-left',
        status: 'info',
        duration: 2000,
      });

    const submissions = hackathonSlice?.clientHackInfo?.submissions;

    if (submissions && submissions.length > 0) {
      setScoringId(userID);
      dispatch(setParticipantScore({ score, _id }));
    }
  };

  const onAccepted = async (accepted: boolean, _id: any) => {
    dispatch(acceptParticipantResult({ accepted, _id }));
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(getHackathonDetailForClient(id));
  }, []);

  useEffect(() => {
    if (hackathonSlice?.scored) {
      toast({
        description: `Participant result updated`,
        status: 'success',
        duration: 2000,
        position: 'top-right',
        isClosable: true,
        onCloseComplete() {
          dispatch(resetScored());
        },
      });
    }

    if (hackathonSlice?.paid) {
      onClose(); // close the modal
      toast({
        description: `You have successfully paid participants`,
        status: 'success',
        duration: 10000,
        position: 'top-right',
        isClosable: true,
        onCloseComplete() {
          dispatch(resetPayed());
        },
      });
    }
  }, [hackathonSlice?.scored, hackathonSlice?.paying, hackathonSlice?.paid]);

  const timestamp: any = hackathonSlice?.clientHackInfo?.submissionDeadline;
  const isUtc = timestamp?.endsWith('Z');
  const utcDateTime = isUtc
    ? moment.utc(timestamp)
    : moment.utc(timestamp + 'Z');

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(
      `${proxyAddress}/hacks/${hackathonSlice?.clientHackInfo?.hackathonId}`,
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
      link: `http://twitter.com/share?text=${hackathonSlice?.clientHackInfo?.hackathonName}&url=${proxyAddress}/hacks/${hackathonSlice?.clientHackInfo?.hackathonId}`,
    },
    {
      socialMedia: 'telegram',
      link: `https://t.me/share?url=${proxyAddress}/hacks/${hackathonSlice?.clientHackInfo?.hackathonId}&text=${hackathonSlice?.clientHackInfo?.hackathonName}`,
    },
    // {
    //   socialMedia: 'discord',
    //   link: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=0&redirect_uri=${encodeURIComponent(
    //     proxyAddress,
    //   )}/hacks/${hackathonSlice?.clientHackInfo?.hackathonId}`,
    // },
  ];

  return (
    <ConditionalRoute redirectTo="/404" condition={(id && true) || false}>
      <ConditionalRoute
        redirectTo="/login"
        condition={userSlice?.isAuthenticated || false}
      >
        <ConditionalRoute
          redirectTo="/404"
          condition={
            userSlice.user && userSlice.user.roles.includes(Role.Client)
              ? true
              : false
          }
        >
          <>
            <BodyWrapper>
              <>
                <MetaTags
                  title={`${hackathonSlice?.clientHackInfo?.hackathonName}`}
                  description={`${hackathonSlice?.clientHackInfo?.description.slice(
                    0,
                    100,
                  )}`}
                  pageUrl={window.location.href}
                />
                {hackathonSlice?.fetchingClientHack ? (
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
                                  hackathonSlice?.clientHackInfo?.company
                                    ?.companyName
                                }
                                ignoreFallback={true}
                                src={
                                  hackathonSlice?.clientHackInfo?.company?.logo
                                }
                                size={{ base: 'xl', lg: 'lg' }}
                                rounded={'none'}
                                borderRadius={'none'}
                                mb={'24px'}
                              />
                            </Flex>
                          </Box>

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
                              <Box
                                borderRadius={'20px'}
                                px="24px"
                                py="1rem"
                                mb="24px"
                                bg="var(--bg-linear-2, linear-gradient(135deg, #F0F9FF 0%, #FFF 100%));"
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
                                              hackathonSlice?.clientHackInfo
                                                ?.hackathonName
                                            }
                                          </Text>
                                          <Box>
                                            <HackathonStatusComponent
                                              status={
                                                hackathonSlice?.clientHackInfo
                                                  ?.status
                                              }
                                            />
                                          </Box>
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
                                              ml={'10px'}
                                              h="24px"
                                              w="24px"
                                              display="flex"
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
                                  </Grid>
                                </Box>

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
                                        Bounty
                                      </Text>
                                      <Text
                                        fontWeight={'700'}
                                        fontSize={'14px'}
                                        color="brand.secondary"
                                      >
                                        {
                                          hackathonSlice?.clientHackInfo
                                            ?.totalRewardinUsd
                                        }{' '}
                                        {
                                          supportedTokens.find(
                                            (tk) =>
                                              tk.address ===
                                              hackathonSlice?.clientHackInfo
                                                ?.rewardTokenAddress,
                                          )?.symbol
                                        }
                                      </Text>
                                    </Flex>
                                  </Box>

                                  {hackathonSlice?.clientHackInfo
                                    ?.startDate && (
                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
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
                                          Start date
                                        </Text>
                                        <Text
                                          fontWeight={'700'}
                                          color="brand.secondary"
                                          fontSize={'14px'}
                                        >
                                          {moment
                                            .utc(
                                              hackathonSlice?.clientHackInfo
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
                                        Submission Deadline
                                      </Text>
                                      <Text
                                        fontWeight={'700'}
                                        fontSize={'14px'}
                                        color="brand.secondary"
                                      >
                                        {utcDateTime
                                          .local()
                                          .format('MMMM Do, YYYY HH:mm')}
                                      </Text>
                                    </Flex>
                                  </Box>

                                  {hackathonSlice?.clientHackInfo?.endDate && (
                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
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
                                          End date
                                        </Text>
                                        <Text
                                          fontWeight={'700'}
                                          fontSize={'16px'}
                                          color="brand.secondary"
                                        >
                                          {moment
                                            .utc(
                                              hackathonSlice?.clientHackInfo
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
                                        fontSize={'18px'}
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
                                <Box mt="48px">
                                  <Tabs>
                                    <TabList borderBottom={'none'}>
                                      <CustomTab>Overview</CustomTab>
                                      <CustomTab>Submission Criteria</CustomTab>
                                      <CustomTab>Events</CustomTab>
                                      <CustomTab>Participants</CustomTab>
                                      <CustomTab>Submissions</CustomTab>
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
                                                hackathonSlice?.clientHackInfo?.description?.replace(
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
                                                hackathonSlice?.clientHackInfo?.submissionCriteria?.replace(
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
                                                hackathonSlice?.clientHackInfo?.events?.replace(
                                                  /<a\b([^>]*)>(.*?)<\/a>/g,
                                                  `<a $1 style='color: #0BA5EC;'>$2</a>`,
                                                ),
                                            }}
                                          />
                                        </FormattingWrapper>
                                      </CustomTabPanel>
                                      <CustomTabPanel>
                                        <Flex
                                          flexDirection={'row'}
                                          gap={'8px'}
                                          w="full"
                                          alignItems={'center'}
                                          justifyContent={'center'}
                                          mb={'24px'}
                                        >
                                          <Text
                                            fontWeight={'400'}
                                            fontSize={'24px'}
                                            color="brand.lightsecondary"
                                          >
                                            Showing results for
                                          </Text>
                                          <Text
                                            fontWeight={'700'}
                                            fontSize={'24px'}
                                            color="brand.secondary"
                                          >
                                            {
                                              hackathonSlice?.clientHackInfo
                                                ?.participants.length
                                            }{' '}
                                            participants
                                          </Text>
                                        </Flex>
                                        <Grid
                                          gridTemplateColumns={{
                                            lg: 'repeat(4, 1fr)',
                                            md: 'repeat(3, 1fr)',
                                            base: 'repeat(1, 1fr)',
                                          }}
                                        >
                                          {hackathonSlice?.clientHackInfo?.participants.map(
                                            (
                                              { firstname, lastname, email },
                                              index,
                                            ) => (
                                              <GridItem
                                                key={index}
                                                p="1rem"
                                                h={'auto'}
                                              >
                                                <Flex
                                                  flexDirection={'row'}
                                                  justifyContent={
                                                    'space-between'
                                                  }
                                                  flexWrap={'wrap'}
                                                >
                                                  <Stack
                                                    spacing="4"
                                                    cursor={'pointer'}
                                                  >
                                                    <Card
                                                      key={email}
                                                      size={'sm'}
                                                    >
                                                      <CardHeader>
                                                        <Heading size="md">
                                                          {firstname} {lastname}
                                                        </Heading>
                                                      </CardHeader>
                                                    </Card>
                                                  </Stack>
                                                </Flex>
                                              </GridItem>
                                            ),
                                          )}
                                        </Grid>
                                      </CustomTabPanel>
                                      <CustomTabPanel>
                                        <Flex
                                          flexDirection={'row'}
                                          gap={'8px'}
                                          w="full"
                                          alignItems={'center'}
                                          justifyContent={'center'}
                                          mb={'24px'}
                                        >
                                          <Text
                                            fontWeight={'400'}
                                            fontSize={'24px'}
                                            color="brand.lightsecondary"
                                          >
                                            Showing results for
                                          </Text>
                                          <Text
                                            fontWeight={'700'}
                                            fontSize={'24px'}
                                            color="brand.secondary"
                                          >
                                            {
                                              hackathonSlice?.clientHackInfo
                                                ?.submissions.length
                                            }{' '}
                                            participants
                                          </Text>
                                        </Flex>
                                        <Stack
                                          minH={
                                            hackathonSlice?.clientHackInfo &&
                                            hackathonSlice?.clientHackInfo
                                              .submissions.length >= 8
                                              ? '300px'
                                              : ''
                                          }
                                          maxH={'500px'}
                                          overflowY={'scroll'}
                                        >
                                          {hackathonSlice?.clientHackInfo?.submissions
                                            .slice()
                                            .sort((a, b) => {
                                              if (
                                                !a.hasOwnProperty('score') &&
                                                !b.hasOwnProperty('score')
                                              ) {
                                                return 0;
                                              }
                                              if (!a.hasOwnProperty('score')) {
                                                return 1;
                                              }
                                              if (!b.hasOwnProperty('score')) {
                                                return -1;
                                              }
                                              if (
                                                a.score === null &&
                                                b.score === null
                                              ) {
                                                return 0;
                                              }
                                              if (a.score === null) {
                                                return 1;
                                              }
                                              if (b.score === null) {
                                                return -1;
                                              }
                                              if (
                                                a.score === 0 &&
                                                b.score === 0
                                              ) {
                                                return 0;
                                              }
                                              if (a.score === 0) {
                                                return 1;
                                              }
                                              if (b.score === 0) {
                                                return -1;
                                              }
                                              return b.score - a.score;
                                            })
                                            .map(
                                              (
                                                {
                                                  user,
                                                  result,
                                                  createdAt,
                                                  _id,
                                                  score,
                                                  accepted,
                                                },
                                                index,
                                              ) => (
                                                <Box
                                                  key={index}
                                                  p={'16px'}
                                                  w={'full'}
                                                  borderWidth={'1px'}
                                                  borderColor={
                                                    'brand.lightsecondary'
                                                  }
                                                  borderRadius={'5px'}
                                                  maxH={'200px'}
                                                >
                                                  <Flex
                                                    flexDirection={'row'}
                                                    justifyContent={
                                                      'space-between'
                                                    }
                                                  >
                                                    <Flex
                                                      flexDirection={'column'}
                                                    >
                                                      <Text
                                                        fontWeight={'500'}
                                                        fontSize={'24px'}
                                                        color="brand.secondary"
                                                        display={'inline'}
                                                      >
                                                        {user.firstname}{' '}
                                                        {user.lastname}
                                                      </Text>

                                                      <Text
                                                        fontWeight={'400'}
                                                        fontSize={'14px'}
                                                        color="brand.lightsecondary"
                                                      >
                                                        Submitted on:{' '}
                                                        <Text
                                                          color="brand.secondary"
                                                          display={
                                                            'inline-block'
                                                          }
                                                        >
                                                          {moment(
                                                            createdAt,
                                                          ).format('DD/MM/YY')}
                                                        </Text>
                                                      </Text>
                                                      <Text
                                                        fontWeight={'400'}
                                                        fontSize={'14px'}
                                                        color="brand.lightsecondary"
                                                        mb={'8px'}
                                                      >
                                                        Result link:{' '}
                                                        <Text
                                                          color="brand.primary"
                                                          display={
                                                            'inline-block'
                                                          }
                                                        >
                                                          <Link
                                                            href={
                                                              result.startsWith(
                                                                'www.',
                                                              )
                                                                ? result.replace(
                                                                    /^www\./i,
                                                                    'https://',
                                                                  )
                                                                : result.startsWith(
                                                                    'http://',
                                                                  )
                                                                ? result.replace(
                                                                    /^http:/i,
                                                                    'https:',
                                                                  )
                                                                : result.startsWith(
                                                                    'https://',
                                                                  )
                                                                ? result
                                                                : 'https://' +
                                                                  result
                                                            }
                                                            isExternal
                                                          >
                                                            {result.startsWith(
                                                              'www.',
                                                            )
                                                              ? result
                                                                  .substring(
                                                                    0,
                                                                    100,
                                                                  )
                                                                  .replace(
                                                                    /^www\./i,
                                                                    'https://',
                                                                  )
                                                              : result.startsWith(
                                                                  'http://',
                                                                )
                                                              ? result
                                                                  .substring(
                                                                    0,
                                                                    100,
                                                                  )
                                                                  .replace(
                                                                    /^http:/i,
                                                                    'https:',
                                                                  )
                                                              : result.startsWith(
                                                                  'https://',
                                                                )
                                                              ? result.substring(
                                                                  0,
                                                                  100,
                                                                )
                                                              : 'https://' +
                                                                result.substring(
                                                                  0,
                                                                  100,
                                                                )}
                                                            <ExternalLinkIcon mx="2px" />
                                                          </Link>
                                                        </Text>
                                                      </Text>
                                                      <Box>
                                                        <Tag
                                                          key={index}
                                                          size={'md'}
                                                          borderRadius="full"
                                                          variant="subtle"
                                                          colorScheme="green"
                                                          fontSize={'14px'}
                                                          fontWeight={'500'}
                                                        >
                                                          <TagLabel>
                                                            Score: {score}
                                                          </TagLabel>
                                                        </Tag>
                                                      </Box>
                                                    </Flex>
                                                    <Flex
                                                      flexDirection={'column'}
                                                      gap={'8px'}
                                                      justifyContent={'center'}
                                                      alignItems={'center'}
                                                    >
                                                      <Flex
                                                        flexDirection={'column'}
                                                        gap={'5px'}
                                                        justifyContent={
                                                          'center'
                                                        }
                                                        alignItems={'center'}
                                                      >
                                                        <Text
                                                          fontWeight={'500'}
                                                          fontSize={'16px'}
                                                          color="brand.lightsecondary"
                                                        >
                                                          Score
                                                        </Text>
                                                        {hackathonSlice
                                                          .clientHackInfo
                                                          ?.equalDistribution ===
                                                        'no' ? (
                                                          <>
                                                            <NumberInput
                                                              id={`score-${user._id}`}
                                                              boxShadow={'none'}
                                                              outline={'none'}
                                                              max={250}
                                                              clampValueOnBlur={
                                                                false
                                                              }
                                                              size={'xs'}
                                                              w="80px"
                                                              borderRadius={
                                                                '10px'
                                                              }
                                                              bg="white"
                                                              defaultValue={
                                                                score
                                                              }
                                                              onKeyUp={(
                                                                e: any,
                                                              ) => {
                                                                if (
                                                                  e.key ===
                                                                  'Enter'
                                                                ) {
                                                                  onScore(
                                                                    e.target
                                                                      .value,
                                                                    _id,
                                                                    user._id,
                                                                  );
                                                                }
                                                              }}
                                                              borderColor="brand.primary"
                                                              isDisabled={
                                                                hackathonSlice
                                                                  ?.clientHackInfo
                                                                  ?.status ===
                                                                  HackathonStatus.ended ||
                                                                (hackathonSlice?.scoring &&
                                                                  user._id ===
                                                                    scoringUserId)
                                                              }
                                                            >
                                                              <NumberInputField />
                                                              <NumberInputStepper>
                                                                <NumberIncrementStepper
                                                                  bg={
                                                                    'gray.300'
                                                                  }
                                                                  color={
                                                                    'green.400'
                                                                  }
                                                                />
                                                                <NumberDecrementStepper
                                                                  color={
                                                                    'red.400'
                                                                  }
                                                                />
                                                              </NumberInputStepper>
                                                            </NumberInput>
                                                            <Button
                                                              w="80px"
                                                              mt="0.2rem"
                                                              size={'xs'}
                                                              color="white"
                                                              bg="brand.primary !important"
                                                              isLoading={
                                                                hackathonSlice?.scoring &&
                                                                user._id ===
                                                                  scoringUserId
                                                              }
                                                              isDisabled={
                                                                hackathonSlice
                                                                  ?.clientHackInfo
                                                                  ?.status ===
                                                                  HackathonStatus.ended ||
                                                                (hackathonSlice?.scoring &&
                                                                  user._id ===
                                                                    scoringUserId)
                                                              }
                                                              onClick={() => {
                                                                const inputElement =
                                                                  document.querySelector(
                                                                    `#score-${user._id}`,
                                                                  ) as HTMLInputElement | null;

                                                                const score: any =
                                                                  inputElement?.value ||
                                                                  '';

                                                                onScore(
                                                                  score,
                                                                  _id,
                                                                  user._id,
                                                                );
                                                              }}
                                                            >
                                                              Score
                                                            </Button>
                                                          </>
                                                        ) : (
                                                          <Checkbox
                                                            isDisabled={
                                                              hackathonSlice
                                                                ?.clientHackInfo
                                                                ?.status ===
                                                                HackathonStatus.ended ||
                                                              hackathonSlice?.scoring
                                                            }
                                                            size="sm"
                                                            borderColor={
                                                              '#DD2121'
                                                            }
                                                            colorScheme="green"
                                                            isChecked={accepted}
                                                            onChange={(e) =>
                                                              onAccepted(
                                                                e.target
                                                                  .checked,
                                                                _id,
                                                              )
                                                            }
                                                          />
                                                        )}
                                                      </Flex>
                                                    </Flex>
                                                  </Flex>
                                                </Box>
                                              ),
                                            )}
                                        </Stack>

                                        <Flex
                                          flexDirection={'row'}
                                          gap={'8px'}
                                          w="full"
                                          alignItems={'center'}
                                          justifyContent={'flex-end'}
                                          mt={'24px'}
                                          color="brand.primary"
                                          display={
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions.length &&
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions.length > 0
                                              ? 'flex'
                                              : 'none'
                                          }
                                        >
                                          <Text
                                            fontWeight={'400'}
                                            fontSize={'14px'}
                                            display={'inline-flex'}
                                            gap={2}
                                            onClick={() =>
                                              handleDowloadSubmission(
                                                hackathonSlice?.clientHackInfo
                                                  ?.hackathonId,
                                              )
                                            }
                                            cursor={'pointer'}
                                          >
                                            [ Download as .xlsx <DownloadIcon />{' '}
                                            ]
                                          </Text>
                                        </Flex>
                                        <Box>
                                          {moment(
                                            hackathonSlice?.clientHackInfo
                                              ?.submissionDeadline,
                                          ).isBefore(today) &&
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions &&
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions.length <
                                              hackathonSlice?.clientHackInfo
                                                ?.rewardCount && (
                                              <Text color="brand.danger">
                                                {
                                                  hackathonSlice?.clientHackInfo
                                                    ?.rewardCount
                                                }{' '}
                                                Participants has to submit
                                                before you can payout (Contact
                                                us to resolve this issue)
                                              </Text>
                                            )}

                                          {hackathonSlice?.clientHackInfo
                                            ?.status ===
                                            HackathonStatus.reviewing &&
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions &&
                                            hackathonSlice?.clientHackInfo
                                              ?.submissions.length >=
                                              hackathonSlice?.clientHackInfo
                                                ?.rewardCount &&
                                            moment(
                                              hackathonSlice?.clientHackInfo
                                                ?.submissionDeadline,
                                            ).isBefore(today) && (
                                              <HStack
                                                alignItems={'center'}
                                                justifyContent={'center'}
                                                mt="1rem"
                                                mb={{ lg: '4rem' }}
                                                gap={'1rem'}
                                              >
                                                <Button
                                                  isLoading={
                                                    hackathonSlice?.paying
                                                  }
                                                  bg="white"
                                                  borderWidth={'1px'}
                                                  borderColor={'brand.primary'}
                                                  color="rgba(11, 165, 236, 1)"
                                                  px={{ lg: '4rem' }}
                                                  _hover={{
                                                    bg: 'brand.primary',
                                                    color: 'white',
                                                  }}
                                                  onClick={onPayout}
                                                >
                                                  Payout
                                                </Button>
                                              </HStack>
                                            )}
                                        </Box>
                                      </CustomTabPanel>
                                    </TabPanels>
                                  </Tabs>
                                </Box>
                              </Box>
                            </GridItem>
                          </Grid>
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
                    {hackathonSlice?.clientHackInfo?.status ===
                      HackathonStatus.reviewing && (
                      <ConfirmPayment {...{ isOpen, onOpen, onClose, id }} />
                    )}
                  </>
                )}
                <NewFooter />
              </>
            </BodyWrapper>
          </>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default HackathonDetail;
