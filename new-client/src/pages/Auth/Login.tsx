import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
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
import { Formik, Form } from 'formik';
import { LoginSchema } from '../../utils/Yup';
import { lazy, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { FcGoogle } from 'react-icons/fc';
import {
  LoginProps,
  Role,
  UserStateProps,
} from '../../store/interfaces/user.interface';
import ConditionalRoute from '../../routes/ConditionalRoute';
// import { useLocation } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AiOutlineGithub } from 'react-icons/ai';
import LazyLoad from 'react-lazyload';

const MetaTags = lazy(() => import('../../reusable/components/MetaTags'));

/*========================= User Login function =========================*/
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { data: googleApi } = useGetGoogleLinkQuery();
  const dispatch = useDispatch<Dispatch<any>>();

  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const message = searchParams.get('msg');

  /*========================= Google Login function =========================*/
  // const onGoogleLogin = useCallback(() => {
  //   if (googleApi && googleApi.url) {
  //     return (window.location.href = googleApi.url);
  //   }
  // }, []);

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
                {/* <HomeNavbar /> */}

                <Box
                  w={{ base: 'full' }}
                  mx="auto"
                  pb={'3rem'}
                  overflow={'hidden'}
                >
                  <Grid gridTemplateColumns={{ lg: '50% 50%' }} pt={'50px'}>
                    {/*========================= User Login form Container =========================*/}
                    <GridItem
                      display={'flex'}
                      flexDirection={'column'}
                      mx={{ lg: '140px' }}
                      mt={{ lg: '50px' }}
                    >
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
                            {/*========================= Login form =========================*/}
                            <Flex
                              justifyContent={'center'}
                              align={'center'}
                              flexDirection={'column'}
                            >
                              <Flex
                                flexDirection={'column'}
                                w={'131px'}
                                h={'120px'}
                                mb={'8px'}
                                align={'center'}
                              >
                                {/*========================= logo =========================*/}
                                <InternalLink to="/">
                                  <Box w={'40px'} h={'40px'} mb={'23px'}>
                                    <Image
                                      w={'full'}
                                      src="/images/new/logo.png"
                                      alt="Logo"
                                    />
                                  </Box>
                                </InternalLink>

                                {/*========================= heading =========================*/}
                                <Text
                                  color="#3C4D6D"
                                  fontSize="36"
                                  fontWeight="700"
                                  mb={'33px'}
                                >
                                  Log in
                                </Text>
                              </Flex>

                              {/*========================= Dont have and Account, sign up =========================*/}
                              <HStack
                                w={'381px'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                gap={'4px'}
                                display={'inline-flex'}
                                mb={'20px'}
                              >
                                <Text
                                  color="#3C4D6D"
                                  fontSize={'16px'}
                                  fontWeight="400"
                                  letterSpacing="0.16"
                                  align={'center'}
                                >
                                  Don’t have an account?
                                </Text>
                                <InternalLink to="/user-signup">
                                  <Text
                                    color="#0F5EFE"
                                    fontSize={'16px'}
                                    fontWeight={'700'}
                                  >
                                    Sign up here
                                  </Text>
                                </InternalLink>
                              </HStack>

                              {/*========================= SignUp Option Button =========================*/}
                              <Grid
                                gap={'16px'}
                                gridTemplateColumns={'repeat(2, 1fr)'}
                                w={{ md: '440px' }}
                                mx={{ md: 'auto' }}
                                display="none"
                              >
                                <GridItem>
                                  {/*========================= Sign Up with Github =========================*/}
                                  <Button
                                    w={{ base: '100%' }}
                                    leftIcon={<Icon as={AiOutlineGithub} />}
                                    variant="solid"
                                    bg="white"
                                    color="brand.tertiary"
                                    borderWidth={'1px'}
                                    borderColor={'brand.tertiary'}
                                  >
                                    Github
                                  </Button>
                                </GridItem>
                                <GridItem>
                                  {/*========================= SignUp with Google =========================*/}
                                  <Button
                                    w="full"
                                    leftIcon={<Icon as={FcGoogle} />}
                                    variant="solid"
                                    bg="white"
                                    color="brand.tertiary"
                                    borderWidth={'1px'}
                                    borderColor={'brand.tertiary'}
                                  >
                                    Github
                                  </Button>
                                </GridItem>
                              </Grid>

                              {/*========================= Divider for Alternative Login =========================*/}
                              <HStack
                                w={{ lg: '440px', md: '440px', base: '324px' }}
                                h={'17'}
                                mt={'20px'}
                                mb={'20px'}
                                alignItems={'center'}
                                gap={'16px'}
                                // display={'inline-flex'}
                                justifyContent={'center'}
                                display="none"
                              >
                                <Divider
                                  orientation="horizontal"
                                  size={'198px'}
                                  color={'#3C4D6D'}
                                  variant={'solid'}
                                />
                                <Text
                                  color={'#3C4D6D'}
                                  fontSize={'16px'}
                                  fontWeight={'500'}
                                  letterSpacing={'0.02'}
                                >
                                  or
                                </Text>
                                <Divider
                                  orientation="horizontal"
                                  size={'198px'}
                                  color={'#3C4D6D'}
                                  variant={'solid'}
                                />
                              </HStack>

                              {/*========================= Form Details =========================*/}

                              <Box w={{ lg: '440px', md: '440px' }}>
                                {/* {message ? (
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
                                ) : null} */}

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
                                <FormControl mt="1rem">
                                  <FormLabel
                                    mb={'4px'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={'10px'}
                                    display={'inline-flex'}
                                    fontSize={'16px'}
                                    fontWeight={'500'}
                                    color={'#3C4D6D'}
                                    placeholder="your@email.com"
                                  >
                                    Email
                                  </FormLabel>
                                  <Input
                                    onChange={(e) =>
                                      setFieldValue('email', e.target.value)
                                    }
                                    px={'12px'}
                                    py={'18px'}
                                    border={'1px'}
                                    borderRadius={'8px'}
                                    w={{
                                      lg: '440px',
                                      md: '440px',
                                      base: 'full',
                                    }}
                                    h={'48px'}
                                    type="email"
                                    placeholder="Your email address"
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
                                </FormControl>

                                <FormControl mt="1rem">
                                  <FormLabel
                                    mb={'4px'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={'10px'}
                                    display={'inline-flex'}
                                    fontSize={'16px'}
                                    fontWeight={'500'}
                                    color={'#3C4D6D'}
                                  >
                                    Password
                                  </FormLabel>

                                  <InputGroup>
                                    <Input
                                      px={'12px'}
                                      py={'18px'}
                                      border={'1px'}
                                      borderRadius={'8px'}
                                      type={showPassword ? 'text' : 'password'}
                                      value={values['password']}
                                      w={{
                                        lg: '440px',
                                        md: '440px',
                                        base: '324px',
                                      }}
                                      onChange={(e) =>
                                        setFieldValue(
                                          'password',
                                          e.target.value,
                                        )
                                      }
                                      h={'48px'}
                                      placeholder="***********"
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
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
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
                                </FormControl>
                              </Box>
                              <HStack
                                mt={'2rem'}
                                gap={{ lg: '80px', base: '50px', md: '80px' }}
                                w={{ lg: '440px', md: '440px', base: '324px' }}
                                h={'20px'}
                              >
                                <Checkbox
                                  w={{
                                    lg: '227px',
                                    md: '227px',
                                    base: '180px',
                                  }}
                                  justifyContent={'flex-start'}
                                  alignItems={'center'}
                                  gap={'2'}
                                  display={'inline-flex'}
                                >
                                  Keep me logged in
                                </Checkbox>

                                <Text
                                  fontSize={{
                                    lg: '12px',
                                    md: '12px',
                                    base: '10px',
                                  }}
                                  fontWeight={'500'}
                                  color={'#3C4D6D'}
                                >
                                  <InternalLink to="/recover-password">
                                    Forgot password?
                                  </InternalLink>
                                </Text>
                              </HStack>

                              <Button
                                bg="brand.primary"
                                w={{ lg: '440px', md: '440px', base: '324px' }}
                                h={'48px'}
                                mt={'17px'}
                                mb={'16px'}
                                color={'white'}
                                _hover={{
                                  backgroundColor: 'white',
                                  color: 'brand.primary',
                                  borderWidth: '1px',
                                  borderColor: 'brand.primary',
                                }}
                                type="submit"
                                isLoading={userSlice?.loggin}
                              >
                                Login
                              </Button>
                            </Flex>
                          </Form>
                        )}
                      </Formik>
                    </GridItem>

                    {/*========================= User Onboarding Display =========================*/}
                    <GridItem
                      display={{ lg: 'flex', base: 'none', md: 'flex' }}
                      justifyContent={'center'}
                      p={{ lg: '2rem', md: '1.5rem' }}
                      h={{ r: '719px' }}
                    >
                      <Flex
                        bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 100%)"
                        boxShadow="0px 3px 4px rgba(60, 77, 109, 0.25)"
                        borderRadius="40"
                        flexDirection={'column'}
                        justifyContent={'center'}
                        align={'center'}
                        w={{ lg: '670px', md: '635px' }}
                      >
                        <Box pt={'79px'} px={'160px'} pb={'40px'}>
                          <LazyLoad offset={100}>
                            <Image
                              src="/images/new/logindj.svg"
                              alt="LoginDJ"
                            />
                          </LazyLoad>
                        </Box>

                        <Flex
                          flexDirection={'column'}
                          justifyContent={'center'}
                          align={'center'}
                          px={'88px'}
                          pb={'49px'}
                        >
                          <Text
                            textAlign="center"
                            color="#3C4D6D"
                            fontSize="36"
                            fontWeight="700"
                          >
                            Ease Of Use{' '}
                          </Text>
                          <Text
                            color="#3C4D6D"
                            fontSize="20"
                            fontWeight="400"
                            letterSpacing="0.03"
                            textAlign="center"
                          >
                            This feature streamlines the communication process
                            and provides a secure environment for discussions,
                            provides a secure{' '}
                          </Text>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Box>

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
