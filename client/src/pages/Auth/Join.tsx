import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import BodyWrapper from '../../reusable/components/BodyWrapper';
import { lazy, useState } from 'react';
import { InternalLink } from '../../utils/Link';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Role, UserStateProps } from '../../store/interfaces/user.interface';
import ConditionalRoute from '../../routes/ConditionalRoute';
import { HomeNavbar } from '../../reusable/components';

const MetaTags = lazy(() => import('../../reusable/components/MetaTags'));

/*========================= User SingUp function =========================*/
function Join() {
  const navigate = useNavigate();
  const [joiningAs, setJoiningAs] = useState<string | null>(null);
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  /*========================= choose identity condition statement =========================*/
  const onChoose = () => {
    if (joiningAs === 'client') {
      navigate('/client-signup', { replace: true });
    } else if (joiningAs === 'participant') {
      navigate('/user-signup', { replace: true });
    }
  };

  return (
    /*========================= Join page =========================*/
    <ConditionalRoute
      redirectTo="/adashboard"
      condition={
        userSlice.user &&
        userSlice.user.isVerified &&
        userSlice.isAuthenticated &&
        userSlice.user.roles.includes(Role.Admin)
          ? false
          : true
      }
    >
      <ConditionalRoute
        redirectTo="/cdashboard"
        condition={
          userSlice.user &&
          userSlice.user.isVerified &&
          userSlice.isAuthenticated &&
          userSlice.user.roles.includes(Role.Client)
            ? false
            : true
        }
      >
        <ConditionalRoute
          redirectTo="/dashboard"
          condition={
            userSlice.user &&
            userSlice.user.isVerified &&
            userSlice.isAuthenticated &&
            userSlice.user.roles.includes(Role.User)
              ? false
              : true
          }
        >
          <>
            <MetaTags
              title={'Register'}
              description={
                'Participate in hackathons where developers thrive, ideas flourish, and success begins'
              }
              pageUrl={window.location.href}
            />
            <HomeNavbar />
            <BodyWrapper>
              <>
                <Box
                  w={{ base: '100%', md: '60%' }}
                  mx="auto"
                  bg="white"
                  p={{ lg: '40.5px' }}
                  borderColor={{ md: 'brand.primary' }}
                  borderWidth={{ md: '1px' }}
                  mt={{ base: '9rem', lg: '8rem' }}
                  borderRadius={{ md: '20px', base: 'none' }}
                >
                  <Text
                    fontSize={{ lg: '36px' }}
                    color="secondary"
                    lineHeight={{ lg: '44px' }}
                    mb={{ lg: '57.6px', sm: '10px' }}
                    textAlign={'center'}
                    fontWeight={'bold'}
                    mt={{ lg: 'none', sm: '16px' }}
                  >
                    Join as a participant or client
                  </Text>

                  <Grid
                    gridTemplateColumns={{ lg: 'repeat(2, 1fr)' }}
                    gap={10}
                    overflow={'hidden'}
                    p={{ lg: 'none', sm: '10px' }}
                  >
                    <GridItem
                      cursor={'pointer'}
                      p={'1rem'}
                      borderWidth={'1px'}
                      borderRadius={'lg'}
                      borderColor={
                        joiningAs === 'client' ? 'brand.primary' : 'none'
                      }
                    >
                      <Box
                        h="full"
                        width={'full'}
                        onClick={() => setJoiningAs('client')}
                      >
                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                        >
                          <Avatar size={{ lg: 'lg' }} src="/images/ic1.svg" />

                          <Checkbox
                            isChecked={joiningAs === 'client' ? true : false}
                            onClick={() => null}
                            borderRadius={'50%'}
                          />
                        </Flex>
                        <Text
                          fontSize={{ lg: '24px' }}
                          lineHeight={{ lg: '32px' }}
                          color="black"
                          mt={{ lg: '20px' }}
                        >
                          I’m a Client, I want to organize a hackathon
                        </Text>
                      </Box>
                    </GridItem>

                    <GridItem
                      cursor={'pointer'}
                      p={'1rem'}
                      borderWidth={'1px'}
                      borderRadius={'lg'}
                      borderColor={
                        joiningAs === 'participant' ? 'brand.primary' : 'none'
                      }
                    >
                      <Box
                        h="full"
                        width={'full'}
                        onClick={() => setJoiningAs('participant')}
                      >
                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                        >
                          <Avatar size={{ lg: 'lg' }} src="/images/ic2.svg" />

                          <Checkbox
                            isChecked={
                              joiningAs === 'participant' ? true : false
                            }
                            onClick={() => null}
                            borderRadius={'md'}
                          />
                        </Flex>
                        <Text
                          fontSize={{ lg: '24px' }}
                          lineHeight={{ lg: '32px' }}
                          color="black"
                          mt={{ lg: '20px', sm: '10px' }}
                        >
                          I’m a Participant, I want to participate in
                          hackathons.
                        </Text>
                      </Box>
                    </GridItem>
                  </Grid>

                  <Flex
                    alignItems={'center'}
                    justifyContent={'center'}
                    mt={{ lg: '50px', sm: '20px' }}
                  >
                    <Button
                      onClick={onChoose}
                      _hover={{
                        bg: 'brand.secondary',
                        color: 'white',
                      }}
                      w={{ lg: '384px', sm: '250px' }}
                      bg={{
                        lg: (joiningAs && 'brand.primary') || 'brand.dark.1000',
                        sm: (joiningAs && 'brand.primary') || 'brand.dark.1000',
                      }}
                      fontSize={{ lg: '14px' }}
                      py={{ lg: '10px', sm: '5px' }}
                      textAlign={'center'}
                      color={(joiningAs && 'gray.100') || 'white'}
                    >
                      {joiningAs ? `Join as a ${joiningAs}` : 'Create Account'}
                    </Button>
                  </Flex>

                  <Text
                    textAlign={'center'}
                    mt={{ lg: '24px', sm: '15px' }}
                    mb={{ lg: 'none', sm: '5px' }}
                  >
                    Already have an account?{' '}
                    <Text display={'inline'} fontWeight={'bold'}>
                      <InternalLink to="/login"> Log In</InternalLink>
                    </Text>
                  </Text>
                </Box>
              </>
            </BodyWrapper>
          </>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default Join;
