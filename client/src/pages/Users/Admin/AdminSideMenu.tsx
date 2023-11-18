import { Button, Flex, Text } from '@chakra-ui/react';
import { DashboardIcon, SettingsIcon } from '../../../assets/icons';
import { InternalLink } from '../../../utils/Link';
import { cloneElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Dispatch } from '@reduxjs/toolkit';
import { updateMenu } from '../../../store/slices/menuSlice';
import { useLocation } from 'react-router-dom';
import RequestsIcon from '../../../assets/icons/RequestsIcon';
import InviteUsersIcon from '../../../assets/icons/InviteUsersIcon';

function AdminSideMenu() {
  const location = useLocation();
  const dispatch = useDispatch<Dispatch<any>>();
  const activeSideMenu = useSelector<RootState>((state) => state.menu);

  const { menu } = activeSideMenu as any;

  const handleSideMenuClick = (sidemenu: number) => {
    dispatch(updateMenu(sidemenu));
  };

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
    <Flex direction={'column'}>
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
            bg={menu == index ? 'brand.secondary' : ''}
            w={'180px'}
            mb="44px"
            leftIcon={cloneElement(icon, { isActive: menu == index })}
            _hover={{
              background: menu == index ? 'brand.secondary' : '',
            }}
            alignItems={'center'}
          >
            <Flex color={menu == index ? 'white' : 'brand.secondary'}>
              <Text>{title}</Text>
            </Flex>
          </Button>
        </InternalLink>
      ))}
    </Flex>
  );
}

export default AdminSideMenu;
