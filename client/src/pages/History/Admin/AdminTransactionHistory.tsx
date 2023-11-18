import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { ChevronRightIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { ExternalLink, InternalLink } from '../../../utils/Link';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { AdminSideMenu } from '../../Users/Admin';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

interface AdminTransactionProps {
  time: Date;
  companyName: string;
  hackathonName: string;
  participant: string;
  amount: number;
  transactionAddress: string;
}

function AdminTransactionHistory() {
  const transactions: AdminTransactionProps[] = [
    {
      time: new Date(),
      companyName: 'Ekolance',
      hackathonName: 'chat dApp',
      participant: 'Samuel Anthony',
      amount: 1000,
      transactionAddress: '0x123456789',
    },
    {
      time: new Date(),
      companyName: 'Lana Steiner',
      hackathonName: 'chat dApp',
      participant: 'Rejoice Edo',
      amount: 400,
      transactionAddress: '0x123456789',
    },
    {
      time: new Date(),
      companyName: 'Human Protocol',
      hackathonName: 'chat dApp',
      participant: 'Francisca',
      amount: 300,
      transactionAddress: '0x123456789',
    },
    {
      time: new Date(),
      companyName: 'Demi Willkinson',
      hackathonName: 'food dApp',
      participant: 'chat dApp',
      amount: 5000,
      transactionAddress: '0x123456789',
    },
    {
      time: new Date(),
      companyName: 'Natali Craig',
      hackathonName: 'food dApp',
      participant: 'food dApp',
      amount: 5000,
      transactionAddress: '0x123456789',
    },
  ];

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/404"
        condition={
          userSlice.user && userSlice.user?.roles.includes(Role.Admin)
            ? true
            : false
        }
      >
        <>
          <BodyWrapper>
            <>
              <MetaTags
                title={'Transaction History'}
                description={
                  'Transactions is responsible for all of the history behind all of the transactions the clients has made'
                }
                pageUrl={window.location.href}
              />
              <HomeNavbar />
              <Box w={{ lg: '1199px' }} mx="auto" mb={'500px'}>
                <Grid
                  mt={{ lg: '3rem' }}
                  templateAreas={`"nav main"
                    "nav footer"`}
                  gridTemplateRows={'50px 1fr 30px'}
                  gridTemplateColumns={'200px 1fr'}
                  gap="10"
                  color="blackAlpha.700"
                  fontWeight="bold"
                >
                  <GridItem pl="2" bg="white" area={'nav'} position={'sticky'}>
                    <AdminSideMenu />
                  </GridItem>
                  <GridItem pl="2" bg="white" area={'main'}>
                    <Breadcrumb
                      mb={{ lg: '1rem' }}
                      spacing="8px"
                      separator={<ChevronRightIcon color="gray.500" />}
                      fontSize={'12px'}
                    >
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={
                            userSlice?.user?.roles.includes(Role.Admin)
                              ? '/adashboard'
                              : userSlice?.user?.roles.includes(Role.Client)
                              ? '/cdashboard'
                              : '/dashboard'
                          }
                        >
                          Dashboard
                        </BreadcrumbLink>
                      </BreadcrumbItem>

                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href="#"
                          isCurrentPage
                          color="brand.primary"
                        >
                          Transactions
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Breadcrumb>
                    <Box
                      color="brand.secondary"
                      bg="rgba(240, 249, 255, 1)"
                      px={{ lg: '24px' }}
                      py={{ lg: '24px' }}
                      borderRadius={{ lg: '10px' }}
                    >
                      <Text fontSize={{ lg: '48px' }} fontWeight={'500'}>
                        Transaction History
                      </Text>
                      <Text
                        fontSize={'16px'}
                        lineHeight={'24px'}
                        my={'20px'}
                        fontWeight={'400'}
                        w={'50%'}
                      >
                        Transactions is responsible for all of the history
                        behind all of the transactions the clients has made
                      </Text>
                    </Box>

                    <Box
                      mt="2rem"
                      boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
                      mb={'100px'}
                    >
                      <Box
                        py="16px"
                        px={'24px'}
                        bg="rgba(240, 249, 255, 1)"
                        mb="1rem"
                      >
                        <Flex justifyContent={'space-between'}>
                          <Flex align={'center'}>
                            <Text fontSize={'14px'}>
                              All Transactions
                              <Text
                                bg="brand.primary"
                                fontSize={'12px'}
                                display={'inline-block'}
                                px="0.5rem"
                                mx={'0.5rem'}
                                borderRadius={'12px'}
                                color="white"
                              >
                                10 transactions
                              </Text>
                            </Text>
                          </Flex>
                          <Flex display={'flex'} flexDirection={'row'} gap={4}>
                            <Button
                              px={4}
                              // py={2}
                              transition="all 0.2s"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="brand.primary"
                              color="brand.primary"
                              bg="white"
                              leftIcon={<DownloadIcon />}
                              _active={{ bg: 'white' }}
                              _hover={{ bg: 'gray.400' }}
                              _focus={{ boxShadow: 'outline' }}
                            >
                              Download
                            </Button>
                            <Menu>
                              <MenuButton
                                px={4}
                                // py={2}
                                transition="all 0.2s"
                                borderRadius="md"
                                borderWidth="1px"
                                bg="white"
                                borderColor="brand.primary"
                                color="brand.primary"
                                _active={{ bg: 'white' }}
                                _hover={{ bg: 'gray.400' }}
                                _expanded={{ bg: 'blue.400', color: 'white' }}
                                _focus={{ boxShadow: 'outline' }}
                              >
                                Company
                                <TriangleDownIcon ml={'0.5rem'} />
                              </MenuButton>
                              <MenuList>
                                <MenuItem>Upcoming</MenuItem>
                                <MenuItem>Ongoing</MenuItem>
                                <MenuItem>Ended</MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </Flex>
                      </Box>

                      <TableContainer>
                        <Table fontSize={'12px'} gap={'0.5rem'}>
                          <Thead>
                            <Tr>
                              <Th>Time</Th>
                              <Th>Company Name</Th>
                              <Th>Hackathon Name</Th>
                              <Th>Participant</Th>
                              <Th isNumeric>Amount(USDC)</Th>
                              <Th>Address</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {transactions.map(
                              (
                                {
                                  time,
                                  companyName,
                                  hackathonName,
                                  participant,
                                  amount,
                                  transactionAddress,
                                },
                                index,
                              ) => {
                                const mTime =
                                  moment(time).format('YYYY-MM-DD HH:mm');
                                return (
                                  <Tr
                                    key={index}
                                    _hover={{
                                      bg: 'rgba(234, 236, 240, 1)',
                                    }}
                                  >
                                    <Td>{mTime}</Td>
                                    <Td>{companyName}</Td>
                                    <Td>
                                      <Text color="brand.primary">
                                        <InternalLink to="/adetail">
                                          {hackathonName}
                                        </InternalLink>
                                      </Text>
                                    </Td>
                                    <Td>{participant}</Td>
                                    <Td isNumeric>{amount}</Td>
                                    <Td>
                                      <Text color="brand.primary">
                                        <ExternalLink href="https://etherscan.io">
                                          {transactionAddress}
                                        </ExternalLink>
                                      </Text>
                                    </Td>
                                  </Tr>
                                );
                              },
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminTransactionHistory;
