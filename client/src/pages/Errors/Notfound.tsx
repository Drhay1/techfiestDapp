import {
  Box,
  Button,
  Image,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
} from '@chakra-ui/react';
import BodyWrapper from '../../reusable/components/BodyWrapper';
import { InternalLink } from '../../utils/Link';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Role, UserStateProps } from '../../store/interfaces/user.interface';
import { MetaTags } from '../../reusable/components';

function Notfound() {
  const navigate = useNavigate();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const onClickGoHome = () => {
    navigate(
      userSlice?.user?.roles.includes(Role.Admin)
        ? '/adashboard'
        : userSlice?.user?.roles.includes(Role.Client)
        ? '/cdashboard'
        : '/dashboard',
      {
        replace: true,
      },
    );
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <BodyWrapper>
        <>
          <MetaTags />
          <Flex
            zIndex={'100'}
            minW="20rem"
            h={{ base: '5rem', md: '64px' }}
            px={{ base: '1rem', md: '2rem' }}
            align="center"
            justify="space-between"
            w={{ base: 'full' }}
            mx={'auto'}
            color="brand.light"
            display={'flex'}
            alignItems={'center'}
            textDecoration={'none'}
            bg="linear-gradient(to bottom, #F0F9FF 0%, #FFFFFF 100%)"
            py={{ base: '2.2rem', md: '18px' }}
          >
            <Box
              w={{ base: 'full', lg: '1199px' }}
              mx="auto"
              boxShadow={'rgba(16, 24, 40, 1)'}
            >
              <Flex alignItems={'center'} w="full">
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
                      fontSize={{ base: '22.67px', lg: '25.53px' }}
                      color="black"
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
              </Flex>
            </Box>
          </Flex>
          <Spacer />
          <Box
            w={{ base: '100%', md: '50%' }}
            mx="auto"
            bg="white"
            p={{ lg: '66.5' }}
            borderWidth={'1px'}
            borderRadius={'1rem'}
            mt={{ lg: '2.5rem' }}
            boxShadow={
              '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;'
            }
          >
            <Grid gridTemplateColumns={'70% 30%'} gap={10} overflow={'hidden'}>
              <GridItem p={'2.5rem'}>
                <Text
                  mt={{ lg: '32px' }}
                  fontSize={{ lg: '24px' }}
                  color="secondary"
                  lineHeight={{ lg: '44px' }}
                  fontWeight={'bold'}
                >
                  This page doesn't exist
                </Text>

                <Text
                  fontSize={{ lg: '14px' }}
                  lineHeight={{ lg: '32px' }}
                  color="black"
                >
                  Please check your URL or return to techFiesta home.
                </Text>
                <Flex
                  alignItems={'center'}
                  w="full"
                  display={'flex'}
                  justify={'space-between'}
                  gap={5}
                  mt="1rem"
                >
                  <Button
                    width={{ base: '50%' }}
                    borderRadius={'50px'}
                    bg="brand.primary"
                    color="white"
                    fontSize={'14px'}
                    fontWeight="medium"
                    isLoading={userSlice?.isLoading}
                    _hover={{
                      bg: 'white',
                      color: 'brand.primary',
                    }}
                    borderWidth={'1px'}
                    borderColor={'brand.primary'}
                    type="submit"
                    onClick={handleGoBack}
                  >
                    Go back
                  </Button>
                  <Button
                    width={{ base: '50%' }}
                    borderRadius={'50px'}
                    bg="white"
                    color="brand.primary"
                    fontSize={'14px'}
                    fontWeight="medium"
                    isLoading={userSlice?.isLoading}
                    _hover={{
                      bg: 'brand.primary',
                      color: 'white',
                    }}
                    borderWidth={'1px'}
                    borderColor={'brand.primary'}
                    type="submit"
                    onClick={onClickGoHome}
                  >
                    Go home
                  </Button>
                </Flex>
              </GridItem>

              <GridItem display={'flex'} justifyContent={'center'} p={'1rem'}>
                <Image src="/images/image404.png" alt="image404" />
              </GridItem>
            </Grid>
          </Box>
        </>
      </BodyWrapper>
    </>
  );
}

export default Notfound;
