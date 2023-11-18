/*==================== Import necessary components and libraries ====================*/ import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import {
  getHackathonDetailForAdmin,
  updateHackathon,
} from '../../../store/slices/hackathonSlice';
import {
  HackathonStateProps,
  HackathonUpdateProps,
} from '../../../store/interfaces/hackathon.interface';
import { HomeNavbar, MetaTags } from '../../../reusable/components';
import PageLoader from '../../../reusable/components/PageLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  resetErrMsg,
  resetUpdated,
} from '../../../store/slices/hackathonSlice';
import { supportedTokens } from '../../../utils/tokens';
import moment from 'moment';

/*====================  Define the AdminEditHackathon component ====================*/
function AdminEditHackathon() {
  // Get hackathon state from Redux
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  /*==================== Define state variables to manage form inputs and other data ====================*/
  const [hackathonName, setHackathonName] = useState<any>('');
  const [description, setDescription] = useState<any>('');
  const [submissionCriteria, setSubmissionCriteria] = useState<any>('');
  const [events, setEvents] = useState<any>('');
  const [startDate, setStartDate] = useState<any>('');
  const [submissionDeadline, setSubmissionDeadline] = useState<any>('');
  const [endDate, setEndDate] = useState('');

  const [logo, setLogo] = useState<string | undefined>('');

  /*==================== Initialize Chakra UI toast for notifications ====================*/
  const toast = useToast();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  /*==================== Initialize dispatch function from Redux ====================*/
  const dispatch = useDispatch<any>();

  /*==================== Get hackathon ID from URL ====================*/
  const { id: hackathonId } = useParams();

  /*==================== Display error toast notifications ====================*/
  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          status: 'error',
          position: 'top-right',
          duration: 10000,
          onCloseComplete: () => dispatch(resetErrMsg()),
          isClosable: true,
        }),
      ),
    );
  };

  /*==================== Get hackathon details from Redux ====================*/
  useEffect(() => {
    dispatch(getHackathonDetailForAdmin(hackathonId));
  }, [hackathonId]);

  /*==================== Set hackathon details in state variables ====================*/
  useEffect(() => {
    setHackathonName(hackathonSlice?.adminHackInfo?.hackathonName);

    setLogo(hackathonSlice?.adminHackInfo?.company?.logo);

    setDescription(hackathonSlice?.adminHackInfo?.description);

    setSubmissionCriteria(hackathonSlice?.adminHackInfo?.submissionCriteria);

    setEvents(hackathonSlice?.adminHackInfo?.events);

    setStartDate(
      moment(hackathonSlice?.adminHackInfo?.startDate).format(
        'YYYY-MM-DDTHH:mm:ss',
      ),
    );

    setSubmissionDeadline(
      moment(hackathonSlice?.adminHackInfo?.submissionDeadline).format(
        'YYYY-MM-DDTHH:mm:ss',
      ),
    );

    setEndDate(
      moment(hackathonSlice?.adminHackInfo?.endDate).format(
        'YYYY-MM-DDTHH:mm:ss',
      ),
    );
  }, [hackathonSlice?.adminHackInfo]);

  /*==================== Display error toast notifications ====================*/
  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'UPDATE_HACKATHON_ERROR'
    ) {
      displayErrorToasts();
    }

    if (hackathonSlice?.updatedHackathon) {
      toast({
        title: 'Success',
        description: 'Your hackathon has been updated',
        status: 'success',
        duration: 10000,
        onCloseComplete: () => dispatch(resetUpdated()),
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [hackathonSlice?.updatedHackathon, hackathonSlice?.errMsg]);

  /*==================== Set logo URL ====================*/
  const onSetLogo = () => {
    if (!logo) return;

    const updatedLogo = logo.startsWith('www.')
      ? logo.replace(/^www\./i, 'https://')
      : logo.startsWith('http://')
      ? logo.replace(/^http:/i, 'https:')
      : logo.startsWith('https://')
      ? logo
      : 'https://' + logo;

    return updatedLogo;
  };

  /*==================== Update hackathon details ====================*/
  const onSend = async () => {
    if (
      !hackathonName ||
      !description ||
      !submissionCriteria ||
      !events ||
      !logo
    ) {
      return toast({
        description: 'Please fill all the fields to proceed',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!startDate) {
      return toast({
        description: `Please select the start date`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!endDate) {
      return toast({
        description: `Please select the end date`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    if (!submissionDeadline) {
      return toast({
        description: `Please select the submission deadline`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    const data: HackathonUpdateProps = {
      hackathonName,
      logo: onSetLogo(),
      description,
      submissionCriteria,
      events,
      startDate: `${startDate}Z`,
      submissionDeadline: `${submissionDeadline}Z`,
      endDate: `${endDate}Z`,
      hackathonId: Number(hackathonId),
    };

    dispatch(updateHackathon(data));
  };

  /*==================== Get reward token details ====================*/
  const rewardToken = supportedTokens.find(
    (token) =>
      token.address === hackathonSlice?.adminHackInfo?.rewardTokenAddress,
  );

  /*==================== Return the AdminEditHackathon component ====================*/
  return (
    <Suspense fallback={<PageLoader />}>
      <ConditionalRoute
        redirectTo="/404"
        condition={(hackathonId && true) || false}
      >
        <ConditionalRoute
          redirectTo="/login"
          condition={userSlice?.isAuthenticated || false}
        >
          <ConditionalRoute
            redirectTo="/404"
            condition={
              userSlice.user && userSlice.user.roles.includes(Role.Admin)
                ? true
                : false
            }
          >
            <>
              {/*========== Render the BodyWrapper component ==========*/}
              <BodyWrapper>
                <>
                  <MetaTags
                    title={`${hackathonSlice?.adminHackInfo?.hackathonName} | Hackathon | techFiesta`}
                    description={`${hackathonSlice?.adminHackInfo?.description.slice(
                      0,
                      100,
                    )}`}
                    pageUrl={window.location.href}
                  />

                  {/*========== Render the HomeNavbar component ==========*/}
                  {hackathonSlice?.fetchingHackInfo ? (
                    <Flex
                      alignItems={'center'}
                      justifyContent={'center'}
                      h="100vh"
                    >
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="brand.primary"
                        size="xl"
                      />
                    </Flex>
                  ) : (
                    <>
                      <HomeNavbar />

                      <Box
                        w={{ lg: '800px' }}
                        mx="auto"
                        mb={'100px'}
                        mt={{ lg: '6rem', base: '8rem' }}
                        px={{ base: '1rem', lg: 'unset' }}
                      >
                        {/*=========== Render the PageLoader component ==========*/}
                        {!hackathonSlice?.fetchingHacks ? (
                          <>
                            <Box mb={'24px'}>
                              <Box mb={'40px'}>
                                <Text
                                  fontWeight={'700'}
                                  fontSize={{ base: '24px', lg: '36px' }}
                                  color="brand.secondary"
                                >
                                  Edit Hackathon
                                </Text>
                              </Box>

                              <Box
                                px="24px"
                                display={'flex'}
                                alignItems={'center'}
                                flexDirection={'column'}
                              >
                                <Avatar
                                  name={
                                    hackathonSlice?.adminHackInfo?.company
                                      ?.companyName
                                  }
                                  src={logo}
                                  size={{ base: 'md', lg: 'lg' }}
                                  bg={'gray.200'}
                                  borderRadius={'none'}
                                  rounded={'none'}
                                />
                              </Box>
                            </Box>

                            <Box
                              display={'flex'}
                              flexDirection={'column'}
                              gap={'6'}
                              textColor="brand.secondary"
                            >
                              {/*=========== Render the FormLabel component ==========*/}
                              <FormControl>
                                <FormLabel fontSize="16px" fontWeight={'500'}>
                                  Hackathon Name
                                </FormLabel>
                                <Input
                                  onChange={(e) =>
                                    setHackathonName(e.target.value)
                                  }
                                  value={hackathonName}
                                  fontSize="14px"
                                  fontWeight={'400'}
                                  outline={'unset'}
                                  boxShadow="none"
                                  borderColor="black"
                                  type="text"
                                  borderRadius={'none'}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel fontSize="16px" fontWeight={'500'}>
                                  Company Logo Link
                                </FormLabel>
                                <Input
                                  value={logo}
                                  fontSize="14px"
                                  fontWeight={'400'}
                                  outline={'unset'}
                                  boxShadow="none"
                                  borderColor="black"
                                  type="text"
                                  borderRadius={'none'}
                                  onChange={(e) => setLogo(e.target.value)}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel fontSize="16px" fontWeight={'500'}>
                                  Hackathon Overview
                                </FormLabel>

                                <div
                                  style={{
                                    height: '200px',
                                    minHeight: '200px',
                                    maxHeight: '100%',
                                    position: 'relative',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    marginBottom: '24px',
                                  }}
                                >
                                  <ReactQuill
                                    style={{
                                      height: '100%',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                    }}
                                    theme="snow"
                                    value={description}
                                    onChange={(value) => setDescription(value)}
                                  />
                                </div>
                              </FormControl>

                              <FormControl>
                                <FormLabel fontSize="16px" fontWeight={'500'}>
                                  Hackathon Submission Criteria
                                </FormLabel>

                                <div
                                  style={{
                                    height: '200px',
                                    minHeight: '200px',
                                    maxHeight: '100%',
                                    position: 'relative',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    marginBottom: '24px',
                                  }}
                                >
                                  <ReactQuill
                                    style={{
                                      height: '100%',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                    }}
                                    theme="snow"
                                    value={submissionCriteria}
                                    onChange={(value) =>
                                      setSubmissionCriteria(value)
                                    }
                                  />
                                </div>
                              </FormControl>

                              <FormControl>
                                <FormLabel fontSize="16px" fontWeight={'500'}>
                                  Hackathon Events
                                </FormLabel>

                                <div
                                  style={{
                                    height: '200px',
                                    minHeight: '200px',
                                    maxHeight: '100%',
                                    position: 'relative',
                                    fontSize: '14px',
                                    fontWeight: '400',
                                    marginBottom: '24px',
                                  }}
                                >
                                  <ReactQuill
                                    style={{
                                      height: '100%',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                    }}
                                    theme="snow"
                                    value={events}
                                    onChange={(value) => setEvents(value)}
                                  />
                                </div>
                              </FormControl>

                              <Box
                                display={'flex'}
                                flexDirection={'column'}
                                gap={'6'}
                                maxW={{ base: 'full', md: '50%' }}
                              >
                                <FormControl mt="24px">
                                  <FormLabel fontSize="16px" fontWeight={'500'}>
                                    How many participants do you want to reward
                                  </FormLabel>

                                  <HStack>
                                    {hackathonSlice?.adminHackInfo?.rewardsArrayInUSD.map(
                                      (price, index) => (
                                        <VStack
                                          alignItems={'flex-start'}
                                          key={index}
                                        >
                                          <HStack>
                                            <Box
                                              display={'flex'}
                                              flexDirection={'column'}
                                            >
                                              <Flex
                                                borderWidth={'1px'}
                                                padding={'8px'}
                                                alignItems={'center'}
                                                borderLeftWidth={'5px'}
                                                borderLeftColor={
                                                  'brand.primary'
                                                }
                                                fontSize={'1rem'}
                                                pl={'10px'}
                                                borderRadius={'4px'}
                                                fontWeight={'600'}
                                              >
                                                <Text mr="10.5px">{price}</Text>

                                                {rewardToken?.symbol}
                                              </Flex>
                                            </Box>
                                          </HStack>
                                          <Text mt="5px" fontSize={'10px'}>
                                            {index + 1} participant
                                          </Text>
                                        </VStack>
                                      ),
                                    )}
                                  </HStack>
                                </FormControl>

                                <FormControl>
                                  <FormLabel fontSize="16px" fontWeight={'500'}>
                                    Start Date
                                  </FormLabel>
                                  <Flex gap={'4'} flexDirection={'row'}>
                                    <Input
                                      fontSize="14px"
                                      fontWeight={'400'}
                                      outline={'unset'}
                                      boxShadow="none"
                                      borderColor="black"
                                      placeholder=""
                                      size="md"
                                      borderRadius={'none'}
                                      value={startDate}
                                      type="datetime-local"
                                      onChange={(e) =>
                                        setStartDate(e.target.value)
                                      }
                                    />
                                  </Flex>
                                </FormControl>

                                <FormControl>
                                  <FormLabel fontSize="16px" fontWeight={'500'}>
                                    End Date
                                  </FormLabel>
                                  <Flex gap={'4'} flexDirection={'row'}>
                                    <Input
                                      fontSize="14px"
                                      fontWeight={'400'}
                                      outline={'unset'}
                                      boxShadow="none"
                                      borderColor="black"
                                      placeholder=""
                                      size="md"
                                      borderRadius={'none'}
                                      value={endDate}
                                      type="datetime-local"
                                      onChange={(e) =>
                                        setEndDate(e.target.value)
                                      }
                                    />
                                  </Flex>
                                </FormControl>

                                <FormControl>
                                  <FormLabel fontSize="16px" fontWeight={'500'}>
                                    Submission deadline
                                  </FormLabel>
                                  <Flex gap={'4'} flexDirection={'row'}>
                                    <Input
                                      fontSize="14px"
                                      fontWeight={'400'}
                                      outline={'unset'}
                                      boxShadow="none"
                                      borderColor="black"
                                      placeholder=""
                                      size="md"
                                      type="datetime-local"
                                      borderRadius={'none'}
                                      onChange={(e) =>
                                        setSubmissionDeadline(e.target.value)
                                      }
                                      value={submissionDeadline}
                                    />
                                  </Flex>
                                </FormControl>
                              </Box>
                            </Box>
                            <Flex
                              alignItems={'center'}
                              justifyContent={'flex-end'}
                              mt={'40px'}
                            >
                              <Button
                                onClick={onSend}
                                borderRadius={'none'}
                                bg="brand.primary"
                                color="white"
                                fontSize={'16px'}
                                fontWeight="700"
                                _hover={{
                                  bg: 'white',
                                  color: 'brand.primary',
                                }}
                                borderWidth={'1px'}
                                borderColor={'brand.primary'}
                                isLoading={hackathonSlice?.updatingHackathon}
                              >
                                Save changes
                              </Button>
                            </Flex>
                          </>
                        ) : (
                          <Flex
                            h="full"
                            w="full"
                            justifyContent={'center'}
                            alignItems={'center'}
                            mt="2rem"
                          >
                            <PageLoader />
                          </Flex>
                        )}
                      </Box>
                    </>
                  )}
                </>
              </BodyWrapper>
              {/*========== End of the AdminEditHackathon component ==========*/}
            </>
          </ConditionalRoute>
        </ConditionalRoute>
      </ConditionalRoute>
    </Suspense>
  );
}

export default AdminEditHackathon;
