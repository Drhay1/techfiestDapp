import {
  Modal,
  ModalContent,
  ModalCloseButton,
  Button,
  ModalOverlay,
  ModalBody,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HackathonProps,
  HackathonStateProps,
} from '../../store/interfaces/hackathon.interface';
import { RootState } from '../../store/store';
import { payoutReq, setIsPayingOut } from '../../store/slices/hackathonSlice';
import { supportedTokens } from '../../utils/tokens';

function ConfirmPayment({ isOpen, onClose, id }: any) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [usersToReward, setUsersToReward] = useState<any>(null);
  const [hackathon, setHackathon] = useState<HackathonProps | any>(null);
  const [userRewards, setUserRewards] = useState([]);
  const [rewardCount, setRewardCount] = useState(null);
  const [equalDistribution, setEqualDistribution] = useState(null);
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  useEffect(() => {
    if (id) {
      const thisHackathon: HackathonProps | any =
        hackathonSlice?.clientHackInfo;
      setHackathon(thisHackathon);
      setRewardCount(thisHackathon.rewardCount);
      setEqualDistribution(thisHackathon?.equalDistribution);
    }
  }, [id, hackathonSlice?.clientHackathons]);

  useEffect(() => {
    if (equalDistribution === 'no') {
      const HighToLowest =
        hackathon &&
        hackathonSlice?.clientHackInfo?.submissions.slice().sort((a, b) => {
          if (!a.hasOwnProperty('score') && !b.hasOwnProperty('score')) {
            return 0;
          }
          if (!a.hasOwnProperty('score')) {
            return 1;
          }
          if (!b.hasOwnProperty('score')) {
            return -1;
          }
          if (a.score === null && b.score === null) {
            return 0;
          }
          if (a.score === null) {
            return 1;
          }
          if (b.score === null) {
            return -1;
          }
          if (a.score === 0 && b.score === 0) {
            return 0;
          }
          if (a.score === 0) {
            return 1;
          }
          if (b.score === 0) {
            return -1;
          }
          return b.score - a.score;
        });

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
    if (hackathonSlice?.paid) {
      onClose();
    }
  }, [hackathonSlice?.paid]);

  const onPayout = async () => {
    if (usersToReward.length <= 0) {
      return toast({
        description: `Participants rewards less than ${hackathon.rewardCount}`,
        position: 'top-right',
        status: 'warning',
        duration: 2000,
      });
    }

    if (equalDistribution === 'no') {
      const HighToLowest =
        hackathon &&
        hackathon.submissions
          .slice()
          .sort((a: any, b: any) => b.score - a.score);

      const acceptedSubmissions = HighToLowest.splice(0, rewardCount);

      dispatch(setIsPayingOut());
      dispatch(
        payoutReq({
          rewards: userRewards,
          hackathonId: hackathon.hackathonId,
          escrowId: hackathon.escrow,
          acceptedSubmissions,
          usersToReward,
          equalDistribution,
        }),
      );
    } else if (equalDistribution === 'yes') {
      const acceptedSubmissions =
        hackathon &&
        hackathon.submissions.slice().filter((obj: any) => obj.accepted);

      dispatch(setIsPayingOut());
      dispatch(
        payoutReq({
          hackathonId: hackathon.hackathonId,
          escrowId: hackathon.escrow,
          equalDistribution,
          acceptedSubmissions,
        }),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody w="auto">
          {usersToReward && usersToReward.length >= hackathon?.rewardCount ? (
            <TableContainer>
              <Table fontSize={'12px'} variant="simple">
                <Tbody>
                  <Tr>
                    <Td fontWeight={'bold'}>Name of recipient</Td>
                    <Td fontWeight={'bold'}>Amount to receive</Td>
                  </Tr>

                  {usersToReward.map((props: any, index: number) => {
                    return (
                      <Tr key={index}>
                        <Td>
                          <Text color="brand.primary" fontWeight={'medium'}>
                            {(props.user && props.user.firstname) ||
                              props.firstname}
                          </Text>
                        </Td>

                        {equalDistribution === 'no' ? (
                          <Td>
                            <Text fontWeight={'bold'}>
                              {Number(userRewards[index]).toFixed(1)}{' '}
                              {
                                supportedTokens.find(
                                  (tk) =>
                                    tk.address ===
                                    hackathonSlice?.clientHackInfo
                                      ?.rewardTokenAddress,
                                )?.symbol
                              }
                            </Text>
                          </Td>
                        ) : (
                          <Td>
                            <Text color="green">
                              {(
                                hackathon.tokenAmounts / usersToReward.length
                              ).toFixed(0)}

                              {
                                supportedTokens.find(
                                  (tk) =>
                                    tk.address ===
                                    hackathonSlice?.clientHackInfo
                                      ?.rewardTokenAddress,
                                )?.symbol
                              }
                            </Text>
                          </Td>
                        )}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          ) : null}
          <Button
            isLoading={hackathonSlice?.paying}
            onClick={onPayout}
            mt="40px"
            w="full"
            borderRadius={'unset'}
            color="white"
            bg="brand.primary"
          >
            Confirm Payout
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmPayment;
