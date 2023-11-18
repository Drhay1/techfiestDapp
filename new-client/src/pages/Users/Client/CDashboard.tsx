import { Box, Flex } from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import SideMenu from './SideMenu';
import Main from './Main';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { getClientHacks } from '../../../store/slices/hackathonSlice';
import AuthNavbar from '../../../reusable/components/AuthNavbar';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

function CDashboard() {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getClientHacks());
  }, []);

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/404"
        condition={
          userSlice.user && userSlice.user?.roles.includes(Role.Client)
            ? true
            : false
        }
      >
        <>
          <BodyWrapper>
            <>
              <MetaTags
                title={'Dashboard'}
                description={
                  'Get Started with Web3 | Create hackathons where developers thrive, ideas flourish, and success begins'
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
                  <SideMenu />
                </Box>

                <Box
                  flex="1"
                  overflowX="auto"
                  ml={{ base: '0', lg: '280px' }}
                  px={{ base: '1rem', lg: '2rem' }}
                >
                  <Main />
                </Box>
              </Flex>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default CDashboard;
