import * as XLSX from 'xlsx';
import { AdminSideMenu } from '.';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import UploadIcon from '../../../assets/icons/UploadIcon';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronRightIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import {
  InviteUsersProps,
  Role,
  UserStateProps,
} from '../../../store/interfaces/user.interface';
import {
  inviteUsers,
  resetCreatedUser,
  resetInvitedUser,
  resetInvitingUser,
} from '../../../store/slices/userSlice';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { PublishedStatus } from '../../../reusable/styled';
import AuthNavbar from '../../../reusable/components/AuthNavbar';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

function AdminInviteUsers() {
  const toast = useToast();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [usersArray, setUsersArray] = useState<InviteUsersProps[]>([]);
  const [, /*selectedUsers*/ setSelectedUsers] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  useEffect(() => {
    if (userSlice?.invitedUsers) {
      if (userSlice?.createdUsers && userSlice?.createdUsers?.length > 0) {
        const createdUser = userSlice?.createdUsers;

        const mergedData = usersArray.map((user: any) => {
          const existingUser = createdUser.find(
            (existing) => existing.email === user.email,
          );

          if (existingUser) {
            return { ...user, invited: true };
          } else {
            return user;
          }
        });

        setUsersArray(mergedData);

        toast({
          description: 'User has been created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          onCloseComplete() {
            dispatch(resetInvitedUser());
            dispatch(resetCreatedUser());
            dispatch(resetInvitingUser());
          },
        });
      } else {
        toast({
          description: 'All users are already invited',
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          onCloseComplete() {
            dispatch(resetInvitedUser());
            dispatch(resetCreatedUser());
            dispatch(resetInvitingUser());
          },
        });
      }
    }
  }, [userSlice?.invitedUsers, userSlice?.invitingUsers]);

  const filteredUsers = useMemo(() => {
    return usersArray.filter(
      (item) =>
        item.name?.toLowerCase().includes(query?.toLowerCase()) ||
        item.email?.toLowerCase().includes(query?.toLowerCase()),
    );
  }, [usersArray, query]);

  const handleSearch = (query: string) => setQuery(query);

  const handleDelete = (index: number) => {
    const newUsersArray = [...usersArray];
    newUsersArray.splice(index, 1);
    setUsersArray(newUsersArray);

    const selectedUsersLength = newUsersArray.filter(
      (user) => user.selected,
    ).length;
    setSelectedUsers(selectedUsersLength);
  };

  const handleUpload = (binaryData: any) => {
    try {
      const workbook = XLSX.read(binaryData, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      const formattedData = jsonData
        .map((user: any) => ({
          selected: false,
          name: user.name,
          email: user.email,
        }))
        .filter(
          (user, index, self) =>
            emailRegex.test(user.email) &&
            index === self.findIndex((u) => u.email === user.email),
        );

      setUsersArray(formattedData);
    } catch (error) {
      console.error('Error parsing Excel file', error);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = useCallback(
    (e: any) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          const binaryStr = event.target?.result as string;

          handleUpload(binaryStr);
        };

        reader.readAsBinaryString(file);
      }
    },
    [handleUpload],
  );

  const onInviteUsers = async () => {
    if (usersArray.length < 1) {
      return toast({
        description: 'No users to invite',
        status: 'info',
        duration: 1000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetInvitedUser());
        },
      });
    }

    dispatch(inviteUsers(usersArray));
  };

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
              title={'Invite Users'}
              description={'Manage and invite registered users'}
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
                px={{ base: '1rem', lg: '2rem' }}
              >
                <Box mt="90px">
                  <Breadcrumb
                    mb={'1rem'}
                    mt={'1.5rem'}
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
                        InviteUser
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                  <Box>
                    <Text
                      fontSize={{ base: '24px', lg: '48px' }}
                      color="brand.secondary"
                    >
                      Invite Users
                    </Text>
                    <Text fontSize={{ base: '12px', lg: '14px' }}>
                      Manage and invite registered users
                    </Text>
                    <Box
                      py="1rem"
                      mt="48px"
                      fontSize={'14px'}
                      color="brand.secondary"
                      px={{ lg: '0.5rem' }}
                      bg="white"
                      borderRadius={'1rem'}
                    >
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls"
                        display={'none'}
                        onChange={handleFileChange}
                      />
                      <Button
                        size={'sm'}
                        mt="2rem"
                        bg="brand.primary"
                        fontSize={'14px'}
                        color="white"
                        leftIcon={<UploadIcon />}
                        _hover={{
                          bg: 'white',
                          color: 'brand.primary',
                        }}
                        boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.20)'}
                        onClick={handleButtonClick}
                      >
                        Upload Document [.xls]
                      </Button>
                      <InputGroup mt={'2rem'}>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon />
                        </InputLeftElement>
                        <Input
                          w={{ lg: '240px', base: 'full' }}
                          fontWeight={'400'}
                          outline={'unset'}
                          boxShadow="none"
                          borderColor="black"
                          placeholder="Search User"
                          size="md"
                          type="search"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Box>

                    <Box
                      mt="2rem"
                      boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
                      mb={'100px'}
                    >
                      <TableContainer>
                        <Table fontSize={'12px'} gap={'0.5rem'}>
                          <Thead>
                            <Tr>
                              <Th>Name</Th>
                              <Th>Email address</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredUsers.map(
                              ({ name, email, invited }, index) => {
                                return (
                                  <Tr
                                    key={index}
                                    _hover={{
                                      bg: 'rgba(234, 236, 240, 1)',
                                    }}
                                  >
                                    <Td>
                                      <Text>{name}</Text>
                                    </Td>
                                    <Td>{email}</Td>
                                    <Td>
                                      {invited && (
                                        <PublishedStatus>
                                          Uploaded
                                        </PublishedStatus>
                                      )}
                                    </Td>
                                    <Td
                                      display={'flex'}
                                      justifyContent={'flex-end'}
                                    >
                                      <Button
                                        size={'xs'}
                                        bg="brand.danger"
                                        color="white"
                                        leftIcon={<DeleteIcon />}
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.danger',
                                        }}
                                        isLoading={userSlice?.invitingUsers}
                                        onClick={() => handleDelete(index)}
                                      >
                                        RM
                                      </Button>
                                    </Td>
                                  </Tr>
                                );
                              },
                            )}
                          </Tbody>
                        </Table>
                      </TableContainer>
                      {usersArray.length > 0 && (
                        <Flex
                          justifyContent={'flex-end'}
                          alignItems={'center'}
                          p={'1rem'}
                        >
                          <Button
                            size={'sm'}
                            bg="brand.primary"
                            color="white"
                            _hover={{
                              bg: 'white',
                              color: 'brand.primary',
                            }}
                            onClick={onInviteUsers}
                            isLoading={userSlice?.invitingUsers}
                          >
                            Invite Users
                          </Button>
                        </Flex>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminInviteUsers;
