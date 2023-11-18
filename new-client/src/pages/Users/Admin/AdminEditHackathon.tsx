/*==================== Import necessary components and libraries ====================*/ import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Spinner,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useParams } from 'react-router-dom';
import React, { Suspense, useEffect, useState } from 'react';
import {
  getHackathonDetailForAdmin,
  updateHackathon,
} from '../../../store/slices/hackathonSlice';
import {
  HackathonStateProps,
  HackathonUpdateProps,
} from '../../../store/interfaces/hackathon.interface';
import PageLoader from '../../../reusable/components/PageLoader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  resetErrMsg,
  resetUpdated,
} from '../../../store/slices/hackathonSlice';
import { supportedTokens } from '../../../utils/tokens';
import moment from 'moment';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { DatePicker, TimePicker } from 'antd';
import { BiSave } from 'react-icons/bi';
import AuthNavbar from '../../../reusable/components/AuthNavbar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { AdminSideMenu } from '.';

const MetaTags = React.lazy(
  () => import('../../../reusable/components/MetaTags'),
);

dayjs.extend(utc);

/*====================  Define the AdminEditHackathon component ====================*/
function AdminEditHackathon() {
  const steps = [
    { title: 'Details' },
    { title: 'Rewards' },
    { title: 'Criteria' },
    { title: 'Events' },
  ];

  // Get hackathon state from Redux
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  /*==================== Define state variables to manage form inputs and other data ====================*/
  const [size /*setSize*/] = useState<SizeType>('small');
  const [hackathonName, setHackathonName] = useState<any>('');
  const [description, setDescription] = useState<any>('');
  const [submissionCriteria, setSubmissionCriteria] = useState<any>('');
  const [events, setEvents] = useState<any>('');
  const [startDate, setStartDate] = useState<any>('');
  const [submissionDeadline, setSubmissionDeadline] = useState<any>('');
  const [endDate, setEndDate] = useState('');

  //Sets date and time properties
  const [adate, setAdate] = useState<any>(null);
  const [atime, setAtime] = useState<any>(null);
  // Sets deadline time and date
  const [ddate, setDDate] = useState<any>(null);
  const [dtime, setDTime] = useState<any>(null);
  // Sets end time and date
  const [edate, setEDate] = useState<any>(null);
  const [etime, setETime] = useState<any>(null);

  /* sets time and dates */
  const onGetDDate = (date: any, _: any) => setDDate(date);
  const onGetDTime = (time: any, _: any) => setDTime(time);
  const onGetEDate = (date: any, _: any) => setEDate(date);
  const onGetETime = (time: any, _: any) => setETime(time);
  const onGetStartDate = (date: any, _: any) => setAdate(date);
  const onGetStartTime = (time: any, _: any) => setAtime(time);

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

  //================================ effects for dates and times ================================
  useEffect(() => {
    if (adate && atime) {
      const formattedADate = dayjs(adate).format('YYYY-MM-DD');
      const formattedATime = dayjs(atime, 'HH:mm:ss').format('HH:mm:ss');
      setStartDate(`${formattedADate}T${formattedATime}`);
    }
  }, [adate, atime]);

  useEffect(() => {
    if (ddate && dtime) {
      const formattedDDate = dayjs(ddate).format('YYYY-MM-DD');
      const formattedDTime = dayjs(dtime, 'HH:mm:ss').format('HH:mm:ss');
      setSubmissionDeadline(`${formattedDDate}T${formattedDTime}`);
    }
  }, [ddate, dtime]);

  useEffect(() => {
    if (edate && etime) {
      const formattedEDate = dayjs(edate).format('YYYY-MM-DD');
      const formattedETime = dayjs(etime, 'HH:mm:ss').format('HH:mm:ss');
      setEndDate(`${formattedEDate}T${formattedETime}`);
    }
  }, [edate, etime]);

  /*==================== Set hackathon details in state variables ====================*/
  useEffect(() => {
    setAdate(dayjs.utc(hackathonSlice?.adminHackInfo?.startDate));
    setAtime(dayjs.utc(hackathonSlice?.adminHackInfo?.startDate));

    setDDate(dayjs.utc(hackathonSlice?.adminHackInfo?.submissionDeadline));
    setDTime(dayjs.utc(hackathonSlice?.adminHackInfo?.submissionDeadline));

    setEDate(dayjs.utc(hackathonSlice?.adminHackInfo?.endDate));
    setETime(dayjs.utc(hackathonSlice?.adminHackInfo?.endDate));

    setHackathonName(hackathonSlice?.adminHackInfo?.hackathonName);

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

  /*==================== Update hackathon details ====================*/
  const onSend = async () => {
    if (!hackathonName || !description || !submissionCriteria || !events) {
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
                          <AdminSideMenu />
                        </Box>
                        <Box
                          flex="1"
                          overflowX="auto"
                          ml={{ base: '0', lg: '280px' }}
                          px={{ base: '1rem', md: '0rem', lg: '2rem' }}
                        >
                          {!hackathonSlice?.fetchingHacks ? (
                            <>
                              <Box my={{ base: '80px', lg: '90px' }} py="1rem">
                                <Box
                                  borderRadius={'0.5rem'}
                                  bg={'#FFFFFF'}
                                  boxShadow={
                                    ' 0px 3px 4px 0px rgba(60, 77, 109, 0.25)'
                                  }
                                  backdropFilter={'blur(20px)'}
                                  px="1.25rem"
                                  py={'1.25rem'}
                                  gap={'2.25rem'}
                                  display={'flex'}
                                  flexDirection={'column'}
                                  w={{ lg: '80%' }}
                                  margin={'auto'}
                                >
                                  <Stepper
                                    size="xs"
                                    index={activeStep}
                                    bg={'rgba(60, 77, 109, 0.05)'}
                                    border={
                                      '0.5px solid rgba(60, 77, 109, 0.50)'
                                    }
                                    borderRadius={'0.5rem'}
                                    p={'1rem'}
                                    color={'#3C4D6D'}
                                    flexWrap={'wrap'}
                                    fontSize={{ base: '14px', md: '1rem' }}
                                  >
                                    {steps.map((step, index) => (
                                      <Step key={index}>
                                        <StepIndicator borderRadius={'0.5rem'}>
                                          <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                          />
                                        </StepIndicator>

                                        <Box flexShrink="0">
                                          <StepTitle>
                                            <Text color="brand.secondary">
                                              {step.title}
                                            </Text>
                                          </StepTitle>
                                        </Box>

                                        <StepSeparator />
                                      </Step>
                                    ))}
                                  </Stepper>

                                  <Stack>
                                    <Stack
                                      display={
                                        activeStep === 0 ? 'block' : 'none'
                                      }
                                    >
                                      <Text
                                        fontSize={{ lg: '1.5rem' }}
                                        fontWeight={'700'}
                                        mb={'2.25rem'}
                                        color={'#3C4D6D'}
                                      >
                                        Provide hackathon details
                                      </Text>

                                      <Flex
                                        flexDirection={'column'}
                                        gap={'1.25rem'}
                                      >
                                        <Input
                                          boxShadow="none"
                                          bg="white"
                                          borderColor="rgba(60, 77, 109, 0.80)"
                                          borderWidth={'0.5px'}
                                          w={'100%'}
                                          h={'3rem'}
                                          fontSize={'1rem'}
                                          color={'brand.secondary'}
                                          p="1.12rem 0.75rem"
                                          outline="none"
                                          borderRadius={'0.5rem'}
                                          name="name"
                                          type={'text'}
                                          placeholder={'Hackathon Name'}
                                          onChange={(e) =>
                                            setHackathonName(e.target.value)
                                          }
                                          value={hackathonName}
                                        />
                                        <Box
                                          mb={{
                                            lg: '4rem',
                                            md: '4rem',
                                            sm: '7rem',
                                          }}
                                        >
                                          <div
                                            style={{
                                              height: '200px',
                                              minHeight: '200px',
                                              maxHeight: '100%',
                                              position: 'relative',
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
                                              onChange={(value) =>
                                                setDescription(value)
                                              }
                                              placeholder={
                                                'Give techFiesta details'
                                              }
                                            />
                                          </div>
                                        </Box>
                                        <Grid
                                          gridTemplateColumns={'repeat(3,1fr)'}
                                        >
                                          <GridItem
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={'0.6rem'}
                                            pr={'1rem'}
                                            borderRight={{
                                              lg: '1px solid rgba(60, 77, 109, 0.50)',
                                            }}
                                          >
                                            <Text
                                              fontSize={'1rem'}
                                              color={'#3C4D6D'}
                                            >
                                              Start Date
                                            </Text>
                                            <DatePicker
                                              size={size}
                                              value={adate}
                                              placeholder="Select a date"
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetStartDate}
                                            />

                                            <TimePicker
                                              size={size}
                                              value={atime}
                                              placeholder="Select a time"
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetStartTime}
                                            />
                                          </GridItem>{' '}
                                          <GridItem
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={'0.6rem'}
                                            borderRight={{
                                              lg: '1px solid rgba(60, 77, 109, 0.50)',
                                            }}
                                            px={'1rem'}
                                          >
                                            <Text
                                              fontSize={'1rem'}
                                              color={'#3C4D6D'}
                                            >
                                              Submission Deadline
                                            </Text>
                                            <DatePicker
                                              placeholder="Select a date"
                                              value={ddate}
                                              size={size}
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetDDate}
                                            />
                                            <TimePicker
                                              size={size}
                                              value={dtime}
                                              placeholder="Select a time"
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetDTime}
                                            />
                                          </GridItem>
                                          <GridItem
                                            display={'flex'}
                                            flexDirection={'column'}
                                            gap={'0.6rem'}
                                            pl={'1rem'}
                                          >
                                            <Text
                                              fontSize={'1rem'}
                                              color={'#3C4D6D'}
                                            >
                                              End Date
                                            </Text>
                                            <DatePicker
                                              placeholder="Select a date"
                                              size={size}
                                              value={edate}
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetEDate}
                                            />
                                            <TimePicker
                                              placeholder="Select a time"
                                              size={size}
                                              value={etime}
                                              style={{ minHeight: '48px' }}
                                              onChange={onGetETime}
                                            />
                                          </GridItem>{' '}
                                        </Grid>
                                        <Flex
                                          w={'full'}
                                          justifyContent={'flex-end'}
                                        >
                                          <Button
                                            mr="1rem"
                                            bg={'rgba(60, 77, 109, 0.05)'}
                                            borderRadius={'0.5rem'}
                                            px={'1rem'}
                                            transition={'all 0.2s ease-in-out'}
                                            _hover={{
                                              filter: 'brightness(105%)',
                                            }}
                                            borderWidth={'1px'}
                                            borderColor={'#3C4D6D'}
                                            backdropFilter={'blur(20px)'}
                                            color={'#3C4D6D'}
                                            cursor={'pointer'}
                                            leftIcon={<ArrowBackIcon />}
                                            onClick={() =>
                                              setActiveStep(activeStep - 1)
                                            }
                                            size={'sm'}
                                          >
                                            vious
                                          </Button>

                                          <Button
                                            bg="#0F5EFE"
                                            color="#FFFFFF"
                                            fontWeight={'500'}
                                            fontSize={{
                                              lg: '1rem',
                                              base: '0.75rem',
                                            }}
                                            borderRadius={'0.5rem'}
                                            transition={'all 0.2s ease-in-out'}
                                            _hover={{
                                              filter: 'brightness(105%)',
                                            }}
                                            borderWidth={'1px'}
                                            borderColor={'#0F5EFE'}
                                            rightIcon={<ArrowForwardIcon />}
                                            onClick={() =>
                                              setActiveStep(activeStep + 1)
                                            }
                                          >
                                            Next
                                          </Button>
                                        </Flex>
                                      </Flex>
                                    </Stack>

                                    <Stack
                                      display={
                                        activeStep === 1 ? 'block' : 'none'
                                      }
                                    >
                                      <Box w="full">
                                        <FormControl mt="17px" isRequired>
                                          <FormLabel fontSize={'14px'}>
                                            How many participants do you want to
                                            reward
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
                                                        <Text mr="10.5px">
                                                          {price}
                                                        </Text>

                                                        {rewardToken?.symbol}
                                                      </Flex>
                                                    </Box>
                                                  </HStack>
                                                  <Text
                                                    mt="5px"
                                                    fontSize={'10px'}
                                                  >
                                                    {index + 1} participant
                                                  </Text>
                                                </VStack>
                                              ),
                                            )}
                                          </HStack>
                                        </FormControl>
                                      </Box>

                                      <Flex
                                        w={'full'}
                                        justifyContent={'flex-end'}
                                      >
                                        <Button
                                          mr="1rem"
                                          bg={'rgba(60, 77, 109, 0.05)'}
                                          borderRadius={'0.5rem'}
                                          px={'1rem'}
                                          transition={'all 0.2s ease-in-out'}
                                          _hover={{
                                            filter: 'brightness(105%)',
                                          }}
                                          borderWidth={'1px'}
                                          borderColor={'#3C4D6D'}
                                          backdropFilter={'blur(20px)'}
                                          color={'#3C4D6D'}
                                          cursor={'pointer'}
                                          leftIcon={<ArrowBackIcon />}
                                          onClick={() =>
                                            setActiveStep(activeStep - 1)
                                          }
                                          size={'sm'}
                                        >
                                          Previous
                                        </Button>

                                        <Button
                                          bg="#0F5EFE"
                                          color="#FFFFFF"
                                          fontWeight={'500'}
                                          fontSize={{
                                            lg: '1rem',
                                            base: '0.75rem',
                                          }}
                                          borderRadius={'0.5rem'}
                                          transition={'all 0.2s ease-in-out'}
                                          _hover={{
                                            filter: 'brightness(105%)',
                                          }}
                                          borderWidth={'1px'}
                                          borderColor={'#0F5EFE'}
                                          rightIcon={<ArrowForwardIcon />}
                                          onClick={() =>
                                            setActiveStep(activeStep + 1)
                                          }
                                        >
                                          Next
                                        </Button>
                                      </Flex>
                                    </Stack>

                                    <Stack
                                      display={
                                        activeStep === 2 ? 'block' : 'none'
                                      }
                                    >
                                      <Text
                                        fontSize={{ lg: '1.5rem' }}
                                        fontWeight={'700'}
                                        mb={'2.25rem'}
                                        color={'#3C4D6D'}
                                      >
                                        Provide a submission criteria
                                      </Text>

                                      <Flex
                                        flexDirection={'column'}
                                        gap={'1.25rem'}
                                      >
                                        <Box
                                          mb={{
                                            lg: '4rem',
                                            md: '4rem',
                                            sm: '7rem',
                                          }}
                                        >
                                          <div
                                            style={{
                                              height: '200px',
                                              minHeight: '200px',
                                              maxHeight: '100%',
                                              position: 'relative',
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
                                              placeholder={
                                                'Write your submission criteria here'
                                              }
                                              value={submissionCriteria}
                                              onChange={(value) =>
                                                setSubmissionCriteria(value)
                                              }
                                            />
                                          </div>
                                        </Box>

                                        <Flex
                                          justifyContent={'flex-end'}
                                          w={'full'}
                                          alignItems={'center'}
                                        >
                                          <Flex gap={'1rem'}>
                                            <Button
                                              bg={'rgba(60, 77, 109, 0.05)'}
                                              borderRadius={'0.5rem'}
                                              px={'1rem'}
                                              transition={
                                                'all 0.2s ease-in-out'
                                              }
                                              _hover={{
                                                filter: 'brightness(105%)',
                                              }}
                                              borderWidth={'1px'}
                                              borderColor={'#3C4D6D'}
                                              backdropFilter={'blur(20px)'}
                                              color={'#3C4D6D'}
                                              cursor={'pointer'}
                                              leftIcon={<ArrowBackIcon />}
                                              onClick={() =>
                                                setActiveStep(activeStep - 1)
                                              }
                                            >
                                              Previous
                                            </Button>
                                            <Button
                                              bg="#0F5EFE"
                                              color="#FFFFFF"
                                              fontWeight={'500'}
                                              fontSize={{
                                                lg: '1rem',
                                                base: '0.75rem',
                                              }}
                                              borderRadius={'0.5rem'}
                                              px={{
                                                lg: '1.25rem',
                                                base: '2rem',
                                              }}
                                              transition={
                                                'all 0.2s ease-in-out'
                                              }
                                              _hover={{
                                                filter: 'brightness(105%)',
                                              }}
                                              borderWidth={'1px'}
                                              borderColor={'#0F5EFE'}
                                              rightIcon={<ArrowForwardIcon />}
                                              onClick={() =>
                                                setActiveStep(activeStep + 1)
                                              }
                                            >
                                              Next
                                            </Button>
                                          </Flex>
                                        </Flex>
                                      </Flex>
                                    </Stack>

                                    <Stack
                                      display={
                                        activeStep === 3 ? 'block' : 'none'
                                      }
                                    >
                                      <Text
                                        fontSize={{ lg: '1.5rem' }}
                                        fontWeight={'700'}
                                        mb={'2.25rem'}
                                        color={'#3C4D6D'}
                                      >
                                        Hackathon Events
                                      </Text>

                                      <Flex
                                        flexDirection={'column'}
                                        gap={'1.25rem'}
                                      >
                                        <Box
                                          mb={{
                                            lg: '4rem',
                                            md: '4rem',
                                            sm: '7rem',
                                          }}
                                        >
                                          <div
                                            style={{
                                              height: '200px',
                                              minHeight: '200px',
                                              maxHeight: '100%',
                                              position: 'relative',
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
                                              placeholder={
                                                'Provided event dates.'
                                              }
                                              value={events}
                                              onChange={(value) =>
                                                setEvents(value)
                                              }
                                            />
                                          </div>
                                        </Box>

                                        <Flex
                                          justifyContent={'flex-end'}
                                          w={'full'}
                                          alignItems={'center'}
                                        >
                                          <Flex gap={'1rem'}>
                                            <Button
                                              bg={'rgba(60, 77, 109, 0.05)'}
                                              borderRadius={'0.5rem'}
                                              px={'1rem'}
                                              transition={
                                                'all 0.2s ease-in-out'
                                              }
                                              _hover={{
                                                filter: 'brightness(105%)',
                                              }}
                                              borderWidth={'1px'}
                                              borderColor={'#3C4D6D'}
                                              backdropFilter={'blur(20px)'}
                                              color={'#3C4D6D'}
                                              cursor={'pointer'}
                                              leftIcon={<ArrowBackIcon />}
                                              onClick={() =>
                                                setActiveStep(activeStep - 1)
                                              }
                                            >
                                              Previous
                                            </Button>
                                            <Button
                                              bg="#0F5EFE"
                                              color="#FFFFFF"
                                              fontWeight={'500'}
                                              fontSize={{
                                                lg: '1rem',
                                                base: '0.75rem',
                                              }}
                                              borderRadius={'0.5rem'}
                                              px={{
                                                lg: '1.25rem',
                                                base: '2rem',
                                              }}
                                              transition={
                                                'all 0.2s ease-in-out'
                                              }
                                              _hover={{
                                                filter: 'brightness(105%)',
                                              }}
                                              borderWidth={'1px'}
                                              borderColor={'#0F5EFE'}
                                              rightIcon={<BiSave />}
                                              isLoading={
                                                hackathonSlice?.updatingHackathon
                                              }
                                              onClick={onSend}
                                            >
                                              Save
                                            </Button>
                                          </Flex>
                                        </Flex>
                                      </Flex>
                                    </Stack>
                                  </Stack>
                                </Box>
                              </Box>
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
                      </Flex>
                    </>
                  )}
                </>
              </BodyWrapper>
            </>
          </ConditionalRoute>
        </ConditionalRoute>
      </ConditionalRoute>
    </Suspense>
  );
}

export default AdminEditHackathon;
