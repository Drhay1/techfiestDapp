import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { InternalLink } from '../../utils/Link';
import { supportedTokens } from '../../utils/tokens';
import {
  HackathonStateProps,
  HackathonStatus,
} from '../../store/interfaces/hackathon.interface';
import {
  Box,
  Flex,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';
import React from 'react';

const HackathonStatusComponent = React.lazy(
  () => import('../../reusable/components/HackathonStatusComponent'),
);

function Listings() {
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  return (
    <Box px={{ base: '1rem', lg: 'unset' }}>
      <Box
        px="1rem"
        py={'1rem'}
        borderRadius={'lg'}
        bg="#F3FAFF"
        shadow={'0 2px 4px rgba(243, 250, 255, 0.5)'}
      >
        <Text
          fontSize={{ lg: '48px', base: '24px' }}
          fontWeight={'bold'}
          color={'brand.secondary'}
        >
          All Hackathons
        </Text>

        <Text fontSize={{ lg: '16px', base: '14px' }} my="0.5rem">
          These are all available hackathons listed on techFiesta. Discover
          detailed information about them and register to participate.
        </Text>
        <UnorderedList
          fontSize={{ lg: '16px', base: '14px' }}
          gap={'1rem'}
          mt="1rem"
        >
          <ListItem mb="0.5rem">
            <Flex gap={'1rem'}>
              <Box w={'auto'}>
                <HackathonStatusComponent status={HackathonStatus.published} />
              </Box>
              This refers to hackathons that are currently running.
            </Flex>
          </ListItem>
          <ListItem>
            <Flex gap={'1rem'}>
              <Box w={'auto'} mb="0.5rem">
                <HackathonStatusComponent status={HackathonStatus.reviewing} />
              </Box>
              This refers to hackathons that are been reviewed by judges.
            </Flex>
          </ListItem>
          <ListItem>
            <Flex gap={'1rem'}>
              <Box w={'auto'}>
                <HackathonStatusComponent status={HackathonStatus.ended} />
              </Box>
              This refers to hackathons that are not currently running.
            </Flex>
          </ListItem>
        </UnorderedList>
      </Box>

      <Box mt="2rem" boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px" mb={'100px'}>
        <Box py="16px" px={'24px'} bg="rgba(240, 249, 255, 1)" mb="1rem">
          <Flex justifyContent={'space-between'}>
            <Flex alignItems={'center'}>
              <Text fontSize={'14px'}>Hackathons</Text>
            </Flex>
          </Flex>
        </Box>

        {hackathonSlice?.hackathons &&
          hackathonSlice?.hackathons.length > 0 && (
            <TableContainer>
              <Table fontSize={'12px'} gap={'0.5rem'}>
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th>Title</Th>
                    <Th>Status</Th>
                    <Th isNumeric>Bounty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {hackathonSlice?.hackathons.map(
                    (
                      {
                        company: { companyName },
                        hackathonName,
                        status,
                        tokenAmounts,
                        hackathonId,
                        rewardTokenAddress,
                        totalRewardinUsd,
                        slug,
                      },
                      index,
                    ) => (
                      <Tr
                        key={index}
                        _hover={{
                          bg: 'rgba(234, 236, 240, 1)',
                        }}
                      >
                        <Td>{companyName}</Td>
                        <Td>
                          <Text color="brand.primary">
                            <InternalLink to={`/hacks/${hackathonId}/${slug}`}>
                              {hackathonName}
                            </InternalLink>
                          </Text>
                        </Td>
                        <Td>
                          <HackathonStatusComponent status={status} />
                        </Td>
                        <Td isNumeric>
                          <Text color="brand.secondary" fontWeight={'bold'}>
                            {tokenAmounts || totalRewardinUsd}{' '}
                            {
                              supportedTokens.find(
                                (tk) => tk.address === rewardTokenAddress,
                              )?.symbol
                            }
                          </Text>
                        </Td>
                      </Tr>
                    ),
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )}
      </Box>
    </Box>
  );
}

export default Listings;
