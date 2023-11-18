import React, { Suspense, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Text,
} from '@chakra-ui/react';
import { InternalLink } from '../../utils/Link';
import { useSelector } from 'react-redux';
import {
  HackathonStateProps,
  HackathonStatus,
} from '../../store/interfaces/hackathon.interface';
import { RootState } from '../../store/store';
import { supportedTokens } from '../../utils/tokens';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import moment from 'moment';
import PageLoader from '../../reusable/components/PageLoader';

const HackathonListStatusComponent = React.lazy(
  () => import('../../reusable/components/HackathonListStatusComponent'),
);

const HackathonList = () => {
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const hackathons = useMemo(
    () => hackathonSlice?.hackathons || [],
    [hackathonSlice],
  );

  const daysToGo = (submissionDeadline: Date): number => {
    const today = moment();

    const diffDays = moment.utc(submissionDeadline).local().diff(today, 'days');

    const daysLeft = diffDays > 0 ? diffDays : 0;

    return daysLeft;
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Box mt={'5rem'} p={{ lg: '2.5rem', md: '1.5rem' }} w="full">
        <Flex
          flexDirection={{ md: 'row', base: 'column' }}
          justifyContent={'space-between'}
          alignItems={{ md: 'center', base: 'unset' }}
          mb={{ lg: '2rem', base: '3.5rem' }}
        >
          <Text
            fontSize={{ lg: '2.25rem', md: '1.5rem', base: '1.25rem' }}
            fontWeight={'700'}
          >
            Hackathons
          </Text>
        </Flex>
        <Grid
          gridTemplateColumns={{
            xl: 'repeat(2, 1fr)',
          }}
          gap={'1.25rem'}
          mb={'2rem'}
        >
          {hackathons.length > 0 &&
            hackathons.map(
              (
                {
                  company,
                  hackathonName,
                  tokenAmounts,
                  hackathonId,
                  rewardTokenAddress,
                  totalRewardinUsd,
                  slug,
                  startDate,
                  submissionDeadline,
                  status,
                },
                index,
              ) => (
                <GridItem key={index}>
                  <Box
                    h={'220px'}
                    py={'1.5rem'}
                    px={'1rem'}
                    bg={'rgba(60, 77, 109, 0.05)'}
                    backdropFilter={'blur(20px)'}
                    border={'1px solid #3C4D6D'}
                    borderRadius={'0.75rem'}
                    _hover={{
                      bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0px 3px 4px 0px rgba(60, 77, 109, 0.25)',
                      border: 'unset',
                    }}
                  >
                    <InternalLink
                      to={`/hacks/${hackathonId}/${slug}`}
                      style={{
                        textDecoration: 'unset',
                      }}
                    >
                      <Flex
                        flexDirection={'column'}
                        justifyContent={'space-between'}
                        h={'full'}
                        alignItems={'center'}
                      >
                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                          w={'full'}
                        >
                          <Grid
                            gridTemplateColumns={'15% 85%'}
                            minH={'100px'}
                            w={'full'}
                          >
                            <GridItem h={'full'}>
                              <Flex
                                justifyContent={'center'}
                                alignItems={'center'}
                                w={{ lg: '76px', md: '56px' }}
                                h={{ lg: '76px', md: '56px' }}
                                margin={'auto'}
                                padding={'8px'}
                                bg="rgba(60, 77, 109, 0.05)"
                              >
                                <Avatar
                                  rounded={'none'}
                                  borderRadius={'none'}
                                  src={company?.logo}
                                  width={'100%'}
                                  height={'100%'}
                                  name={company?.companyName}
                                />
                              </Flex>
                            </GridItem>
                            <GridItem px="0.5rem">
                              {status === HackathonStatus.published && (
                                <>
                                  {daysToGo(submissionDeadline) > 1 && (
                                    <>
                                      <Text
                                        fontSize={{
                                          lg: '1rem',
                                          base: '0.75rem',
                                        }}
                                        fontWeight={'400'}
                                        lineHeight={'140%'}
                                        letterSpacing={'0.01rem'}
                                      >
                                        {daysToGo(submissionDeadline)} days to
                                        go
                                      </Text>
                                    </>
                                  )}
                                </>
                              )}
                              <Text
                                mt={
                                  daysToGo(submissionDeadline) ? '1rem' : '0rem'
                                }
                                fontSize={{
                                  lg: '1.5rem',
                                  md: '1.25rem',
                                  base: '1rem',
                                }}
                                fontWeight={'700'}
                                lineHeight={'140%'}
                              >
                                {hackathonName}
                              </Text>
                              <Text
                                fontSize={{ lg: '1rem', base: '0.75rem' }}
                                fontWeight={'400'}
                                lineHeight={'140%'}
                                letterSpacing={'0.01rem'}
                                mt="1.5rem"
                              >
                                {company?.companyName}
                              </Text>
                            </GridItem>
                          </Grid>

                          <Flex
                            flexDirection={'row'}
                            gap={'0.35rem'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            whiteSpace={'nowrap'}
                          >
                            <HackathonListStatusComponent
                              status={
                                moment(startDate).isAfter(moment())
                                  ? HackathonStatus.upcoming
                                  : status
                              }
                            />
                          </Flex>
                        </Flex>
                        <Flex
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          w={'full'}
                        >
                          <Flex gap={'0.25rem'}>
                            <Text
                              fontSize={'0.75rem'}
                              fontWeight={'700'}
                              lineHeight={'140%'}
                              letterSpacing={'0.00113rem'}
                              display={'flex'}
                              alignItems={'flex-start'}
                            >
                              {
                                supportedTokens.find(
                                  (tk) => tk.address === rewardTokenAddress,
                                )?.symbol
                              }
                            </Text>
                            <Text
                              fontSize={{ lg: '1rem', base: '0.75rem' }}
                              fontWeight={'700'}
                            >
                              {tokenAmounts || totalRewardinUsd}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </InternalLink>
                  </Box>
                </GridItem>
              ),
            )}
        </Grid>

        <Flex justifyContent={'center'} alignItems={'center'}>
          <Button
            as={Link}
            href="/hackathons"
            bg="#0F5EFE"
            color="#FFFFFF"
            fontWeight={'500'}
            fontSize={{ lg: '1rem', base: '0.75rem' }}
            borderRadius={'0.5rem'}
            px={{ lg: '1.25rem', base: '2rem' }}
            py={'0.75rem'}
            transition={'all 0.2s ease-in-out'}
            _hover={{ filter: 'brightness(105%)' }}
            borderWidth={'1px'}
            borderColor={'#0F5EFE'}
            rightIcon={<ArrowForwardIcon />}
          >
            Explore more
          </Button>
        </Flex>
      </Box>
    </Suspense>
  );
};

export default HackathonList;
