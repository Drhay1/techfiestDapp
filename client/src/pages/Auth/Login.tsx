import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  login,
  resetRegErrMsg,
  resetRegistered,
  resetUser,
} from '../../store/slices/userSlice';
import BodyWrapper from '../../reusable/components/BodyWrapper';
import { InternalLink } from '../../utils/Link';
import Google from '../../assets/icons/Google';
import { Formik, Form } from 'formik';
import { AuthInput } from '../../reusable/styled';
import { LoginSchema } from '../../utils/Yup';
import { useGetGoogleLinkQuery } from '../../store/slices/api';
import { lazy, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import {
  LoginProps,
  Role,
  UserStateProps,
} from '../../store/interfaces/user.interface';
import ConditionalRoute from '../../routes/ConditionalRoute';
import { useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { HomeNavbar } from '../../reusable/components';

const MetaTags = lazy(() => import('../../reusable/components/MetaTags'));

/*========================= User Login function =========================*/
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: googleApi } = useGetGoogleLinkQuery();
  const dispatch = useDispatch<Dispatch<any>>();

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get('msg');

  /*========================= Google Login function =========================*/
  const onGoogleLogin = useCallback(() => {
    if (googleApi && googleApi.url) {
      return (window.location.href = googleApi.url);
    }
  }, []);

  /*========================= User Login callback function =========================*/
  const onLogin = useCallback((props: LoginProps) => {
    return dispatch(login(props));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    dispatch(resetUser());
  }, []);

  useEffect(() => {
    dispatch(resetRegistered());
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === 'LOGIN_ERROR') {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }

    if (userSlice.user && !userSlice.user?.isVerified) {
      onOpen();
      setTimeout(() => {
        dispatch(resetUser());
      }, 10000);
    }
  }, [userSlice.user, userSlice.user]);

  return (
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
            <BodyWrapper>
              <>
                <MetaTags
                  title={'Login'}
                  description={
                    'Participate in hackathons where developers thrive, ideas flourish, and success begins'
                  }
                  pageUrl={window.location.href}
                />
                <HomeNavbar />
                <Flex
                  flexDir="column"
                  mt={{ base: '9rem', lg: '8rem' }}
                  mx={{ base: 'auto' }}
                  px={{ base: '1rem', md: 'unset' }}
                >
                  <Box
                    mx="auto"
                    bg="white"
                    borderColor={'brand.primary'}
                    borderWidth={'1px'}
                    w="full"
                    borderRadius={'20px'}
                    px={{ lg: '64px', base: '1rem' }}
                  >
                    <Text
                      mt={{ lg: '32px', base: '1rem' }}
                      fontSize={{ lg: '24px' }}
                      color="secondary"
                      lineHeight={{ lg: '44px' }}
                      mb={{ lg: '2rem', base: '1rem' }}
                      textAlign={'center'}
                      fontWeight={'bold'}
                    >
                      Log in to techFiesta
                    </Text>

                    {/*========================= User Login form =========================*/}
                    <Formik
                      initialValues={{
                        email: '',
                        password: '',
                        loginAlways: false,
                      }}
                      validationSchema={LoginSchema}
                      onSubmit={(values) => {
                        onLogin(values);
                      }}
                    >
                      {({ errors, values, setFieldValue }) => (
                        <Form>
                          {message ? (
                            <Alert
                              alignItems={'center'}
                              borderRadius={'0.2rem'}
                              mb={'0.4rem'}
                              padding={'0.2rem'}
                              fontSize={'14px'}
                              status="success"
                            >
                              <AlertIcon />
                              {message}
                            </Alert>
                          ) : null}

                          {userSlice.errMsg &&
                          userSlice.errMsg.Id === 'LOGIN_ERROR' ? (
                            <Alert
                              alignItems={'center'}
                              borderRadius={'0.2rem'}
                              mb={'0.4rem'}
                              padding={'0.2rem'}
                              fontSize={'14px'}
                              status="error"
                            >
                              <AlertIcon />
                              {userSlice.errMsg.msg}
                            </Alert>
                          ) : null}
                          <Flex flexDir={'column'} marginBottom="1rem" w="full">
                            <Text
                              color={'black'}
                              fontSize="0.8rem"
                              fontWeight={'medium'}
                            >
                              Email address
                            </Text>
                            <AuthInput
                              name="email"
                              type="email"
                              value={values['email']}
                              onChange={(e) =>
                                setFieldValue('email', e.target.value)
                              }
                              placeholder="Enter your email"
                            />

                            {errors && errors.email ? (
                              <Text
                                fontSize={'12px'}
                                mt="0.2rem"
                                color="brand.danger"
                              >
                                {errors.email}
                              </Text>
                            ) : null}
                          </Flex>
                          <Flex flexDir={'column'} marginBottom="1rem" w="full">
                            <Text
                              color={'black'}
                              fontSize="0.8rem"
                              fontWeight={'medium'}
                            >
                              Password
                            </Text>
                            <InputGroup>
                              <AuthInput
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values['password']}
                                onChange={(e) =>
                                  setFieldValue('password', e.target.value)
                                }
                                placeholder={
                                  showPassword
                                    ? 'Enter your password'
                                    : '********'
                                }
                              />
                              <InputRightElement h={'100%'}>
                                <IconButton
                                  icon={
                                    showPassword ? (
                                      <ViewOffIcon />
                                    ) : (
                                      <ViewIcon />
                                    )
                                  }
                                  variant={'ghost'}
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={
                                    showPassword
                                      ? 'Hide Password'
                                      : 'Show Password'
                                  }
                                  h={'100%'}
                                />
                              </InputRightElement>
                            </InputGroup>
                            {errors && errors.password ? (
                              <Text
                                fontSize={'12px'}
                                mt="0.2rem"
                                color="brand.danger"
                              >
                                {errors.password}
                              </Text>
                            ) : null}
                          </Flex>
                          <Flex
                            mt="1rem"
                            alignItems={'center'}
                            justifyContent={'space-between'}
                          >
                            <Flex alignItems={'center'}>
                              <Checkbox
                                isChecked={values['loginAlways']}
                                onChange={(e) =>
                                  setFieldValue('loginAlways', e.target.checked)
                                }
                                borderRadius={'md'}
                                mr="0.5rem"
                              />
                              <Text
                                color={'black'}
                                fontSize="0.8rem"
                                fontWeight={'medium'}
                              >
                                Keep me logged in
                              </Text>
                            </Flex>

                            <Text display={'inline'}>
                              <InternalLink to="/recover-password">
                                Forgot password
                              </InternalLink>{' '}
                            </Text>
                          </Flex>
                          <Flex alignItems={'center'} mt="1rem">
                            <Button
                              width={{ base: '100%' }}
                              borderRadius={'50px'}
                              bg="brand.primary"
                              color="white"
                              fontSize={'14px'}
                              fontWeight="medium"
                              isLoading={userSlice?.loggin}
                              _hover={{
                                bg: 'ek.secondary',
                                color: 'ek.primary',
                              }}
                              _active={{ bg: 'ek.btnGrad2' }}
                              type="submit"
                            >
                              Sign me in
                            </Button>
                          </Flex>
                          <Flex alignItems={'center'} justifyContent={'center'}>
                            <Button
                              display={'none'}
                              bg="unset"
                              w="full"
                              borderWidth={'1px'}
                              borderRadius={'8px'}
                              borderColor={'brand.secondary'}
                              _hover={{
                                bg: 'unset',
                              }}
                              fontSize={{ lg: '14px' }}
                              py={{ lg: '10px' }}
                              textAlign={'center'}
                              leftIcon={<Google />}
                              onClick={onGoogleLogin}
                            >
                              Sign in with Google
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>

                    <Text textAlign={'center'} mt={'2rem'} mb="1rem">
                      Don't have an techFiesta account?{' '}
                      <Text display={'inline'} fontWeight={'bold'}>
                        <InternalLink to="/join">Sign up here</InternalLink>
                      </Text>
                    </Text>
                  </Box>
                </Flex>

                {/*================ Modal alert to notify user to go verify account ================*/}
                {userSlice.user && !userSlice.user.isVerified && (
                  <Modal isOpen={isOpen} onClose={handleClose} size={'xl'}>
                    <ModalOverlay />
                    <ModalContent borderRadius={'lg'}>
                      <ModalCloseButton
                        color="white"
                        boxShadow={'unset'}
                        outline={'unset'}
                      />
                      <ModalBody>
                        <Flex
                          direction={'column'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <Box w="50px" h="50px">
                            <Image src="/images/ladyr.svg" h="full" w="full" />
                          </Box>

                          <Text
                            mt="1rem"
                            fontWeight={{ lg: '700' }}
                            fontSize={{ lg: '24px' }}
                          >
                            Verify Your Account
                          </Text>

                          <Text my="1rem" fontSize={{ lg: '16px' }}>
                            We’ve sent an email to{' '}
                            <Text display={'inline'} fontWeight={'bold'}>
                              {userSlice.user?.email}
                            </Text>
                            . Follow the steps provided in the email to verify
                            your account.
                          </Text>
                        </Flex>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                )}
              </>
            </BodyWrapper>
          </>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default Login;
