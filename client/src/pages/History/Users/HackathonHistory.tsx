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
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import PdfIcon from '../../../assets/icons/PdfIcon';
import { ChevronRightIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { ExternalLink, InternalLink } from '../../../utils/Link';
import { SideMenu } from '../../Users/Client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

interface HackathonHistoryProps {
  time: Date;
  hackathonName: string;
  amount: number;
  transactionAddress: string;
}

function HackathonHistory() {
  const transactions: HackathonHistoryProps[] = [
    {
      time: new Date(),
      hackathonName: 'Hackathon A',
      amount: 100,
      transactionAddress: '0x123456789',
    },
    {
      time: new Date(),
      hackathonName: 'Hackathon B',
      amount: 200,
      transactionAddress: '0x987654321',
    },
    {
      time: new Date(),
      hackathonName: 'Hackathon C',
      amount: 150,
      transactionAddress: '0xabcdef123',
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
          userSlice.user && userSlice.user?.roles.includes(Role.User)
            ? true
            : false
        }
      >
        <>
          <BodyWrapper>
            <>
              <MetaTags
                title={'Hackathon History'}
                description={
                  'Track all of the hackathons you have participated in'
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
                    <SideMenu />
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
                            userSlice?.user?.roles.includes(Role.Client)
                              ? '/cdashboard'
                              : 'dashboard'
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
                          History
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
                        Hackathon History
                      </Text>
                      <Text
                        fontSize={'16px'}
                        lineHeight={'24px'}
                        my={'20px'}
                        fontWeight={'400'}
                      >
                        Track all of the hackathons you have participated in
                      </Text>

                      <Button
                        bg="brand.primary"
                        leftIcon={<PdfIcon />}
                        _hover={{
                          color: 'brand.secondary',
                        }}
                        borderWidth={'1px'}
                        borderColor={'brand.primary'}
                        color="white"
                      >
                        Download pdf
                      </Button>
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
                        borderRadius={{ lg: '10px' }}
                      >
                        <Flex justifyContent={'space-between'}>
                          <Text fontSize={'14px'}>
                            Hackathon History
                            <Text
                              bg="brand.primary"
                              fontSize={'12px'}
                              display={'inline-block'}
                              px="0.5rem"
                              mx={'0.5rem'}
                              borderRadius={'12px'}
                              color="white"
                            >
                              2 transactions
                            </Text>
                          </Text>

                          <Menu>
                            <MenuButton
                              px={4}
                              // py={2}
                              transition="all 0.2s"
                              borderRadius="md"
                              borderWidth="1px"
                              bg="white"
                              _active={{ bg: 'white' }}
                              _hover={{ bg: 'gray.400' }}
                              _expanded={{ bg: 'blue.400' }}
                              _focus={{ boxShadow: 'outline' }}
                            >
                              Sort By
                              <TriangleDownIcon ml={'0.5rem'} />
                            </MenuButton>
                            <MenuList>
                              <MenuItem>Date</MenuItem>
                              <MenuItem>Last 2 months</MenuItem>
                              <MenuItem>Last 3 months</MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Box>

                      <TableContainer>
                        <Table fontSize={'12px'} gap={'0.5rem'}>
                          <Thead>
                            <Tr>
                              <Th>Company</Th>
                              <Th>Hackathon</Th>
                              <Th isNumeric>Reward Amount</Th>
                              <Th>Status</Th>
                              <Th>TxID</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {transactions.map(
                              (
                                { hackathonName, amount, transactionAddress },
                                index,
                              ) => {
                                return (
                                  <Tr
                                    key={index}
                                    _hover={{
                                      bg: 'rgba(234, 236, 240, 1)',
                                    }}
                                  >
                                    <Td>Ekolance</Td>
                                    <Td>
                                      <Text color="brand.primary">
                                        <InternalLink to="/cdetail">
                                          {hackathonName}
                                        </InternalLink>
                                      </Text>
                                    </Td>
                                    <Td isNumeric>{amount}</Td>
                                    <Td isNumeric>
                                      <Tag
                                        variant="subtle"
                                        colorScheme="green"
                                        borderRadius={'full'}
                                      >
                                        <TagLabel>{'active'}</TagLabel>
                                      </Tag>
                                    </Td>
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

export default HackathonHistory;