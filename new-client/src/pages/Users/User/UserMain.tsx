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
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';
import { InternalLink } from '../../../utils/Link';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { UserStateProps } from '../../../store/interfaces/user.interface';
import { BasicStatsProps } from '../Client/Main';
import {
  HackathonProps,
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';
import moment from 'moment';
import { supportedTokens } from '../../../utils/tokens';
import { ChevronRightIcon } from '@chakra-ui/icons';
import LazyLoad from 'react-lazyload';
import React from 'react';

const HackathonStatusComponent = React.lazy(
  () => import('../../../reusable/components/HackathonStatusComponent'),
);

export const utcFormat = (timestamp: any) => {
  const isUtc = timestamp?.endsWith('Z');
  const utcDateTime = isUtc
    ? moment.utc(timestamp)
    : moment.utc(timestamp + 'Z');
  return utcDateTime;
};

function UserMain() {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  // const myActiveHacks =
  //   userSlice?.stats?.hackathons &&
  //   userSlice?.stats?.hackathons.filter(
  //     (obj: any) => obj.status == HackathonStatus.published,
  //   );

  const myCompletedHacks =
    userSlice?.stats?.hackathons &&
    userSlice?.stats?.hackathons.filter(
      (obj: any) => obj.status === HackathonStatus.ended,
    );

  const basicStats: BasicStatsProps[] = [
    // {
    //   title: 'Rewards Earned',
    //   record: 199,
    //   icon: '/images/cusers.png',
    //   label: 'USDC',
    // },
    {
      title: 'Active',
      record:
        (userSlice?.stats?.hackathons && userSlice.stats.hackathons.length) ||
        '0',
      icon: '/images/new/paper.svg',
      label: 'Hackathons',
    },
    {
      title: 'Completed',
      record: (myCompletedHacks && myCompletedHacks.length) || '0',
      icon: '/images/new/swap.svg',
      label: 'Hackathons',
    },
  ];

  return (
    <Box px={{ base: '1rem', lg: 'unset' }} mt={{ base: '1rem', lg: '7rem' }}>
      <Grid
        w={{ base: 'full', lg: '730px' }}
        margin={{ base: 'none', md: 'auto' }}
      >
        <GridItem
          m={'1rem'}
          display={'flex'}
          flexDirection={'column'}
          gap={'1.5rem'}
        >
          <Breadcrumb
            mb={'1rem'}
            mt={'1.5rem'}
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            fontSize={'12px'}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Flex flexDirection={'column'} maxW={{ lg: '65%' }}>
            <Text
              display={'flex'}
              gap={'0.5rem'}
              color={'#3C4D6D'}
              fontSize={'1.5rem'}
              fontWeight={'700'}
            >
              <Image src="/images/new/hey.svg" alt="hey" />
              Welcome onboard
            </Text>
          </Flex>
          <Box>
            <Box borderRadius={'0.5rem'} backdropFilter={'blur(20px)'}>
              <Grid
                w="full"
                gridTemplateColumns={{
                  base: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                }}
                gap={{ base: '0.5rem', md: '1rem' }}
              >
                {basicStats.map(({ title, record, icon }, index) => (
                  <GridItem
                    key={index}
                    bg="white"
                    px={{ base: '1rem' }}
                    py={{ base: '1rem' }}
                    borderRadius={{ base: '1rem' }}
                  >
                    <HStack>
                      <Box w="48px" h="48px">
                        <Image src={icon} h="full" w="full" />
                      </Box>
                      <Flex flexDirection={'column'}>
                        <Text fontSize={'12px'}>{title}</Text>

                        <Text fontSize={'1.5rem'} fontWeight={'bold'}>
                          {record}
                        </Text>
                      </Flex>
                    </HStack>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Box>
          {userSlice?.stats?.hackathons &&
          userSlice?.stats?.hackathons
            .slice()
            .filter(
              (hackathon: any) =>
                hackathon.status === HackathonStatus.published ||
                hackathon.status === HackathonStatus.reviewing,
            ).length > 0 ? (
            <Box
              borderRadius={'0.5rem'}
              bg={'#FFFFFF'}
              boxShadow={' 0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
              backdropFilter={'blur(20px)'}
              px={'1rem'}
              py={'1.5rem'}
            >
              <Flex flexDirection={'column'} gap={'1.5rem'}>
                <Text
                  fontSize={{
                    lg: '1.25rem',
                    md: '1.5rem',
                    base: '1.25rem',
                  }}
                  fontWeight={'700'}
                >
                  My projects
                </Text>
                {userSlice?.stats.hackathons
                  .slice()
                  .filter(
                    (hackathon: any) =>
                      hackathon.status === HackathonStatus.published ||
                      hackathon.status === HackathonStatus.reviewing,
                  )
                  .map(
                    (
                      {
                        slug,
                        status,
                        hackathonId,
                        tokenAmounts,
                        hackathonName,
                        totalRewardinUsd,
                        rewardTokenAddress,
                        company: { companyName, logo },
                      }: HackathonProps,
                      index: any,
                    ) => (
                      <Box
                        py={'1.5rem'}
                        px={'1rem'}
                        backdropFilter={'blur(20px)'}
                        border={'1px solid rgba(60, 77, 109, 0.50)'}
                        borderRadius={'0.5rem'}
                        key={index}
                      >
                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          w={'full'}
                          mb={'1rem'}
                        >
                          <Grid
                            gridTemplateColumns={'15% 85%'}
                            minH={'100px'}
                            w={'full'}
                          >
                            <GridItem h={'full'}>
                              <Flex
                                justifyContent={'center'}
                                alignItems={'center'}
                                w={{ lg: '76px', md: '56px' }}
                                h={{ lg: '76px', md: '56px' }}
                                margin={'auto'}
                                padding={'8px'}
                                bg="rgba(60, 77, 109, 0.05)"
                              >
                                <Avatar
                                  src={logo}
                                  w="full"
                                  h="full"
                                  rounded={'none'}
                                  name={companyName}
                                  borderRadius={'none'}
                                />
                              </Flex>
                            </GridItem>
                            <GridItem>
                              {/* <Text
                                fontSize={{ lg: '0.75rem', base: '0.75rem' }}
                                fontWeight={'400'}
                                lineHeight={'140%'}
                                letterSpacing={'0.01rem'}
                              >
                                14 days to go
                              </Text> */}
                              <Text
                                // mt="1rem"
                                fontSize={{
                                  lg: '1.25rem',
                                  md: '1.25rem',
                                  base: '1rem',
                                }}
                                fontWeight={'700'}
                                lineHeight={'140%'}
                              >
                                <InternalLink
                                  to={`/hacks/${hackathonId}/${slug}`}
                                >
                                  {hackathonName}
                                </InternalLink>
                              </Text>
                              <Text
                                fontSize={{ lg: '0.75rem', base: '0.75rem' }}
                                fontWeight={'400'}
                                lineHeight={'140%'}
                                letterSpacing={'0.01rem'}
                              >
                                {companyName}
                              </Text>
                            </GridItem>
                          </Grid>

                          <Flex
                            flexDirection={'row'}
                            gap={'0.35rem'}
                            justifyContent={'center'}
                            alignItems={'center'}
                          >
                            <HackathonStatusComponent status={status} />
                          </Flex>
                        </Flex>

                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          w={'full'}
                        >
                          <Flex gap={'0.25rem'}>
                            <Text
                              fontSize={'0.75rem'}
                              fontWeight={'700'}
                              lineHeight={'140%'}
                              letterSpacing={'0.00113rem'}
                              display={'flex'}
                              alignItems={'flex-start'}
                            >
                              {
                                supportedTokens.find(
                                  (token) =>
                                    token.address === rewardTokenAddress,
                                )?.symbol
                              }
                            </Text>
                            <Text
                              fontSize={{
                                lg: '1.25rem',
                                md: '1.25rem',
                                base: '1rem',
                              }}
                              fontWeight={'700'}
                            >
                              {tokenAmounts || totalRewardinUsd}{' '}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                    ),
                  )}
              </Flex>
            </Box>
          ) : (
            <Flex p="2rem" justifyContent={'center'} alignItems={'center'}>
              <Text>You're currently not participating in any hackathon</Text>
            </Flex>
          )}

          <Box
            borderRadius={'0.5rem'}
            bg={'#FFFFFF'}
            boxShadow={' 0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
            backdropFilter={'blur(20px)'}
            px={'1rem'}
            py={'1.5rem'}
          >
            <Flex flexDirection={'column'} gap={'1.5rem'}>
              <Text
                fontSize={{
                  lg: '1.25rem',
                  md: '1.5rem',
                  base: '1.25rem',
                }}
                fontWeight={'700'}
              >
                All techFiestas'
              </Text>

              {hackathonSlice?.hackathons
                ?.slice(0, 5)
                .map(
                  (
                    {
                      slug,
                      status,
                      hackathonId,
                      tokenAmounts,
                      hackathonName,
                      totalRewardinUsd,
                      rewardTokenAddress,
                      company: { companyName, logo },
                    },
                    index,
                  ) => (
                    <Box
                      py={'1.5rem'}
                      px={'1rem'}
                      backdropFilter={'blur(20px)'}
                      border={'1px solid rgba(60, 77, 109, 0.50)'}
                      borderRadius={'0.5rem'}
                      key={index}
                    >
                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        w={'full'}
                        mb={'1rem'}
                      >
                        <Grid
                          gridTemplateColumns={'15% 85%'}
                          minH={'100px'}
                          w={'full'}
                        >
                          <GridItem h={'full'}>
                            <Flex
                              justifyContent={'center'}
                              alignItems={'center'}
                              w={{ lg: '76px', md: '56px' }}
                              h={{ lg: '76px', md: '56px' }}
                              margin={'auto'}
                              padding={'8px'}
                              bg="rgba(60, 77, 109, 0.05)"
                            >
                              <LazyLoad offset={400}>
                                <Avatar
                                  rounded={'none'}
                                  borderRadius={'none'}
                                  src={logo}
                                  w="full"
                                  h="full"
                                  name={companyName}
                                />
                              </LazyLoad>
                            </Flex>
                          </GridItem>
                          <GridItem>
                            {/* <Text
                              fontSize={{ lg: '0.75rem', base: '0.75rem' }}
                              fontWeight={'400'}
                              lineHeight={'140%'}
                              letterSpacing={'0.01rem'}
                            >
                              14 days to go
                            </Text> */}
                            <Text
                              // mt="1rem"
                              fontSize={{
                                lg: '1.25rem',
                                md: '1.25rem',
                                base: '1rem',
                              }}
                              fontWeight={'700'}
                              lineHeight={'140%'}
                            >
                              <InternalLink
                                to={`/hacks/${hackathonId}/${slug}`}
                              >
                                {hackathonName}
                              </InternalLink>
                            </Text>
                            <Text
                              fontSize={{ lg: '0.75rem', base: '0.75rem' }}
                              fontWeight={'400'}
                              lineHeight={'140%'}
                              letterSpacing={'0.01rem'}
                            >
                              {companyName}
                            </Text>
                          </GridItem>
                        </Grid>

                        <Flex
                          flexDirection={'row'}
                          gap={'0.35rem'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <HackathonStatusComponent status={status} />
                        </Flex>
                      </Flex>
                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        w={'full'}
                      >
                        <Flex gap={'0.25rem'}>
                          <Text
                            fontSize={'0.75rem'}
                            fontWeight={'700'}
                            lineHeight={'140%'}
                            letterSpacing={'0.00113rem'}
                            display={'flex'}
                            alignItems={'flex-start'}
                          >
                            {
                              supportedTokens.find(
                                (token) => token.address === rewardTokenAddress,
                              )?.symbol
                            }
                          </Text>
                          <Text
                            fontSize={{
                              lg: '1.25rem',
                              md: '1.25rem',
                              base: '1rem',
                            }}
                            fontWeight={'700'}
                          >
                            {tokenAmounts || totalRewardinUsd}{' '}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  ),
                )}

              <Flex justifyContent={'center'} alignItems={'center'}>
                <InternalLink to={`/hackathons`}>
                  <Button
                    bg="#0F5EFE"
                    color="#FFFFFF"
                    fontWeight={'500'}
                    fontSize={{ lg: '1rem', base: '0.75rem' }}
                    borderRadius={'0.5rem'}
                    px={{ lg: '1.25rem', base: '2rem' }}
                    py={'0.75rem'}
                    transition={'all 0.2s ease-in-out'}
                    _hover={{ filter: 'brightness(105%)' }}
                    borderWidth={'1px'}
                    borderColor={'#0F5EFE'}
                  >
                    View All
                  </Button>
                </InternalLink>
              </Flex>
            </Flex>
          </Box>
        </GridItem>

        <GridItem m={'1rem'} display={'none'}>
          <Box
            borderRadius={'0.5rem'}
            bg={'#FFFFFF'}
            boxShadow={' 0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
            backdropFilter={'blur(20px)'}
            p={'1rem'}
          >
            <Flex flexDirection={'column'} gap={'1.5rem'}>
              <Text
                fontSize={{
                  lg: '1.25rem',
                  md: '1.5rem',
                  base: '1.25rem',
                }}
                fontWeight={'700'}
              >
                Workshops
              </Text>
              <Text color={'brand.primary'}>No workshops for now</Text>
              {/* <Box
                py={'1.5rem'}
                px={'1rem'}
                bg={'#0F5EFE'}
                borderRadius={'0.6rem'}
                h={{ lg: '10rem' }}
              ></Box>
              <Flex justifyContent={'center'} alignItems={'center'}>
                <Button
                  bg="#0F5EFE"
                  color="#FFFFFF"
                  fontWeight={'500'}
                  fontSize={{ lg: '1rem', base: '0.75rem' }}
                  borderRadius={'0.5rem'}
                  px={{ lg: '1.25rem', base: '2rem' }}
                  py={'0.75rem'}
                  transition={'all 0.2s ease-in-out'}
                  _hover={{ filter: 'brightness(105%)' }}
                  borderWidth={'1px'}
                  borderColor={'#0F5EFE'}
                >
                  See workshops
                </Button>
              </Flex> */}
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default UserMain;
