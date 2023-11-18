import { BsGearWideConnected } from 'react-icons/bs';
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ExternalLink } from '../../utils/Link';
import { useContext } from 'react';
import { GetWalletContext } from '../../store/contextProviders/connectWallet';

interface ConcordiumModalInterface {
  isOpenConcordiumWalletConnect: boolean;
  onCloseConcordiumWalletConnect: () => any;
}

function ConcordiumModal({
  isOpenConcordiumWalletConnect,
  onCloseConcordiumWalletConnect,
}: ConcordiumModalInterface) {
  const { handleCConnect } = useContext(GetWalletContext);

  return (
    <Modal
      isOpen={isOpenConcordiumWalletConnect}
      onClose={onCloseConcordiumWalletConnect}
      size={'full'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton bg="white" />
        <ModalBody
          py={{ lg: '2rem' }}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bg="linear-gradient(92.5deg, #333333 0%, #000000 98.89%, #000000 98.89%);"
          color="white"
        >
          {/* Download wallet to continue */}
          <Box fontSize={'1rem'}>
            <HStack mb="2rem">
              <Image
                borderRadius="full"
                boxSize="50px"
                src="https://assets-global.website-files.com/64f060f3fc95f9d2081781db/64f060f3fc95f9d2081781fd_motif-white.svg"
              />
              <Box>
                <Text>You need Concordium Wallet to proceed</Text>
              </Box>
            </HStack>

            <Box>
              <Button
                onClick={handleCConnect}
                size={'md'}
                fontSize={'14px'}
                leftIcon={<BsGearWideConnected />}
                bg="#052535"
                color={'white'}
                _hover={{
                  backgroundColor: 'white',
                  color: '#052535',
                }}
              >
                Connect Now
              </Button>
            </Box>

            <Box mt="2rem">
              <Text color="brand.primary">
                <ExternalLink href="https://www.concordium.com/wallet">
                  Click here to download
                </ExternalLink>{' '}
              </Text>
            </Box>
          </Box>

          {/* Verify to connect */}
        </ModalBody>

        {/* <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onCloseConcordiumWalletConnect}
          >
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
}

export default ConcordiumModal;
