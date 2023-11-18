import React, { Suspense, lazy } from 'react';
import BodyWrapper from '../../reusable/components/BodyWrapper';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { HomeNavbar, MetaTags } from '../../reusable/components';
const SideMenu = lazy(() => import('../Users/Client/SideMenu'));
const Listings = lazy(() => import('./Listings'));

function AllHackathons() {
  return (
    <BodyWrapper>
      <>
        <MetaTags
          title={'Hackathons'}
          description={
            'These are all available hackathons listed on techFiesta. Discover detailed information about them and register to participate.'
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
              <Suspense fallback={null}>
                {React.createElement(SideMenu)}
              </Suspense>
            </GridItem>
            <GridItem bg="white" area={'main'}>
              <Suspense fallback={null}>
                {React.createElement(Listings)}
              </Suspense>
            </GridItem>
          </Grid>
        </Box>
      </>
    </BodyWrapper>
  );
}

export default AllHackathons;
