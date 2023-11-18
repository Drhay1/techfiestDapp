import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { InternalLink } from '../../utils/Link';

const HeroSection = () => {
  const faces = [
    { img: 'mask1.svg' },
    { img: 'mask2.svg' },
    { img: 'mask3.svg' },
    { img: 'mask4.svg' },
    { img: 'mask5.svg' },
  ];

  const renderFaces = () => {
    const maxIndex = faces.length - 1;
    const translationBase = 40 * Math.floor(maxIndex / 2);

    return faces.map(({ img }, index) => {
      const translation =
        index <= Math.floor(maxIndex / 2)
          ? index * 40
          : (maxIndex - index) * 40;

      const gridItemStyle = {
        transform: `translateY(${translation - translationBase}px)`,
      };

      return (
        <GridItem key={index} style={gridItemStyle}>
          <Avatar
            name="techFiesta"
            src={`/images/${img}`}
            size={index === Math.floor(maxIndex / 2) ? '2xl' : 'xl'}
          />
        </GridItem>
      );
    });
  };

  const memoizedRenderFaces = useMemo(() => {
    return renderFaces();
  }, []);

  return (
    <Box
      mt={{ lg: '5rem' }}
      textAlign={'center'}
      minH={{ base: '100vh', md: '600px' }}
      pt={{ lg: '5rem', sm: '10rem' }}
      w={{ base: 'full' }}
    >
      <Text fontSize={{ lg: '80px', md: '50px', sm: '45px' }}>
        Join a virtual{' '}
        <Text color="black" display={'inline'}>
          tech
          <Text
            display={'inline'}
            color={'linear-gradient(to right, red , yellow)'}
            bgGradient="linear(99.72deg, #2C69D1 7.35%, #0ABCF9 86.94%)"
            bgClip="text"
            fontWeight="bold"
          >
            Fiesta
          </Text>
        </Text>
      </Text>
      <Box maxW={{ lg: '700px', sm: '300px', md: '500px' }} mx="auto" mt="32px">
        <Text
          fontSize={{ lg: '20px', md: '16px', sm: '19px' }}
          fontWeight={{ lg: '500' }}
        >
          Participate in hackathons where developers thrive, ideas flourish, and
          success begins
        </Text>
      </Box>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        flexDir={{ lg: 'row', sm: 'column', md: 'row' }}
        gap={'1rem'}
        my="2rem"
      >
        <Button bg={'brand.primary !important'} color="white">
          <InternalLink to="/login">For Participants</InternalLink>
        </Button>

        <Button
          color={'brand.primary'}
          borderWidth={'1px'}
          bg="white"
          borderColor={'brand.primary'}
          _hover={{
            bgColor: 'white',
          }}
        >
          <InternalLink to="/client-signup">For Organizations</InternalLink>
        </Button>
      </Flex>
      <Grid
        gridTemplateColumns={'repeat(5, 1fr)'}
        gap={'1rem'}
        mt="8rem"
        display={{ lg: 'grid', sm: 'none', md: 'grid' }}
        w={{ lg: '1080px', md: '768px', base: 'full' }}
        mx="auto"
      >
        {memoizedRenderFaces}
      </Grid>
    </Box>
  );
};

export default HeroSection;
