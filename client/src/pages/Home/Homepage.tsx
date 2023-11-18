import  { Suspense, lazy } from 'react';
import { Box } from '@chakra-ui/react';
import { HomeNavbar, MetaTags } from '../../reusable/components';
import BodyWrapper from '../../reusable/components/BodyWrapper';
import PageLoader from '../../reusable/components/PageLoader';

const HeroSection = lazy(() => import('./HeroSection'));
const PartnerSection = lazy(() => import('./PartnerSection'));
const HackathonList = lazy(() => import('./HackathonList'));
const AboutSection = lazy(() => import('./AboutSection'));
const Faqs = lazy(() => import('./FaqSection'));
const Footer = lazy(() => import('./Footer'));

function Homepage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MetaTags
        title={'techFiesta'}
        description={
          'Particpate in hackathons where developers thrive, ideas flourish, and success begins'
        }
        pageUrl={window.location.href}
      />
      <HomeNavbar />
      <BodyWrapper>
        <Box mb={'50px'}>
          <Suspense fallback={null}>
            <HeroSection />
          </Suspense>
          <Suspense fallback={null}>
            <PartnerSection />
          </Suspense>
          <Suspense fallback={null}>
            <HackathonList />
          </Suspense>
          <Suspense fallback={null}>
            <AboutSection />
          </Suspense>
          <Suspense fallback={null}>
            <Faqs />
          </Suspense>
        </Box>
      </BodyWrapper>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </Suspense>
  );
}

export default Homepage;
