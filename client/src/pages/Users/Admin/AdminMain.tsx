import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
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
import { InternalLink } from '../../../utils/Link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { BasicStatsProps } from '../Client/Main';
import { HackathonStateProps } from '../../../store/interfaces/hackathon.interface';
import { MainSliceProps } from '../../../store/interfaces/mainSlice.interface';
import { OngoingIcon, PlusIcon } from '../../../assets/icons';
import { HackathonStatusComponent } from '../../../reusable/components';
import { useCallback, useEffect } from 'react';
import {
  allowHacksLaunch,
  resetAllowed,
  resetErrMsg,
} from '../../../store/slices/mainSlice';
import EllipsisIcon from '../../../assets/icons/EllipsisIcon';
import { EditIcon } from '@chakra-ui/icons';
import { supportedTokens } from '../../../utils/tokens';
import {
  getAllUsersCount,
  getUsersEmailsForAdmin,
} from '../../../store/slices/userSlice';
import DownloadIcon from '../../../assets/icons/DownloadIcon';

function AdminMain() {
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  // get all users
  useEffect(() => {
    if (userSlice?.user?.roles.includes(Role.Admin)) {
      // @ts-ignore
      dispatch(getAllUsersCount());
    }
  }, []);

  const usersCount = userSlice?.usersCount;

  const toast = useToast();
  const dispatch = useDispatch();

  const handleDowloadUsersEmails = () => {
    dispatch(getUsersEmailsForAdmin());
  };

  const basicStats: BasicStatsProps[] = [
    {
      title: 'Users',
      titleIcon: <DownloadIcon />,
      titleIconFunction: handleDowloadUsersEmails,
      record: usersCount,
      icon: '/images/fusers.png',
      label: 'In total',
    },
    // {
    //   title: 'Clients',
    //   record: 0,
    //   icon: '/images/cusers.png',
    //   label: 'In total',
    // },
    // {
    //   title: 'Ongoing',
    //   record: 753,
    //   icon: '/images/ausers.png',
    //   label: 'Hackathons',
    // },
    // {
    //   title: 'Participants',
    //   record: 5,
    //   icon: '/images/fusers.png',
    //   label: 'In total',
    // },
    // {
    //   title: 'Rewards',
    //   record: 2300,
    //   icon: '/images/bounties.png',
    //   label: 'USDC',
    // },
  ];

  const mainSlice = useSelector<RootState, MainSliceProps>(
    (state) => state.main,
  );

  const onAllowHackLaunch = useCallback((e: any) => {
    // @ts-ignore
    dispatch(allowHacksLaunch(e.target.checked));
  }, []);

  const displayErrorToasts = async () => {
    const errorMessages = mainSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          position: 'top-right',
          status: 'error',
          duration: 5000,
          isClosable: true,
          onCloseComplete() {
            dispatch(resetErrMsg());
            dispatch(resetAllowed());
          },
        }),
      ),
    );
  };

  useEffect(() => {
    if (mainSlice?.errMsg && mainSlice?.errMsg?.Id === 'CONFIG_ERROR') {
      displayErrorToasts();
    }
  }, [hackathonSlice?.errMsg]);

  return (
    <Box px={{ base: '1rem', lg: 'unset' }}>
      <Flex
        minH={{ lg: '272px', base: '200px' }}
        borderRadius={{ base: '10px' }}
        p={{ lg: '25px', base: '1rem' }}
        flexDirection={'row'}
        justifyContent={'space-between'}
        mb="55.5px"
        bg={`url('/images/adminFrame.svg')`}
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
                        userSlice?.user?.firstname &&
                        `Hi, ${userSlice?.user?.firstname}`) ||
                        'Hello'}
                    </Text>
                  </Flex>
                  <Text
                    lineHeight={'2.5rem'}
                    mt="1rem"
                    fontSize={{ lg: '48px', base: '24px' }}
                    color="white"
                  >
                    Gain Control Of Hackathon
                  </Text>
                  <Text
                    mt="1rem"
                    fontSize={{ lg: '14px', base: '12px' }}
                    fontWeight={{ base: 'normal', lg: '700' }}
                    color="white"
                  >
                    Gain control over all hackathon and help in administering
                    the platform to make it fit
                  </Text>
                </Box>
              </Box>

              <Box>
                <Flex
                  gap={'8px'}
                  mt={{ base: '1rem', lg: 'unset' }}
                  flexDirection={{ base: 'column', lg: 'row' }}
                  fontSize={{ base: '12px', lg: '14px' }}
                >
                  <Button
                    bg="brand.primary"
                    color="white"
                    display={'none'}
                    leftIcon={<PlusIcon />}
                    _hover={{
                      bg: 'white',
                      color: 'brand.primary',
                    }}
                  >
                    Create Events
                  </Button>
                  <Button
                    _hover={{
                      bg: 'white',
                      color: 'brand.primary',
                    }}
                    leftIcon={<OngoingIcon />}
                    borderWidth={'1px'}
                    borderColor={'brand.primary'}
                    bg="transparent"
                    color="white"
                    w={'50%'}
                  >
                    <InternalLink to="/arequests">All Requests</InternalLink>
                  </Button>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0" color="white">
                      Allow companies to launch hackathons
                    </FormLabel>
                    <Switch
                      id="email-alerts"
                      onChange={onAllowHackLaunch}
                      isChecked={mainSlice?.canLaunchHacks}
                    />
                  </FormControl>
                </Flex>
              </Box>
            </Flex>
          </GridItem>
          <GridItem display={{ base: 'none', lg: 'block' }}>
            <Box w="full" h="full">
              <Image
                h={'250px'}
                w={'full'}
                src="/images/adminDashboardAvatar.png"
                alt="adminDashboardAvatar"
              />
            </Box>
          </GridItem>
        </Grid>
      </Flex>

      <Text color="brand.secondary" mb="1rem">
        Dashboard
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
        {basicStats.map(
          (
            { title, titleIcon, titleIconFunction, record, icon, label },
            index,
          ) => (
            <GridItem
              key={index}
              p="1rem"
              bg="brand.secondary"
              borderRadius={'0.5rem'}
              boxShadow={'rgba(16, 24, 40, 0.03)'}
              color="white"
            >
              <Flex justifyContent={'space-between'} flexDirection={'column'}>
                <Box>
                  <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Flex
                      gap={'0.5rem'}
                      alignItems={'center'}
                      justifyContent={'center'}
                    >
                      <Text fontSize={{ lg: '24px' }}>{title}</Text>
                      {titleIcon && (
                        <Box onClick={titleIconFunction} cursor={'pointer'}>
                          <DownloadIcon />
                        </Box>
                      )}
                    </Flex>
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
          ),
        )}
      </Grid>

      <Box mt="2rem" boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px" mb={'100px'}>
        <Box py="16px" px={'24px'} bg="rgba(240, 249, 255, 1)" mb="1rem">
          <Flex justifyContent={'space-between'}>
            <Flex align={'center'}>
              <Text fontSize={'14px'}>
                All Hackathons
                <Text
                  bg="brand.primary"
                  fontSize={'12px'}
                  display={'none'}
                  px="0.5rem"
                  mx={'0.5rem'}
                  borderRadius={'12px'}
                  color="white"
                >
                  {hackathonSlice?.hackathons?.length} hackathons created so far
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Box>

        <TableContainer>
          <Table fontSize={'12px'} gap={'0.5rem'}>
            <Thead>
              <Tr>
                <Th>Company Name</Th>
                <Th>Hackathon</Th>
                <Th isNumeric>Reward Amount</Th>
                <Th>Status</Th>
                <Th display={'none'}>Deadline</Th>
              </Tr>
            </Thead>
            <Tbody>
              {hackathonSlice?.hackathons &&
                hackathonSlice?.hackathons?.map(
                  (
                    {
                      hackathonName,
                      company,
                      tokenAmounts,
                      status,
                      hackathonId,
                      totalRewardinUsd,
                      rewardTokenAddress,
                      isOnchain,
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
                        <Td>{company.companyName}</Td>
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
                          {tokenAmounts || totalRewardinUsd}{' '}
                          {
                            supportedTokens.find(
                              (token) => token.address === rewardTokenAddress,
                            )?.symbol
                          }
                        </Td>
                        <Td>
                          <HackathonStatusComponent status={status} />
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
                                    to={
                                      isOnchain
                                        ? `/admin/hacks/edit/${hackathonId}/${slug}`
                                        : `/admin/hacks/edit-offchain/${hackathonId}/${slug}`
                                    }
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
  );
}

export default AdminMain;
