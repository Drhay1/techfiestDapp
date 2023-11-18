import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Table,
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
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import {
  HackathonStateProps,
  HackathonStatus,
} from '../../../store/interfaces/hackathon.interface';
import { PlusIcon } from '../../../assets/icons';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { HackathonStatusComponent } from '../../../reusable/components';
import { supportedTokens } from '../../../utils/tokens';
import { utcFormat } from '../User/UserMain';

export interface BasicStatsProps {
  title: string;
  titleIcon?: any;
  titleIconFunction?: any;
  record: number | undefined;
  icon: string;
  label: string;
}

function Main() {
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  // stats
  const participantsCount = hackathonSlice?.clientHackathons?.reduce(
    (totalCount, hackathon) => totalCount + hackathon.participants.length,
    0,
  );

  const publishedHackathonsCount = hackathonSlice?.clientHackathons?.reduce(
    (totalCount, hackathon) => {
      if (hackathon.status === HackathonStatus.published) {
        return totalCount + 1;
      } else {
        return totalCount;
      }
    },
    0,
  );

  const expiredHackathon = hackathonSlice?.clientHackathons?.reduce(
    (totalCount, hackathon) => {
      if (hackathon.status === HackathonStatus.ended) {
        return totalCount + 1;
      } else {
        return totalCount;
      }
    },
    0,
  );

  const basicStats: BasicStatsProps[] = [
    {
      title: 'All Participants',
      record: participantsCount,
      icon: '/images/cusers.png',
      label: 'Participants',
    },
    {
      title: 'Ongoing',
      record: publishedHackathonsCount,
      icon: '/images/ausers.png',
      label: 'Hackathons',
    },
    {
      title: 'Completed',
      record: expiredHackathon,
      icon: '/images/fusers.png',
      label: 'Hackathons',
    },
    // {
    //   title: 'Bounties Distributed',
    //   record: 10000,
    //   icon: '',
    // },
  ];

  return (
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
        <Box px={{ base: '1rem', lg: 'unset' }}>
          <Flex
            h={{ lg: '272px', base: '200px' }}
            borderRadius={{ base: '10px' }}
            p={{ lg: '25px', base: '1rem' }}
            flexDirection={'column'}
            justifyContent={'space-between'}
            mb="55.5px"
            bg={`url('/images/frame.svg')`}
            backgroundSize="cover"
            backgroundPosition="center"
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
                  mb={{ base: '1rem', lg: 'unset' }}
                >
                  {userSlice?.user?.firstname
                    ? `Hi, ${userSlice?.user.firstname}`
                    : `Welcome`}
                </Text>
              </Flex>
              <Text fontSize={{ lg: '48px', base: '18px' }} color="white">
                Organize your hackathons
              </Text>
            </Box>

            <Box>
              <HStack fontSize={{ lg: '14px' }}>
                {userSlice?.user?.company ? (
                  <InternalLink to="/create-hackathon">
                    <Button
                      bg="brand.primary"
                      color="white"
                      leftIcon={<PlusIcon />}
                      _hover={{
                        bg: 'white',
                        color: 'brand.primary',
                      }}
                    >
                      Create Hackathon
                    </Button>
                  </InternalLink>
                ) : (
                  <InternalLink to="/settings?creating=yes&msg=Update your company information&type=settings">
                    <Button
                      bg="brand.primary"
                      color="white"
                      leftIcon={<PlusIcon />}
                      _hover={{
                        bg: 'white',
                        color: 'brand.primary',
                      }}
                    >
                      Provide your company info to create hackathon
                    </Button>
                  </InternalLink>
                )}
              </HStack>
            </Box>
          </Flex>

          <Text color="brand.secondary" mb="1rem">
            Dashboard
          </Text>

          {hackathonSlice?.clientHackathons && (
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
                  bg="brand.secondary"
                  borderRadius={'0.5rem'}
                  boxShadow={'rgba(16, 24, 40, 0.03)'}
                  color="white"
                >
                  <Flex
                    justifyContent={'space-between'}
                    flexDirection={'column'}
                  >
                    <Box>
                      <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Text fontSize={{ lg: '24px' }}>{title}</Text>

                        <Image src={icon} />
                      </Flex>

                      <Text
                        fontSize={'48px'}
                        fontWeight={'700'}
                        textAlign={'center'}
                      >
                        {record}
                      </Text>
                    </Box>

                    <Text fontSize={'12px'} textAlign={'center'}>
                      {label}
                    </Text>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          )}

          <Box
            mt="2rem"
            boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
            mb={'100px'}
          >
            <Box py="16px" px={'24px'} bg="rgba(240, 249, 255, 1)" mb="1rem">
              <Flex justifyContent={'space-between'}>
                <Text fontSize={'14px'}>
                  My Hackathons
                  {hackathonSlice?.clientHackathons && (
                    <Text
                      bg="brand.primary"
                      fontSize={'12px'}
                      display={'inline-block'}
                      px="0.5rem"
                      mx={'0.5rem'}
                      borderRadius={'12px'}
                      color="white"
                    >
                      {hackathonSlice?.clientHackathons.length} hackathons
                      created
                    </Text>
                  )}
                </Text>
              </Flex>
            </Box>

            <TableContainer>
              <Table fontSize={'12px'} gap={'0.5rem'}>
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th isNumeric>Bounty</Th>
                    <Th>Submission Deadline</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hackathonSlice?.clientHackathons &&
                    hackathonSlice?.clientHackathons?.map(
                      (
                        {
                          hackathonName,
                          tokenAmounts,
                          totalRewardinUsd,
                          status,
                          hackathonId,
                          rewardTokenAddress,
                          submissionDeadline,
                          slug,
                        },
                        index,
                      ) => {
                        return (
                          <Tr
                            key={index}
                            _hover={{
                              bg: 'rgba(234, 236, 240, 1)',
                            }}
                          >
                            <Td>
                              <Text color="brand.primary">
                                <InternalLink
                                  to={`/cdetail/${hackathonId}/${slug}`}
                                >
                                  {hackathonName}
                                </InternalLink>
                              </Text>
                            </Td>
                            <Td isNumeric>
                              {tokenAmounts || totalRewardinUsd}{' '}
                              {
                                supportedTokens.find(
                                  (token) =>
                                    token.address === rewardTokenAddress,
                                )?.symbol
                              }
                            </Td>
                            <Td>
                              {utcFormat(submissionDeadline)
                                .local()
                                .format('MMMM Do, YYYY HH:mm')}
                            </Td>
                            <Td>
                              <br />
                              <HackathonStatusComponent status={status} />
                            </Td>
                          </Tr>
                        );
                      },
                    )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default Main;
