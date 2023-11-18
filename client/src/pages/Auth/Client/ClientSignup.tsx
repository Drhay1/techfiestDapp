import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
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
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { InternalLink } from '../../../utils/Link';
import Google from '../../../assets/icons/Google';
import { Formik, Form } from 'formik';
import { AuthInput } from '../../../reusable/styled';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetRegErrMsg,
  resetRegistered,
  resetUser,
  signupClient,
} from '../../../store/slices/userSlice';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import ConditionalRoute from '../../../routes/ConditionalRoute';
// import { HomeNavbar, MetaTags } from '../../../reusable/components';
import { ClientSignupSchema } from '../../../utils/Yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export interface ClientSignupProps {
  email: string;
  password: string;
  cpassword: string;
  agree: boolean;
}

/*================ ClientSignup function ================*/
function ClientSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<any>();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClose = useCallback(() => {
    onClose();
    dispatch(resetRegistered());
    dispatch(resetUser());
  }, []);

  const onRegister = useCallback((props: ClientSignupProps) => {
    return dispatch(signupClient(props));
  }, []);

  useEffect(() => {
    dispatch(resetRegistered());
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === 'CLIENT_REGISTER_ERROR') {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }

    if (
      userSlice.isRegistered &&
      userSlice.user &&
      !userSlice.user?.isVerified
    ) {
      onOpen();
      setTimeout(() => {
        dispatch(resetUser());
        dispatch(resetRegistered());
      }, 10000);
    }
  }, [userSlice, userSlice.user]);

  return (
    /*================ ClientSignup ConditionalRoute ================*/
    <ConditionalRoute
      redirectTo="/adashboard"
      condition={
        userSlice?.user &&
        userSlice?.user?.isVerified &&
        userSlice?.isAuthenticated &&
        userSlice?.user?.roles.includes(Role.Admin)
          ? false
          : true
      }
    >
      <ConditionalRoute
        redirectTo="/cdashboard"
        condition={
          userSlice?.user &&
          userSlice?.user?.isVerified &&
          userSlice?.isAuthenticated &&
          userSlice?.user?.roles.includes(Role.Client)
            ? false
            : true
        }
      >
        <ConditionalRoute
          redirectTo="/dashboard"
          condition={
            userSlice?.user &&
            userSlice?.user?.isVerified &&
            userSlice?.isAuthenticated &&
            userSlice?.user?.roles.includes(Role.User)
              ? false
              : true
          }
        >
          <>
            <HomeNavbar />
            {/*================ ClientSignup BodyWrapper ================*/}
            <BodyWrapper>
              <>
                <MetaTags
                  title={'techFiesta'}
                  description={
                    'Particpate in hackathons where developers thrive, ideas flourish, and success begins'
                  }
                  pageUrl={window.location.href}
                />

                <Flex
                  flexDir="column"
                  w={{ base: '100%', md: '80%', r: '50%' }}
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
                      mt={{ lg: '2rem', base: '1rem' }}
                      fontSize={{ lg: '24px' }}
                      color="secondary"
                      lineHeight={{ lg: '44px' }}
                      mb={{ lg: '57.6', base: '1rem' }}
                      textAlign={'center'}
                      fontWeight={'bold'}
                    >
                      Sign up to create hackathon
                    </Text>

                    <Flex
                      display={'none'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      mb={{ lg: '2rem' }}
                    >
                      <Button
                        bg="unset"
                        w="full"
                        borderWidth={'1px'}
                        borderColor={'brand.secondary'}
                        _hover={{
                          bg: 'unset',
                        }}
                        fontSize={{ lg: '16px' }}
                        py={{ lg: '10px' }}
                        textAlign={'center'}
                        leftIcon={<Google />}
                      >
                        Sign up with Google
                      </Button>
                    </Flex>

                    {/*========================= ClientSignup Formik =========================*/}
                    <Formik
                      initialValues={{
                        email: '',
                        password: '',
                        cpassword: '',
                        agree: false,
                      }}
                      validationSchema={ClientSignupSchema}
                      onSubmit={(values) => {
                        onRegister(values);
                      }}
                    >
                      {({ errors, values, setFieldValue }) => (
                        <Form>
                          {userSlice.errMsg &&
                            userSlice.errMsg.Id === 'CLIENT_REGISTER_ERROR' && (
                              <>
                                {userSlice.errMsg.msg
                                  .split(',')
                                  .map((message: string, index: number) => (
                                    <Alert
                                      key={index}
                                      alignItems={'center'}
                                      borderRadius={'0.2rem'}
                                      mb={'0.4rem'}
                                      padding={'0.2rem'}
                                      fontSize={'14px'}
                                      status="error"
                                    >
                                      <AlertIcon />
                                      {message}
                                    </Alert>
                                  ))}
                              </>
                            )}

                          <Flex flexDir={'column'} marginBottom="1rem" w="full">
                            <Text
                              color={'black'}
                              fontSize="0.8rem"
                              fontWeight={'medium'}
                              mb={'4px'}
                            >
                              Email address
                            </Text>
                            <AuthInput
                              name="email"
                              type="email"
                              defaultValue={values['email']}
                              onChange={(e) =>
                                setFieldValue('email', e.target.value)
                              }
                              placeholder="Enter your company email address"
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

                          <Grid
                            gridTemplateColumns={{ lg: 'repeat(2, 1fr)' }}
                            gap="4"
                          >
                            <GridItem>
                              <Text
                                color={'black'}
                                fontSize="0.8rem"
                                fontWeight={'medium'}
                                mb={'4px'}
                              >
                                Password
                              </Text>
                              <InputGroup>
                                <AuthInput
                                  name="password"
                                  type={showPassword ? 'text' : 'password'}
                                  defaultValue={values['password']}
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
                            </GridItem>

                            <GridItem>
                              <Text
                                color={'black'}
                                fontSize="0.8rem"
                                fontWeight={'medium'}
                                mb={'4px'}
                              >
                                Confirm Password
                              </Text>
                              <InputGroup>
                                <AuthInput
                                  name="password"
                                  type={
                                    showConfirmPassword ? 'text' : 'password'
                                  }
                                  defaultValue={values['cpassword']}
                                  onChange={(e) =>
                                    setFieldValue('cpassword', e.target.value)
                                  }
                                  placeholder={
                                    showConfirmPassword
                                      ? 'Enter your password'
                                      : '********'
                                  }
                                />
                                <InputRightElement h={'100%'}>
                                  <IconButton
                                    icon={
                                      showConfirmPassword ? (
                                        <ViewOffIcon />
                                      ) : (
                                        <ViewIcon />
                                      )
                                    }
                                    variant={'ghost'}
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword,
                                      )
                                    }
                                    aria-label={
                                      showConfirmPassword
                                        ? 'Hide Password'
                                        : 'Show Password'
                                    }
                                    h={'100%'}
                                  />
                                </InputRightElement>
                              </InputGroup>
                              {errors && errors.cpassword && (
                                <Text
                                  fontSize={'12px'}
                                  mt="0.2rem"
                                  color="brand.danger"
                                >
                                  {errors.cpassword}
                                </Text>
                              )}
                            </GridItem>
                          </Grid>

                          <Box>
                            <Flex mt="1rem" alignItems={'center'}>
                              <Checkbox
                                isChecked={values['agree']}
                                onChange={(e) =>
                                  setFieldValue('agree', e.target.checked)
                                }
                                borderRadius={'md'}
                                mr="0.5rem"
                              />
                              <Text
                                color={'black'}
                                fontSize="0.8rem"
                                fontWeight={'medium'}
                              >
                                Yes, I understand and agree to the techFiesta{' '}
                                <Text display={'inline'} fontWeight={'bold'}>
                                  <InternalLink to="/terms-and-conditions">
                                    Terms and conditions
                                  </InternalLink>
                                </Text>
                              </Text>
                            </Flex>
                            {errors && errors.agree ? (
                              <Text
                                fontSize={'12px'}
                                mt="0.2rem"
                                color="brand.danger"
                              >
                                {errors.agree}
                              </Text>
                            ) : null}
                          </Box>

                          <Flex alignItems={'center'} mt="1rem">
                            <Button
                              isLoading={userSlice.isRegistering}
                              width={{ base: '100%' }}
                              borderRadius={'50px'}
                              bg="brand.primary"
                              color="white"
                              fontSize={'0.9rem'}
                              fontWeight="medium"
                              _hover={{
                                bg: 'ek.secondary',
                                color: 'ek.primary',
                              }}
                              _active={{ bg: 'ek.btnGrad2' }}
                              type="submit"
                            >
                              Join as a client
                            </Button>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                    {/*========================= ClientSignup Formik End Here =========================*/}

                    <Text textAlign={'center'} mt={'24px'} mb="1rem">
                      Have an account?{' '}
                      <Text display={'inline'} fontWeight={'bold'}>
                        <InternalLink to="/login"> Log In</InternalLink>
                      </Text>
                    </Text>
                  </Box>
                </Flex>
                {/*================ Modal alert to notify client to go verify account Start Here ================*/}
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
                {/*================ Modal alert to notify client to go verify account End Here ================*/}
              </>
            </BodyWrapper>
          </>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default ClientSignup;
