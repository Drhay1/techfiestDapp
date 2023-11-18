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
  Heading,
  Image,
  Link,
  Spinner,
  Stack,
  TabList,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
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
import {
  HackathonStatusComponent,
  HomeNavbar,
  MetaTags,
} from '../../../reusable/components';
import PageLoader from '../../../reusable/components/PageLoader';
import { supportedTokens } from '../../../utils/tokens';
import CustomTab from '../../../reusable/components/CustomTab';
import CustomTabPanel from '../../../reusable/components/CustomTabPanel';
import { InternalLink, proxyAddress } from '../../../utils/Link';
import FileCheckIcon from '../../../assets/icons/FileCheckIcon';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import { FormattingWrapper } from '../../../reusable/styled';
import NewFooter from '../../../reusable/components/NewFooter';
import { SideMenu } from '../Client';

/*====================  Define AdminHackathonDetail function ====================*/
function AdminHackathonDetail() {
  /*==================== Define variables and states ====================*/
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const toast = useToast();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
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

  return (
    <ConditionalRoute redirectTo="/404" condition={(id && true) || false}>
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
            <BodyWrapper>
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
                              mb={'24px'}
                            >
                              <Avatar
                                name={
                                  hackathonSlice?.adminHackInfo?.company
                                    ?.companyName
                                }
                                ignoreFallback={true}
                                src={
                                  hackathonSlice?.adminHackInfo?.company?.logo
                                }
                                size={{ base: 'xl', lg: 'lg' }}
                                borderRadius={'none'}
                                rounded={'none'}
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
                                py="1rem"
                                px="24px"
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
                                                hackathonSlice?.adminHackInfo
                                                  ?.hackathonName
                                              }
                                            </Text>
                                            <Box>
                                              <HackathonStatusComponent
                                                status={
                                                  hackathonSlice?.adminHackInfo
                                                    ?.status
                                                }
                                              />
                                            </Box>
                                          </Flex>
                                          {/* <Text
                                        fontSize={'16px'}
                                        lineHeight={'24px'}
                                        fontWeight={'400'}
                                        color="brand.lightsecondary"
                                      >
                                        Code, Innovate, Build amazing blockchain
                                        applications
                                      </Text> */}
                                        </Flex>
                                        <Flex
                                          display={'none'}
                                          flexDirection={'row'}
                                          gap={'10px'}
                                          mb={'10px'}
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
                                                <InternalLink
                                                  to={socialMediaLink.link}
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
                                                </InternalLink>
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

                                    <GridItem>
                                      <Flex
                                        gap={'8px'}
                                        flexDirection={'column'}
                                        alignItems={{
                                          base: 'center',
                                          lg: 'flex-end',
                                        }}
                                      >
                                        <>
                                          {!hackathonSlice?.adminHackInfo
                                            ?.endDate && (
                                            <InternalLink
                                              to={
                                                hackathonSlice?.adminHackInfo
                                                  ?.isOnchain
                                                  ? `/admin/hacks/edit/${hackathonSlice?.adminHackInfo?.hackathonId}`
                                                  : `/admin/hacks/edit-offchain/${hackathonSlice?.adminHackInfo?.hackathonId}`
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
                                          )}
                                        </>
                                        <>
                                          {hackathonSlice?.adminHackInfo
                                            ?.status !==
                                            HackathonStatus.published &&
                                            hackathonSlice?.adminHackInfo
                                              ?.status !==
                                              HackathonStatus.reviewing &&
                                            hackathonSlice?.adminHackInfo
                                              ?.status !==
                                              HackathonStatus.ended &&
                                            hackathonSlice?.adminHackInfo
                                              ?.status !==
                                              HackathonStatus.rejected &&
                                            hackathonSlice?.adminHackInfo
                                              ?.endDate && (
                                              <Button
                                                isLoading={
                                                  hackathonSlice?.publishing
                                                }
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
                                                    hackathonSlice
                                                      ?.adminHackInfo
                                                      ?.hackathonId,
                                                  )
                                                }
                                              >
                                                Publish Hackathon
                                              </Button>
                                            )}
                                        </>
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
                                        fontSize={'1rem'}
                                        lineHeight={'24px'}
                                        fontWeight={'400'}
                                        color="brand.lightsecondary"
                                      >
                                        Bounty
                                      </Text>
                                      <Text
                                        fontWeight={'700'}
                                        color="brand.secondary"
                                        fontSize={'14px'}
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
                                    </Flex>
                                  </Box>
                                  {hackathonSlice?.adminHackInfo?.startDate && (
                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
                                        px={'24px'}
                                        flexDirection={'column'}
                                        gap={'8px'}
                                        fontSize={'1rem'}
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
                                              hackathonSlice?.adminHackInfo
                                                ?.startDate,
                                            )
                                            .local()
                                            .format('MMMM Do, YYYY HH:mm')}
                                        </Text>
                                      </Flex>
                                    </Box>
                                  )}{' '}
                                  <Box
                                    borderLeftWidth={'2px'}
                                    borderColor={'brand.secondary'}
                                  >
                                    <Flex
                                      px={'24px'}
                                      flexDirection={'column'}
                                      gap={'8px'}
                                      fontSize={'1rem'}
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
                                        fontSize={'1rem'}
                                      >
                                        {utcDateTime
                                          .local()
                                          .format('MMMM Do, YYYY HH:mm')}
                                      </Text>
                                    </Flex>
                                  </Box>
                                  {hackathonSlice?.adminHackInfo?.endDate && (
                                    <Box
                                      borderLeftWidth={'2px'}
                                      borderColor={'brand.secondary'}
                                    >
                                      <Flex
                                        px={'24px'}
                                        flexDirection={'column'}
                                        gap={'8px'}
                                        fontSize={'14px'}
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
                                          fontSize={'1rem'}
                                        >
                                          {moment
                                            .utc(
                                              hackathonSlice?.adminHackInfo
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
                                      {socialMediaLinks &&
                                        socialMediaLinks.map(
                                          (socialMediaLink) => (
                                            <InternalLink
                                              to={socialMediaLink.link}
                                            >
                                              <Box
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
                                            </InternalLink>
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
                                                hackathonSlice?.adminHackInfo?.description?.replace(
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
                                                hackathonSlice?.adminHackInfo?.submissionCriteria?.replace(
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
                                                hackathonSlice?.adminHackInfo?.events?.replace(
                                                  /<a\b([^>]*)>(.*?)<\/a>/g,
                                                  `<a $1 style='color: #0BA5EC;'>$2</a>`,
                                                ),
                                            }}
                                          />
                                        </FormattingWrapper>
                                      </CustomTabPanel>
                                      <CustomTabPanel>
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
                                              hackathonSlice?.adminHackInfo
                                                .participants.length}{' '}
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
                                                  <Stack spacing="4">
                                                    <Card
                                                      key={email}
                                                      size={'sm'}
                                                    >
                                                      <CardHeader>
                                                        <Heading size="md">
                                                          {firstname} {lastname}
                                                        </Heading>
                                                      </CardHeader>
                                                      <CardBody>
                                                        {userWalletAddress && (
                                                          <Flex
                                                            flexDirection={
                                                              'row'
                                                            }
                                                            gap={1}
                                                          >
                                                            <Text
                                                              whiteSpace={
                                                                'nowrap'
                                                              }
                                                              textOverflow={
                                                                'ellipsis'
                                                              }
                                                              overflow={
                                                                'hidden'
                                                              }
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
                                                              isOpen={
                                                                isTooltipOpen
                                                              }
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
                                                                cursor={
                                                                  'pointer'
                                                                }
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
                                              hackathonSlice?.adminHackInfo
                                                ?.submissions.length
                                            }{' '}
                                            participants
                                          </Text>
                                        </Flex>
                                        <Stack
                                          minH={
                                            hackathonSlice?.adminHackInfo &&
                                            hackathonSlice?.adminHackInfo
                                              .submissions.length >= 8
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
                                                        {user?.firstname}{' '}
                                                        {user?.lastname}
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
                                                        justifyContent={
                                                          'center'
                                                        }
                                                        alignItems={'center'}
                                                      >
                                                        <Text
                                                          fontWeight={'500'}
                                                          fontSize={'14px'}
                                                          color="brand.lightsecondary"
                                                        >
                                                          Score
                                                        </Text>
                                                        {hackathonSlice
                                                          .adminHackInfo
                                                          ?.equalDistribution ===
                                                        'no' ? (
                                                          <Text
                                                            fontSize={'1rem'}
                                                          >
                                                            {score || '0'}
                                                          </Text>
                                                        ) : (
                                                          <Checkbox
                                                            isDisabled
                                                            size="sm"
                                                            borderColor={
                                                              '#DD2121'
                                                            }
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
                                            hackathonSlice?.adminHackInfo
                                              ?.submissions.length &&
                                            hackathonSlice?.adminHackInfo
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
                                                hackathonSlice?.adminHackInfo
                                                  ?.hackathonId,
                                              )
                                            }
                                            cursor={'pointer'}
                                          >
                                            [ Download as .xlsx <DownloadIcon />{' '}
                                            ]
                                          </Text>
                                        </Flex>
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
                  </>
                )}
              </>
            </BodyWrapper>
            <NewFooter />
          </>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminHackathonDetail;
