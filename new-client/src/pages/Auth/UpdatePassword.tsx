import BodyWrapper from '../../reusable/components/BodyWrapper';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
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
  useToast,
} from '@chakra-ui/react';
import KeyRoundIcon from '../../assets/icons/KeyRoundIcon';
import { Form, Formik } from 'formik';
import { AuthInput } from '../../reusable/styled';
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { InternalLink } from '../../utils/Link';
import React, { useCallback, useEffect, useState } from 'react';
import { ResetPasswordSchema } from '../../utils/Yup';
import { RootState } from '../../store/store';
import {
  AuthProps,
  UserStateProps,
} from '../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import {
  changePassword,
  resetChangedRequested,
  resetRegErrMsg,
} from '../../store/slices/userSlice';
import { useLocation } from 'react-router-dom';
import ConditionalRoute from '../../routes/ConditionalRoute';
// import { HomeNavbar, MetaTags } from '../../reusable/components';

const MetaTags = React.lazy(() => import('../../reusable/components/MetaTags'));

const HomeNavbar = React.lazy(
  () => import('../../reusable/components/HomeNavbar'),
);

/*================ Password Update Function ================*/
function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const { onClose } = useDisclosure();
  const dispatch = useDispatch<Dispatch<any>>();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const toast = useToast();

  const onChange = useCallback((values: AuthProps) => {
    dispatch(changePassword({ ...values, id, code } as any));
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === 'CHANGE_PASSWORD_ERROR') {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }
  }, [userSlice.errMsg]);

  useEffect(() => {
    if (userSlice.changedPasswordProps) {
      toast({
        title: 'Password Updated',
        description: 'You have updated your password.',
        status: 'success',
        duration: 9000,
        position: 'top-right',
        isClosable: true,
        onCloseComplete() {
          dispatch(resetChangedRequested());
        },
      });
    }
  }, [userSlice.changedPasswordProps]);

  return (
    <ConditionalRoute
      redirectTo="/404"
      condition={(id && code && true) || false}
    >
      <ConditionalRoute
        redirectTo="/login"
        condition={userSlice.changedPasswordProps ? false : true}
      >
        <>
          <BodyWrapper>
            <>
              <MetaTags
                title={'Update your password'}
                pageUrl={window.location.href}
              />
              <HomeNavbar />

              <Flex
                flexDir="column"
                w={{ base: '100%', md: '40%' }}
                mx="auto"
                mt={{ base: '120px' }}
                px={{ base: '1rem' }}
              >
                <Box
                  mx="auto"
                  bg="white"
                  borderColor={'brand.primary'}
                  borderWidth={'1px'}
                  w="full"
                  borderRadius={'20px'}
                  px={{ base: '1rem' }}
                >
                  <Flex
                    alignItems={'center'}
                    justifyContent={'center'}
                    mt="1rem"
                  >
                    <KeyRoundIcon />
                  </Flex>

                  <Text
                    fontSize={{ lg: '24px' }}
                    color="secondary"
                    lineHeight={{ lg: '44px' }}
                    mb={{ lg: '2rem' }}
                    textAlign={'center'}
                    fontWeight={'bold'}
                  >
                    Update your password
                    <Text
                      fontWeight={'normal'}
                      fontSize={{ lg: '14px' }}
                      lineHeight={{ lg: '32px' }}
                      justifyContent={'center'}
                      color="brand.secondary"
                    >
                      Kindly update your password
                    </Text>
                  </Text>

                  <Formik
                    initialValues={{ password: '', cpassword: '' }}
                    validationSchema={ResetPasswordSchema}
                    onSubmit={(values) => {
                      onChange(values);
                    }}
                  >
                    {({ errors, values, setFieldValue }) => (
                      <Form>
                        {userSlice.errMsg &&
                        userSlice.errMsg.Id === 'CHANGE_PASSWORD_ERROR' ? (
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
                        ) : null}

                        <Flex
                          flexDir={'column'}
                          marginBottom="1rem"
                          w="full"
                          mt="1rem"
                        >
                          <Text
                            fontSize="0.8rem"
                            fontWeight={'medium'}
                            color="brand.secondary"
                          >
                            New password
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
                                showPassword ? 'Enter new password' : '********'
                              }
                            />
                            <InputRightElement h={'100%'}>
                              <IconButton
                                icon={
                                  showPassword ? <ViewOffIcon /> : <ViewIcon />
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

                        <Flex flexDir={'column'} marginBottom="1rem" w="full">
                          <Text
                            fontSize="0.8rem"
                            fontWeight={'medium'}
                            color="brand.secondary"
                          >
                            Confirm password
                          </Text>
                          <InputGroup>
                            <AuthInput
                              name="cpassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={values['cpassword']}
                              onChange={(e) =>
                                setFieldValue('cpassword', e.target.value)
                              }
                              placeholder={
                                showConfirmPassword
                                  ? 'Confirm your password'
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
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                aria-label={
                                  showConfirmPassword
                                    ? 'Hide Confirm Password'
                                    : 'Show Confirm Password'
                                }
                                h={'100%'}
                              />
                            </InputRightElement>
                          </InputGroup>

                          {errors && errors.cpassword ? (
                            <Text
                              fontSize={'12px'}
                              mt="0.2rem"
                              color="brand.danger"
                            >
                              {errors.cpassword}
                            </Text>
                          ) : null}
                        </Flex>

                        <Flex
                          alignItems={'center'}
                          my="1rem"
                          justifyContent={'center'}
                        >
                          <Button
                            width={{ base: '50%' }}
                            borderRadius={'50px'}
                            bg="brand.primary"
                            color="white"
                            fontSize={'14px'}
                            fontWeight="medium"
                            // isLoading={userSlice?.loggin}
                            _hover={{
                              bg: 'ek.secondary',
                              color: 'ek.primary',
                            }}
                            _active={{ bg: 'ek.btnGrad2' }}
                            type="submit"
                          >
                            Update password
                          </Button>
                        </Flex>

                        <Flex
                          my="2rem"
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

              {/*========================= isOpen Modal =========================*/}
              <Modal isOpen={false} onClose={handleClose} size={'xl'}>
                <ModalOverlay />
                <ModalContent borderRadius={'lg'}>
                  <ModalCloseButton
                    boxShadow={'unset'}
                    outline={'unset'}
                    color="black"
                  />
                  <ModalBody py={{ lg: '50px' }} borderRadius={'lg'}>
                    <Flex
                      direction={'column'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Box w="80px" h="80px">
                        <Image src="/images/smile.svg" h="full" w="full" />
                      </Box>

                      <Text
                        mt="45px"
                        fontWeight={{ lg: '700' }}
                        fontSize={{ lg: '30px' }}
                      >
                        Password Verified
                      </Text>

                      <Text my="2rem" fontSize={{ lg: '16px' }}>
                        Your password has been verified and you can proceed now
                        to Log in. Thanks
                      </Text>

                      <Flex
                        alignItems={'center'}
                        mt="1rem"
                        mb={{ lg: '100px' }}
                      >
                        <Button
                          size={'lg'}
                          width={{ base: '100%', lg: '419px' }}
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
                          Login
                        </Button>
                      </Flex>
                    </Flex>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default UpdatePassword;
