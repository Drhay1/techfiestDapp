import React, { Suspense } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
// import { HomeNavbar, MetaTags } from '../../reusable/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { InternalLink } from '../../utils/Link';

const DjSvg = React.lazy(() => import('../../assets/illustrations/DjSvg'));
const DJText = React.lazy(() => import('../../assets/illustrations/DjText'));

const BodyWrapper = React.lazy(
  () => import('../../reusable/components/BodyWrapper'),
);
const PageLoader = React.lazy(
  () => import('../../reusable/components/PageLoader'),
);
const NewFooter = React.lazy(
  () => import('../../reusable/components/NewFooter'),
);
const JoinDiscordSection = React.lazy(
  () => import('../../reusable/components/JoinDiscordSection'),
);
const HackathonList = React.lazy(() => import('./HackathonList'));

import {
  // @ts-ignore
  Grid as SwiperGrid,
  // @ts-ignore
  Pagination as SwiperPagination,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import './style.css';
import LazyLoad from 'react-lazyload';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { HackathonStateProps } from '../../store/interfaces/hackathon.interface';

const HomeNavbar = React.lazy(
  () => import('../../reusable/components/HomeNavbar'),
);
const MetaTags = React.lazy(() => import('../../reusable/components/MetaTags'));

function Homepage() {
  const faqItems = [
    {
      question: 'How do I participate in a techFiesta hackathon?',
      answer:
        'Participating in a techFiesta hackathon is easy! Simply browse through the ongoing hackathons and select the one that interests you and click on the "Register" button. Create your profile, and you\'ll be ready to dive into the exciting world of hackathons!.',
    },
    {
      question: 'How are payments made to developers after a hackathon?',
      answer:
        'Payments are done to the participants wallet after the announcement of the winners of the techFiesta.',
    },
    {
      question:
        'Are there any educational resources available for developers on techFiesta?',
      answer:
        'Absolutely! As a techFiesta participant, you gain access to a wealth of educational resources. We offer educational workshops, seminars, and events where you can enhance your skills and stay updated with the latest technologies. We believe in continuous learning and provide opportunities for developers to upskill and grow.',
    },
    {
      question: 'Can I collaborate with other developers during a hackathon?',
      answer:
        'Collaboration is highly encouraged at techFiesta hackathons! Our platform provides real-time interaction and communication channels where you can connect with other developers, form teams, and collaborate on projects. This collaborative environment fosters innovation, allows for knowledge sharing, and creates a vibrant community of like-minded individuals.',
    },
    {
      question: 'Are the hackathons only for developers?',
      answer:
        'We welcome anyone with an interest in technology, innovation, and collaborative problem-solving. Whether you are a developer, project manager, designer, entrepreneur, or tech enthusiast, you can participate in our hackathons and benefit from the opportunities and resources we offer.',
    },
    {
      question: 'Why do I need techFiesta?',
      answer:
        'techFiesta offers a unique platform to showcase your skills, connect with top companies, and gain recognition in the tech industry. By participating in our hackathons, you can accelerate your learning, expand your network, and have the chance to birth innovative solutions. Additionally, you receive bounties on chain in stable coins and we provide access to educational workshops and upskilling opportunities. Joining techFiesta opens doors to valuable experiences, collaborations, and career growth in the tech ecosystem.',
    },
  ];

  const benefits = [
    {
      title: 'Fast and Secure Payment',
      description: `Get paid on time and securely through HUMAN Protocol audited and secured smart contracts.`,
    },
    {
      title: `Simple registration process`,
      description: `Explore different educational workshops on how to build
      on various protocols.`,
    },
    {
      title: 'User-friendly interface',
      description: `Our techFiesta platform is user-friendly and easy to
    navigate. You will be able to find everything you need
    without any difficulty.`,
    },
  ];

  const hackerVoices = [
    {
      name: `Tolu`,
      voice:
        'I like the simplicity of the techFiesta platform. All it takes to join a hackathon is to connect your wallet and dive right into hacking.',
      x_tag: '@tolu',
    },
    {
      name: `Hamid`,
      voice: `techFiesta has a clean and uncluttered UI. It's incredibly user-friendly and provides all the essential hackathon details. It also doesn't look intimidating to newcomers to hackathons.`,
      x_tag: `@hamid`,
    },
    {
      name: `Abimbola`,
      voice: `I want to extend my heartfelt appreciation to the brilliant developers behind techFiesta. It's an astonishingly innovative platform. The connection of our wallets before project submission, just like in DAO, is a fantastic touch."`,
      x_tag: `@abimbola`,
    },
  ];

  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  return (
    <Suspense fallback={<PageLoader />}>
      <MetaTags
        title={'techFiesta'}
        description={
          'Participate in hackathons where developers thrive, ideas flourish, and success begins'
        }
        pageUrl={window.location.href}
      />
      <HomeNavbar />
      <BodyWrapper>
        <>
          <Stack px={{ base: '1rem' }} overflow={'hidden'} w="full">
            {/* Banner */}
            <Box
              mt={'5rem'}
              h={{ md: ' 35rem', r: '650px' }}
              w={{ base: 'full' }}
              bg={
                'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)'
              }
              borderRadius={{ lg: '2.5rem', md: '1.5rem', base: '0.5rem' }}
              boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
              backdropFilter={'blur(20px)'}
              overflow={'hidden'}
            >
              <Grid
                gridTemplateColumns={{ md: 'repeat(2, 1fr)', lg: '45% 55%' }}
                h="full"
              >
                <GridItem
                  gap={'3rem'}
                  mx={'auto'}
                  p={{ lg: '2.5rem', md: '1.5rem', base: '1rem' }}
                >
                  <Flex flexDirection={'column'} gap={'2rem'}>
                    <Flex
                      flexDirection={'column'}
                      alignItems={{ lg: 'flex-start', base: 'center' }}
                      textAlign={{ md: 'start', base: 'center' }}
                      gap={'1.5rem'}
                      mb={{ base: '1.5rem' }}
                    >
                      <Text
                        fontSize={{ r: '3.7rem', base: '2.75rem' }}
                        fontWeight={'700'}
                        lineHeight={{ md: '77px', base: '55px' }}
                        mt={{ r: '2.4rem' }}
                      >
                        Code, Collaborate
                        <Text display={'block'}>& Win Big</Text>
                      </Text>
                      <Text
                        fontSize={{ lg: '1.25rem', base: '1rem' }}
                        fontWeight={'400'}
                        lineHeight={'140%'}
                      >
                        Join our developer community, build, compete for prizes,
                        and have fun!
                      </Text>
                    </Flex>
                    <Flex
                      w="full"
                      justifyContent={{
                        base: 'center',
                        md: 'unset',
                      }}
                    >
                      <InternalLink to="/user-signup">
                        <Button
                          bg="#0F5EFE"
                          color="#FFFFFF"
                          borderRadius={{ lg: '0.5rem', base: '0.33rem' }}
                          px={{ lg: '1.25rem', md: '0.82rem', base: '2rem' }}
                          py={{ lg: '0.75rem', md: '0.495rem', base: '1rem' }}
                          transition={'all 0.2s ease-in-out'}
                          _hover={{ filter: 'brightness(105%)' }}
                          borderWidth={{ lg: '1px', base: '0.66px' }}
                          borderColor={'#0F5EFE'}
                          w={{ base: '10.375rem' }}
                          mb={{ base: '1.5rem' }}
                          mx={{ base: 'auto', md: 'unset' }}
                          h="48px"
                        >
                          Start Hacking
                        </Button>
                      </InternalLink>
                    </Flex>
                  </Flex>
                  <Flex
                    justifyContent={{ lg: 'unset', base: 'space-between' }}
                    alignItems={{ lg: 'flex-start', base: 'center' }}
                    gap={{ md: '1.5rem', base: 'full' }}
                  >
                    <Flex
                      p={{ md: '1rem', base: '0.5rem' }}
                      flexDirection={'column'}
                      alignItems={'center'}
                      gap={''}
                    >
                      <Text
                        fontSize={{
                          lg: '2.25rem',
                          md: '1.5rem',
                          base: '1.25rem',
                        }}
                        fontWeight={'700'}
                      >
                        1k+
                      </Text>
                      <Text
                        fontSize={{ lg: '1rem', base: '0.75rem' }}
                        fontWeight={'500'}
                      >
                        Participants
                      </Text>
                    </Flex>
                    <Flex
                      p={{ md: '1rem', base: '0.5rem' }}
                      flexDirection={'column'}
                      alignItems={'center'}
                      gap={''}
                    >
                      <Text
                        fontSize={{
                          lg: '2.25rem',
                          md: '1.5rem',
                          base: '1.25rem',
                        }}
                        fontWeight={'700'}
                      >
                        10+
                      </Text>
                      <Text
                        fontSize={{ lg: '1rem', base: '0.75rem' }}
                        fontWeight={'500'}
                      >
                        Hackathons
                      </Text>
                    </Flex>
                    <Flex
                      p={{ md: '1rem', base: '0.5rem' }}
                      flexDirection={'column'}
                      alignItems={'center'}
                      gap={''}
                    >
                      <Text
                        fontSize={{
                          lg: '2.25rem',
                          md: '1.5rem',
                          base: '1.25rem',
                        }}
                        fontWeight={'700'}
                      >
                        $13k+
                      </Text>
                      <Text
                        fontSize={{ lg: '1rem', base: '0.75rem' }}
                        fontWeight={'500'}
                      >
                        Rewards
                      </Text>
                    </Flex>
                  </Flex>
                </GridItem>

                <GridItem
                  display={{ md: 'inline-grid', base: 'none' }}
                  justifyContent={'center'}
                  p={{ lg: '2.5rem', md: '1.5rem' }}
                >
                  <Grid gridTemplateColumns={'repeat(2, 1fr)'}>
                    <GridItem
                      gridRow={'1/-1'}
                      gridColumn={'1/-1'}
                      position={'relative'}
                    >
                      <Box position={'relative'} top={{ r: '-10%' }}>
                        <Box display={{ base: 'none', r: 'block' }}>
                          <DjSvg height={693} />
                        </Box>
                        <Box display={{ r: 'none' }}>
                          <DjSvg height={489.08} width={300.36} />
                        </Box>
                      </Box>
                    </GridItem>
                    <GridItem gridColumn={'1/-1'} gridRow={'1/-1'} zIndex={'1'}>
                      <Flex
                        mt="7%"
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <Box
                          width={'273px'}
                          height={'55px'}
                          bg="rgba(60, 77, 109, 0.05)"
                          py={'10px'}
                          px="10px"
                        >
                          <Grid gridTemplateColumns={'20% 80%'} h="full">
                            <GridItem>
                              <Box h="34.62" w="34.62">
                                <Image src="/images/new/smiley.png" />
                              </Box>
                            </GridItem>
                            <GridItem>
                              <DJText />
                            </GridItem>
                          </Grid>
                        </Box>
                      </Flex>
                    </GridItem>
                  </Grid>
                </GridItem>
              </Grid>
            </Box>

            {/* All techFiesta */}
            <HackathonList />

            <Box
              p={'4.5rem'}
              borderRadius={{ lg: '2.5rem', md: '1.5rem', base: '0.5rem' }}
              bg={
                'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)'
              }
              boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
              backdropFilter={'blur(20px)'}
              display={{ lg: 'flex', base: 'none' }}
              justifyContent={'center'}
              alignItems={'center'}
              mx="auto"
              mt={'5rem'}
            >
              <Text
                textAlign={'center'}
                fontSize={{ lg: '2.25rem', md: '1.5rem', base: '1.25rem' }}
                fontWeight={'700'}
                lineHeight={'140%'}
              >
                A techFiesta is a hacker event which could be a hackathon or a
                developer challenge
              </Text>
            </Box>

            {/* techFiesta Sponsors */}
            <Grid
              mt={'5rem'}
              gridTemplateColumns={{ lg: '25% 1fr' }}
              gap={'2rem'}
              px={{ lg: '2.5rem', md: '1.5rem' }}
              overflow={'hidden'}
              h={{ r: '493px' }}
            >
              <GridItem order={{ md: 1, base: 2 }}>
                <Box
                  w={'full'}
                  h={'full'}
                  p={'1.5rem'}
                  borderRadius={'0.5rem'}
                  bg={
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)'
                  }
                  boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
                  backdropFilter={'blur(20px)'}
                >
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                    gap={'1rem'}
                  >
                    <Text
                      fontSize={{
                        lg: '2.25rem',
                        md: '1.5rem',
                        base: '1.25rem',
                      }}
                      fontWeight={'700'}
                    >
                      techFiesta Sponsors
                    </Text>
                    {/* <Button onClick={handleButtonClick}>Swipe</Button> */}
                  </Flex>
                </Box>
              </GridItem>

              <GridItem order={{ md: 2, base: 1 }} h="full" overflow={'hidden'}>
                <Swiper
                  slidesPerGroup={1}
                  pagination={{ clickable: true }}
                  className="mySwiper"
                  navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }}
                  slidesPerView={3}
                  grid={{
                    rows: 1,
                  }}
                  spaceBetween={30}
                  modules={[SwiperGrid]}
                  breakpoints={{
                    200: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                      grid: { rows: 2, fill: 'row' },
                    },
                    480: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                      grid: { rows: 3, fill: 'row' },
                    },
                    769: {
                      slidesPerView: 3,
                      spaceBetween: 10,
                      grid: { rows: 2, fill: 'row' },
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                      grid: { rows: 2, fill: 'row' },
                    },
                  }}
                >
                  {hackathonSlice?.sponsors?.map(
                    ({ companyName, logo }, key) => (
                      <SwiperSlide
                        style={{
                          cursor: 'pointer',
                          padding: '1rem',
                          boxShadow: '0px 3px 4px 0px rgba(60, 77, 109, 0.25)',
                          backgroundColor: 'rgba(60, 77, 109, 0.05)',
                          border: '1px solid #3C4D6D',
                          borderRadius: '0.5rem',
                          minHeight: '120px',
                        }}
                        {...{ key }}
                      >
                        <Box
                          px={'1rem'}
                          py={{ lg: '1rem', base: '0.75rem' }}
                          backdropFilter={'blur(20px)'}
                          display={'flex'}
                          flexDirection={'column'}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                          gap={{ lg: '2rem', base: '0.5rem' }}
                        >
                          <Box bg={'#0F5EFE'} w={'3.75rem'} h={'3.75rem'}>
                            <Flex
                              alignItems={'center'}
                              w="full"
                              h="full"
                              justifyContent={'center'}
                            >
                              <Image
                                // title={name}
                                w="full"
                                h="full"
                                src={logo}
                              />
                            </Flex>
                          </Box>
                          <Text
                            fontSize={{ lg: '1rem', base: '0.75rem' }}
                            fontWeight={'400'}
                          >
                            {companyName}
                          </Text>
                        </Box>
                      </SwiperSlide>
                    ),
                  )}
                </Swiper>
              </GridItem>
            </Grid>

            {/* Benefits of participating in a techFiesta */}
            <Grid
              mt={'5rem'}
              gridTemplateColumns={{
                lg: '25% 70%',
                md: '25% 70%',
                base: '1fr',
              }}
              gap={'1rem'}
              px={{ lg: '2.5rem', md: '1.5rem' }}
            >
              <GridItem>
                <Box
                  w={'full'}
                  p={'1.5rem'}
                  borderRadius={'0.5rem'}
                  bg={
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)'
                  }
                  boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
                  backdropFilter={'blur(20px)'}
                >
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                    gap={'1rem'}
                  >
                    <Box
                      w={{ lg: '6.25rem', md: '4.5rem', base: '2.5rem' }}
                      h={{ lg: '6.25rem', md: '4.5rem', base: '2.5rem' }}
                      borderRadius={'full'}
                      bg={'#0F5EFE'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Image src="/images/new/benefitsDJ.svg" alt="faqDJ" />
                    </Box>
                    <Text
                      fontSize={{
                        lg: '1.5rem',
                        md: '1.25rem',
                        base: '1.25rem',
                      }}
                      fontWeight={'700'}
                    >
                      Benefits of participating in a techFiesta
                    </Text>
                  </Flex>
                </Box>
              </GridItem>

              <GridItem
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                w={{ lg: '980px', md: '700px' }}
                overflow={'hidden'}
              >
                <Box w={'full'} h="full">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={2}
                    grabCursor={true}
                    style={{ paddingTop: '6rem' }}
                    breakpoints={{
                      300: { slidesPerView: 1, spaceBetween: 10 },
                      750: { slidesPerView: 2, spaceBetween: 20 },
                      1280: { slidesPerView: 3, spaceBetween: 10 },
                    }}
                  >
                    {benefits.map(({ title, description }, index) => (
                      <SwiperSlide
                        key={index}
                        style={{
                          marginTop: '2rem',
                          height: '100%',
                          backgroundColor: 'unset',
                        }}
                      >
                        <Box
                          flexDirection={'column'}
                          justifyContent={'center'}
                          border={'1px solid #3C4D6D'}
                          borderRadius={'8px'}
                          h={{ lg: '224px', md: '200px', base: '160px' }}
                          p={{ lg: '24px', md: '16px', base: '16px' }}
                          mx={'30px'}
                        >
                          <Text
                            fontSize={{ base: '1rem' }}
                            lineHeight={'25px'}
                            fontWeight={'500'}
                          >
                            {title}
                          </Text>
                          <Text
                            color={'#3C4D6D'}
                            fontSize={{
                              base: '14px',
                            }}
                            fontWeight={'400'}
                            mt={'15px'}
                          >
                            {description}
                          </Text>
                        </Box>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              </GridItem>
            </Grid>

            {/* Hackers' Voices */}

            <Box mt={'5rem'} px={{ lg: '2.5rem', md: '1.5rem' }}>
              <Flex
                flexDirection={{ md: 'row', base: 'column' }}
                justifyContent={'space-between'}
                alignItems={{ md: 'center', base: 'unset' }}
                mb={{ lg: '5rem', base: '3.5rem' }}
              >
                <Text
                  fontSize={{ lg: '2.25rem', md: '1.5rem', base: '1.25rem' }}
                  fontWeight={'700'}
                >
                  Hackers' Voices
                </Text>
                <Text
                  textAlign={{ md: 'right', base: 'unset' }}
                  fontSize={{ lg: '1.25rem', base: '1rem' }}
                  fontWeight={'400'}
                >
                  What hackers are saying about techFiesta
                </Text>
              </Flex>
              <Box w="full" overflow={'hidden'}>
                <Swiper
                  breakpoints={{
                    300: { slidesPerView: 1, spaceBetween: 10 },
                    750: { slidesPerView: 2, spaceBetween: 20 },
                    1280: { slidesPerView: 3, spaceBetween: 10 },
                  }}
                  loop={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  navigation={true}
                >
                  {hackerVoices.map(({ name, voice, x_tag }, index) => (
                    <SwiperSlide
                      key={index}
                      style={{ backgroundColor: 'unset' }}
                    >
                      <Box
                        p={'2rem'}
                        maxW={{ lg: '30rem' }}
                        bg={'rgba(60, 77, 109, 0.05)'}
                        border={'1px solid #3C4D6D'}
                        borderRadius={'0.5rem'}
                        h={{ base: '313px' }}
                        textAlign={'left'}
                      >
                        <Flex flexDirection={'column'} gap={'2rem'}>
                          <Box>
                            <LazyLoad offset={300}>
                              <Image src="/images/new/quote.svg" alt="quote" />
                            </LazyLoad>
                          </Box>
                          <Text
                            fontSize={'13.7px'}
                            fontWeight={'500'}
                            lineHeight={'140%'}
                          >
                            {voice}
                          </Text>
                          <Flex
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={'1rem'}
                          >
                            {/* <Box
                              w={{ lg: '3rem', base: '2.5rem' }}
                              h={{ lg: '3rem', base: '2.5rem' }}
                              bg={'rgba(60, 77, 109, 0.05)'}
                              borderRadius={'full'}
                            >
                              <LazyLoad offset={300}>
                                <Avatar
                                  src="https://sam.thelle.io/images/thelle.png"
                                  name="quote"
                                  rounded={'none'}
                                  borderRadius={'none'}
                                />
                              </LazyLoad>
                            </Box> */}
                            <Flex
                              flexDirection={'column'}
                              justifyContent={'space-between'}
                              h={'full'}
                            >
                              <Text
                                fontSize={'1rem'}
                                fontWeight={'700'}
                                lineHeight={'140%'}
                                letterSpacing={'0.0015rem'}
                              >
                                {name}
                              </Text>
                              <Text
                                fontSize={'1rem'}
                                fontWeight={'400'}
                                lineHeight={'140%'}
                                letterSpacing={'0.01rem'}
                              >
                                {x_tag}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
            </Box>

            {/* Join Discord */}
            <JoinDiscordSection />

            <Grid
              mt={'5rem'}
              gridTemplateColumns={{ lg: '35% 55%' }}
              gap={{ lg: '10rem' }}
              p={{ lg: '2.5rem', md: '1.5rem' }}
            >
              <GridItem
                display={'flex'}
                flexDirection={{ lg: 'column', base: 'row' }}
                textAlign={{ lg: 'left', base: 'unset' }}
                alignItems={{ lg: 'unset', base: 'center' }}
                justifyContent={{ lg: 'unset', base: 'space-between' }}
                gap={{ lg: '3rem', base: 'unset' }}
                mx={'auto'}
              >
                <Text
                  fontSize={{ lg: '2.25rem', md: '1.5rem', base: '1.25rem' }}
                  fontWeight={'700'}
                  lineHeight={{ lg: '3.15rem' }}
                >
                  Frequently Asked Questions
                </Text>
                <Box
                  w={{ lg: '20.6875rem', base: '6.5rem' }}
                  height={{ lg: '15.77863rem', base: '4.95763rem' }}
                >
                  <Image src="/images/new/faqDJ.svg" alt="faqDJ" />
                </Box>
              </GridItem>

              <GridItem>
                <Accordion defaultIndex={[0]}>
                  {faqItems.map((item, index) => (
                    <AccordionItem
                      key={index}
                      border="unset"
                      my={'1.25rem'}
                      bg="white"
                    >
                      <h2>
                        <AccordionButton
                          bg="rgba(60, 77, 109, 0.05)"
                          border={'1px solid #3C4D6D'}
                          px={{ lg: '1.5rem', base: '1rem' }}
                          py={'1rem'}
                          borderTopRightRadius={'0.5rem'}
                          borderTopLeftRadius={'0.5rem'}
                        >
                          <Box
                            as="span"
                            flex="1"
                            textAlign="left"
                            fontSize={{ base: '14px', lg: '18px' }}
                            fontWeight="400"
                          >
                            {item.question}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel
                        pb={4}
                        px={'1.5rem'}
                        py={'1rem'}
                        borderRadius={'none'}
                        borderRight={'1px'}
                        borderBottom={'1px'}
                        borderLeft={'1px'}
                        borderColor={'body.color'}
                      >
                        <Text>{item.answer}</Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </GridItem>
            </Grid>
          </Stack>
          {/* footer */}
          <NewFooter />
        </>
      </BodyWrapper>
    </Suspense>
  );
}

export default Homepage;
