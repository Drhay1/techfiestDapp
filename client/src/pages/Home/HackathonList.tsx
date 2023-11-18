import { useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { InternalLink } from '../../utils/Link';
import { useSelector } from 'react-redux';
import { HackathonStateProps } from '../../store/interfaces/hackathon.interface';
import { RootState } from '../../store/store';
import { supportedTokens } from '../../utils/tokens';

const HackathonList = () => {
  const hackathonSlice = useSelector<RootState, HackathonStateProps>(
    (state) => state.hackathon,
  );

  const hackathons = useMemo(
    () => hackathonSlice?.hackathons || [],
    [hackathonSlice],
  );

  return (
    <Box
      mt={{ base: '143px', lg: '120px', sm: '80px' }}
      w={{ base: 'full' }}
      maxW={{ lg: '1199px' }}
      px={{ base: '1rem' }}
      mx="auto"
    >
      <Text
        fontSize={{ base: '24px', lg: '36px', md: '30px' }}
        color="brand.primary"
        fontWeight="bold"
        textAlign="center"
      >
        Hackathons
      </Text>

      <Box
        maxW={{ lg: '900px', sm: 'full', md: 'full' }}
        mx="auto"
        mt="1rem"
        borderRadius="0.5rem"
        p="none"
      >
        <TableContainer>
          <Table
            fontSize={{ lg: '12px', sm: '6px', md: '10px' }}
            gap={{ lg: '0.5rem', sm: '0px' }}
            textAlign="center"
          >
            {hackathons.length > 0 && (
              <TableCaption>
                <Button
                  bg="brand.primary"
                  color="white"
                  fontSize={{ lg: '16px', sm: '13px', md: '15px' }}
                  _hover={{
                    bg: 'white',
                    color: 'brand.primary',
                    borderWidth: '1px',
                    borderColor: 'brand.primary',
                  }}
                >
                  <a href="/hackathons">View More</a>
                </Button>
              </TableCaption>
            )}
            <Thead bg="brand.dark.1000">
              <Tr>
                <Th>Hosted By</Th>
                <Th>Title</Th>
                <Th isNumeric>Bounty</Th>
              </Tr>
            </Thead>
            {hackathons.length > 0 ? (
              <Tbody>
                {hackathons
                  .slice(0, 5)
                  .map(
                    (
                      {
                        company,
                        hackathonName,
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
                        <Td>
                          <Text
                            fontSize={{ lg: '20px', sm: '15px', md: '18px' }}
                          >
                            {company.companyName}
                          </Text>
                        </Td>
                        <Td>
                          <Text
                            color="brand.primary"
                            fontSize={{ lg: '20px', sm: '15px', md: '18px' }}
                            textTransform="capitalize"
                          >
                            <InternalLink to={`/hacks/${hackathonId}/${slug}`}>
                              {hackathonName}
                            </InternalLink>
                          </Text>
                        </Td>
                        <Td isNumeric>
                          <Text
                            color="brand.secondary"
                            fontWeight="600"
                            fontSize={{ lg: '20px', sm: '15px', md: '18px' }}
                          >
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
            ) : (
              <Flex
                alignItems="center"
                justifyContent="center"
                w={{ lg: 'full', sm: 'full', md: 'full' }}
              >
                <Text fontSize="24px" textAlign="center">
                  No hackathons for now
                </Text>
              </Flex>
            )}
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default HackathonList;
