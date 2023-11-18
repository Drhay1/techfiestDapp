import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Link,
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
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { supportedTokens } from '../../../utils/tokens';
import { utcFormat } from '../User/UserMain';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';

const HackathonStatusComponent = React.lazy(
  () => import('../../../reusable/components/HackathonStatusComponent'),
);

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
      icon: '/images/new/graph.svg',
      label: 'Participants',
    },
    {
      title: 'Ongoing',
      record: publishedHackathonsCount,
      icon: '/images/new/graph.svg',
      label: 'Hackathons',
    },
    {
      title: 'Completed',
      record: expiredHackathon,
      icon: '/images/new/graph.svg',
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
        <GridItem
          mt={{ base: '1rem', lg: '2rem' }}
          paddingTop={'80px'}
          display={'flex'}
          flexDirection={'column'}
          gap={'1.5rem'}
        >
          {' '}
          <Flex flexDirection={'column'} maxW={{ lg: '65%' }}>
            <Text
              display={'flex'}
              gap={'0.5rem'}
              color={'#3C4D6D'}
              fontSize={'1.5rem'}
              fontWeight={'700'}
            >
              <Image src="/images/new/hey.svg" alt="hey" />
              Welcome
            </Text>
            <Text fontSize={'1rem'} fontWeight={'400'} color={'#3C4D6DCC'}>
              Organize techFiestas' here and grow your developer community
            </Text>
          </Flex>
          <Box>
            <Grid gap={{ base: '1rem', lg: '2rem' }}>
              <GridItem>
                {/* //TODO: change to swipeable */}
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
                    <GridItem
                      bg={{ lg: 'white' }}
                      borderRadius={{ base: '1rem' }}
                    >
                      <Flex
                        h="full"
                        w="full"
                        alignItems={'center'}
                        justifyContent={{ lg: 'center' }}
                      >
                        <Button
                          as={Link}
                          href="/create-hackathon"
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
                          leftIcon={<AddIcon />}
                        >
                          Create techFiesta
                        </Button>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Box>
              </GridItem>
            </Grid>
          </Box>
          <Box
            borderRadius={'0.5rem'}
            bg={'#FFFFFF'}
            backdropFilter={'blur(20px)'}
            boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
            mb={'100px'}
          >
            <Box py="16px" px={'24px'} bg="#3C4D6D0D" mb="1rem">
              <Flex justifyContent={'space-between'}>
                <Flex align={'center'}>
                  <Text fontSize={'1.25rem'} fontWeight={'700'}>
                    My techFiestas
                  </Text>

                  {hackathonSlice?.clientHackathons && (
                    <Text
                      bg="#3C4D6D0D"
                      fontSize={'0.75rem'}
                      fontWeight={'500'}
                      display={'inline-flex'}
                      px="0.5rem"
                      mx={'0.5rem'}
                      borderRadius={'12px'}
                      color="#0F5EFE"
                    >
                      {hackathonSlice?.clientHackathons.length}
                    </Text>
                  )}
                </Flex>
                {/* <Menu>
                  <MenuButton
                    px={'1.25rem'}
                    transition="all 0.2s"
                    borderRadius="0.5rem"
                    borderWidth="1px"
                    bg="rgba(60, 77, 109, 0.05)"
                    borderColor="#3C4D6D"
                    boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
                    backdropFilter={'blur(20px)'}
                    _active={{ bg: '#EFF4FE' }}
                    _hover={{ bg: 'gray.400' }}
                    _expanded={{ bg: '#EFF4FE', color: '#3C4D6D' }}
                    _focus={{ boxShadow: 'outline' }}
                  >
                    <Image src="/images/new/filterIcon.svg" alt="filterIcon" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Upcoming</MenuItem>
                    <MenuItem>Ongoing</MenuItem>
                    <MenuItem>Ended</MenuItem>
                  </MenuList>
                </Menu> */}
              </Flex>
            </Box>
            <TableContainer>
              <Flex
                w="full"
                p="1rem"
                display={
                  (hackathonSlice?.clientHackathons?.length ?? 0) < 1
                    ? 'block'
                    : 'none'
                }
              >
                <Text textAlign={'center'}>You don't have any Fiesta.</Text>
              </Flex>

              <Table
                fontSize={'12px'}
                gap={'0.5rem'}
                display={
                  (hackathonSlice?.clientHackathons?.length ?? 0) < 1
                    ? 'none'
                    : 'table'
                }
              >
                <Thead bg={'#3C4D6D0D'}>
                  <Tr>
                    <Th>Name</Th>
                    <Th isNumeric>Bounty</Th>
                    <Th>Submission Deadline</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hackathonSlice?.clientHackathons ? (
                    hackathonSlice?.clientHackathons.map(
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
                        // const mDeadline = moment(endDate).format('YYYY-MM-DD');
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
                    )
                  ) : (
                    <Text>You don't have any Fiesta</Text>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </GridItem>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default Main;
