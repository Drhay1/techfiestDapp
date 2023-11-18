import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BiMenuAltLeft } from 'react-icons/bi';
import { Suspense, useEffect } from 'react';
import { RootState } from '../../store/store';
import { UserStateProps } from '../../store/interfaces/user.interface';
import { useSelector } from 'react-redux';
import BodyWrapper from './BodyWrapper';
import PageLoader from './PageLoader';

const AuthNavbar = () => {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  useEffect(() => {
    const menuButton: any = document.getElementById('menu-button');
    const sideMenu: any = document.querySelector('.side-menu');

    if (menuButton) {
      menuButton.addEventListener('click', () => {
        if (sideMenu.style.transform === 'translateX(0)') {
          sideMenu.style.transform = 'translateX(-100%)';
        } else {
          sideMenu.style.transform = 'translateX(0)';
        }
      });
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Box position={'fixed'} top={'0%'} left={'0px'} zIndex={'1'} w="100%">
        <BodyWrapper props={{ px: 'none' }}>
          <Box w="full" bg="white">
            <Flex
              alignItems={'center'}
              h="full"
              py={{ lg: '20.85', base: '7px' }}
            >
              <Box>
                <Box as={Button} bg="none !important" id="menu-button">
                  <Icon as={BiMenuAltLeft} width={'25px'} height={'25px'} />
                </Box>
              </Box>
              <Spacer />
              <Box px={{ base: '1rem', md: 'none' }}>
                <Menu>
                  <MenuButton bg="white !important" as={Button} p={0}>
                    <HStack alignItems={'center'}>
                      <Box>
                        {/* <Avatar
                        margin={'auto'}
                        rounded={'none'}
                        name="Samuel Anthony"
                        size={'md'}
                      /> */}
                      </Box>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Text>{userSlice?.user?.firstname || ''}</Text>
                      </Box>
                    </HStack>
                  </MenuButton>
                  {/* <MenuList> */}
                  {/* <MenuItem bg="none">Settings</MenuItem> */}
                  {/* </MenuList> */}
                </Menu>
              </Box>
            </Flex>
          </Box>
        </BodyWrapper>
      </Box>
    </Suspense>
  );
};
export default AuthNavbar;
