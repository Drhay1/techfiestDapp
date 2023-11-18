import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Text,
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  HStack,
} from '@chakra-ui/react';
import SideMenu from '../Users/Client/SideMenu';
import { ConnectIcon, WalletConnectIcon } from '../../assets/icons';
import { CompanySchema, ProfileSettingsSchema } from '../../utils/Yup';
import { AuthInput } from '../../reusable/styled';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import {
  NotificationsProps,
  Role,
  UserStateProps,
} from '../../store/interfaces/user.interface';
import ConditionalRoute from '../../routes/ConditionalRoute';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  clientCompanyUpdate,
  profileUpdate,
  resetCompanyUpdated,
  resetProfileUpdated,
  resetNotificationsUpdated,
  updateNotificationsSettings,
} from '../../store/slices/userSlice';
import { AdminSideMenu } from '../Users/Admin';
import FileUpload from '../../reusable/cloudinary/cloudinary';
import AuthNavbar from '../../reusable/components/AuthNavbar';
import PageLoader from '../../reusable/components/PageLoader';

const MetaTags = React.lazy(() => import('../../reusable/components/MetaTags'));
const BodyWrapper = lazy(() => import('../../reusable/components/BodyWrapper'));

/*========================= ProfileSettings function =========================*/
function ProfileSettings() {
  const toast = useToast();
  const dispatch = useDispatch<Dispatch<any>>();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const msg = params.get('msg');
  const creating = params.get('creating');
  const joiningId = params.get('joiningid');
  const slug = params.get('slug');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const onSubmitProfileUpdate = useCallback((values: any) => {
    return dispatch(profileUpdate(values));
  }, [dispatch]);

  const onSubmitCompanyUpdate = useCallback(
    (props: any) => {
      return dispatch(clientCompanyUpdate(props));
    },
    [dispatch],
  );

  const onNotificationsUpdate = useCallback((props: NotificationsProps) => {
    return dispatch(updateNotificationsSettings(props));
  }, [dispatch]);

  useEffect(() => {
    if (type) {
      const settingsElement = document.getElementById('settings');
      const profileElement = document.getElementById('profile');
      if (type === 'company') {
        setTimeout(() => {
          if (settingsElement) {
            settingsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      } else if (type === 'user') {
        setTimeout(() => {
          if (profileElement) {
            profileElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  }, []);

  /*========================= Userslice useEffect function =========================*/
  useEffect(() => {
    if (userSlice?.updatedProfile) {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetProfileUpdated());
          if (joiningId && type === 'user') {
            window.location.href = `/hacks/${joiningId}/${slug}`;
          }
        },
      });
    }

    if (userSlice?.updatedCompany) {
      toast({
        title: 'Company info updated',
        description: 'Your company info has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetCompanyUpdated());
          console.log(creating, type);
          if (creating === 'yes' && type === 'settings') {
            window.location.href = `/cdashboard`;
          }
        },
      });
    }

    if (userSlice?.updatedNotifications) {
      toast({
        title: 'Notifications info updated',
        description: 'Your notifications info has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        onCloseComplete() {
          dispatch(resetNotificationsUpdated());
        },
      });
    }
  }, [
    userSlice?.updatedProfile,
    userSlice?.updatedCompany,
    userSlice?.updatedNotifications,
    joiningId,
    slug,
    type,
    creating,
    dispatch,
  ]);

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={(userSlice.isAuthenticated && userSlice.user && true) || false}
    >
      <Suspense fallback={<PageLoader />}>
        <BodyWrapper>
          <>
            <MetaTags
              title={'Settings'}
              description={'Make changes and manage your account settings.'}
              pageUrl={window.location.href}
            />
            <AuthNavbar />

            <Flex minH="100vh">
              <Box
                transform={{ base: 'translateX(-1000%)', lg: 'none' }}
                position="fixed"
                h="100vh"
                w="280px"
                zIndex="1"
                className="side-menu"
                transition="transform 0.3s"
                overflow={'hidden'}
                bg="white"
                px="20px"
              >
                {userSlice?.user?.roles.includes(Role.Admin) ? (
                  <AdminSideMenu />
                ) : (
                  <SideMenu />
                )}
              </Box>
              <Box
                flex="1"
                overflowX="auto"
                ml={{ base: '0', lg: '280px' }}
                px={{ base: '1rem', lg: '2rem' }}
                pb="2rem"
              >
                <Box mt="90px">
                  <Box>
                    <Text
                      fontSize={{ base: '24px', lg: '48px' }}
                      color="brand.secondary"
                    >
                      Settings
                    </Text>
                    <Text fontSize={{ base: '12px', lg: '14px' }}>
                      Make changes and manage your account settings.
                    </Text>

                    <Box
                      py="1rem"
                      mt="48px"
                      fontSize={'14px'}
                      color="brand.secondary"
                      px={{ lg: '0.5rem' }}
                      bg="white"
                      borderRadius={'1rem'}
                    >
                      <Grid
                        px="0.5rem"
                        borderRadius={'0.5rem'}
                        my="48px"
                        gridTemplateColumns={{ lg: '35% 65%' }}
                        gap={{ lg: '5px', base: '20px' }}
                      >
                        <GridItem>
                          <Text fontWeight={'bold'} mb="8px">
                            Profile
                          </Text>
                          <Text fontSize={{ lg: '14px' }}>
                            Manage your personal information and keep your
                            profile up to date.
                          </Text>

                          {msg && type === 'user' && (
                            <Text
                              color="red"
                              fontSize={'1rem'}
                              mt="2rem"
                              fontWeight={'bold'}
                            >
                              {msg}
                            </Text>
                          )}
                        </GridItem>
                        <GridItem>
                          {/*================ Profile setting form ================*/}
                          <Formik
                            initialValues={{
                              firstname: userSlice?.user?.firstname || '',
                              lastname: userSlice?.user?.lastname || '',
                            }}
                            validationSchema={ProfileSettingsSchema}
                            onSubmit={(values) => {
                              onSubmitProfileUpdate(values);
                            }}
                          >
                            {({ errors, values, setFieldValue }) => (
                              <Form>
                                {userSlice.errMsg &&
                                userSlice.errMsg.Id ===
                                  'PROFILE_UPDATE_ERROR' ? (
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
                                <Grid
                                  gridTemplateColumns={'repeat(2, 1fr)'}
                                  gap="10px"
                                  id="profile"
                                >
                                  <GridItem
                                    borderWidth={
                                      (msg && type === 'user' && '1px') ||
                                      'none'
                                    }
                                    borderColor={
                                      (msg && type === 'user' && 'red') ||
                                      'brand.accent.danger'
                                    }
                                  >
                                    <Text mb="10px">Firstname</Text>
                                    <AuthInput
                                      name="firstname"
                                      type="text"
                                      value={values['firstname']}
                                      onChange={(e) =>
                                        setFieldValue(
                                          'firstname',
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Enter your first name"
                                    />
                                    {errors && errors.firstname ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.firstname}
                                      </Text>
                                    ) : null}
                                  </GridItem>
                                  <GridItem>
                                    <Text mb="10px">Lastname</Text>
                                    <AuthInput
                                      name="lastname"
                                      type="text"
                                      value={values['lastname']}
                                      onChange={(e) =>
                                        setFieldValue(
                                          'lastname',
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Enter your last name"
                                    />
                                    {errors && errors.lastname ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.lastname}
                                      </Text>
                                    ) : null}
                                  </GridItem>
                                </Grid>

                                <Flex
                                  my="20px"
                                  justifyContent={'flex-end'}
                                  alignItems={'center'}
                                >
                                  <Button
                                    bg="brand.primary"
                                    _hover={{
                                      bg: 'white',
                                      color: 'brand.primary',
                                    }}
                                    borderWidth={'1px'}
                                    borderColor={'brand.primary'}
                                    color="white"
                                    isLoading={userSlice?.updatingProfile}
                                    type="submit"
                                  >
                                    Save
                                  </Button>
                                </Flex>
                              </Form>
                            )}
                          </Formik>
                        </GridItem>
                      </Grid>

                      {(userSlice?.user?.roles.includes(Role.Admin) ||
                        userSlice?.user?.roles.includes(Role.Client)) && (
                        <Grid
                          id="settings"
                          px="0.5rem"
                          my="48px"
                          gridTemplateColumns={{ lg: '40% 60%' }}
                          borderWidth={
                            (msg && type === 'settings' && '1px') || 'none'
                          }
                          borderColor={
                            (msg && type == 'settings' && 'red') ||
                            'brand.accent.danger'
                          }
                          borderRadius={'0.5rem'}
                          gap={{ lg: '5px', base: '20px' }}
                        >
                          <GridItem>
                            <Text
                              color="brand.secondary"
                              mb="8px"
                              fontWeight={'bold'}
                            >
                              Company info
                            </Text>
                            <Text fontSize={{ lg: '14px' }}>
                              Provide or update your company details.
                            </Text>

                            {msg && (
                              <Text
                                color="red"
                                fontSize={'1rem'}
                                mt="2rem"
                                fontWeight={'bold'}
                              >
                                {msg}
                              </Text>
                            )}
                          </GridItem>

                          {/*================ Company setting form ================*/}
                          <Formik
                            initialValues={{
                              companyName:
                                userSlice?.user?.company?.companyName || '',
                              country: userSlice?.user?.company?.country || '',
                              address: userSlice?.user?.company?.address || '',
                              city: userSlice?.user?.company?.city || '',
                              state: userSlice?.user?.company?.state || '',
                              postalCode:
                                userSlice?.user?.company?.postalCode || '',
                              logo:
                                uploadedImageUrl ||
                                userSlice?.user?.company?.logo,
                            }}
                            validationSchema={CompanySchema}
                            onSubmit={(values) => {
                              onSubmitCompanyUpdate(values);
                            }}
                          >
                            {({ errors, values, setFieldValue }) => (
                              <Form>
                                {userSlice.errMsg &&
                                  userSlice.errMsg.Id ===
                                    'CLIENT_COMPANY_SETTINGS_ERROR' &&
                                  userSlice.errMsg.msg
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

                                <GridItem>
                                  <Box mb="20px">
                                    <Text mb="10px">Company Name</Text>
                                    <AuthInput
                                      name="companyName"
                                      type="text"
                                      value={values['companyName']}
                                      onChange={(e) =>
                                        setFieldValue(
                                          'companyName',
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Enter your company name"
                                    />
                                    {errors && errors.companyName ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.companyName}
                                      </Text>
                                    ) : null}
                                  </Box>

                                  <Box mb="20px">
                                    {/* <InputGroup height={'43px'}>
                                        <InputLeftElement pointerEvents="none">
                                          <Avatar
                                            borderRadius={'none'}
                                            size={'xs'}
                                            name={values['companyName']}
                                            src={values['logo']}
                                            rounded="none"
                                          />
                                        </InputLeftElement>
                                        <Input
                                          onChange={(e) =>
                                            setFieldValue(
                                              'logo',
                                              e.target.value,
                                            )
                                          }
                                          value={values['logo']}
                                          outline={'none'}
                                          boxShadow={'none'}
                                          borderColor="rgba(208, 213, 221, 1)"
                                          type="url"
                                          placeholder="Company's Logo URL"
                                          fontSize={'14px'}
                                          _focus={{
                                            borderColor:
                                              'rgba(208, 213, 221, 1)',
                                            boxShadow: 'none',
                                          }}
                                        />
                                      </InputGroup> */}
                                    <HStack w="full">
                                      <FileUpload
                                        {...{
                                          setUploadedImageUrl,
                                          uploadedImageUrl,
                                          logo: values['logo'],
                                          setFieldValue,
                                        }}
                                      />
                                      <Text>Company Logo</Text>
                                    </HStack>

                                    {errors && errors.logo ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.logo}
                                      </Text>
                                    ) : null}
                                  </Box>

                                  <Box mb="20px" display={'none'}>
                                    <Text mb="10px">Country</Text>
                                    <AuthInput
                                      name="country"
                                      type="text"
                                      value={values['country']}
                                      onChange={(e) =>
                                        setFieldValue('country', e.target.value)
                                      }
                                      placeholder="Enter your country"
                                    />
                                    {errors && errors.country ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.country}
                                      </Text>
                                    ) : null}
                                  </Box>

                                  <Box mb="20px" display={'none'}>
                                    <Text mb="10px">Company address</Text>
                                    <AuthInput
                                      name="address"
                                      type="text"
                                      value={values['address']}
                                      onChange={(e) =>
                                        setFieldValue('address', e.target.value)
                                      }
                                      placeholder="Enter your company address"
                                    />
                                    {errors && errors.address ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.address}
                                      </Text>
                                    ) : null}
                                  </Box>

                                  <Grid
                                    gridTemplateColumns={{
                                      lg: 'repeat(3, 1fr)',
                                    }}
                                    gap={'20px'}
                                    display={'none'}
                                  >
                                    <GridItem>
                                      <Text mb="1rem">City</Text>
                                      <AuthInput
                                        name="city"
                                        type="text"
                                        value={values['city']}
                                        onChange={(e) =>
                                          setFieldValue('city', e.target.value)
                                        }
                                        placeholder="Enter your city"
                                      />
                                      {errors && errors.city ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.city}
                                        </Text>
                                      ) : null}
                                    </GridItem>

                                    <GridItem>
                                      <Text mb="1rem">State/Province</Text>
                                      <AuthInput
                                        name="state"
                                        type="text"
                                        value={values['state']}
                                        onChange={(e) =>
                                          setFieldValue('state', e.target.value)
                                        }
                                        placeholder="Enter your State/Porvince"
                                      />
                                      {errors && errors.state ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.state}
                                        </Text>
                                      ) : null}
                                    </GridItem>

                                    <GridItem>
                                      <Text mb="1rem">Zip/Postal Code</Text>
                                      <AuthInput
                                        name="postalCode"
                                        type=""
                                        value={values['postalCode']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'postalCode',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your Zip/Postal Code"
                                      />
                                      {errors && errors.postalCode ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.postalCode}
                                        </Text>
                                      ) : null}
                                    </GridItem>
                                  </Grid>

                                  <Flex
                                    my="20px"
                                    justifyContent={'flex-end'}
                                    alignItems={'center'}
                                  >
                                    <Button
                                      bg="brand.primary"
                                      _hover={{
                                        bg: 'white',
                                        color: 'brand.primary',
                                      }}
                                      borderWidth={'1px'}
                                      borderColor={'brand.primary'}
                                      color="white"
                                      isLoading={userSlice?.updatingCompany}
                                      type="submit"
                                    >
                                      Save
                                    </Button>
                                  </Flex>
                                </GridItem>
                              </Form>
                            )}
                          </Formik>
                        </Grid>
                      )}
                      <Grid
                        my="48px"
                        gridTemplateColumns={'40% 60%'}
                        gap="10px"
                        display={'none'}
                      >
                        <GridItem>
                          <Text
                            color="brand.secondary"
                            fontWeight={'bold'}
                            mb="8px"
                          >
                            Notifications
                          </Text>
                          <Text fontSize={{ lg: '14px' }}>
                            Customize your notifications preferences to stay
                            informed about important updates on your hackathons.
                          </Text>
                        </GridItem>

                        {/*================ Notifications setting form ================*/}
                        <Formik
                          initialValues={{
                            payout:
                              userSlice?.user?.notifications?.payout || false,
                            participants:
                              userSlice?.user?.notifications?.participants ||
                              false,
                            completed:
                              userSlice?.user?.notifications?.completed ||
                              false,
                            recentHackathon:
                              userSlice?.user?.notifications?.recentHackathon ||
                              false,
                            hackathonSetup:
                              userSlice?.user?.notifications?.hackathonSetup ||
                              false,
                            rewards:
                              userSlice?.user?.notifications?.rewards || false,
                          }}
                          // validationSchema={NotificationsSchema}
                          onSubmit={(values) => {
                            onNotificationsUpdate(values);
                          }}
                        >
                          {({ errors, values, setFieldValue }) => (
                            <Form>
                              {userSlice.errMsg &&
                              userSlice.errMsg.Id ===
                                'CLIENT_NOTIFICATIONS_SETTINGS_ERROR' ? (
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
                              {userSlice?.user?.roles.includes(Role.Client) ? (
                                <GridItem>
                                  <Text fontWeight={'bold'} mb="20px">
                                    By Email
                                  </Text>
                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="payout"
                                      isChecked={values['payout']}
                                      onChange={() =>
                                        setFieldValue(
                                          'payout',
                                          !values['payout'],
                                        )
                                      }
                                    />

                                    {errors && errors.payout ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.payout}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>Payout</Text>
                                      <Text>
                                        Get notified when a payout is made to
                                        the winner of your hackathons
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="participants"
                                      isChecked={values['participants']}
                                      onChange={() =>
                                        setFieldValue(
                                          'participants',
                                          !values['participants'],
                                        )
                                      }
                                    />

                                    {errors && errors.participants ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.participants}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>
                                        Participants
                                      </Text>
                                      <Text>
                                        Get notified when a participant applies
                                        for a hackathon
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="completed"
                                      isChecked={values['completed']}
                                      onChange={() =>
                                        setFieldValue(
                                          'completed',
                                          !values['completed'],
                                        )
                                      }
                                    />

                                    {errors && errors.completed ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.completed}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>Completed</Text>
                                      <Text>
                                        Get notified when a participant
                                        completes a hackathon
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex
                                    my="20px"
                                    justifyContent={'flex-end'}
                                    alignItems={'center'}
                                  >
                                    <Button
                                      bg="brand.primary"
                                      _hover={{
                                        bg: 'white',
                                        color: 'brand.primary',
                                      }}
                                      borderWidth={'1px'}
                                      borderColor={'brand.primary'}
                                      color="white"
                                      isLoading={
                                        userSlice?.updatingNotifications
                                      }
                                      type="submit"
                                    >
                                      Save
                                    </Button>
                                  </Flex>
                                </GridItem>
                              ) : userSlice?.user?.roles.includes(Role.User) ? (
                                <GridItem>
                                  <Text fontWeight={'bold'} mb="20px">
                                    By Email
                                  </Text>
                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="recentHackathon"
                                      isChecked={values['recentHackathon']}
                                      onChange={() =>
                                        setFieldValue(
                                          'recentHackathon',
                                          !values['recentHackathon'],
                                        )
                                      }
                                    />

                                    {errors && errors.recentHackathon ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.recentHackathon}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>
                                        Recent hackathons
                                      </Text>
                                      <Text>
                                        Get notified when a new hackathons is
                                        launched
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="participants"
                                      isChecked={values['participants']}
                                      onChange={() =>
                                        setFieldValue(
                                          'participants',
                                          !values['participants'],
                                        )
                                      }
                                    />

                                    {errors && errors.participants ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.participants}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>
                                        Participants
                                      </Text>
                                      <Text>
                                        Get notified when a participant applies
                                        for a hackathon
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex alignItems={'flex-start'} mb="1rem">
                                    <Checkbox
                                      size={'md'}
                                      name="completed"
                                      isChecked={values['completed']}
                                      onChange={() =>
                                        setFieldValue(
                                          'completed',
                                          !values['completed'],
                                        )
                                      }
                                    />

                                    {errors && errors.completed ? (
                                      <Text
                                        fontSize={'12px'}
                                        mt="0.2rem"
                                        color="brand.danger"
                                      >
                                        {errors.completed}
                                      </Text>
                                    ) : null}
                                    <Box ml="10px">
                                      <Text fontWeight={'bold'}>Completed</Text>
                                      <Text>
                                        Get notified when a participant
                                        completes a hackathon
                                      </Text>
                                    </Box>
                                  </Flex>

                                  <Flex
                                    my="20px"
                                    justifyContent={'flex-end'}
                                    alignItems={'center'}
                                  >
                                    <Button
                                      bg="brand.primary"
                                      _hover={{
                                        bg: 'white',
                                        color: 'brand.primary',
                                      }}
                                      borderWidth={'1px'}
                                      borderColor={'brand.primary'}
                                      color="white"
                                      isLoading={
                                        userSlice?.updatingNotifications
                                      }
                                      type="submit"
                                    >
                                      Save
                                    </Button>
                                  </Flex>
                                </GridItem>
                              ) : (
                                userSlice?.user?.roles.includes(Role.Admin) && (
                                  <GridItem>
                                    <Text fontWeight={'bold'} mb="20px">
                                      By Email
                                    </Text>
                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="payout"
                                        isChecked={values['payout']}
                                        onChange={() =>
                                          setFieldValue(
                                            'payout',
                                            !values['payout'],
                                          )
                                        }
                                      />

                                      {errors && errors.payout ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.payout}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>Payout</Text>
                                        <Text>
                                          Get notified when a payout is made to
                                          the winner of your hackathons
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="hackathonSetup"
                                        isChecked={values['hackathonSetup']}
                                        onChange={() =>
                                          setFieldValue(
                                            'hackathonSetup',
                                            !values['hackathonSetup'],
                                          )
                                        }
                                      />

                                      {errors && errors.hackathonSetup ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.hackathonSetup}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Hackathon Set-up
                                        </Text>
                                        <Text>
                                          The admin is notified, when a client
                                          sets up a hackathon and the admin
                                          needs to approve it
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="rewards"
                                        isChecked={values.rewards}
                                        onChange={() =>
                                          setFieldValue(
                                            'rewards',
                                            !values.rewards,
                                          )
                                        }
                                      />

                                      {errors && errors.rewards ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.rewards}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>Rewards</Text>
                                        <Text>
                                          The admin is notified, when a
                                          hackathon is completed and rewards are
                                          sent out.
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex
                                      my="20px"
                                      justifyContent={'flex-end'}
                                      alignItems={'center'}
                                    >
                                      <Button
                                        bg="brand.primary"
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.primary',
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'brand.primary'}
                                        color="white"
                                        isLoading={
                                          userSlice?.updatingNotifications
                                        }
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                )
                              )}
                            </Form>
                          )}
                        </Formik>
                      </Grid>

                      {!userSlice?.user?.roles.includes(Role.Admin) && (
                        <Grid
                          my="48px"
                          gridTemplateColumns={'40% 60%'}
                          gap="10px"
                          display={'none'}
                        >
                          <GridItem>
                            <Text
                              color="brand.secondary"
                              fontWeight={'bold'}
                              mb="8px"
                            >
                              Payment info
                            </Text>
                            <Text fontSize={{ lg: '14px' }}>
                              Connect your wallet address to ensure smooth
                              transactions for your hackathons.
                            </Text>
                          </GridItem>
                          <GridItem>
                            <Text fontWeight={'bold'} mb="2rem">
                              Connect Wallet
                            </Text>

                            <Button
                              bg="white"
                              _hover={{
                                bg: 'white',
                                color: 'brand.primary',
                              }}
                              borderWidth={'1px'}
                              borderColor={'black'}
                              color="black"
                              leftIcon={<ConnectIcon />}
                            >
                              Connect Wallet
                            </Button>

                            <Text fontWeight={'bold'} mt="2rem">
                              Supported Wallets
                            </Text>

                            <Box mt="2rem">
                              <Grid
                                gridTemplateColumns={'repeat(2, 1fr)'}
                                gap={'20px'}
                              >
                                <Box
                                  p="1rem"
                                  borderColor={'brand.secondary'}
                                  borderWidth={'1px'}
                                  boxShadow={
                                    '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                  }
                                  borderRadius={'4px'}
                                >
                                  <Flex alignItems={'center'}>
                                    <WalletConnectIcon />
                                    <Text ml="1rem">Wallet Connect</Text>
                                  </Flex>
                                  <Text mt="0.5rem">
                                    Connect with Wallet Connect
                                  </Text>
                                </Box>

                                <Box
                                  p="1rem"
                                  borderColor={'brand.secondary'}
                                  borderWidth={'1px'}
                                  boxShadow={
                                    '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                  }
                                  borderRadius={'4px'}
                                >
                                  <Flex alignItems={'center'}>
                                    <WalletConnectIcon />
                                    <Text ml="1rem">Wallet Connect</Text>
                                  </Flex>
                                  <Text mt="0.5rem">
                                    Connect with Wallet Connect
                                  </Text>
                                </Box>

                                <Box
                                  p="1rem"
                                  borderColor={'brand.secondary'}
                                  borderWidth={'1px'}
                                  boxShadow={
                                    '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                  }
                                  borderRadius={'4px'}
                                >
                                  <Flex alignItems={'center'}>
                                    <WalletConnectIcon />
                                    <Text ml="1rem">Wallet Connect</Text>
                                  </Flex>
                                  <Text mt="0.5rem">
                                    Connect with Wallet Connect
                                  </Text>
                                </Box>
                              </Grid>
                            </Box>
                          </GridItem>
                        </Grid>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Flex>

            <Box
              display={'none'}
              w={{ base: 'full' }}
              maxW={{ lg: '1199px' }}
              mx="auto"
              mb={'50px'}
              mt={{ lg: '6rem', base: '8rem' }}
              px={{ base: '1rem', lg: 'unset' }}
            >
              <Grid
                display={{ base: 'block', lg: 'grid' }}
                mt={{ lg: '3rem' }}
                templateAreas={{
                  lg: `"nav main"
              "nav footer"`,
                }}
                gridTemplateRows={{ lg: 'auto 1fr ' }}
                gridTemplateColumns={{ lg: '200px 1fr' }}
                gap={{ lg: '10' }}
                color="blackAlpha.700"
              >
                <GridItem
                  bg="white"
                  area={'nav'}
                  display={{ base: 'none', lg: 'inline-grid' }}
                  position={'sticky'}
                >
                  {userSlice?.user?.roles.includes(Role.Admin) ? (
                    <AdminSideMenu />
                  ) : (
                    <SideMenu />
                  )}
                </GridItem>
                <GridItem bg="white" area={'main'} overflow={'hidden'}>
                  <Breadcrumb
                    mb={{ lg: '1rem' }}
                    spacing="8px"
                    separator={<ChevronRightIcon color="gray.500" />}
                    fontSize={'12px'}
                  >
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={
                          userSlice?.user?.roles.includes(Role.Admin)
                            ? '/adashboard'
                            : userSlice?.user?.roles.includes(Role.Client)
                            ? '/cdashboard'
                            : '/dashboard'
                        }
                      >
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        isCurrentPage
                        color="brand.primary"
                      >
                        Settings
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                  <Box>
                    <Box>
                      <Text
                        fontSize={{ base: '24px', lg: '48px' }}
                        color="brand.secondary"
                      >
                        Settings
                      </Text>
                      <Text fontSize={{ base: '12px', lg: '14px' }}>
                        Make changes and manage your account settings.
                      </Text>

                      <Box
                        py="1rem"
                        mt="48px"
                        fontSize={'14px'}
                        color="brand.secondary"
                        px={{ lg: '0.5rem' }}
                        boxShadow={
                          ' 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;'
                        }
                      >
                        <Grid
                          px="0.5rem"
                          borderRadius={'0.5rem'}
                          my="48px"
                          gridTemplateColumns={{ lg: '35% 65%' }}
                          gap={{ lg: '5px', base: '20px' }}
                        >
                          <GridItem>
                            <Text fontWeight={'bold'} mb="8px">
                              Profile
                            </Text>
                            <Text fontSize={{ lg: '14px' }}>
                              Manage your personal information and keep your
                              profile up to date.
                            </Text>

                            {msg && type === 'user' && (
                              <Text
                                color="red"
                                fontSize={'1rem'}
                                mt="2rem"
                                fontWeight={'bold'}
                              >
                                {msg}
                              </Text>
                            )}
                          </GridItem>
                          <GridItem>
                            {/*================ Profile setting form ================*/}
                            <Formik
                              initialValues={{
                                firstname: userSlice?.user?.firstname || '',
                                lastname: userSlice?.user?.lastname || '',
                              }}
                              validationSchema={ProfileSettingsSchema}
                              onSubmit={(values) => {
                                onSubmitProfileUpdate(values);
                              }}
                            >
                              {({ errors, values, setFieldValue }) => (
                                <Form>
                                  {userSlice.errMsg &&
                                  userSlice.errMsg.Id ===
                                    'PROFILE_UPDATE_ERROR' ? (
                                    <>
                                      {userSlice.errMsg.msg
                                        .split(',')
                                        .map(
                                          (message: string, index: number) => (
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
                                          ),
                                        )}
                                    </>
                                  ) : null}
                                  <Grid
                                    gridTemplateColumns={'repeat(2, 1fr)'}
                                    gap="10px"
                                    id="profile"
                                  >
                                    <GridItem
                                      borderWidth={
                                        (msg && type === 'user' && '1px') ||
                                        'none'
                                      }
                                      borderColor={
                                        (msg && type === 'user' && 'red') ||
                                        'brand.accent.danger'
                                      }
                                    >
                                      <Text mb="10px">Firstname</Text>
                                      <AuthInput
                                        name="firstname"
                                        type="text"
                                        value={values['firstname']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'firstname',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your first name"
                                      />
                                      {errors && errors.firstname ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.firstname}
                                        </Text>
                                      ) : null}
                                    </GridItem>
                                    <GridItem>
                                      <Text mb="10px">Lastname</Text>
                                      <AuthInput
                                        name="lastname"
                                        type="text"
                                        value={values['lastname']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'lastname',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your last name"
                                      />
                                      {errors && errors.lastname ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.lastname}
                                        </Text>
                                      ) : null}
                                    </GridItem>
                                  </Grid>

                                  <Flex
                                    my="20px"
                                    justifyContent={'flex-end'}
                                    alignItems={'center'}
                                  >
                                    <Button
                                      bg="brand.primary"
                                      _hover={{
                                        bg: 'white',
                                        color: 'brand.primary',
                                      }}
                                      borderWidth={'1px'}
                                      borderColor={'brand.primary'}
                                      color="white"
                                      isLoading={userSlice?.updatingProfile}
                                      type="submit"
                                    >
                                      Save
                                    </Button>
                                  </Flex>
                                </Form>
                              )}
                            </Formik>
                          </GridItem>
                        </Grid>

                        {(userSlice?.user?.roles.includes(Role.Admin) ||
                          userSlice?.user?.roles.includes(Role.Client)) && (
                          <Grid
                            id="settings"
                            px="0.5rem"
                            my="48px"
                            gridTemplateColumns={{ lg: '40% 60%' }}
                            borderWidth={
                              (msg && type === 'settings' && '1px') || 'none'
                            }
                            borderColor={
                              (msg && type == 'settings' && 'red') ||
                              'brand.accent.danger'
                            }
                            borderRadius={'0.5rem'}
                            gap={{ lg: '5px', base: '20px' }}
                          >
                            <GridItem>
                              <Text
                                color="brand.secondary"
                                mb="8px"
                                fontWeight={'bold'}
                              >
                                Company info
                              </Text>
                              <Text fontSize={{ lg: '14px' }}>
                                Provide or update your company details.
                              </Text>

                              {msg && (
                                <Text
                                  color="red"
                                  fontSize={'1rem'}
                                  mt="2rem"
                                  fontWeight={'bold'}
                                >
                                  {msg}
                                </Text>
                              )}
                            </GridItem>

                            {/*================ Company setting form ================*/}
                            <Formik
                              initialValues={{
                                companyName:
                                  userSlice?.user?.company?.companyName || '',
                                country:
                                  userSlice?.user?.company?.country || '',
                                address:
                                  userSlice?.user?.company?.address || '',
                                city: userSlice?.user?.company?.city || '',
                                state: userSlice?.user?.company?.state || '',
                                postalCode:
                                  userSlice?.user?.company?.postalCode || '',
                                logo:
                                  userSlice?.user?.company?.logo ||
                                  uploadedImageUrl,
                              }}
                              validationSchema={CompanySchema}
                              onSubmit={(values) => {
                                onSubmitCompanyUpdate(values);
                              }}
                            >
                              {({ errors, values, setFieldValue }) => (
                                <Form>
                                  {userSlice.errMsg &&
                                    userSlice.errMsg.Id ===
                                      'CLIENT_COMPANY_SETTINGS_ERROR' &&
                                    userSlice.errMsg.msg
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

                                  <GridItem>
                                    <Box mb="20px">
                                      <Text mb="10px">Company Name</Text>
                                      <AuthInput
                                        name="companyName"
                                        type="text"
                                        value={values['companyName']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'companyName',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your company name"
                                      />
                                      {errors && errors.companyName ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.companyName}
                                        </Text>
                                      ) : null}
                                    </Box>

                                    <Box mb="20px">
                                      {/* <InputGroup height={'43px'}>
                                        <InputLeftElement pointerEvents="none">
                                          <Avatar
                                            borderRadius={'none'}
                                            size={'xs'}
                                            name={values['companyName']}
                                            src={values['logo']}
                                            rounded="none"
                                          />
                                        </InputLeftElement>
                                        <Input
                                          onChange={(e) =>
                                            setFieldValue(
                                              'logo',
                                              e.target.value,
                                            )
                                          }
                                          value={values['logo']}
                                          outline={'none'}
                                          boxShadow={'none'}
                                          borderColor="rgba(208, 213, 221, 1)"
                                          type="url"
                                          placeholder="Company's Logo URL"
                                          fontSize={'14px'}
                                          _focus={{
                                            borderColor:
                                              'rgba(208, 213, 221, 1)',
                                            boxShadow: 'none',
                                          }}
                                        />
                                      </InputGroup> */}
                                      {/* <HStack
                                        w="full"
                                        alignItems={'center'}
                                        bg="red"
                                      >
                                        <FileUpload
                                          {...{
                                            setUploadedImageUrl,
                                            uploadedImageUrl,
                                            logo: values['logo'],
                                            setFieldValue,
                                          }}
                                        />
                                        <Text color={'brand.secondary'}>
                                          Company Logo
                                        </Text>
                                      </HStack> */}

                                      {errors && errors.logo ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.logo}
                                        </Text>
                                      ) : null}
                                    </Box>

                                    <Box mb="20px" display={'none'}>
                                      <Text mb="10px">Country</Text>
                                      <AuthInput
                                        name="country"
                                        type="text"
                                        value={values['country']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'country',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your country"
                                      />
                                      {errors && errors.country ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.country}
                                        </Text>
                                      ) : null}
                                    </Box>

                                    <Box mb="20px" display={'none'}>
                                      <Text mb="10px">Company address</Text>
                                      <AuthInput
                                        name="address"
                                        type="text"
                                        value={values['address']}
                                        onChange={(e) =>
                                          setFieldValue(
                                            'address',
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Enter your company address"
                                      />
                                      {errors && errors.address ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.address}
                                        </Text>
                                      ) : null}
                                    </Box>

                                    <Grid
                                      gridTemplateColumns={{
                                        lg: 'repeat(3, 1fr)',
                                      }}
                                      gap={'20px'}
                                      display={'none'}
                                    >
                                      <GridItem>
                                        <Text mb="1rem">City</Text>
                                        <AuthInput
                                          name="city"
                                          type="text"
                                          value={values['city']}
                                          onChange={(e) =>
                                            setFieldValue(
                                              'city',
                                              e.target.value,
                                            )
                                          }
                                          placeholder="Enter your city"
                                        />
                                        {errors && errors.city ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.city}
                                          </Text>
                                        ) : null}
                                      </GridItem>

                                      <GridItem>
                                        <Text mb="1rem">State/Province</Text>
                                        <AuthInput
                                          name="state"
                                          type="text"
                                          value={values['state']}
                                          onChange={(e) =>
                                            setFieldValue(
                                              'state',
                                              e.target.value,
                                            )
                                          }
                                          placeholder="Enter your State/Porvince"
                                        />
                                        {errors && errors.state ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.state}
                                          </Text>
                                        ) : null}
                                      </GridItem>

                                      <GridItem>
                                        <Text mb="1rem">Zip/Postal Code</Text>
                                        <AuthInput
                                          name="postalCode"
                                          type=""
                                          value={values['postalCode']}
                                          onChange={(e) =>
                                            setFieldValue(
                                              'postalCode',
                                              e.target.value,
                                            )
                                          }
                                          placeholder="Enter your Zip/Postal Code"
                                        />
                                        {errors && errors.postalCode ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.postalCode}
                                          </Text>
                                        ) : null}
                                      </GridItem>
                                    </Grid>

                                    <Flex
                                      my="20px"
                                      justifyContent={'flex-end'}
                                      alignItems={'center'}
                                    >
                                      <Button
                                        bg="brand.primary"
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.primary',
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'brand.primary'}
                                        color="white"
                                        isLoading={userSlice?.updatingCompany}
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                </Form>
                              )}
                            </Formik>
                          </Grid>
                        )}
                        <Grid
                          my="48px"
                          gridTemplateColumns={'40% 60%'}
                          gap="10px"
                          display={'none'}
                        >
                          <GridItem>
                            <Text
                              color="brand.secondary"
                              fontWeight={'bold'}
                              mb="8px"
                            >
                              Notifications
                            </Text>
                            <Text fontSize={{ lg: '14px' }}>
                              Customize your notifications preferences to stay
                              informed about important updates on your
                              hackathons.
                            </Text>
                          </GridItem>

                          {/*================ Notifications setting form ================*/}
                          <Formik
                            initialValues={{
                              payout:
                                userSlice?.user?.notifications?.payout || false,
                              participants:
                                userSlice?.user?.notifications?.participants ||
                                false,
                              completed:
                                userSlice?.user?.notifications?.completed ||
                                false,
                              recentHackathon:
                                userSlice?.user?.notifications
                                  ?.recentHackathon || false,
                              hackathonSetup:
                                userSlice?.user?.notifications
                                  ?.hackathonSetup || false,
                              rewards:
                                userSlice?.user?.notifications?.rewards ||
                                false,
                            }}
                            // validationSchema={NotificationsSchema}
                            onSubmit={(values) => {
                              onNotificationsUpdate(values);
                            }}
                          >
                            {({ errors, values, setFieldValue }) => (
                              <Form>
                                {userSlice.errMsg &&
                                userSlice.errMsg.Id ===
                                  'CLIENT_NOTIFICATIONS_SETTINGS_ERROR' ? (
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
                                {userSlice?.user?.roles.includes(
                                  Role.Client,
                                ) ? (
                                  <GridItem>
                                    <Text fontWeight={'bold'} mb="20px">
                                      By Email
                                    </Text>
                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="payout"
                                        isChecked={values['payout']}
                                        onChange={() =>
                                          setFieldValue(
                                            'payout',
                                            !values['payout'],
                                          )
                                        }
                                      />

                                      {errors && errors.payout ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.payout}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>Payout</Text>
                                        <Text>
                                          Get notified when a payout is made to
                                          the winner of your hackathons
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="participants"
                                        isChecked={values['participants']}
                                        onChange={() =>
                                          setFieldValue(
                                            'participants',
                                            !values['participants'],
                                          )
                                        }
                                      />

                                      {errors && errors.participants ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.participants}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Participants
                                        </Text>
                                        <Text>
                                          Get notified when a participant
                                          applies for a hackathon
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="completed"
                                        isChecked={values['completed']}
                                        onChange={() =>
                                          setFieldValue(
                                            'completed',
                                            !values['completed'],
                                          )
                                        }
                                      />

                                      {errors && errors.completed ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.completed}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Completed
                                        </Text>
                                        <Text>
                                          Get notified when a participant
                                          completes a hackathon
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex
                                      my="20px"
                                      justifyContent={'flex-end'}
                                      alignItems={'center'}
                                    >
                                      <Button
                                        bg="brand.primary"
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.primary',
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'brand.primary'}
                                        color="white"
                                        isLoading={
                                          userSlice?.updatingNotifications
                                        }
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                ) : userSlice?.user?.roles.includes(
                                    Role.User,
                                  ) ? (
                                  <GridItem>
                                    <Text fontWeight={'bold'} mb="20px">
                                      By Email
                                    </Text>
                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="recentHackathon"
                                        isChecked={values['recentHackathon']}
                                        onChange={() =>
                                          setFieldValue(
                                            'recentHackathon',
                                            !values['recentHackathon'],
                                          )
                                        }
                                      />

                                      {errors && errors.recentHackathon ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.recentHackathon}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Recent hackathons
                                        </Text>
                                        <Text>
                                          Get notified when a new hackathons is
                                          launched
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="participants"
                                        isChecked={values['participants']}
                                        onChange={() =>
                                          setFieldValue(
                                            'participants',
                                            !values['participants'],
                                          )
                                        }
                                      />

                                      {errors && errors.participants ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.participants}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Participants
                                        </Text>
                                        <Text>
                                          Get notified when a participant
                                          applies for a hackathon
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex alignItems={'flex-start'} mb="1rem">
                                      <Checkbox
                                        size={'md'}
                                        name="completed"
                                        isChecked={values['completed']}
                                        onChange={() =>
                                          setFieldValue(
                                            'completed',
                                            !values['completed'],
                                          )
                                        }
                                      />

                                      {errors && errors.completed ? (
                                        <Text
                                          fontSize={'12px'}
                                          mt="0.2rem"
                                          color="brand.danger"
                                        >
                                          {errors.completed}
                                        </Text>
                                      ) : null}
                                      <Box ml="10px">
                                        <Text fontWeight={'bold'}>
                                          Completed
                                        </Text>
                                        <Text>
                                          Get notified when a participant
                                          completes a hackathon
                                        </Text>
                                      </Box>
                                    </Flex>

                                    <Flex
                                      my="20px"
                                      justifyContent={'flex-end'}
                                      alignItems={'center'}
                                    >
                                      <Button
                                        bg="brand.primary"
                                        _hover={{
                                          bg: 'white',
                                          color: 'brand.primary',
                                        }}
                                        borderWidth={'1px'}
                                        borderColor={'brand.primary'}
                                        color="white"
                                        isLoading={
                                          userSlice?.updatingNotifications
                                        }
                                        type="submit"
                                      >
                                        Save
                                      </Button>
                                    </Flex>
                                  </GridItem>
                                ) : (
                                  userSlice?.user?.roles.includes(
                                    Role.Admin,
                                  ) && (
                                    <GridItem>
                                      <Text fontWeight={'bold'} mb="20px">
                                        By Email
                                      </Text>
                                      <Flex alignItems={'flex-start'} mb="1rem">
                                        <Checkbox
                                          size={'md'}
                                          name="payout"
                                          isChecked={values['payout']}
                                          onChange={() =>
                                            setFieldValue(
                                              'payout',
                                              !values['payout'],
                                            )
                                          }
                                        />

                                        {errors && errors.payout ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.payout}
                                          </Text>
                                        ) : null}
                                        <Box ml="10px">
                                          <Text fontWeight={'bold'}>
                                            Payout
                                          </Text>
                                          <Text>
                                            Get notified when a payout is made
                                            to the winner of your hackathons
                                          </Text>
                                        </Box>
                                      </Flex>

                                      <Flex alignItems={'flex-start'} mb="1rem">
                                        <Checkbox
                                          size={'md'}
                                          name="hackathonSetup"
                                          isChecked={values['hackathonSetup']}
                                          onChange={() =>
                                            setFieldValue(
                                              'hackathonSetup',
                                              !values['hackathonSetup'],
                                            )
                                          }
                                        />

                                        {errors && errors.hackathonSetup ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.hackathonSetup}
                                          </Text>
                                        ) : null}
                                        <Box ml="10px">
                                          <Text fontWeight={'bold'}>
                                            Hackathon Set-up
                                          </Text>
                                          <Text>
                                            The admin is notified, when a client
                                            sets up a hackathon and the admin
                                            needs to approve it
                                          </Text>
                                        </Box>
                                      </Flex>

                                      <Flex alignItems={'flex-start'} mb="1rem">
                                        <Checkbox
                                          size={'md'}
                                          name="rewards"
                                          isChecked={values.rewards}
                                          onChange={() =>
                                            setFieldValue(
                                              'rewards',
                                              !values.rewards,
                                            )
                                          }
                                        />

                                        {errors && errors.rewards ? (
                                          <Text
                                            fontSize={'12px'}
                                            mt="0.2rem"
                                            color="brand.danger"
                                          >
                                            {errors.rewards}
                                          </Text>
                                        ) : null}
                                        <Box ml="10px">
                                          <Text fontWeight={'bold'}>
                                            Rewards
                                          </Text>
                                          <Text>
                                            The admin is notified, when a
                                            hackathon is completed and rewards
                                            are sent out.
                                          </Text>
                                        </Box>
                                      </Flex>

                                      <Flex
                                        my="20px"
                                        justifyContent={'flex-end'}
                                        alignItems={'center'}
                                      >
                                        <Button
                                          bg="brand.primary"
                                          _hover={{
                                            bg: 'white',
                                            color: 'brand.primary',
                                          }}
                                          borderWidth={'1px'}
                                          borderColor={'brand.primary'}
                                          color="white"
                                          isLoading={
                                            userSlice?.updatingNotifications
                                          }
                                          type="submit"
                                        >
                                          Save
                                        </Button>
                                      </Flex>
                                    </GridItem>
                                  )
                                )}
                              </Form>
                            )}
                          </Formik>
                        </Grid>

                        {!userSlice?.user?.roles.includes(Role.Admin) && (
                          <Grid
                            my="48px"
                            gridTemplateColumns={'40% 60%'}
                            gap="10px"
                            display={'none'}
                          >
                            <GridItem>
                              <Text
                                color="brand.secondary"
                                fontWeight={'bold'}
                                mb="8px"
                              >
                                Payment info
                              </Text>
                              <Text fontSize={{ lg: '14px' }}>
                                Connect your wallet address to ensure smooth
                                transactions for your hackathons.
                              </Text>
                            </GridItem>
                            <GridItem>
                              <Text fontWeight={'bold'} mb="2rem">
                                Connect Wallet
                              </Text>

                              <Button
                                bg="white"
                                _hover={{
                                  bg: 'white',
                                  color: 'brand.primary',
                                }}
                                borderWidth={'1px'}
                                borderColor={'black'}
                                color="black"
                                leftIcon={<ConnectIcon />}
                              >
                                Connect Wallet
                              </Button>

                              <Text fontWeight={'bold'} mt="2rem">
                                Supported Wallets
                              </Text>

                              <Box mt="2rem">
                                <Grid
                                  gridTemplateColumns={'repeat(2, 1fr)'}
                                  gap={'20px'}
                                >
                                  <Box
                                    p="1rem"
                                    borderColor={'brand.secondary'}
                                    borderWidth={'1px'}
                                    boxShadow={
                                      '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                    }
                                    borderRadius={'4px'}
                                  >
                                    <Flex alignItems={'center'}>
                                      <WalletConnectIcon />
                                      <Text ml="1rem">Wallet Connect</Text>
                                    </Flex>
                                    <Text mt="0.5rem">
                                      Connect with Wallet Connect
                                    </Text>
                                  </Box>

                                  <Box
                                    p="1rem"
                                    borderColor={'brand.secondary'}
                                    borderWidth={'1px'}
                                    boxShadow={
                                      '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                    }
                                    borderRadius={'4px'}
                                  >
                                    <Flex alignItems={'center'}>
                                      <WalletConnectIcon />
                                      <Text ml="1rem">Wallet Connect</Text>
                                    </Flex>
                                    <Text mt="0.5rem">
                                      Connect with Wallet Connect
                                    </Text>
                                  </Box>

                                  <Box
                                    p="1rem"
                                    borderColor={'brand.secondary'}
                                    borderWidth={'1px'}
                                    boxShadow={
                                      '0px 4px 20px 0px rgba(0, 0, 0, 0.1)'
                                    }
                                    borderRadius={'4px'}
                                  >
                                    <Flex alignItems={'center'}>
                                      <WalletConnectIcon />
                                      <Text ml="1rem">Wallet Connect</Text>
                                    </Flex>
                                    <Text mt="0.5rem">
                                      Connect with Wallet Connect
                                    </Text>
                                  </Box>
                                </Grid>
                              </Box>
                            </GridItem>
                          </Grid>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </>
        </BodyWrapper>
      </Suspense>
    </ConditionalRoute>
  );
}

export default ProfileSettings;
