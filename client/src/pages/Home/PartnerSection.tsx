import { Box, Text, Image } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

type PartnersProps = {
  logo: string;
  label: string;
};

function PartnerSection() {
  const partners: PartnersProps[] = [
    {
      logo: '/icons/partners/HumanProtocol.svg',
      label: 'Human Protocol logo',
    },
    {
      logo: '/icons/partners/AlephZero.svg',
      label: 'AlephZero logo',
    },
    {
      logo: '/icons/partners/TheHub.svg',
      label: 'TheHub logo',
    },
    {
      logo: '/icons/partners/Celo.svg',
      label: 'Celo logo',
    },
    {
      logo: '/icons/partners/Bunzz.svg',
      label: 'Bunzz logo',
    },
    {
      logo: '/icons/partners/Concordium.svg',
      label: 'Concordium logo',
    },
    {
      logo: '/icons/partners/Gnosis.svg',
      label: 'Gnosis logo',
    },
  ];

  const doubledPartners: PartnersProps[] = [...partners, ...partners];

  const swiperBreakpoints = {
    300: { slidesPerView: 1.5, spaceBetween: 10 },
    750: { slidesPerView: 3, spaceBetween: 20 },
    1280: { slidesPerView: 4 },
  };

  const autoplaySettings = {
    delay: 2000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  return (
    <Box
      borderRadius={{ base: 'none', lg: '0.5rem' }}
      mt={{ lg: '120px', md: '150px' }}
      w={{ base: 'full' }}
      maxW={{ lg: '1199px' }}
      mx="auto"
      boxShadow={
        '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;'
      }
      py={{ sm: '2rem' }}
    >
      <Text
        fontSize={{ lg: '24px', sm: '18px', md: '30px' }}
        mb="2rem"
        textAlign={'center'}
      >
        Brands we are collaborating with
      </Text>

      <Swiper
        breakpoints={swiperBreakpoints}
        slidesPerView={4}
        loop={true}
        autoplay={autoplaySettings}
        speed={2000}
        modules={[Autoplay]}
      >
        {doubledPartners.map(({ logo, label }, index) => (
          <SwiperSlide key={index}>
            <Box
              minH={{ lg: '10vh', sm: '8vh', md: '10vh' }}
              h={{ lg: '80px', sm: '65px', md: '100px' }}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Image
                src={logo}
                cursor={'pointer'}
                h={{ base: 'full' }}
                m="10px"
                w={{ lg: '100%', sm: 'full', md: 'full' }}
                objectFit="none"
                alt={label}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default PartnerSection;
