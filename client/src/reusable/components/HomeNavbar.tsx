import { useDisconnect } from 'wagmi';
import BodyWrapper from './BodyWrapper';
import { NavLink } from 'react-router-dom';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { InternalLink } from '../../utils/Link';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import WalletIcon from '../../assets/icons/WalletIcon';
import { useCallback, useContext, useEffect } from 'react';
import { logoutUser, setAccount } from '../../store/slices/userSlice';
import { Role, UserStateProps } from '../../store/interfaces/user.interface';
import { GetWalletContext } from '../../store/contextProviders/connectWallet';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

function HomeNavbar() {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  const dispatch = useDispatch<Dispatch<any>>();
  const { isConnected, account, wonOpen } = useContext(GetWalletContext);
  const { disconnect } = useDisconnect();

  const onLogout = useCallback(() => {
    dispatch(logoutUser());
    disconnect();
  }, []);

  useEffect(() => {
    dispatch(setAccount(account));
  }, [isConnected, account]);

  const accFirstFiveChars = account && account.substring(0, 5);
  const accLastThreeChars = account && account.substring(account.length - 3);

  return (
    <Flex
      zIndex={'100'}
      minW="20rem"
      h={{ base: '5rem', md: '64px' }}
      align="center"
      mx={'auto'}
      color="brand.light"
      display={'flex'}
      alignItems={'center'}
      textDecoration={'none'}
      bg="linear-gradient(to bottom, #F0F9FF 0%, #FFFFFF 100%)"
      position="fixed"
      top={'0px'}
      left={'0px'}
      boxShadow={
        '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px -4px 20px -2px rgba(0, 0, 0, 0.03), 4px 4px 10px 0px rgba(0, 0, 0, 0.05) inset;'
      }
      w={{ base: 'full' }}
    >
      <BodyWrapper>
        <Box w={{ base: 'full' }} mx="auto" boxShadow={'rgba(16, 24, 40, 1)'}>
          <Flex
            zIndex={'100'}
            w={{ base: 'full' }}
            h="5rem"
            py="1.2rem"
            align="center"
            justifyContent={'space-between'}
            color="brand.light"
            px={{ base: '1rem' }}
            mx={{ md: 'auto' }}
          >
            <InternalLink to="/">
              <Flex alignItems={'center'}>
                <Box w={{ base: '25.53' }} h={{ base: '25.53' }} mr="4px">
                  <Image
                    w="full"
                    h="full"
                    cursor={'pointer'}
                    src={'/images/logo.svg'}
                  />
                </Box>

                <Text
                  fontSize={{ base: '22.67px', lg: '25.53px', sm: '18.35px' }}
                  color="black"
                >
                  tech
                  <Text
                    display={'inline'}
                    color={'linear-gradient(to right, red , yellow)'}
                    bgGradient="linear(99.72deg, #2C69D1 7.35%, #0ABCF9 86.94%)"
                    bgClip="text"
                    fontWeight="bold"
                  >
                    Fiesta
                  </Text>
                </Text>
              </Flex>
            </InternalLink>

            <Flex
              alignItems={'center'}
              fontSize={{ lg: '18px' }}
              fontWeight={'600'}
              justifyContent={'flex-end'}
            >
              <Menu isLazy>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  display={{ lg: 'none', base: 'flex' }}
                  flexDirection={'column'}
                />
                <MenuList>
                  {userSlice?.isAuthenticated && (
                    <>
                      {!isConnected ? (
                        <MenuItem minH="48px" onClick={wonOpen}>
                          <>
                            <Image
                              boxSize="1rem"
                              src="/images/connect.png"
                              alt="Connect your wallet"
                              mr="12px"
                            />
                            <span>Connect your wallet</span>
                          </>
                        </MenuItem>
                      ) : (
                        <MenuItem>
                          <Text
                            whiteSpace={'nowrap'}
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                          >
                            {accFirstFiveChars}...{accLastThreeChars}
                          </Text>
                        </MenuItem>
                      )}
                    </>
                  )}

                  <MenuItem>
                    <Box w={'full'}>
                      <NavLink
                        to="/hackathons"
                        role="group"
                        onClick={() =>
                          // @ts-ignore
                          document.getElementById(link.id).scrollIntoView({
                            block: 'center',
                            behavior: 'smooth',
                          })
                        }
                      >
                        <Text
                          transition="all 0.2s ease-in-out"
                          mr="1rem"
                          color="black"
                          _groupHover={{
                            color: 'black',
                            fontWeight: '600',
                          }}
                        >
                          Hackathon
                        </Text>
                      </NavLink>
                    </Box>
                  </MenuItem>
                  {userSlice?.isAuthenticated &&
                  userSlice?.user?.roles.includes(Role.Admin) ? (
                    <>
                      <MenuItem>
                        <Box w={'full'}>
                          <NavLink
                            to="/arequests"
                            role="group"
                            onClick={() =>
                              // @ts-ignore
                              document.getElementById(link.id).scrollIntoView({
                                block: 'center',
                                behavior: 'smooth',
                              })
                            }
                          >
                            <Text
                              transition="all 0.2s ease-in-out"
                              mr="1rem"
                              color="black"
                              _groupHover={{
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >
                              Requests
                            </Text>
                          </NavLink>
                        </Box>
                      </MenuItem>
                      <MenuItem>
                        <Box w={'full'}>
                          <NavLink
                            to="/invite-users"
                            role="group"
                            onClick={() =>
                              // @ts-ignore
                              document.getElementById(link.id).scrollIntoView({
                                block: 'center',
                                behavior: 'smooth',
                              })
                            }
                          >
                            <Text
                              transition="all 0.2s ease-in-out"
                              mr="1rem"
                              color="black"
                              _groupHover={{
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >
                              Invite Users
                            </Text>
                          </NavLink>
                        </Box>
                      </MenuItem>
                    </>
                  ) : null}
                  {userSlice?.isAuthenticated ? (
                    <>
                      <MenuItem>
                        <Box w={'full'}>
                          <NavLink
                            to="/settings"
                            role="group"
                            onClick={() =>
                              // @ts-ignore
                              document.getElementById(link.id).scrollIntoView({
                                block: 'center',
                                behavior: 'smooth',
                              })
                            }
                          >
                            <Text
                              transition="all 0.2s ease-in-out"
                              mr="1rem"
                              color="black"
                              _groupHover={{
                                color: 'black',
                                fontWeight: '600',
                              }}
                            >
                              Settings
                            </Text>
                          </NavLink>
                        </Box>
                      </MenuItem>
                    </>
                  ) : null}
                  {userSlice?.isAuthenticated ? (
                    <>
                      <MenuItem minH="40px" onClick={onLogout}>
                        <Box w={'full'}>
                          <Text
                            transition="all 0.2s ease-in-out"
                            mr="1rem"
                            color="black"
                            _hover={{
                              color: 'black',
                              fontWeight: '600',
                            }}
                          >
                            Sign Out
                          </Text>
                        </Box>
                      </MenuItem>
                    </>
                  ) : null}
                  <MenuItem padding={'none'}>
                    <Box w={'full'}>
                      {!userSlice?.isAuthenticated ? (
                        <>
                          <Box>
                            <InternalLink to="/login">
                              <Button
                                bg="white"
                                color="black"
                                transition={'all 0.2s ease-in-out'}
                                _hover={{ filter: 'brightness(105%)' }}
                                borderWidth={'1px'}
                                borderColor={'brand.primary'}
                                w={'full'}
                              >
                                Login
                              </Button>
                            </InternalLink>
                          </Box>
                          <Box mt="1rem">
                            <InternalLink to="/join">
                              <Button
                                bg="white"
                                color="black"
                                transition={'all 0.2s ease-in-out'}
                                _hover={{ filter: 'brightness(105%)' }}
                                borderWidth={'1px'}
                                borderColor={'brand.primary'}
                                w={'full'}
                              >
                                Sign up
                              </Button>
                            </InternalLink>
                          </Box>
                        </>
                      ) : (
                        <InternalLink
                          to={
                            userSlice?.isAuthenticated &&
                            userSlice?.user?.roles.includes(Role.Client)
                              ? '/cdashboard'
                              : userSlice?.user?.roles.includes(Role.Admin)
                              ? '/adashboard'
                              : userSlice?.user?.roles.includes(Role.User)
                              ? '/dashboard'
                              : '/login'
                          }
                        >
                          <Button
                            color={'white'}
                            w={'full'}
                            bg="brand.primary"
                            transition={'all 0.2s ease-in-out'}
                            _hover={{ filter: 'brightness(105%)' }}
                          >
                            Dashboard
                          </Button>
                        </InternalLink>
                      )}
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* <Text
                transition="all 0.2s ease-in-out"
                mr="1rem"
                color="black"
                _groupHover={{
                  color: 'black',
                  fontWeight: '600',
                }}
                display={{ lg: 'flex', base: 'none' }}
              >
                <NavLink
                  to="/hackathons"
                  role="group"
                  onClick={() =>
                    // @ts-ignore
                    document.getElementById(link.id).scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  }
                >
                  Hackathon
                </NavLink>
              </Text> */}

              <Flex
                align="center"
                fontSize={{ lg: '18px' }}
                fontWeight={{ lg: '600' }}
                display={{ lg: 'flex', base: 'none' }}
              >
                {!userSlice?.isAuthenticated ? (
                  <>
                    <Box>
                      <InternalLink
                        display={{ base: 'none', md: 'block' }}
                        to="/login"
                      >
                        <Button
                          bg="white"
                          color="black"
                          transition={'all 0.2s ease-in-out'}
                          _hover={{ filter: 'brightness(105%)' }}
                          borderWidth={'1px'}
                          borderColor={'brand.primary'}
                        >
                          Login
                        </Button>
                      </InternalLink>
                    </Box>
                    <Box ml="1rem">
                      <InternalLink
                        display={{ base: 'none', md: 'block' }}
                        to="/join"
                      >
                        <Button
                          bg="white"
                          color="black"
                          transition={'all 0.2s ease-in-out'}
                          _hover={{ filter: 'brightness(105%)' }}
                          borderWidth={'1px'}
                          borderColor={'brand.primary'}
                        >
                          Sign up
                        </Button>
                      </InternalLink>
                    </Box>
                  </>
                ) : (
                  <>
                    <Flex alignItems={'center'}>
                      <Menu isLazy>
                        <MenuButton
                          overflow={'hidden'}
                          as={Button}
                          leftIcon={<WalletIcon />}
                          rightIcon={<ChevronDownIcon />}
                        >
                          {isConnected ? (
                            <Text
                              whiteSpace={'nowrap'}
                              textOverflow={'ellipsis'}
                              overflow={'hidden'}
                            >
                              {accFirstFiveChars}...{accLastThreeChars}
                            </Text>
                          ) : (
                            <>
                              <Text>Connect your wallet</Text>
                            </>
                          )}
                        </MenuButton>
                        <MenuList>
                          {!isConnected && (
                            <MenuItem minH="48px" onClick={wonOpen}>
                              <>
                                <Image
                                  boxSize="1rem"
                                  src="/images/connect.png"
                                  alt="Connect your wallet"
                                  mr="12px"
                                />
                                <span>Connect your wallet</span>
                              </>
                            </MenuItem>
                          )}
                          <MenuItem minH="40px" onClick={onLogout}>
                            <Box w={'full'}>
                              <Text
                                transition="all 0.2s ease-in-out"
                                mr="1rem"
                                color="black"
                                _groupHover={{
                                  color: 'black',
                                  fontWeight: '600',
                                }}
                              >
                                Sign Out
                              </Text>
                            </Box>
                          </MenuItem>
                          <MenuItem padding={'none'}>
                            <Box w={'full'}>
                              <InternalLink
                                to={
                                  userSlice?.isAuthenticated &&
                                  userSlice?.user?.roles.includes(Role.Client)
                                    ? '/cdashboard'
                                    : userSlice?.user?.roles.includes(
                                        Role.Admin,
                                      )
                                    ? '/adashboard'
                                    : userSlice?.user?.roles.includes(Role.User)
                                    ? '/dashboard'
                                    : '/login'
                                }
                              >
                                <Button
                                  width={{ base: '100%' }}
                                  color={'white'}
                                  bg="brand.primary"
                                  transition={'all 0.2s ease-in-out'}
                                  _hover={{ filter: 'brightness(105%)' }}
                                >
                                  Dashboard
                                </Button>
                              </InternalLink>
                            </Box>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </BodyWrapper>
    </Flex>
  );
}

export default HomeNavbar;
