import { Box, Grid, GridItem } from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { SideMenu } from '../Client';
import { UserMain } from '.';
import { useEffect } from 'react';
import { loadUserStats } from '../../../store/slices/userSlice';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

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
        <BodyWrapper>
          <>
            <MetaTags
              title={'Dashboard | techFiesta'}
              description={
                'Explore, collaborate and demonstrate your skills by participating in exciting hackathons'
              }
              pageUrl={window.location.href}
            />
            <HomeNavbar />
            <Box
              mt={{ lg: '6rem', base: '8rem' }}
              w={{ base: 'full' }}
              maxW={{ lg: '1199px' }}
              mx="auto"
              mb={'50px'}
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
                  <SideMenu />
                </GridItem>
                <GridItem bg="white" area={'main'}>
                  <UserMain />
                </GridItem>
              </Grid>
            </Box>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default UserDashboard;
