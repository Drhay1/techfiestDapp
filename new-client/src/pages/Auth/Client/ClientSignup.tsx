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
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { ExternalLink, InternalLink } from '../../../utils/Link';
import { Formik, Form } from 'formik';
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
import { ClientSignupSchema } from '../../../utils/Yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AiOutlineGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

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
            <BodyWrapper>
              <>
                <Box
                  w={{ base: 'full' }}
                  mx="auto"
                  pb={'3rem'}
                  overflow={'hidden'}
                >
                  <Grid gridTemplateColumns={{ lg: '50% 50%' }} pt={'50px'}>
                    <GridItem
                      display={'flex'}
                      flexDirection={'column'}
                      mx={{ lg: '140px' }}
                      mt={{ lg: '50px' }}
                    >
                      <Flex
                        align={'center'}
                        flexDirection={'column'}
                        px={{ base: '2rem' }}
                      >
                        <Flex
                          flexDirection={'column'}
                          h={'120px'}
                          mb={'8px'}
                          align={'center'}
                        >
                          <InternalLink to="/">
                            <Box w={'40px'} h={'40px'} mb={'23px'}>
                              <Image
                                w={'full'}
                                src="/images/new/logo.png"
                                alt="Logo"
                              />
                            </Box>
                          </InternalLink>

                          <Text
                            color="#3C4D6D"
                            fontSize="36"
                            fontWeight="700"
                            mb={'33px'}
                          >
                            Sign Up
                          </Text>
                        </Flex>

                        <HStack
                          w={{ md: '381px' }}
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
                            Already part of techFiesta?
                          </Text>
                          <InternalLink to="/login">
                            <Text
                              color="#0F5EFE"
                              fontSize={'16px'}
                              fontWeight={'700'}
                            >
                              Login
                            </Text>
                          </InternalLink>
                        </HStack>

                        <Grid
                          gap={'16px'}
                          gridTemplateColumns={'repeat(2, 1fr)'}
                          w={{ md: '440px' }}
                          mx={{ md: 'auto' }}
                          display="none"
                        >
                          <GridItem>
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

                        <HStack
                          w={{ lg: '440px', md: '440px' }}
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
                                userSlice.errMsg.Id ===
                                  'CLIENT_REGISTER_ERROR' && (
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
                                )}
                              <Box
                                w={{ lg: '440px', md: '440px', base: 'full' }}
                              >
                                <FormControl>
                                  <FormLabel
                                    mb={'4px'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={'10px'}
                                    display={'inline-flex'}
                                    fontSize={'16px'}
                                    fontWeight={'500'}
                                    color={'brand.secondary'}
                                  >
                                    Email
                                  </FormLabel>
                                  <Input
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
                                    onChange={(e) =>
                                      setFieldValue('email', e.target.value)
                                    }
                                    placeholder="Your email address"
                                  />
                                  {errors && errors.email && (
                                    <Text
                                      fontSize={'12px'}
                                      mt="0.2rem"
                                      color="brand.danger"
                                    >
                                      {errors.email}
                                    </Text>
                                  )}
                                </FormControl>

                                <FormControl mt={'1rem'}>
                                  <FormLabel
                                    mb={'4px'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={'10px'}
                                    display={'inline-flex'}
                                    fontSize={'16px'}
                                    fontWeight={'500'}
                                    color={'brand.secondary'}
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
                                        base: 'full',
                                      }}
                                      placeholder={
                                        showPassword
                                          ? 'Enter your password'
                                          : '********'
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          'password',
                                          e.target.value,
                                        )
                                      }
                                      h={'48px'}
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
                                  {errors && errors.password && (
                                    <Text
                                      fontSize={'12px'}
                                      mt="0.2rem"
                                      color="brand.danger"
                                    >
                                      {errors.password}
                                    </Text>
                                  )}
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
                                    color={'brand.secondary'}
                                  >
                                    Confirm password
                                  </FormLabel>

                                  <InputGroup>
                                    <Input
                                      px={'12px'}
                                      py={'18px'}
                                      border={'1px'}
                                      borderRadius={'8px'}
                                      type={
                                        showConfirmPassword
                                          ? 'text'
                                          : 'password'
                                      }
                                      value={values['cpassword']}
                                      w={{
                                        lg: '440px',
                                        md: '440px',
                                        base: 'full',
                                      }}
                                      placeholder={
                                        showConfirmPassword
                                          ? 'Confirm your password'
                                          : '********'
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          'cpassword',
                                          e.target.value,
                                        )
                                      }
                                      h={'48px'}
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
                                </FormControl>
                              </Box>

                              <VStack alignItems={'flex-start'}>
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
                                    Yes, I understand and agree to the
                                    techFiesta
                                    <Text
                                      display={'inline'}
                                      fontWeight={'bold'}
                                    >
                                      <ExternalLink href="/terms-and-conditions">
                                        Terms of Service
                                      </ExternalLink>
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
                              </VStack>

                              <Button
                                isLoading={userSlice?.isRegistering}
                                bg="brand.primary"
                                w={{ lg: '440px', md: '440px', base: 'full' }}
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
                              >
                                Join as a client
                              </Button>
                            </Form>
                          )}
                        </Formik>
                      </Flex>
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
                        // backdropFilter = 'blur(40px)'
                        flexDirection={'column'}
                        justifyContent={'center'}
                        align={'center'}
                        w={{ lg: '670px', md: '635px' }}
                      >
                        <Box pt={'79px'} px={'160px'} pb={'40px'}>
                          <Image src="/images/new/logindj.svg" alt="LoginDJ" />
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

export default ClientSignup;
