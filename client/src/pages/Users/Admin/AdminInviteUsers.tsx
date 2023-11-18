import * as XLSX from 'xlsx';
import { AdminSideMenu } from '.';
import { RootState } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import UploadIcon from '../../../assets/icons/UploadIcon';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { HomeNavbar, MetaTags } from '../../../reusable/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Grid,
  GridItem,
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
            <HomeNavbar />
            <Box
              w={{ base: 'full' }}
              maxW={{ lg: '1199px' }}
              mx="auto"
              mb={'50px'}
              mt={{ lg: '6rem', base: '8rem' }}
              px={{ base: '1rem', lg: 'unset' }}
            >
              <Grid
                display={{ base: 'block', lg: 'grid' }}
                mt={{ lg: '3rem' }}
                templateAreas={{
                  lg: `"nav main"
                  "nav footer"`,
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
                  <AdminSideMenu />
                </GridItem>
                <GridItem bg="white" area={'main'}>
                  <Breadcrumb
                    mb={'1rem'}
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
                        Invite Users
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
                      Invite Users
                    </Text>
                    <Text
                      fontSize={{ base: '14px', lg: '16px' }}
                      lineHeight={'24px'}
                      my={'20px'}
                      fontWeight={'400'}
                      w={{ base: 'full', lg: '50%' }}
                    >
                      Manage and invite registered users
                    </Text>
                  </Box>

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
                </GridItem>
              </Grid>
            </Box>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminInviteUsers;
