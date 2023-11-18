import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { supportedTokens } from '../../../utils/tokens';
import { useNavigate, useParams } from 'react-router-dom';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import NewFooter from '../../../reusable/components/NewFooter';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { ExternalLink, proxyAddress } from '../../../utils/Link';

import {
  Avatar,
  Box,
  Button,
  Flex,
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
  Icon,
  Tab,
  TabPanel,
  VStack,
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

import ConfirmPayment from '../../../components/Modals/ConfirmPayment';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import PageLoader from '../../../reusable/components/PageLoader';

import CustomTabPanel from '../../../reusable/components/CustomTabPanel';

import { AiOutlineLink } from 'react-icons/ai';
import { BsTelegram } from 'react-icons/bs';
import { RiTwitterXFill } from 'react-icons/ri';

const HomeNavbar = React.lazy(
  () => import('../../../reusable/components/HomeNavbar'),
);
const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

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
  const params = useParams();

  return (
    <ConditionalRoute
      redirectTo="/404"
      condition={(params?.id && true) || false}
    >
      <>
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
              <Suspense fallback={<PageLoader />}>
                <>
                  <MetaTags
                    title={`${hackathonSlice?.clientHackInfo?.hackathonName}`}
                    description={`${hackathonSlice?.clientHackInfo?.description.slice(
                      0,
                      100,
                    )}`}
                    pageUrl={window.location.href}
                  />
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

                      <BodyWrapper>
                        <>
                          <Stack px={{ base: '1rem' }} overflow={'hidden'}>
                            {!hackathonSlice?.fetchingHacks ? (
                              <Box>
                                <VStack
                                  mt={{ base: '92px' }}
                                  w="100%"
                                  justifyContent="center"
                                  borderRadius={{
                                    base: '8px',
                                    lg: '40px',
                                    md: '24px',
                                  }}
                                  boxShadow="0px 3px 4px rgba(60, 77, 109, 0.25)"
                                  background="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%)"
                                  py={{ base: '1.5rem' }}
                                >
                                  <Avatar
                                    name={
                                      hackathonSlice?.clientHackInfo?.company
                                        ?.companyName
                                    }
                                    src={
                                      hackathonSlice?.clientHackInfo?.company
                                        ?.logo
                                    }
                                    size={{ base: 'md', md: 'lg', lg: 'xl' }}
                                    rounded={'none'}
                                    borderRadius={'unset'}
                                    mb={{ base: '20px' }}
                                  />

                                  <Text
                                    textAlign="center"
                                    color="brand.secondary"
                                    fontSize={{
                                      lg: '44px',
                                      base: '18px',
                                      md: '24px',
                                    }}
                                    fontWeight="700"
                                  >
                                    {
                                      hackathonSlice?.clientHackInfo
                                        ?.hackathonName
                                    }
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
                                      socialMediaLinks.map(
                                        (socialMediaLink) => (
                                          <Flex
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            pt="0.3rem"
                                          >
                                            <ExternalLink
                                              href={socialMediaLink.link}
                                            >
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
                                        ),
                                      )}
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
                                    </VStack>
                                  </GridItem>
                                  <GridItem
                                    p="16px"
                                    border="1px"
                                    borderColor={'brand.primary'}
                                    borderRadius="10px"
                                    bg="white"
                                  >
                                    <VStack
                                      display="flex"
                                      alignItems={'flex-start'}
                                    >
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
                                          .utc(
                                            hackathonSlice?.clientHackInfo
                                              ?.startDate,
                                          )
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
                                          .utc(
                                            hackathonSlice?.clientHackInfo
                                              ?.endDate,
                                          )
                                          .local()
                                          .format('MMMM Do, YYYY HH:mm')}
                                      </Text>
                                    </VStack>
                                  </GridItem>
                                </Grid>

                                {/* Tabs */}
                                <Tabs
                                  w="100%"
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
                                    <Tab
                                      _selected={{
                                        color: 'white',
                                        bg: 'brand.primary',
                                      }}
                                      fontSize={{ base: '12px', lg: '16px' }}
                                    >
                                      Participants
                                    </Tab>
                                    <Tab
                                      _selected={{
                                        color: 'white',
                                        bg: 'brand.primary',
                                      }}
                                      fontSize={{ base: '12px', lg: '16px' }}
                                    >
                                      Submissions
                                    </Tab>
                                  </TabList>
                                  <TabPanels
                                    border="1px"
                                    borderRadius="18px"
                                    py="1rem"
                                    bg="white"
                                  >
                                    {/*========================= Overview Panel =========================*/}
                                    <CustomTabPanel
                                      data={
                                        hackathonSlice?.clientHackInfo
                                          ?.description
                                      }
                                    />

                                    {/*========================= Submission Criteria Panel =========================*/}
                                    <CustomTabPanel
                                      data={
                                        hackathonSlice?.clientHackInfo
                                          ?.submissionCriteria ||
                                        'No Submission Criteria Available'
                                      }
                                    />

                                    {/*========================= Events Criteria =========================*/}
                                    <CustomTabPanel
                                      data={
                                        hackathonSlice?.clientHackInfo
                                          ?.events || 'No Events Available'
                                      }
                                    />

                                    <TabPanel>
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
                                                justifyContent={'space-between'}
                                                flexWrap={'wrap'}
                                              >
                                                <Stack
                                                  spacing="4"
                                                  cursor={'pointer'}
                                                >
                                                  <Card key={email} size={'sm'}>
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
                                    </TabPanel>
                                    <TabPanel>
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
                                                        display={'inline-block'}
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
                                                        display={'inline-block'}
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
                                                      justifyContent={'center'}
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
                                                            defaultValue={score}
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
                                                                bg={'gray.300'}
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
                                                              e.target.checked,
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
                                          [ Download as .xlsx <DownloadIcon /> ]
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
                                              Participants has to submit before
                                              you can payout (Contact us to
                                              resolve this issue)
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
                            {hackathonSlice?.clientHackInfo?.status ===
                              HackathonStatus.reviewing && (
                              <ConfirmPayment
                                {...{ isOpen, onOpen, onClose, id }}
                              />
                            )}

                            {/* Concordium wallet manager */}
                          </Stack>

                          <NewFooter />
                        </>
                      </BodyWrapper>
                    </>
                  )}
                </>
              </Suspense>
            </ConditionalRoute>
          </ConditionalRoute>
        </ConditionalRoute>
      </>
    </ConditionalRoute>
  );
}

export default HackathonDetail;
