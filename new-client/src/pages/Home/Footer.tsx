import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { ExternalLink, InternalLink } from '../../utils/Link';
import MiniWrapper from '../../reusable/styled/MiniWrapper';

const Footer = () => {
  return (
    <Box
      mt={{ base: '49px', lg: '120px' }}
      minH="539px"
      bg="brand.secondary"
      px={{ base: '1rem' }}
    >
      <MiniWrapper>
        <Grid
          gridTemplateColumns={{ lg: '70% 30%' }}
          h="full"
          gridTemplateAreas={{
            lg: `'s-left s-right'`,
            base: `'s-right s-right' 's-left s-left'`,
          }}
          pt={{ lg: '87px' }}
        >
          <GridItem gridArea={'s-left'}>
            <Box w={{ lg: '380px' }}>
              <InternalLink to="/">
                <Flex alignItems={'center'}>
                  <Box w={{ base: '25.53' }} h={{ base: '25.53' }} mr="4px">
                    <Image
                      w="full"
                      h="full"
                      cursor={'pointer'}
                      src={'/images/logo.png'}
                    />
                  </Box>
                  <Text
                    fontSize={{ base: '22.67px', lg: '25.53px' }}
                    color="white"
                  >
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
                </Flex>
              </InternalLink>
              <Text color="white" mt="1rem">
                World's first blockchain hackathon platform
              </Text>
            </Box>
          </GridItem>
          <GridItem
            gridArea={'s-right'}
            pt={{ base: '65px', lg: '115px' }}
            mb={{ base: '67px' }}
            pb="2rem"
            textAlign={'end'}
          >
            <Grid
              gridTemplateColumns={'repeat(5, 1fr)'}
              justifyContent={'space-between'}
            >
              <GridItem h="40px" w="40px">
                <ExternalLink href="https://t.me/+R2dFGg-iB5NlYzg0">
                  <Image
                    w="full"
                    h="full"
                    src="/icons/telegramW.svg"
                    title="Telegram"
                    alt="Telegram"
                  />
                </ExternalLink>
              </GridItem>
              <GridItem h="40px" w="40px">
                <ExternalLink href="https://discord.gg/xn8XbxXem9">
                  <Image
                    src="/icons/discordWhite.svg"
                    alt="Discord"
                    w="full"
                    h="full"
                  />
                </ExternalLink>
              </GridItem>
              <GridItem h="40px" w="40px">
                <ExternalLink href="https://youtube.com/@techFiesta_hack">
                  <Image
                    src="/icons/youtube.svg"
                    alt="YT"
                    title="Youtube"
                    w="full"
                    h="full"
                  />
                </ExternalLink>
              </GridItem>
              <GridItem h="40px" w="40px">
                <ExternalLink href="https://www.linkedin.com/company/techfiesta/">
                  <Image
                    src="/icons/linkedinWhite.svg"
                    alt="LN"
                    title="LinkedIn"
                    w="full"
                    h="full"
                  />
                </ExternalLink>
              </GridItem>
              <GridItem h="40px" w="40px">
                <ExternalLink href="https://techfiestablog.hashnode.dev/">
                  <Image
                    src="/icons/hashnode.svg"
                    alt="HN"
                    title="Hashnode"
                    w="full"
                    h="full"
                  />
                </ExternalLink>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>

        <Flex
          mt={{ base: '54px', lg: '89px' }}
          pb={{ lg: '82px', base: '65px' }}
          justifyContent={{ lg: 'space-between' }}
          gap={{
            base: '18px',
            lg: 'unset',
          }}
          flexDirection={{ base: 'column', lg: 'row' }}
          fontSize="12px"
          color="white"
        >
          <InternalLink to="/terms-and-conditions">
            <Text>Terms and conditions</Text>
          </InternalLink>
          <InternalLink to="/imprint">
            <Text>Imprint</Text>
          </InternalLink>
          <Text>
            Runs on the{' '}
            <ExternalLink href="https://www.humanprotocol.org/">
              <Text display={'inline'} fontWeight={'bold'}>
                Human Protocol
              </Text>
            </ExternalLink>
          </Text>
        </Flex>
      </MiniWrapper>
    </Box>
  );
};

export default Footer;
