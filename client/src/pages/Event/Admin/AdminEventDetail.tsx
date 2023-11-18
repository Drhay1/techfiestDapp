import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Grid,
  GridItem,
  Icon,
  Text,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from '@chakra-ui/icons';
import { ExternalLink } from '../../../utils/Link';
import moment from 'moment';
import { AdminSideMenu } from '../../Users/Admin';
import { useNavigate } from 'react-router-dom';
import { AdminEventsProps } from './AdminEvents';
import EventTile from '../../../reusable/components/EventTile';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

function AdminEventDetail() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const relatedEvents: AdminEventsProps[] = [
    {
      eventImage: '/images/eventbg1.svg',
      eventName:
        'Raise the Bar in 2023: Strategies from Top Employers Winning Tech Talent',
      hackathonName: 'Ekolance',
      description: '',
      link: '',
      startDate: new Date(),
    },
    {
      eventImage: '/images/eventbg2.svg',
      eventName:
        'Raise the Bar in 2023: Strategies from Top Employers Winning Tech Talent',
      hackathonName: 'Ekolance',
      description: '',
      link: '',
      startDate: new Date(),
    },
    {
      eventImage: '/images/eventbg3.svg',
      eventName:
        'Raise the Bar in 2023: Strategies from Top Employers Winning Tech Talent',
      hackathonName: 'Ekolance',
      description: '',
      link: '',
      startDate: new Date(),
    },
  ];
  return (
    <>
      <BodyWrapper>
        <>
          <HomeNavbar />
          <MetaTags
            title={'Events | techFiesta'}
            description={
              "This displays all of the events you've created as an Admin"
            }
            pageUrl={window.location.href}
          />
          <Box w={{ lg: '1199px' }} mx="auto" mb={'500px'}>
            <Grid
              mt={{ lg: '3rem' }}
              templateAreas={`"nav main"
                    "nav footer"`}
              gridTemplateRows={'50px 1fr 30px'}
              gridTemplateColumns={'200px 1fr'}
              gap="10"
              color="blackAlpha.700"
            >
              <GridItem pl="2" bg="white" area={'nav'} position={'sticky'}>
                <AdminSideMenu />
              </GridItem>
              <GridItem pl="2" bg="white" area={'main'}>
                <Breadcrumb
                  mb={{ lg: '1rem' }}
                  spacing="8px"
                  separator={<ChevronRightIcon color="gray.500" />}
                  fontSize={'12px'}
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={handleGoBack}
                      color="brand.primary"
                    >
                      <Icon as={ChevronLeftIcon} />
                      Back
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Flex
                  justifyContent={'space-between'}
                  flexDirection={'column'}
                  textColor={'brand.secondary'}
                  mb={'20'}
                >
                  <Text
                    fontSize={'16px'}
                    lineHeight={'24px'}
                    my={'10px'}
                    fontWeight={'bold'}
                  >
                    Virtual Panel Discussion
                  </Text>
                  <Text fontSize={{ lg: '48px' }} fontWeight={'bold'}>
                    Raise the Bar in 2023: Strategies from Top Employers Winning
                    Tech Talent
                  </Text>
                  <Text
                    fontSize={'16px'}
                    lineHeight={'24px'}
                    my={'10px'}
                    fontWeight={'bold'}
                    color={'brand.primary'}
                  >
                    September 20th at 12pm ET / 5pm GMT
                  </Text>
                  <Text
                    fontSize={'16px'}
                    whiteSpace={'pre-line'}
                    lineHeight={'24px'}
                    my={'10px'}
                  >
                    Are you experiencing a long and tedious hiring process that
                    produces limited responses and leaves positions unfilled?
                    Benchmark data shows top employers on Hired have higher than
                    average response rates and it takes less days to hire
                    talent.
                    {'\n\n'} What does your company need to implement in order
                    to increase the efficiency, equity, and transparency of your
                    hiring process? Watch the recording below as our panel of
                    experts analyze key findings and data of Hired’s top
                    performing employers and share strategies on what you can do
                    to fill open positions with top talent and to build a
                    diverse team quickly and efficiently.{'\n\n'} Are you
                    experiencing a long and tedious hiring process that produces
                    limited responses and leaves positions unfilled? Benchmark
                    data shows top employers on Hired have higher than average
                    response rates and it takes less days to hire talent.
                    {'\n\n'} What does your company need to implement in order
                    to increase the efficiency, equity, and transparency of your
                    hiring process?{'\n\n'} Watch the recording below as our
                    panel of experts analyze key findings and data of Hired’s
                    top performing employers and share strategies on what you
                    can do to fill open positions with top talent and to build a
                    diverse team quickly and efficiently.
                  </Text>
                  <Text fontSize={'16px'} lineHeight={'24px'} my={'20px'}>
                    Event Link:{' '}
                    <ExternalLink
                      href="https://etherscan.io"
                      textColor={'brand.primary'}
                    >
                      Click here <LinkIcon />
                    </ExternalLink>{' '}
                  </Text>
                </Flex>
                <Text fontSize={'16px'} my={'10px'} fontWeight={'bold'}>
                  Other Related Events
                </Text>
                <Grid
                  gridTemplateColumns={{ lg: 'repeat(3, 1fr)' }}
                  gap="5"
                  mt={'2rem'}
                  mb={'100px'}
                >
                  {relatedEvents.map(
                    (
                      { eventImage, eventName, startDate, hackathonName, link },
                      index,
                    ) => {
                      const mStartDate =
                        moment(startDate).format('YYYY-MM-DD HH:mm');
                      return (
                        <EventTile
                          key={index}
                          eventImage={eventImage}
                          eventName={eventName}
                          hackathonName={hackathonName}
                          link={link}
                          mStartDate={mStartDate}
                        />
                      );
                    },
                  )}
                </Grid>
              </GridItem>
            </Grid>
          </Box>
        </>
      </BodyWrapper>
    </>
  );
}

export default AdminEventDetail;
