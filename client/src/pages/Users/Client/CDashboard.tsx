import { Box, Grid, GridItem } from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import SideMenu from './SideMenu';
import Main from './Main';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getClientHacks } from '../../../store/slices/hackathonSlice';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

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
              <HomeNavbar />
              <Box w={{ lg: '1199px', base: 'full' }} mx="auto" mb={'50px'}>
                <Grid
                  display={{ base: 'block', lg: 'grid' }}
                  mt={{ lg: '6rem', base: '8rem' }}
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
                    <Main />
                  </GridItem>
                </Grid>
              </Box>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default CDashboard;
