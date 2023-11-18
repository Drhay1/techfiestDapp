import { Dispatch } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import { cloneElement, useEffect } from 'react';
import { RootState } from '../../../store/store';
import { InternalLink } from '../../../utils/Link';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMenu } from '../../../store/slices/menuSlice';
import { DashboardIcon, SettingsIcon } from '../../../assets/icons';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';

function SideMenu() {
  const location = useLocation();
  const dispatch = useDispatch<Dispatch<any>>();
  const activeSideMenu = useSelector<RootState>((state) => state.menu);
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const { menu }: any = activeSideMenu;

  const handleSideMenuClick = (sidemenu: number) => {
    dispatch(updateMenu(sidemenu));
  };

  // const conditionalMenu = userSlice.user?.roles.includes(Role.Client)
  //   ? {
  //       title: 'Transactions',
  //       link: 'ctransactions',
  //       icon: <TransactionsIcon />,
  //       isActive: false,
  //     }
  //   : null;

  const menus = [
    {
      title: 'Dashboard',
      link:
        userSlice?.isAuthenticated &&
        userSlice?.user?.roles.includes(Role.Client)
          ? 'cdashboard'
          : userSlice?.user?.roles.includes(Role.Admin)
          ? 'adashboard'
          : userSlice?.user?.roles.includes(Role.User)
          ? 'dashboard'
          : 'login',
      icon: <DashboardIcon />,
      isActive: true,
    },
    ...(userSlice?.isAuthenticated
      ? [
          {
            title: 'Settings',
            link: 'settings',
            icon: <SettingsIcon />,
            isActive: false,
          },
        ]
      : []),
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

export default SideMenu;
