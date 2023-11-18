import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { InternalLink } from '../../../utils/Link';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { UserStateProps } from '../../../store/interfaces/user.interface';
import { BasicStatsProps } from '../Client/Main';
import ZapIcon from '../../../assets/icons/ZapIcon';
import {
  HackathonProps,
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';
import moment from 'moment';
import { HackathonStatusComponent } from '../../../reusable/components';
import { supportedTokens } from '../../../utils/tokens';

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

  const myActiveHacks =
    userSlice?.stats?.hackathons &&
    userSlice?.stats?.hackathons.filter(
      (obj: any) => obj.status == HackathonStatus.published,
    );

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
      title: 'Ongoing',
      record:
        (userSlice?.stats?.hackathons && userSlice.stats.hackathons.length) ||
        '0',
      icon: '/images/ausers.png',
      label: 'Hackathons',
    },
    {
      title: 'Completed',
      record: (myCompletedHacks && myCompletedHacks.length) || '0',
      icon: '/images/fusers.png',
      label: 'Hackathons',
    },
  ];

  return (
    <Box px={{ base: '1rem', lg: 'unset' }}>
      <Flex
        minH={{ lg: '272px', base: '200px' }}
        borderRadius={{ base: '10px' }}
        p={{ lg: '25px', base: '1rem' }}
        flexDirection={'row'}
        justifyContent={'space-between'}
        mb="55.5px"
        bg={`url('/images/uframe.svg')`}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        <Grid gridTemplateColumns={{ lg: '70% 30%' }} h="full" w="full">
          <GridItem>
            <Flex
              flexDirection={'column'}
              h="full"
              justifyContent={'space-between'}
            >
              <Box>
                <Flex alignItems={'center'}>
                  <Box w="32px" h="32px">
                    <Image src="/images/hi.png" />
                  </Box>

                  <Text
                    fontWeight="700"
                    fontSize={{ base: '1.2rem', md: '24px' }}
                    ml={{ lg: '10px' }}
                    color="white"
                  >
                    {(userSlice?.user &&
                      userSlice?.user.firstname &&
                      `Hi, ${userSlice?.user.firstname}`) ||
                      'Hello'}
                  </Text>
                </Flex>
                <Text fontSize={{ lg: '48px', base: '24px' }} color="white">
                  Welcome Onboard
                </Text>
                <Text
                  fontSize={{ lg: '14px', base: '12px' }}
                  fontWeight={{ base: 'normal', lg: '700' }}
                  color="white"
                >
                  Explore, collaborate and demonstrate your skills by
                  participating in exciting hackathons
                </Text>
              </Box>

              <Box>
                <HStack
                  mt={{ base: '1rem', lg: 'unset' }}
                  fontSize={{ base: '12px', lg: '14px' }}
                >
                  <InternalLink to="/hackathons">
                    <Button
                      bg="brand.primary"
                      color="white"
                      rightIcon={<ZapIcon />}
                      _hover={{
                        bg: 'white',
                        color: 'brand.primary',
                      }}
                    >
                      Join Hackathons
                    </Button>
                  </InternalLink>
                </HStack>
              </Box>
            </Flex>
          </GridItem>
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <Box bottom={0} right={0}>
              <Image
                h={'full'}
                w={'full'}
                src="/images/userDashboardAvatar.png"
                alt="userDashboardAvatar"
              />
            </Box>
          </GridItem>
        </Grid>
      </Flex>

      <Text color="brand.secondary" mb="1rem" display={'none'}>
        My data
      </Text>

      <Grid
        gridTemplateColumns={{
          lg: 'repeat(3, 1fr)',
          base: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap="4"
        fontSize={'14px'}
      >
        {basicStats.map(({ title, record, icon, label }, index) => (
          <GridItem
            key={index}
            p="1rem"
            bg="var(--bg-linear-2, linear-gradient(135deg, #F0F9FF 0%, #FFF 100%))"
            borderRadius={'0.5rem'}
            boxShadow={
              '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;'
            }
          >
            <Flex justifyContent={'space-between'} flexDirection={'column'}>
              <Box>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <Text fontSize={{ lg: '1rem' }} color="brand.secondary">
                    {title}
                  </Text>

                  <Image src={icon} />
                </Flex>

                <Text
                  fontSize={'48px'}
                  fontWeight={'700'}
                  textAlign={'center'}
                  color="brand.secondary"
                >
                  {record}
                </Text>
              </Box>

              <Text
                fontSize={'12px'}
                textAlign={'center'}
                color="brand.secondary"
              >
                {label}
              </Text>
            </Flex>
          </GridItem>
        ))}
      </Grid>

      <Box mt="2rem" boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px">
        <Box py="0.5" px={'24px'} bg="rgba(240, 249, 255, 1)" mb="1rem">
          <Flex justifyContent={'space-between'}>
            <Text fontSize={'14px'}>
              Your Active Hackathons
              <Text
                bg="brand.primary"
                fontSize={'12px'}
                display={'inline-block'}
                px="0.5rem"
                mx={'0.5rem'}
                borderRadius={'12px'}
                color="white"
              >
                {(myActiveHacks && `${myActiveHacks.length}`) ||
                  `You currently don't have any participation`}
              </Text>
            </Text>
          </Flex>
        </Box>

        {userSlice?.stats?.hackathons &&
        userSlice?.stats?.hackathons
          .slice()
          .filter(
            (hackathon: any) => hackathon.status === HackathonStatus.published,
          ).length > 0 ? (
          <TableContainer>
            <Table fontSize={'12px'} gap={'0.5rem'}>
              <Thead>
                <Tr>
                  <Th>Company Name</Th>
                  <Th>Title</Th>
                  <Th isNumeric>Bounty</Th>
                  <Th>Submission Deadline</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userSlice?.stats.hackathons
                  .slice()
                  .filter(
                    (hackathon: any) =>
                      hackathon.status === HackathonStatus.published,
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
                        submissionDeadline,
                        company: { companyName },
                      }: HackathonProps,
                      index: any,
                    ) => (
                      <Tr
                        key={index}
                        _hover={{
                          bg: 'rgba(234, 236, 240, 1)',
                        }}
                      >
                        <Td>{companyName}</Td>
                        <Td>
                          <Text color="brand.primary">
                            <InternalLink to={`/hacks/${hackathonId}/${slug}`}>
                              {hackathonName}
                            </InternalLink>
                          </Text>
                        </Td>
                        <Td isNumeric>
                          {tokenAmounts || totalRewardinUsd}{' '}
                          {
                            supportedTokens.find(
                              (token) => token.address === rewardTokenAddress,
                            )?.symbol
                          }
                        </Td>
                        <Td>
                          {moment(submissionDeadline)
                            .local()
                            .format('MMMM Do, YYYY HH:mm')}
                        </Td>
                        <Td>
                          <HackathonStatusComponent status={status} />
                        </Td>
                      </Tr>
                    ),
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Flex p="2rem" justifyContent={'center'} alignItems={'center'}>
            <Text>You're currently not participating in any hackathon</Text>
          </Flex>
        )}
      </Box>

      <Box mt="2rem" boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px" mb={'100px'}>
        <Box py="0.5" px={'24px'} bg="rgba(240, 249, 255, 1)" mb="1rem">
          <Flex justifyContent={'space-between'}>
            <Text fontSize={'14px'}>All Hackathons</Text>
          </Flex>
        </Box>

        {hackathonSlice?.hackathons && (
          <TableContainer>
            <Table fontSize={'12px'} gap={'0.5rem'}>
              {hackathonSlice?.hackathons.length > 0 && (
                <TableCaption>
                  <Button
                    size={'sm'}
                    bg="brand.primary"
                    color="white"
                    fontSize={'12px'}
                    _hover={{
                      bg: 'white',
                      color: 'brand.primary',
                      borderWidth: '1px',
                      borderColor: 'brand.primary',
                    }}
                  >
                    <a href="/hackathons">View More</a>
                  </Button>
                </TableCaption>
              )}

              <Thead>
                <Tr>
                  <Th>Company Name</Th>
                  <Th>Title</Th>
                  <Th isNumeric>Bounty</Th>
                  <Th>Submission Deadline</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {hackathonSlice?.hackathons
                  .slice(0, 5)
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
                        submissionDeadline,
                        company: { companyName },
                      },
                      index,
                    ) => (
                      <Tr
                        key={index}
                        _hover={{
                          bg: 'rgba(234, 236, 240, 1)',
                        }}
                      >
                        <Td>{companyName}</Td>
                        <Td>
                          <Text color="brand.primary">
                            <InternalLink to={`/hacks/${hackathonId}/${slug}`}>
                              {hackathonName}
                            </InternalLink>
                          </Text>
                        </Td>
                        <Td isNumeric>
                          {tokenAmounts || totalRewardinUsd}{' '}
                          {
                            supportedTokens.find(
                              (token) => token.address === rewardTokenAddress,
                            )?.symbol
                          }
                        </Td>
                        <Td>
                          {moment(submissionDeadline)
                            .local()
                            .format('MMMM Do, YYYY HH:mm')}
                        </Td>
                        <Td>
                          <HackathonStatusComponent status={status} />
                        </Td>
                      </Tr>
                    ),
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

export default UserMain;
