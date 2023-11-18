/*==================== Import necessary components and libraries ====================*/
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Link,
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
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getHackathonDetailForAdmin,
  getHackathonSubmissionsDownloadForAdmin,
  publishAHackathon,
  resetErrMsg,
  resetPublished,
} from '../../../store/slices/hackathonSlice';
import {
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';
import moment from 'moment';
import PageLoader from '../../../reusable/components/PageLoader';
import { supportedTokens } from '../../../utils/tokens';
import CustomTab from '../../../reusable/components/CustomTab';
import { ExternalLink, InternalLink, proxyAddress } from '../../../utils/Link';
import FileCheckIcon from '../../../assets/icons/FileCheckIcon';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import { FormattingWrapper } from '../../../reusable/styled';
import NewFooter from '../../../reusable/components/NewFooter';
import { RiTwitterXFill } from 'react-icons/ri';
import { BsTelegram } from 'react-icons/bs';
import { AiOutlineLink } from 'react-icons/ai';

const HomeNavbar = React.lazy(
  () => import('../../../reusable/components/HomeNavbar'),
);

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

/*====================  Define AdminHackathonDetail function ====================*/
function AdminHackathonDetail() {
  /*==================== Define variables and states ====================*/
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const toast = useToast();
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const dispatch = useDispatch();

  const { id } = useParams();

  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Something went wrong',
          description: message,
          status: 'error',
          duration: 10000,
          isClosable: true,
          position: 'top-right',
          onCloseComplete() {
            dispatch(resetErrMsg());
          },
        }),
      ),
    );
  };

  const handleDowloadSubmission = (id: number | undefined) => {
    dispatch(getHackathonSubmissionsDownloadForAdmin(id));
  };

  const onPublishHackathon = useCallback((id: number | undefined) => {
    return dispatch(publishAHackathon(id));
  }, []);

  useEffect(() => {
    dispatch(getHackathonDetailForAdmin(id));
  }, []);

  useEffect(() => {
    if (hackathonSlice?.published) {
      toast({
        description: 'Hackathon is published',
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetPublished());
        },
      });
    }
  }, [hackathonSlice?.published]);

  useEffect(() => {
    const { errMsg } = hackathonSlice;
    if (hackathonSlice?.errMsg && errMsg.Id === 'PUBLISHING_HACKATHON_ERROR') {
      displayErrorToasts();
    }
  }, [hackathonSlice?.errMsg]);

  const timestamp: any = hackathonSlice?.adminHackInfo?.submissionDeadline;
  const isUtc = timestamp?.endsWith('Z');
  const utcDateTime = isUtc
    ? moment.utc(timestamp)
    : moment.utc(timestamp + 'Z');

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(
      `${proxyAddress}/hacks/${hackathonSlice?.adminHackInfo?.hackathonId}`,
    );
    setIsTooltipOpen(true);

    //close the tooltip after a short delay
    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 2000);
  };

  const copyParticipantWalletAddressToClipboard = (
    userWalletAddress: string,
  ) => {
    navigator.clipboard.writeText(userWalletAddress);
    // setIsTooltipOpen(true);

    //close the tooltip after a short delay
    setTimeout(() => {
      // setIsTooltipOpen(false);
    }, 2000);
  };

  const socialMediaLinks = [
    {
      socialMedia: 'twitter',
      link: `http://twitter.com/share?text=${hackathonSlice?.adminHackInfo?.hackathonName}&url=${proxyAddress}/hacks/${hackathonSlice?.adminHackInfo?.hackathonId}`,
    },
    {
      socialMedia: 'telegram',
      link: `https://t.me/share?url=${proxyAddress}/hacks/${hackathonSlice?.adminHackInfo?.hackathonId}&text=${hackathonSlice?.adminHackInfo?.hackathonName}`,
    },
    // {
    //   socialMedia: 'discord',
    //   link: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=0&redirect_uri=${encodeURIComponent(
    //     proxyAddress,
    //   )}/hacks/${hackathonSlice?.adminHackInfo?.hackathonId}`,
    // },
  ];
  const params = useParams();

  return (
    <ConditionalRoute
      redirectTo="/404"
      condition={(params?.id && true) || false}
    >
      <>
        <>
          <MetaTags
            title={`${hackathonSlice?.adminHackInfo?.hackathonName}`}
            description={`${hackathonSlice?.adminHackInfo?.description.slice(
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
                          <Avatar
                            name={
                              hackathonSlice?.adminHackInfo?.company
                                ?.companyName
                            }
                            src={hackathonSlice?.adminHackInfo?.company?.logo}
                            size={{ base: 'md', md: 'lg', lg: 'xl' }}
                            rounded={'none'}
                            borderRadius={'unset'}
                            mb={{ base: '20px' }}
                          />

                          <Text
                            textAlign="center"
                            color="brand.secondary"
                            fontSize={{ lg: '44px', base: '18px', md: '24px' }}
                            fontWeight="700"
                          >
                            {hackathonSlice?.adminHackInfo?.hackathonName}
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
                                  hackathonSlice?.adminHackInfo
                                    ?.totalRewardinUsd
                                }{' '}
                                {
                                  supportedTokens.find(
                                    (tk) =>
                                      tk.address ===
                                      hackathonSlice?.adminHackInfo
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
                                  .utc(hackathonSlice?.adminHackInfo?.startDate)
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
                                  .utc(hackathonSlice?.adminHackInfo?.endDate)
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
                            <CustomTab>Participants</CustomTab>
                            <CustomTab>Submissions</CustomTab>
                          </TabList>
                          <TabPanels
                            border="1px"
                            borderRadius="18px"
                            py="1rem"
                            bg="white"
                          >
                            {/*========================= Overview Panel =========================*/}
                            <TabPanel bg="white">
                              <Grid
                                w="full"
                                gridTemplateColumns={{
                                  base: 'repeat(2, 1fr)',
                                  lg: 'repeat(4, 1fr)',
                                }}
                                mb="1rem"
                              >
                                <GridItem>
                                  <InternalLink
                                    to={
                                      hackathonSlice?.adminHackInfo?.isOnchain
                                        ? `/admin/hacks/edit/${hackathonSlice?.adminHackInfo?.hackathonId}/${hackathonSlice?.adminHackInfo?.hackathonName}`
                                        : `/admin/hacks/edit-offchain/${hackathonSlice?.adminHackInfo?.hackathonId}/${hackathonSlice?.adminHackInfo?.hackathonName}`
                                    }
                                  >
                                    <Button
                                      borderRadius={'8px'}
                                      leftIcon={<FileCheckIcon />}
                                      bg="white"
                                      color="brand.primary"
                                      fontSize={{
                                        base: '14px',
                                        lg: '16px',
                                      }}
                                      fontWeight="700"
                                      _hover={{
                                        bg: 'brand.primary',
                                        color: 'white',
                                      }}
                                      borderWidth={'1px'}
                                      borderColor={'brand.primary'}
                                    >
                                      Edit Hackathon
                                    </Button>
                                  </InternalLink>
                                </GridItem>

                                {hackathonSlice?.adminHackInfo?.status !==
                                  HackathonStatus.published &&
                                  hackathonSlice?.adminHackInfo?.status !==
                                    HackathonStatus.reviewing &&
                                  hackathonSlice?.adminHackInfo?.status !==
                                    HackathonStatus.ended &&
                                  hackathonSlice?.adminHackInfo?.status !==
                                    HackathonStatus.rejected &&
                                  hackathonSlice?.adminHackInfo?.endDate && (
                                    <GridItem>
                                      <Button
                                        isLoading={hackathonSlice?.publishing}
                                        borderRadius={'8px'}
                                        bg="brand.primary"
                                        color="white"
                                        fontSize={{
                                          base: '14px',
                                          lg: '16px',
                                        }}
                                        fontWeight="700"
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.primary',
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'brand.primary'}
                                        onClick={() =>
                                          onPublishHackathon(
                                            hackathonSlice?.adminHackInfo
                                              ?.hackathonId,
                                          )
                                        }
                                      >
                                        Publish Hackathon
                                      </Button>
                                    </GridItem>
                                  )}

                                {/* <GridItem>
                                  <Button
                                    size={'md'}
                                    bg="brand.primary"
                                    color="white"
                                    _hover={{
                                      backgroundColor: 'white',
                                      color: 'brand.primary',
                                    }}
                                    leftIcon={<Icon as={EditIcon} />}
                                  >
                                    Unpublish
                                  </Button>
                                </GridItem>

                                <GridItem>
                                  <Button
                                    bg="brand.primary"
                                    color="white"
                                    _hover={{
                                      backgroundColor: 'white',
                                      color: 'brand.primary',
                                    }}
                                    leftIcon={<Icon as={EditIcon} />}
                                  >
                                    Delete
                                  </Button>
                                </GridItem> */}
                              </Grid>

                              <FormattingWrapper>
                                <Box
                                  borderColor={'brand.secondary'}
                                  color="black"
                                  p={'1rem'}
                                  // @ts-ignore
                                  dangerouslySetInnerHTML={{
                                    // @ts-ignore
                                    __html:
                                      hackathonSlice?.adminHackInfo?.description?.replace(
                                        /<a\b([^>]*)>(.*?)<\/a>/g,
                                        `<a $1 style='color: #0F5EFE;'>$2</a>`,
                                      ) || 'No Info provided',
                                  }}
                                />
                              </FormattingWrapper>
                            </TabPanel>

                            {/*========================= Submission Criteria Panel =========================*/}
                            <TabPanel bg="white">
                              <FormattingWrapper>
                                <Box
                                  borderColor={'brand.secondary'}
                                  color="black"
                                  p={'1rem'}
                                  // @ts-ignore
                                  dangerouslySetInnerHTML={{
                                    // @ts-ignore
                                    __html:
                                      hackathonSlice?.adminHackInfo?.submissionCriteria?.replace(
                                        /<a\b([^>]*)>(.*?)<\/a>/g,
                                        `<a $1 style='color: #0F5EFE;'>$2</a>`,
                                      ) || 'No Submission Criteria Available',
                                  }}
                                />
                              </FormattingWrapper>
                            </TabPanel>

                            {/*========================= Events Criteria =========================*/}
                            <TabPanel bg="white">
                              <FormattingWrapper>
                                <Box
                                  borderColor={'brand.secondary'}
                                  color="black"
                                  p={'1rem'}
                                  // @ts-ignore
                                  dangerouslySetInnerHTML={{
                                    // @ts-ignore
                                    __html:
                                      hackathonSlice?.adminHackInfo?.events?.replace(
                                        /<a\b([^>]*)>(.*?)<\/a>/g,
                                        `<a $1 style='color: #0F5EFE;'>$2</a>`,
                                      ) || 'No Events Available',
                                  }}
                                />
                              </FormattingWrapper>
                            </TabPanel>

                            <TabPanel>
                              <Flex
                                flexDirection={{
                                  base: 'column',
                                  lg: 'row',
                                }}
                                gap={'8px'}
                                w="full"
                                alignItems={'center'}
                                justifyContent={'center'}
                                mb={'24px'}
                              >
                                <Text
                                  fontWeight={'400'}
                                  fontSize={{
                                    base: '18px',
                                    lg: '24px',
                                  }}
                                  color="brand.lightsecondary"
                                >
                                  Showing results for
                                </Text>
                                <Text
                                  fontWeight={'700'}
                                  fontSize={{
                                    base: '18px',
                                    lg: '24px',
                                  }}
                                  color="brand.secondary"
                                >
                                  {hackathonSlice?.adminHackInfo &&
                                    hackathonSlice?.adminHackInfo.participants
                                      .length}{' '}
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
                                {hackathonSlice?.adminHackInfo?.participants.map(
                                  (
                                    {
                                      firstname,
                                      lastname,
                                      email,
                                      userWalletAddress,
                                    },
                                    index,
                                  ) => (
                                    <GridItem key={index} p="1rem" h={'auto'}>
                                      <Flex
                                        flexDirection={'row'}
                                        justifyContent={'space-between'}
                                        flexWrap={'wrap'}
                                      >
                                        <Stack spacing="4">
                                          <Card key={email} size={'sm'}>
                                            <CardHeader>
                                              <Heading size="md">
                                                {firstname} {lastname}
                                              </Heading>
                                            </CardHeader>
                                            <CardBody>
                                              {userWalletAddress && (
                                                <Flex
                                                  flexDirection={'row'}
                                                  gap={1}
                                                >
                                                  <Text
                                                    whiteSpace={'nowrap'}
                                                    textOverflow={'ellipsis'}
                                                    overflow={'hidden'}
                                                  >
                                                    {userWalletAddress.substring(
                                                      0,
                                                      5,
                                                    )}
                                                    ...
                                                    {userWalletAddress.substring(
                                                      userWalletAddress.length -
                                                        3,
                                                    )}
                                                  </Text>
                                                  <Tooltip
                                                    label="Wallet address copied!"
                                                    isOpen={isTooltipOpen}
                                                    placement="bottom"
                                                  >
                                                    <Box
                                                      h="24px"
                                                      w="24px"
                                                      display="flex"
                                                      p="4px"
                                                      justifyContent="center"
                                                      alignItems="center"
                                                      onClick={() =>
                                                        copyParticipantWalletAddressToClipboard(
                                                          userWalletAddress,
                                                        )
                                                      }
                                                      cursor={'pointer'}
                                                    >
                                                      <CopyIcon />
                                                    </Box>
                                                  </Tooltip>
                                                </Flex>
                                              )}
                                              <Text>{email}</Text>
                                            </CardBody>
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
                                    hackathonSlice?.adminHackInfo?.submissions
                                      .length
                                  }{' '}
                                  participants
                                </Text>
                              </Flex>
                              <Stack
                                minH={
                                  hackathonSlice?.adminHackInfo &&
                                  hackathonSlice?.adminHackInfo.submissions
                                    .length >= 8
                                    ? '300px'
                                    : ''
                                }
                                maxH={'500px'}
                                overflowY={'scroll'}
                              >
                                {hackathonSlice?.adminHackInfo?.submissions
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
                                    if (a.score === null && b.score === null) {
                                      return 0;
                                    }
                                    if (a.score === null) {
                                      return 1;
                                    }
                                    if (b.score === null) {
                                      return -1;
                                    }
                                    if (a.score === 0 && b.score === 0) {
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
                                        score,
                                        accepted,
                                      },
                                      index,
                                    ) => (
                                      <Box
                                        key={index}
                                        p={'11px'}
                                        w={'full'}
                                        borderWidth={'1px'}
                                        borderColor={'brand.lightsecondary'}
                                        borderRadius={'5px'}
                                        maxH={'200px'}
                                      >
                                        <Flex
                                          flexDirection={'row'}
                                          justifyContent={'space-between'}
                                        >
                                          <Flex flexDirection={'column'}>
                                            <Text
                                              fontWeight={'500'}
                                              fontSize={'24px'}
                                              color="brand.secondary"
                                              display={'inline'}
                                            >
                                              {user?.firstname} {user?.lastname}
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
                                                {moment(createdAt).format(
                                                  'DD/MM/YY',
                                                )}
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
                                                    result.startsWith('www.')
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
                                                      : 'https://' + result
                                                  }
                                                  isExternal
                                                >
                                                  {result.startsWith('www.')
                                                    ? result
                                                        .substring(0, 100)
                                                        .replace(
                                                          /^www\./i,
                                                          'https://',
                                                        )
                                                    : result.startsWith(
                                                        'http://',
                                                      )
                                                    ? result
                                                        .substring(0, 100)
                                                        .replace(
                                                          /^http:/i,
                                                          'https:',
                                                        )
                                                    : result.startsWith(
                                                        'https://',
                                                      )
                                                    ? result.substring(0, 100)
                                                    : 'https://' +
                                                      result.substring(0, 100)}
                                                  <ExternalLinkIcon mx="2px" />
                                                </Link>
                                              </Text>
                                            </Text>
                                          </Flex>
                                          <Flex
                                            flexDirection={'column'}
                                            gap={'8px'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                          >
                                            <Flex
                                              flexDirection={'row'}
                                              gap={'5px'}
                                              justifyContent={'center'}
                                              alignItems={'center'}
                                            >
                                              <Text
                                                fontWeight={'500'}
                                                fontSize={'14px'}
                                                color="brand.lightsecondary"
                                              >
                                                Score
                                              </Text>
                                              {hackathonSlice.adminHackInfo
                                                ?.equalDistribution === 'no' ? (
                                                <Text fontSize={'1rem'}>
                                                  {score || '0'}
                                                </Text>
                                              ) : (
                                                <Checkbox
                                                  isDisabled
                                                  size="sm"
                                                  borderColor={'#DD2121'}
                                                  colorScheme="green"
                                                  isChecked={accepted}
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
                                  hackathonSlice?.adminHackInfo?.submissions
                                    .length &&
                                  hackathonSlice?.adminHackInfo?.submissions
                                    .length > 0
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
                                      hackathonSlice?.adminHackInfo
                                        ?.hackathonId,
                                    )
                                  }
                                  cursor={'pointer'}
                                >
                                  [ Download as .xlsx <DownloadIcon /> ]
                                </Text>
                              </Flex>
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
                </>
              </BodyWrapper>
            </>
          )}
        </>
      </>
    </ConditionalRoute>
  );
}

export default AdminHackathonDetail;
