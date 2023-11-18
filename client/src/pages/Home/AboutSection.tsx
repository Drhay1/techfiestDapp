import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Text,
  Image,
} from '@chakra-ui/react';

function AboutSection() {
  return (
    <Box
      mt={{ base: '143px', lg: '120px', sm: '80px', md: '100px' }}
      px={{ base: '1rem' }}
      w={{ base: 'full' }}
      maxW={{ lg: '1199px' }}
      mx="auto"
    >
      <Text
        color="ek.primary"
        fontSize={{ base: '24px', lg: '36px', sm: '22px', md: '30px' }}
        textAlign={{
          lg: 'center',
          base: 'left',
        }}
      >
        Benefits of participating in techFiesta Hackathons
      </Text>

      <Grid
        mt={{ base: '58px', lg: '80px', md: '60px' }}
        gridTemplateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gridAutoRows={{
          // md: '400px',
          // sm: '200px',
          base: 'unset',
        }}
        gridTemplateAreas={{
          lg: `'f-left f-right'`,
          md: `'f-left f-right'`,
          base: `'f-right f-right' 'f-left f-left'`,
        }}
        gap="2rem"
        mx={{ lg: '0px', sm: 'none', md: '0px' }}
      >
        <GridItem
          bg="brand.primary"
          gridArea="f-left"
          h={{ base: '186px', md: 'unset' }}
          bgGradient="linear-gradient(rgba(11, 165, 236, 1), rgba(29, 41, 57, 1))"
          borderRadius={'1rem'}
        >
          <Flex
            w={'full'}
            h={'full'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box
              w={{ lg: '300px', base: '186px' }}
              h={{ lg: '300px', base: '186px' }}
              overflow={'hidden'}
            >
              <Image
                src="/images/grants.svg"
                alt="techFiesta"
                w="full"
                h="full"
                objectFit={'contain'}
              />
            </Box>
          </Flex>
        </GridItem>

        <GridItem pl={{ lg: '60px' }} py={{ lg: '60px' }} gridArea="f-right">
          <Text
            fontWeight={'bold'}
            fontSize={{ lg: '25px', sm: '18px', md: '22px' }}
            px={{ lg: 'none', sm: 'none', md: 'none' }}
            mb="32px"
            color="brand.primary"
          >
            Grants and Support from Hackathon Sponsors
          </Text>

          <Text
            fontSize={{ lg: '20px', sm: '15px', md: '18px' }}
            px={{ lg: 'none', sm: 'none', md: 'none' }}
            color="black"
          >
            Receive grants and support from hackathon sponsors as you work on
            building groundbreaking projects. You can get financial backing and
            guidance from companies that recognize and value your
            entrepreneurial spirit.
          </Text>

          <Button
            display={'none'}
            bg="brand.primary !important"
            mt="32px"
            fontSize="16px"
            fontWeight={'semibold'}
            color="white"
            px={'10px'}
            py="4px"
          >
            <Text>Learn how?</Text>
          </Button>
        </GridItem>
      </Grid>

      <Grid
        mt={{ base: '58px', lg: '80px', md: '60px' }}
        gridTemplateColumns={{
          lg: 'repeat(2, 1fr)',
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gridAutoRows={{
          // md: '400px',
          base: 'unset',
        }}
        gridTemplateAreas={{
          lg: `'f-right f-left'`,
          md: `'f-right f-left'`,
          base: `'f-right f-right' 'f-left f-left'`,
        }}
        gap="2rem"
        mx={{ lg: '0px', sm: 'none', md: 'none' }}
      >
        <GridItem
          bg="brand.primary"
          gridArea="f-left"
          h={{ base: '186px', md: 'unset' }}
          bgGradient="linear-gradient(rgba(11, 165, 236, 1), rgba(29, 41, 57, 1))"
          borderRadius={'1rem'}
        >
          <Flex
            w={'full'}
            h={'full'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Box
              w={{ lg: '300px', base: '186px' }}
              h={{ lg: '300px', base: '186px' }}
              overflow={'hidden'}
            >
              <Image
                src="/images/skill.svg"
                alt="techFiesta"
                w="full"
                h="full"
                objectFit={'contain'}
              />
            </Box>
          </Flex>
        </GridItem>
        <GridItem pr={{ lg: '60px' }} py={{ lg: '60px' }} gridArea="f-right">
          <Text
            fontWeight={'bold'}
            fontSize={{ lg: '25px', sm: '18px', md: '22px' }}
            px={{ lg: 'none', sm: 'none', md: 'none' }}
            mb="32px"
            color="brand.primary"
          >
            Access to Upskilling Opportunities
          </Text>

          <Text
            fontSize={{ lg: '20px', sm: '15px', md: '18px' }}
            px={{ lg: 'none', sm: 'none', md: 'none' }}
            color="black"
          >
            As a member of techFiesta, you gain access to a wealth of upskilling
            opportunities, including educational workshops, seminars, and
            events, enabling you to stay ahead of the curve in the ever-evolving
            tech landscape.
          </Text>

          <Button
            display={'none'}
            bg="brand.primary !important"
            mt="32px"
            fontSize="16px"
            fontWeight={'semibold'}
            color="white"
            px={'10px'}
            py="4px"
          >
            <Text>Learn how?</Text>
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default AboutSection;
