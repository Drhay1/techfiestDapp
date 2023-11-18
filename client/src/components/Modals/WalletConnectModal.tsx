import { Suspense, lazy, useEffect } from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAccount, useConnect } from 'wagmi';
import PageLoader from '../../reusable/components/PageLoader';
const ConnectorIcon = lazy(
  () => import('../../reusable/components/ConnectorIcon'),
);

function WalletConnectModal({ wisOpen, wonClose }: any) {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  useEffect(() => {
    if (isConnected) {
      wonClose();
    }
  }, [isConnected]);

  return (
    <Modal
      blockScrollOnMount={true}
      isOpen={(!isConnected && wisOpen) || false}
      onClose={wonClose}
      size={'2xl'}
    >
      <ModalOverlay />
      <ModalContent
        bg="var(--bg-linear-2, linear-gradient(135deg, #F0F9FF 0%, #FFF 100%));"
        px="41px"
      >
        <ModalHeader fontWeight={'bold'} fontSize={'20px'}>
          Choose your wallet
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody my="21px">
          <VStack spacing={4}>
            {connectors.map((connector) => (
              <Button
                bg="white"
                size="lg"
                w="full"
                key={connector.id}
                onClick={() => connect({ connector })}
                isLoading={isLoading && connector.id === pendingConnector?.id}
              >
                <Flex
                  justifyContent={'space-between'}
                  w="full"
                  alignItems={'center'}
                  py="1rem"
                  bg="0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;"
                >
                  <Flex alignItems={'center'}>
                    <Suspense fallback={<PageLoader />}>
                      <ConnectorIcon connector={connector} />
                    </Suspense>
                    <Text ml="1rem">{connector.name}</Text>
                  </Flex>

                  <Text>
                    <Text display={'inline'}>
                      {!connector.ready && '(unsupported)'}
                    </Text>
                  </Text>
                </Flex>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default WalletConnectModal;
