import {
  Box,
  Flex,
  Image,
  Grid,
  GridItem,
  Text,
  Tooltip,
  useToast,
  TableContainer,
  Table,
  Tr,
  Th,
  Tbody,
  Td,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Select,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkIfUserIsPaid,
  getHackathonDetailForClient,
  paidUser,
  resetErrMsg,
  resetIsPayingOut,
  resetUserIsNowPaid,
} from '../../../store/slices/hackathonSlice';
import { useParams } from 'react-router-dom';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { RootState } from '../../../store/store';
import {
  HackathonProps,
  HackathonStateProps,
} from '../../../store/interfaces/hackathon.interface';
import { HomeNavbar, MetaTags } from '../../../reusable/components';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { utcFormat } from '../User/UserMain';
import { SideMenu } from '.';
import { Address, supportedTokens } from '../../../utils/tokens';
import { GetWalletContext } from '../../../store/contextProviders/connectWallet';
import { NETWORKS, chains } from '../../../utils/config';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { parseEther, parseUnits } from 'viem';

const Payout = () => {
  const { chain } = useNetwork();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const [usersToReward, setUsersToReward] = useState<any>(null);
  const [hackathon, setHackathon] = useState<HackathonProps | any>(null);
  const [userRewards, setUserRewards] = useState([]);
  const [equalDistribution, setEqualDistribution] = useState<any>(null);
  const toast = useToast();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const { address: account } = useAccount();
  const [userInPaying, setUserInPaying] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const { id } = useParams();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );
  const [paymentToken, setPaymentToken] = useState<Address>();
  const [paymentTokenPrice, setPaymentTokenPrice] = useState<number>();
  const {
    HMTokenAbi,
    getTokenInfo,
    walletClient,
    publicClient,
    isConnected,
    wonOpen,
    getTokenRate,
  } = useContext(GetWalletContext);
  const { pendingChainId, switchNetwork }: any = useSwitchNetwork();
  const rewardTokenContract: any = new ethers.Contract(
    hackathonSlice?.clientHackInfo?.rewardTokenAddress!,
    HMTokenAbi,
    walletClient,
  );

  const onSwitchPaymentToken = async (address: Address) => {
    if (!address) {
      setPaymentToken(undefined);
      setPaymentTokenPrice(undefined);
    } else {
      setPaymentToken(address);

      const _tokenChain = chains.find((c) => c.chainId === hackathon?.chainId);
      const info = await getTokenInfo(_tokenChain?.providerUrl, `${address}`);

      setTokenInfo(info);
    }
  };

  useEffect(() => {
    if (id) {
      setHackathon(hackathonSlice?.clientHackInfo);
      setEqualDistribution(hackathonSlice?.clientHackInfo?.equalDistribution);
    }
  }, [id, hackathonSlice?.clientHackathons]);

  useEffect(() => {
    if (equalDistribution === 'no') {
      const HighToLowest =
        hackathon &&
        hackathon.submissions
          .slice()
          .filter((htl: any) => htl.reviewed)
          .sort((a: any, b: any) => b.score - a.score);

      if (HighToLowest) {
        const participantsToReward = HighToLowest.splice(
          0,
          hackathon.rewardCount,
        );

        setUsersToReward(participantsToReward);
      }
    }
  }, [equalDistribution, hackathon]);

  useEffect(() => {
    switchNetwork?.(hackathonSlice?.hackathonInfo?.chainId);
  }, [hackathonSlice?.hackathonInfo?.chainId]);

  useEffect(() => {
    if (usersToReward && usersToReward.length > 0 && hackathon) {
      if (hackathon.equalDistribution === 'no') {
        const allScores = usersToReward.map((obj: any) => obj.score);
        const allrewards =
          hackathon &&
          hackathon.rewardsArrayInUSD
            .slice()
            .sort((a: any, b: any) => parseInt(a.score) - parseInt(b.score));

        const mappedRewards = allScores.map(
          (_: any, index: number) => allrewards[index],
        );

        setUserRewards(mappedRewards);
      }
    }
  }, [usersToReward]);

  useEffect(() => {
    (async () => {
      const _tokenChain = chains.find((c) => c.chainId === hackathon?.chainId);
      const info = await getTokenInfo(
        _tokenChain?.providerUrl,
        `${hackathonSlice?.clientHackInfo?.rewardTokenAddress}`,
      );

      setTokenInfo(info);
    })();
  }, [hackathonSlice?.clientHackInfo?.rewardTokenAddress, hackathon]);

  const displayErrorToasts = async () => {
    const errorMessages = hackathonSlice?.errMsg?.msg || [];

    await Promise.all(
      errorMessages.split(',').map((message: string) =>
        toast({
          title: 'Error',
          description: message,
          position: 'top-right',
          status: 'error',
          duration: 5000,
          isClosable: true,
          onCloseComplete() {
            dispatch(resetErrMsg());
            dispatch(resetIsPayingOut());
          },
        }),
      ),
    );
  };

  useEffect(() => {
    if (
      hackathonSlice?.errMsg &&
      hackathonSlice?.errMsg?.Id === 'PAYOUT_REQUEST_ERROR'
    ) {
      displayErrorToasts();
    }

    if (hackathonSlice?.userIsNowPaid) {
      toast({
        title: 'Paid',
        description: 'Participant has been paid successfully',
        status: 'success',
        duration: 5000,
        onCloseComplete: () => dispatch(resetUserIsNowPaid()),
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [hackathonSlice?.errMsg, hackathonSlice?.userIsNowPaid]);

  useEffect(() => {
    dispatch(getHackathonDetailForClient(id));
  }, []);

  useEffect(() => {
    if (paymentToken) {
      const tokenID = supportedTokens.find(
        (tk) => tk.address === paymentToken,
      )?.coingeckoID;

      getTokenRate(tokenID)
        .then((rates: any) => {
          const _paymentTokenPrice = rates['market_data'].current_price.usd;
          setPaymentTokenPrice(_paymentTokenPrice);
        })
        .catch((error: any) => {
          console.error('Error:', error);
        });
    }
  }, [paymentToken, supportedTokens]);

  const copyWalletAddressToClipboard = (walletAddress: string) => {
    navigator.clipboard.writeText(`${walletAddress}`);
    setIsTooltipOpen(true);

    setTimeout(() => {
      setIsTooltipOpen(false);
    }, 2000);
  };

  const payoutUser = async (
    amount: string,
    walletAddress: string,
    userId: string,
  ) => {
    try {
      setUserInPaying(userId);
      setIsPaying(true);

      dispatch(
        checkIfUserIsPaid({ userId, hackathonId: hackathon.hackathonId }),
      ).then(async ({ payload }: any) => {
        if (payload.paid) {
          setUserInPaying('');
          setIsPaying(false);

          return toast({
            description: 'You have already paid this participant',
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        } else {
          try {
            const tokenToUse = !paymentToken
              ? hackathon?.rewardTokenAddress!
              : paymentToken;

            const amountN = parseUnits(
              `${
                paymentTokenPrice
                  ? parseInt(amount) / paymentTokenPrice
                  : parseInt(amount)
              }`,
              tokenInfo?.decimals,
            );

            const data = rewardTokenContract.interface.encodeFunctionData(
              'transfer',
              [walletAddress, amountN],
            );

            const gasEstimate = await publicClient.estimateGas({
              from: account,
              to: tokenToUse,
              value: ethers.parseEther('0.00'),
              data: data,
              account: account,
            });

            const hash = await walletClient.sendTransaction({
              to: paymentToken ? paymentToken : hackathon?.rewardTokenAddress!,
              from: account,
              value: parseEther('0.00'),
              data: data,
              gas: Number(gasEstimate),
            });

            await publicClient.waitForTransactionReceipt({ hash });

            dispatch(
              paidUser({
                hackathonId: hackathonSlice?.clientHackInfo?.hackathonId,
                userId,
                amount,
                hash,
              }),
            );

            setUserInPaying('');
            setIsPaying(false);
          } catch (err: any) {
            const errorMessage = err.message;
            console.log(errorMessage);

            // Extract the desired part of the error message
            const startIndex = errorMessage.indexOf(':') + 1; // Find the index of ':' and add 1 to skip it
            const endIndex = errorMessage.indexOf('Version'); // Find the index of 'Version'

            // Extract the relevant portion of the error message
            const extractedErrorMessage = errorMessage
              .substring(startIndex, endIndex)
              .trim();

            toast({
              title: 'Error',
              description: extractedErrorMessage,
              status: 'error',
              position: 'top-right',
              duration: 2000,
              onCloseComplete: () => dispatch(resetErrMsg()),
              isClosable: true,
            });

            setUserInPaying('');
            setIsPaying(false);
          }
        }
      });
    } catch (err) {
      console.log(err);
      setUserInPaying('');
      setIsPaying(false);
    }
  };

  return (
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/404"
        condition={
          userSlice.user && userSlice.user?.roles.includes(Role.Client)
            ? true
            : false
        }
      >
        <>
          <BodyWrapper>
            <>
              <MetaTags
                title={'Payout'}
                description={'Payout users'}
                pageUrl={window.location.href}
              />
              <HomeNavbar />
              <Box w={{ lg: '1199px', base: 'full' }} mx="auto" mb={'50px'}>
                <Grid
                  display={{ base: 'block', lg: 'grid' }}
                  mt={{ lg: '6rem', base: '8rem' }}
                  templateAreas={{
                    lg: `"nav main" "nav footer"`,
                  }}
                  gridTemplateColumns={{ lg: '200px 1fr' }}
                  gap={{ lg: '10' }}
                  color="blackAlpha.700"
                  fontWeight="bold"
                >
                  <GridItem
                    bg="white"
                    area={'nav'}
                    display={{ base: 'none', lg: 'inline-grid' }}
                  >
                    <SideMenu />
                  </GridItem>
                  {hackathon?.chainId === chain?.id ? (
                    <GridItem bg="white" area={'main'}>
                      <Breadcrumb
                        mb={{ lg: '1rem' }}
                        spacing="8px"
                        separator={<ChevronRightIcon color="gray.500" />}
                        fontSize={'12px'}
                      >
                        <BreadcrumbItem>
                          <BreadcrumbLink href={'/cdashboard'}>
                            Dashboard
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href={`/cdetail/${id}/${hackathonSlice?.clientHackInfo?.slug}`}
                          >
                            {`${hackathonSlice?.clientHackInfo?.hackathonName}`}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            href="#"
                            isCurrentPage
                            color="brand.primary"
                          >
                            Payout
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </Breadcrumb>
                      <Text fontSize={{ lg: '48px' }} color="brand.secondary">
                        {hackathonSlice?.clientHackInfo?.hackathonName}
                      </Text>
                      <Text fontSize={{ lg: '14px' }}>Payout Participants</Text>
                      <Box>
                        <Box
                          mt="2rem"
                          boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
                          mb={'100px'}
                          borderRadius={'10px'}
                        >
                          <Box
                            py="12px"
                            px="16px"
                            bg="rgba(240, 249, 255, 1)"
                            mb="1rem"
                          >
                            <Flex justifyContent={'space-between'}>
                              <Text fontSize={'14px'}>
                                Participants to pay
                                <Text
                                  bg="brand.primary"
                                  fontSize={'12px'}
                                  display={'inline-block'}
                                  px="0.5rem"
                                  mx={'0.5rem'}
                                  borderRadius={'12px'}
                                  color="white"
                                >
                                  {
                                    hackathonSlice?.clientHackInfo?.submissions
                                      .length
                                  }{' '}
                                  participants
                                </Text>
                              </Text>
                            </Flex>
                          </Box>

                          {usersToReward &&
                          usersToReward.length >= hackathon?.rewardCount ? (
                            <TableContainer>
                              <Table fontSize={'12px'} variant="simple">
                                <Tr>
                                  <Th>Participant</Th>
                                  <Th>Submission Date</Th>
                                  <Th>Wallet</Th>
                                  <Th isNumeric>Score</Th>
                                  <Th>Price</Th>
                                  <Th>Pay With</Th>
                                </Tr>

                                <Tbody>
                                  {usersToReward.map(
                                    (props: any, index: number) => {
                                      return (
                                        <Tr key={index}>
                                          <Td>
                                            <Text
                                              color="brand.primary"
                                              fontWeight={'medium'}
                                            >
                                              {(props.user &&
                                                props.user.firstname) ||
                                                props.firstname}
                                            </Text>
                                          </Td>

                                          <Td>
                                            {utcFormat(
                                              hackathon?.createdAt,
                                            ).format(
                                              'MMMM Do, YYYY HH:mm [UTC]',
                                            )}
                                          </Td>

                                          <Td>
                                            <Flex flexDirection={'row'}>
                                              <Text
                                                whiteSpace={'nowrap'}
                                                textOverflow={'ellipsis'}
                                                overflow={'hidden'}
                                              >
                                                {props.userWalletAddress.substring(
                                                  0,
                                                  5,
                                                )}
                                                ...
                                                {props.userWalletAddress.substring(
                                                  props.userWalletAddress
                                                    .length - 3,
                                                )}
                                              </Text>
                                              <Tooltip
                                                label="Wallet address copied!"
                                                isOpen={isTooltipOpen}
                                                placement="bottom"
                                              >
                                                <Box
                                                  h="24px"
                                                  w="24px"
                                                  display="flex"
                                                  p="4px"
                                                  justifyContent="center"
                                                  alignItems="center"
                                                >
                                                  <Image
                                                    src={'/icons/linkIcon.svg'}
                                                    cursor={'pointer'}
                                                    h="100%"
                                                    w="100%"
                                                    objectFit={'cover'}
                                                    onClick={() =>
                                                      copyWalletAddressToClipboard(
                                                        props.userWalletAddress,
                                                      )
                                                    }
                                                    alt={'Social Media Icon'}
                                                  />
                                                </Box>
                                              </Tooltip>
                                            </Flex>
                                          </Td>

                                          <Td isNumeric>{props.score}</Td>

                                          {equalDistribution === 'no' ? (
                                            <Td>
                                              <Text fontWeight={'bold'}>
                                                {Number(
                                                  userRewards[index],
                                                ).toFixed(1)}{' '}
                                                {
                                                  supportedTokens.find(
                                                    (tk) =>
                                                      tk.address ===
                                                      hackathonSlice
                                                        ?.clientHackInfo
                                                        ?.rewardTokenAddress,
                                                  )?.symbol
                                                }
                                                {hackathonSlice?.clientHackInfo
                                                  ?.rewardTokenAddress !==
                                                  tokenInfo?.tokenAddress &&
                                                  paymentToken && (
                                                    <Text
                                                      mr="0.5rem"
                                                      color="brand.danger"
                                                      fontSize={'xs'}
                                                    >
                                                      <sub>
                                                        {paymentTokenPrice &&
                                                          (
                                                            Number(
                                                              userRewards[
                                                                index
                                                              ],
                                                            ) /
                                                            paymentTokenPrice
                                                          ).toFixed(4)}{' '}
                                                        {
                                                          supportedTokens.find(
                                                            (tk) =>
                                                              tk.address ===
                                                              paymentToken,
                                                          )?.symbol
                                                        }
                                                      </sub>
                                                    </Text>
                                                  )}
                                              </Text>
                                            </Td>
                                          ) : (
                                            <Td>
                                              <Text color="green">
                                                (
                                                {(
                                                  hackathon.tokenAmounts /
                                                  usersToReward.length
                                                ).toFixed(0)}
                                                ){' '}
                                                {
                                                  supportedTokens.find(
                                                    (tk) =>
                                                      tk.address ===
                                                      hackathon?.rewardTokenAddress,
                                                  )?.symbol
                                                }
                                              </Text>
                                            </Td>
                                          )}

                                          <Td>
                                            <Select
                                              placeholder={'Choose'}
                                              size={'xs'}
                                              onChange={(e) =>
                                                onSwitchPaymentToken(
                                                  e.target.value as Address,
                                                )
                                              }
                                              value={
                                                paymentToken ||
                                                hackathonSlice?.clientHackInfo
                                                  ?.rewardTokenAddress
                                              }
                                            >
                                              {supportedTokens
                                                ?.filter(
                                                  (token) =>
                                                    token.chainId ===
                                                    hackathonSlice
                                                      ?.clientHackInfo?.chainId,
                                                )
                                                .map((token) => (
                                                  <option
                                                    value={`${token.address}`}
                                                    key={token.address}
                                                  >
                                                    {token.symbol}
                                                  </option>
                                                ))}
                                            </Select>
                                          </Td>

                                          <Td>
                                            <Text
                                              color="brand.primary"
                                              textAlign={'center'}
                                            >
                                              <Button
                                                bg={
                                                  hackathonSlice?.clientHackInfo?.winners.find(
                                                    (w: any) =>
                                                      w._id === props.user._id,
                                                  )
                                                    ? 'brand.secondary !important'
                                                    : 'brand.primary !important'
                                                }
                                                color="white"
                                                size={'xs'}
                                                isDisabled={
                                                  (hackathonSlice?.clientHackInfo?.winners.find(
                                                    (w: any) =>
                                                      w._id === props.user._id,
                                                  )
                                                    ? true
                                                    : false) ||
                                                  !tokenInfo?.decimals
                                                }
                                                isLoading={
                                                  userInPaying ===
                                                    props.user._id && isPaying
                                                }
                                                onClick={() =>
                                                  payoutUser(
                                                    Number(
                                                      userRewards[index],
                                                    ).toFixed(1),
                                                    props.userWalletAddress,
                                                    props.user._id,
                                                  )
                                                }
                                              >
                                                {hackathonSlice?.clientHackInfo?.winners.find(
                                                  (w: any) =>
                                                    w._id === props.user._id,
                                                )
                                                  ? 'Paid'
                                                  : 'Pay'}
                                              </Button>
                                            </Text>
                                          </Td>
                                        </Tr>
                                      );
                                    },
                                  )}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          ) : null}
                        </Box>
                      </Box>
                    </GridItem>
                  ) : (
                    <>
                      {isConnected ? (
                        <GridItem>
                          <Button
                            bg="brand.primary !important"
                            color="white"
                            onClick={() => switchNetwork?.(hackathon?.chainId)}
                            isLoading={
                              (pendingChainId && pendingChainId) || false
                            }
                          >
                            Switch to {NETWORKS[hackathon?.chainId]} Network to
                            pay participants
                          </Button>
                        </GridItem>
                      ) : (
                        <GridItem>
                          <Button
                            bg="brand.primary"
                            onClick={wonOpen}
                            color="white"
                            _hover={{
                              bg: 'brand.primary',
                            }}
                          >
                            Connect your wallet to submit your result
                          </Button>
                        </GridItem>
                      )}
                    </>
                  )}
                </Grid>
              </Box>
            </>
          </BodyWrapper>
        </>
      </ConditionalRoute>
    </ConditionalRoute>
  );
};

export default Payout;
