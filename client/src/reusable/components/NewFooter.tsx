import BodyWrapper from './BodyWrapper';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { ExternalLink, InternalLink } from '../../utils/Link';

function NewFooter() {
  return (
    <Flex
      h={{ base: '5rem', md: '64px' }}
      align="center"
      justify="space-between"
      w={{ base: 'full', xll: '1440px' }}
      mx={'auto'}
      color="white"
      display={'flex'}
      alignItems={'center'}
      textDecoration={'none'}
      bottom={'0px'}
      mb="50px"
    >
      <BodyWrapper>
        <Box w={{ base: 'full' }} mx="auto">
          <Flex
            zIndex={'100'}
            minW="20rem"
            w="full"
            h="5rem"
            py="1.2rem"
            align="center"
            justify="space-between"
            color="white"
            px={{ base: '1rem', md: 'none' }}
          >
            <InternalLink to="/">
              <Flex alignItems={'center'}>
                <Box w={{ base: '25.53' }} h={{ base: '25.53' }} mr="4px">
                  <Image
                    w="full"
                    h="full"
                    cursor={'pointer'}
                    src={'/images/logo.svg'}
                  />
                </Box>

                <Text
                  fontSize={{ base: '22.67px', lg: '25.53px', sm: '18.35px' }}
                  color="black"
                >
                  tech
                  <Text display={'inline'} color={'brand.primary'}>
                    Fiesta
                  </Text>
                </Text>
              </Flex>
            </InternalLink>

            <Flex
              direction={'row'}
              gap={'10px'}
              ml="2rem"
              alignItems={'center'}
              fontSize={{ base: '14px', lg: '16px' }}
              fontWeight={'bold'}
            >
              <Text color="brand.primary">
                <ExternalLink p={'none'} href="https://discord.gg/xn8XbxXem9">
                  Discord
                </ExternalLink>
              </Text>
              <Text color="brand.primary">
                <ExternalLink
                  p={'none'}
                  href="https://www.linkedin.com/company/techfiesta/"
                >
                  LinkedIn
                </ExternalLink>
              </Text>
              <Text color="brand.primary">
                <ExternalLink
                  p={'none'}
                  href="https://techfiestablog.hashnode.dev/"
                >
                  Hashnode
                </ExternalLink>
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent={'center'} alignItems={'center'}>
            <Text
              fontWeight={'400'}
              fontSize={{ base: '12px', lg: '14px' }}
              color={'brand.secondary'}
            >
              &copy; 2023 All rights reserved, techFiesta
            </Text>
          </Flex>
        </Box>
      </BodyWrapper>
    </Flex>
  );
}

export default NewFooter;
