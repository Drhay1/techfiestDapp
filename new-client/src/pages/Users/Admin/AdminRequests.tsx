import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  getHackathonRequests,
  resetErrMsg,
  resetPublished,
} from '../../../store/slices/hackathonSlice';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { InternalLink } from '../../../utils/Link';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { AdminSideMenu } from '.';
import React, { useCallback, useEffect } from 'react';
import { HackathonStateProps } from '../../../store/interfaces/hackathon.interface';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import EllipsisIcon from '../../../assets/icons/EllipsisIcon';
import { supportedTokens } from '../../../utils/tokens';
import AuthNavbar from '../../../reusable/components/AuthNavbar';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

function AdminRequests() {
  const toast = useToast();
  const dispatch = useDispatch();
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

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
      onRefresh();
    }
  }, [hackathonSlice?.published]);

  useEffect(() => {
    const { errMsg } = hackathonSlice;
    if (hackathonSlice?.errMsg && errMsg.Id === 'PUBLISHING_HACKATHON_ERROR') {
      displayErrorToasts();
    }
  }, [hackathonSlice?.errMsg]);

  const onRefresh = useCallback(() => {
    return dispatch(getHackathonRequests());
  }, []);

  useEffect(() => {
    dispatch(getHackathonRequests());
  }, []);

  return (
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
        <BodyWrapper>
          <>
            <MetaTags
              title={'Requests | techFiesta'}
              description={
                'This dislays all of the requests received from the clients.'
              }
              pageUrl={window.location.href}
            />
            <AuthNavbar />
            <Flex minH="100vh">
              <Box
                transform={{ base: 'translateX(-1000%)', lg: 'none' }}
                position="fixed"
                h="100vh"
                w="280px"
                zIndex="1"
                className="side-menu"
                transition="transform 0.3s"
                overflow={'hidden'}
                bg="white"
                px="20px"
              >
                <AdminSideMenu />
              </Box>
              <Box
                flex="1"
                overflowX="auto"
                ml={{ base: '0', lg: '280px' }}
                px={{ lg: '2rem', base: '1rem' }}
                mt={{ base: '90px' }}
              >
                <Breadcrumb
                  mb={'1rem'}
                  mt={'0.5rem'}
                  spacing="8px"
                  separator={<ChevronRightIcon color="gray.500" />}
                  fontSize={'12px'}
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/adashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="#"
                      isCurrentPage
                      color="brand.primary"
                    >
                      Requests
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Box
                  color="brand.secondary"
                  bg="rgba(240, 249, 255, 1)"
                  px={'1rem'}
                  py={'1rem'}
                  borderRadius={'10px'}
                >
                  <Text
                    fontSize={{ base: '24px', lg: '48px' }}
                    fontWeight={'500'}
                  >
                    Requests
                  </Text>
                  <Text
                    fontSize={{ base: '14px', lg: '16px' }}
                    lineHeight={'24px'}
                    my={'20px'}
                    fontWeight={'400'}
                    w={{ base: 'full', lg: '50%' }}
                  >
                    This displays all of the requests received from the clients.
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
                    <Flex
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Text fontSize={'14px'}>
                        All Requests
                        <Text
                          bg="brand.primary"
                          fontSize={{ base: '10px', lg: '12px' }}
                          display={'inline-block'}
                          px="0.5rem"
                          mx={'0.5rem'}
                          borderRadius={'12px'}
                          color="white"
                        >
                          {hackathonSlice?.hackathonToReview &&
                            hackathonSlice?.hackathonToReview.length}{' '}
                          Requests
                        </Text>
                      </Text>

                      <Button
                        onClick={onRefresh}
                        outline={'unset'}
                        bg="brand.primary !important"
                        color="white"
                        size={{ base: 'xs', lg: 'sm' }}
                        isLoading={hackathonSlice?.fetchingRequest}
                      >
                        Refresh
                      </Button>
                    </Flex>
                  </Box>

                  <TableContainer>
                    <Table fontSize={'12px'} gap={'0.5rem'}>
                      <Thead>
                        <Tr>
                          <Th>Company Name</Th>
                          <Th>Hackathon</Th>
                          <Th isNumeric>Bounty</Th>
                          <Th>Status</Th>
                          <Th>Submitted on</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {hackathonSlice?.hackathonToReview &&
                          hackathonSlice?.hackathonToReview.map(
                            (
                              {
                                slug,
                                createdAt,
                                hackathonId,
                                tokenAmounts,
                                hackathonName,
                                rewardTokenAddress,
                                company: { companyName },
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
                                    <Text>{companyName}</Text>
                                  </Td>
                                  <Td>
                                    <Text color="brand.primary">
                                      <InternalLink
                                        to={`/admin/hacks/${hackathonId}/${slug}`}
                                      >
                                        {hackathonName}
                                      </InternalLink>
                                    </Text>
                                  </Td>

                                  <Td isNumeric>
                                    {tokenAmounts}{' '}
                                    {
                                      supportedTokens.find(
                                        (tk) =>
                                          tk.address === rewardTokenAddress,
                                      )?.symbol
                                    }
                                  </Td>
                                  <Td>
                                    <Tag color="brand.danger">Unpublished</Tag>
                                  </Td>
                                  <Td>
                                    <Text>
                                      {moment(createdAt).format(
                                        'MMMM Do, YYYY [at] h:mm a',
                                      )}
                                    </Text>
                                  </Td>

                                  <Td>
                                    <Menu>
                                      <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<EllipsisIcon />}
                                        variant="ghost"
                                      />
                                      <MenuList>
                                        <MenuItem>
                                          <Box w={'full'}>
                                            <InternalLink
                                              to={`/admin/hacks/edit/${hackathonId}/${slug}`}
                                            >
                                              <Text>
                                                <EditIcon mr="2" />
                                                Edit Hackathon
                                              </Text>
                                            </InternalLink>
                                          </Box>
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
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
            </Flex>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminRequests;
