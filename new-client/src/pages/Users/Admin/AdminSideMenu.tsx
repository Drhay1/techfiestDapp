import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { DashboardIcon, SettingsIcon } from '../../../assets/icons';
import { InternalLink } from '../../../utils/Link';
import { cloneElement, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Dispatch } from '@reduxjs/toolkit';
import { updateMenu } from '../../../store/slices/menuSlice';
import { useLocation } from 'react-router-dom';
import RequestsIcon from '../../../assets/icons/RequestsIcon';
import { AiOutlineLogout } from 'react-icons/ai';
import InviteUsersIcon from '../../../assets/icons/InviteUsersIcon';
import { logoutUser } from '../../../store/slices/userSlice';

function AdminSideMenu() {
  const location = useLocation();
  const dispatch = useDispatch<Dispatch<any>>();
  const activeSideMenu = useSelector<RootState>((state) => state.menu);

  const { menu } = activeSideMenu as any;

  const handleSideMenuClick = (sidemenu: number) => {
    dispatch(updateMenu(sidemenu));
  };

  const onLogout = useCallback(() => {
    dispatch(logoutUser());
  }, []);

  const menus = [
    {
      title: 'Dashboard',
      link: 'adashboard',
      icon: <DashboardIcon />,
      isActive: true,
    },
    {
      title: 'Requests',
      link: 'arequests',
      icon: <RequestsIcon />,
      isActive: false,
    },
    // {
    //   title: 'Events',
    //   link: 'aevents',
    //   icon: <EventsIcon />,
    //   isActive: false,
    // },
    // {
    //   title: 'Transactions',
    //   link: 'atransactions',
    //   icon: <TransactionsIcon />,
    //   isActive: false,
    // },
    {
      title: 'Settings',
      link: 'settings',
      icon: <SettingsIcon />,
      isActive: false,
    },
    {
      title: 'Invite Users',
      link: 'invite-users',
      icon: <InviteUsersIcon />,
      isActive: false,
    },
  ];

  useEffect(() => {
    const pathName = location.pathname
      .split('/')
      .filter((element) => element !== '');
    const pathTitle = pathName[0];
    const sideMenuTitle = menus.find(
      (sidemenu) => sidemenu.link === pathTitle,
    )?.title;

    if (sideMenuTitle && sideMenuTitle !== activeSideMenu) {
      handleSideMenuClick(
        menus.findIndex((sidemenu) => sidemenu.title === sideMenuTitle),
      );
    }
  }, [location.pathname, menus, activeSideMenu, dispatch]);
  return (
    <Box px="1rem">
      <Flex h="full" justifyContent={'space-between'} flexDirection={'column'}>
        <Box>
          <Box mt="32px">
            <InternalLink to="/">
              <Flex alignItems={'center'}>
                <Box w={{ base: '25.53' }} h={{ base: '25.53' }} mr="4px">
                  <Image
                    w="full"
                    h="full"
                    cursor={'pointer'}
                    src={'/images/new/logo.svg'}
                  />
                </Box>

                <Text
                  fontSize={{ base: '22.67px', lg: '25.53px', sm: '18.35px' }}
                  color="black"
                >
                  tech
                  <Text
                    display={'inline'}
                    color={'linear-gradient(to right, red , yellow)'}
                    bg="rgba(15, 94, 254, 1)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    Fiesta
                  </Text>
                </Text>
              </Flex>
            </InternalLink>
          </Box>
          <Flex direction={'column'} mt="64px">
            {menus.map(({ title, link, icon }, index) => (
              <InternalLink
                to={`/${link}`}
                style={{ textDecoration: 'unset' }}
                key={index}
              >
                <Button
                  boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
                  borderColor={'brand.secondary'}
                  py={'1.5rem'}
                  key={index}
                  bg={menu == index ? 'rgba(239, 244, 254, 1)' : 'white'}
                  w={'180px'}
                  mb="20px"
                  leftIcon={cloneElement(icon, { isActive: menu == index })}
                  _hover={{
                    background: menu == index ? 'brand.secondary' : '',
                    color: menu == index ? 'white' : 'brand.secondary',
                  }}
                  color={menu == index ? 'brand.primary' : 'brand.secondary'}
                  alignItems={'center'}
                >
                  <Text>{title}</Text>
                </Button>
              </InternalLink>
            ))}
            <Box
              boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
              borderColor={'brand.secondary'}
              py={'1.5rem'}
              bg="white"
              w={'180px'}
              mb="20px"
              as={Button}
              leftIcon={<Icon w="20px" as={AiOutlineLogout} />}
              _hover={{
                background: 'brand.secondary',
                color: 'white',
              }}
              color="brand.secondary"
              alignItems={'center'}
              onClick={onLogout}
            >
              <Text>Logout</Text>
            </Box>
          </Flex>
        </Box>
        <Box></Box>
      </Flex>
    </Box>
  );
}

export default AdminSideMenu;
