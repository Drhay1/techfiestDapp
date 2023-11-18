import { Box, Flex } from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../Client';
import { UserMain } from '.';
import React, { useEffect } from 'react';
import { loadUserStats } from '../../../store/slices/userSlice';
import AuthNavbar from '../../../reusable/components/AuthNavbar';
import './auth_header_style.scss';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

function UserDashboard() {
  const dispatch = useDispatch();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  // get all user stats
  useEffect(() => {
    if (userSlice?.user?.roles.includes(Role.User)) {
      dispatch(loadUserStats());
    }
  }, [userSlice?.user]);

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
          <MetaTags
            title={'Dashboard'}
            description={
              'Explore, collaborate and demonstrate your skills by participating in exciting hackathons'
            }
            pageUrl={window.location.href}
          />
          <AuthNavbar />
          <BodyWrapper>
            <Flex minH="100vh">
              <Box
                transform={{ base: 'translateX(-100%)', lg: 'none' }}
                position="fixed"
                h="100vh"
                w="280px"
                zIndex="1"
                className="side-menu"
                transition="transform 0.3s"
                bg="white"
              >
                <SideMenu />
              </Box>
              <Box flex="1" overflowX="auto" ml={{ base: '0', lg: '280px' }}>
                <UserMain />
              </Box>
            </Flex>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default UserDashboard;
