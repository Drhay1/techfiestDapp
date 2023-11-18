import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { ExternalLink } from '../../utils/Link';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function JoinDiscordSection() {
  return (
    <Box
      minH={{ lg: '17.5rem', md: '14.75rem', base: '12.5rem' }}
      borderRadius={{ base: '0.5rem' }}
      p={{ lg: '25px', base: '1rem' }}
      mt={'5rem'}
      bg={{
        base: `url('/images/new/bg_dj.png') no-repeat`,
      }}
      backgroundSize="cover"
      // bg={'#0F5EFE'}
      position={'relative'}
      // backgroundSize="cover"
      // backgroundPosition="center"
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Flex
        gap={'2.12rem'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text
          fontSize={{ lg: '2.25rem', md: '1.5rem', base: '1.25rem' }}
          fontWeight={'700'}
          color={'#FFFFFF'}
        >
          A thriving community for visionary hackers
        </Text>

        <ExternalLink href="https://discord.gg/xn8XbxXem9">
          <Button
            bg="#FFFFFF"
            color="#0F5EFE"
            fontWeight={'500'}
            fontSize={{ lg: '1rem', base: '0.75rem' }}
            borderRadius={'0.5rem'}
            px={'1.25rem'}
            py={'0.75rem'}
            transition={'all 0.2s ease-in-out'}
            _hover={{ filter: 'brightness(105%)' }}
            borderWidth={'1px'}
            borderColor={'#0F5EFE'}
            rightIcon={<ArrowForwardIcon />}
          >
            Join Discord
          </Button>
        </ExternalLink>
      </Flex>
      <Image
        h={{ lg: 'auto', md: '9rem', base: '5rem' }}
        w={{ lg: 'auto', md: '7rem', base: '5rem' }}
        position={'absolute'}
        src="/images/new/leftDJ.svg"
        alt="discord DJ"
        bottom={'0'}
        right={'0'}
        maxH={'100%'}
        maxW={'100%'}
      />
      {/* </Box> */}
    </Box>
  );
}

export default JoinDiscordSection;
