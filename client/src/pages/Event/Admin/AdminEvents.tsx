import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { ChevronRightIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { AdminSideMenu } from '../../Users/Admin';
import EventTile from '../../../reusable/components/EventTile';
import { HomeNavbar, MetaTags } from '../../../reusable/components';

export interface AdminEventsProps {
  eventImage: string;
  eventName: string;
  hackathonName: string;
  description: string;
  link: string;
  startDate: Date;
}

function AdminEvents() {
  const events: AdminEventsProps[] = [
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

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  return (
    <>
      <BodyWrapper>
        <>
          <MetaTags
            title={'Events | techFiesta'}
            description={
              "This displays all of the events you've created as an Admin"
            }
            pageUrl={window.location.href}
          />
          <HomeNavbar />
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
                      href={
                        userSlice?.user?.roles.includes(Role.Admin)
                          ? '/adashboard'
                          : userSlice?.user?.roles.includes(Role.Client)
                          ? '/cdashboard'
                          : '/dashboard'
                      }
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="#"
                      isCurrentPage
                      color="brand.primary"
                    >
                      Events
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Box
                  color="brand.secondary"
                  bg="rgba(240, 249, 255, 1)"
                  px={{ lg: '24px' }}
                  py={{ lg: '24px' }}
                  borderRadius={{ lg: '10px' }}
                >
                  <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={{ lg: '48px' }} fontWeight={'500'}>
                      All Events
                    </Text>

                    <Button bg="brand.primary" color="white">
                      Create Event
                    </Button>
                  </Flex>
                  <Text
                    fontSize={'16px'}
                    lineHeight={'24px'}
                    my={'20px'}
                    fontWeight={'400'}
                    w={'50%'}
                  >
                    This displays all of the events you've created as an Admin
                  </Text>
                </Box>

                <Grid
                  gridTemplateColumns={{ lg: 'repeat(3, 3fr)' }}
                  gap="5"
                  mt={'2rem'}
                  mb={'100px'}
                >
                  {events.map(
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

export default AdminEvents;
