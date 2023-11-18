/*==================== Import necessary components and libraries ====================*/
import { Box, Grid, GridItem } from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { AdminMain, AdminSideMenu } from '.';
import { getAllHackathons } from '../../../store/slices/hackathonSlice';
import { useEffect } from 'react';
import { HomeNavbar } from '../../../reusable/components';

/*==================== Define the AdminDashboard component ====================*/
function AdminDashboard() {
  /*=========== Initialize dispatch function from Redux ==========*/
  const dispatch = useDispatch<any>();

  /*========== Get user state from Redux ==========*/
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  /*========== Get all hackathons from Redux ==========*/
  useEffect(() => {
    dispatch(getAllHackathons());
  }, []);

  /*========== Return the AdminDashboard component ==========*/
  return (
    /*========== Render the ConditionalRoute component ==========*/
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/404"
        condition={
          userSlice.user && userSlice.user?.roles.includes(Role.Admin)
            ? true
            : false
        }
      >
        {/*=============== Render the BodyWrapper component ===============*/}
        <BodyWrapper>
          <>
            {/*========== Render the HomeNavbar component ==========*/}
            <HomeNavbar />

            {/*========== Css container chackra ui ==========*/}
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
                  {/*========== Render the AdminSideMenu component =========*/}
                  <AdminSideMenu />
                </GridItem>
                <GridItem bg="white" area={'main'}>
                  {/*========= Render the AdminMain component ==========*/}
                  <AdminMain />
                </GridItem>
              </Grid>
            </Box>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminDashboard;
