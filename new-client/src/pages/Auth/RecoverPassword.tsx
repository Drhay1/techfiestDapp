import BodyWrapper from '../../reusable/components/BodyWrapper';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import KeyRoundIcon from '../../assets/icons/KeyRoundIcon';
import { Form, Formik } from 'formik';
import { AuthInput } from '../../reusable/styled';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { InternalLink } from '../../utils/Link';
import React, { Suspense, useCallback, useEffect } from 'react';
import { ForgotPasswordSchema } from '../../utils/Yup';
import { RootState } from '../../store/store';
import {
  AuthProps,
  Role,
  UserStateProps,
} from '../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import {
  requestPassword,
  resetPasswordRequested,
  resetRegErrMsg,
} from '../../store/slices/userSlice';
import { Dispatch } from '@reduxjs/toolkit';
import ConditionalRoute from '../../routes/ConditionalRoute';
import PageLoader from '../../reusable/components/PageLoader';

const MetaTags = React.lazy(() => import('../../reusable/components/MetaTags'));
const HomeNavbar = React.lazy(
  () => import('../../reusable/components/HomeNavbar'),
);

/*================ Password Recovery ================*/
function RecoverPassword() {
  const dispatch = useDispatch<Dispatch<any>>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  /*================ Callback onRequest ================*/
  const onRequest = useCallback((values: AuthProps) => {
    return dispatch(requestPassword(values));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(resetPasswordRequested());
    onClose();
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === 'REQUEST_PASSWORD_ERROR') {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }
  }, [userSlice.errMsg]);

  useEffect(() => {
    if (
      userSlice.passwordRequestedProps &&
      userSlice.passwordRequestedProps.passwordRequested
    ) {
      onOpen();
      setTimeout(() => {
        dispatch(resetPasswordRequested());
      }, 10000);
    }
  }, [userSlice.passwordRequestedProps]);

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
          <Suspense fallback={<PageLoader />}>
            <>
              <MetaTags
                title={'techFiesta'}
                description={
                  'Participate in hackathons where developers thrive, ideas flourish, and success begins'
                }
                pageUrl={window.location.href}
              />
              <HomeNavbar />
              <BodyWrapper>
                <>
                  <Flex
                    flexDir="column"
                    w={{ base: '100%', md: '65%', lg: '40%' }}
                    mt={{ base: '9rem', lg: '8rem' }}
                    px={{ base: '1rem', md: 'unset' }}
                    mx="auto"
                  >
                    <Box
                      mx="auto"
                      bg="white"
                      borderColor={'brand.primary'}
                      borderWidth={'1px'}
                      w="full"
                      borderRadius={'20px'}
                      px={{ lg: '64px', sm: '10px' }}
                    >
                      <Flex
                        alignItems={'center'}
                        justifyContent={'center'}
                        mt="1rem"
                      >
                        <KeyRoundIcon />
                      </Flex>

                      <Text
                        mt={{ lg: '1rem', sm: '10px' }}
                        fontSize={{ lg: '24px' }}
                        color="secondary"
                        lineHeight={{ lg: '44px' }}
                        mb={{ lg: '2rem', sm: '10px' }}
                        textAlign={'center'}
                        fontWeight={'bold'}
                      >
                        Forgot Password?
                        <Text
                          fontWeight={'normal'}
                          fontSize={{ lg: '14px' }}
                          lineHeight={{ lg: '32px' }}
                          justifyContent={'center'}
                          color="brand.secondary"
                        >
                          No worries, we'll send you reset instructions.
                        </Text>
                      </Text>

                      <Formik
                        initialValues={{ email: '' }}
                        validationSchema={ForgotPasswordSchema}
                        onSubmit={(values) => {
                          onRequest(values);
                        }}
                      >
                        {({ errors, values, setFieldValue }) => (
                          <Form>
                            {userSlice.errMsg &&
                            userSlice.errMsg.Id === 'REQUEST_PASSWORD_ERROR' ? (
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
                                      status="info"
                                    >
                                      <AlertIcon />
                                      {message}
                                    </Alert>
                                  ))}
                              </>
                            ) : null}

                            <Flex
                              flexDir={'column'}
                              marginBottom="1rem"
                              w="full"
                            >
                              <Text
                                fontSize="0.8rem"
                                fontWeight={'medium'}
                                color="brand.secondary"
                                mb={'10px'}
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

                            <Flex alignItems={'center'} mt="1rem">
                              <Button
                                width={{ base: '100%' }}
                                borderRadius={'50px'}
                                bg="brand.primary"
                                color="white"
                                fontSize={'14px'}
                                fontWeight="medium"
                                isLoading={userSlice?.reqResettingPass}
                                _hover={{
                                  bg: 'ek.secondary',
                                  color: 'ek.primary',
                                }}
                                _active={{ bg: 'ek.btnGrad2' }}
                                type="submit"
                              >
                                Send Instructions
                              </Button>
                            </Flex>

                            <Flex
                              mt="2rem"
                              mb="1rem"
                              alignItems={'center'}
                              justifyContent={'center'}
                            >
                              <ArrowBackIcon />
                              <InternalLink to="/login">
                                <Text ml="0.5rem">Back to login</Text>
                              </InternalLink>
                            </Flex>
                          </Form>
                        )}
                      </Formik>
                    </Box>
                  </Flex>

                  {/*========================= Forgot password modal =========================*/}
                  {userSlice.passwordRequestedProps?.passwordRequested && (
                    <Modal isOpen={isOpen} onClose={handleClose} size={'xl'}>
                      <ModalOverlay />
                      <ModalContent borderRadius={'lg'}>
                        <ModalCloseButton
                          boxShadow={'unset'}
                          outline={'unset'}
                          color="black"
                        />
                        <ModalBody py={{ lg: '1rem' }} borderRadius={'lg'}>
                          <Flex
                            direction={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                          >
                            <Box w="50px" h="50px">
                              <Image
                                src="/images/ladyr.svg"
                                h="full"
                                w="full"
                              />
                            </Box>

                            <Text
                              mt="1rem"
                              fontWeight={{ lg: '700' }}
                              fontSize={{ lg: '24px' }}
                            >
                              Recover Password
                            </Text>

                            <Text my="1rem" fontSize={{ lg: '16px' }}>
                              We’ve sent an email to{' '}
                              <Text display={'inline'} fontWeight={'bold'}>
                                {userSlice.passwordRequestedProps.email}
                              </Text>
                              . Follow the steps provided in the email to update
                              your password.
                            </Text>
                          </Flex>
                        </ModalBody>
                      </ModalContent>
                    </Modal>
                  )}
                </>
              </BodyWrapper>
            </>
          </Suspense>
        </ConditionalRoute>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default RecoverPassword;
