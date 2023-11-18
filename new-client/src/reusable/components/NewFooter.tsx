import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { ExternalLink, InternalLink } from '../../utils/Link';

function NewFooter() {
  const footerLinks = [
    {
      name: 'TG',
      link: 'https://t.me/+R2dFGg-iB5NlYzg0',
      img: 'telegram.svg',
    },
    {
      name: 'Ds',
      link: 'https://discord.gg/xn8XbxXem9',
      img: 'discord.svg',
    },
    {
      name: 'X',
      link: 'https://twitter.com/techFiesta_hack',
      img: 'x.svg',
    },
    {
      name: 'YT',
      link: 'https://youtube.com/@techFiesta_hack',
      img: 'youtube.svg',
    },
    {
      name: 'LN',
      link: 'https://www.linkedin.com/company/techfiesta/',
      img: 'linkedin.svg',
    },
    {
      name: 'HN',
      link: 'https://techfiestablog.hashnode.dev/',
      img: 'hashnode.svg',
    },
  ];

  return (
    <Box
      borderRadius={{ lg: '1.5rem' }}
      bg={'#FFFFFF'}
      boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25)'}
      backdropFilter={'blur(20px)'}
      mt={'5rem'}
      mb={{ base: '0rem', md: '2rem' }}
      w="full"
    >
      <Flex pt={'4.5rem'} flexDirection={'column'} alignItems={'center'}>
        <InternalLink to="/">
          <Flex alignItems={'center'}>
            <Box w={{ base: '2rem' }} h={{ base: '2rem' }} mr="4px">
              <Image
                w="full"
                h="full"
                cursor={'pointer'}
                src={'/images/new/logo.png'}
              />
            </Box>
            <Text
              fontSize={{ base: '22.67px', lg: '1.5rem' }}
              fontWeight={'500'}
            >
              tech
            </Text>

            <Text
              display={'inline'}
              fontSize={{ base: '22.67px', lg: '1.5rem' }}
              fontWeight={'500'}
              color={'#0F5EFE'}
            >
              Fiesta
            </Text>
          </Flex>
        </InternalLink>
        <Box>
          <Text
            mt="1rem"
            fontSize={{ lg: '1rem', base: '0.75rem' }}
            fontWeight={'400'}
            textAlign={'center'}
          >
            Connect with us on social media
          </Text>

          <Flex
            w="full"
            gap={{ base: '1rem' }}
            alignItems={'center'}
            justifyContent={'center'}
            mt="1rem"
            mx="auto"
          >
            {footerLinks.map(({ link, img, name }) => (
              <ExternalLink href={link}>
                <Box key={link} w={{ base: '25px' }} h={{ base: '25px' }}>
                  <Image src={`/icons/${img}`} alt={name} />
                </Box>
              </ExternalLink>
            ))}
          </Flex>
        </Box>

        <Flex
          gap={{ base: '1rem', lg: '3rem' }}
          fontSize={{ lg: '1rem', base: '0.75rem' }}
          justifyContent={'center'}
          flexWrap={'wrap'}
          mt={'3.25rem'}
          mx="auto"
          w="full"
        >
          <InternalLink to="/hackathons">
            <Text>techFiesta's</Text>
          </InternalLink>
          <InternalLink to="/terms-and-conditions">
            <Text>Terms and conditions</Text>
          </InternalLink>
          <InternalLink to="/client-signup">
            <Text>Create techFiesta's</Text>
          </InternalLink>
          <InternalLink to="/imprint">
            <Text>Imprint</Text>
          </InternalLink>
        </Flex>
      </Flex>
      <Flex
        bg={'#3C4D6D0D'}
        mt={'2rem'}
        w={'full'}
        p={'1rem'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Text
          textAlign={'center'}
          fontSize={{ lg: '1rem', base: '0.75rem' }}
          fontWeight={'400'}
        >
          &copy; 2023 All rights reserved, techFiesta
        </Text>
      </Flex>
    </Box>
  );
}

export default NewFooter;
