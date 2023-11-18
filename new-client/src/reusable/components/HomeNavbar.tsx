import BodyWrapper from './BodyWrapper';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { InternalLink } from '../../utils/Link';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { setAccount } from '../../store/slices/userSlice';
import { Role, UserStateProps } from '../../store/interfaces/user.interface';
import { GetWalletContext } from '../../store/contextProviders/connectWallet';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import './header_style.scss';
import { Box, Button, Flex, Icon, Image, Link, Text } from '@chakra-ui/react';

function HomeNavbar() {
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );
  const [activeMenu, setActiveMenu] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();
  const { isConnected, account } = useContext(GetWalletContext);

  useEffect(() => {
    dispatch(setAccount(account));
  }, [isConnected, account]);

  const onShowMenu = () => {
    const header_style: any = document.querySelector('.header_style');
    if (header_style.classList.contains('show')) {
      header_style.classList.remove('show');
      setActiveMenu(false);
    } else {
      header_style.classList.add('show');
      setActiveMenu(true);
    }
  };

  return (
    <Flex
      zIndex={'100'}
      minW="20rem"
      h={{ base: '60px', md: '64px' }}
      align="center"
      mx={'auto'}
      color="brand.light"
      display={'flex'}
      alignItems={'center'}
      textDecoration={'none'}
      bg="white"
      position="fixed"
      top={'0px'}
      left={'0px'}
      boxShadow={'0px 3px 4px 0px rgba(60, 77, 109, 0.25);'}
      w={{ base: 'full' }}
    >
      <BodyWrapper>
        <Box w={{ base: 'full' }} mx="auto" px={{ base: '1rem', md: 'unset' }}>
          <Flex
            zIndex={'100'}
            w={{ base: 'full' }}
            py="1.2rem"
            align="center"
            justifyContent={'space-between'}
            color="brand.light"
            mx={{ md: 'auto' }}
          >
            <InternalLink to="/">
              <Flex alignItems={'center'}>
                <Box w={{ base: '25.53' }} h={{ base: '25.53' }} mr="4px">
                  <Image
                    w="full"
                    h="full"
                    cursor={'pointer'}
                    src={'/images/new/logo.svg'}
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
                    bg="rgba(15, 94, 254, 1)"
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
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={'24px'}
                fontSize={'1rem'}
                bg="white"
                pt={{ base: '2rem', lg: 'unset' }}
                width={{ base: '70%', lg: 'unset' }}
                top={{
                  base: '60px',
                  lg: 'none',
                }}
                flexDirection={{
                  base: 'column',
                  lg: 'row',
                }}
                position={{
                  base: 'fixed',
                  lg: 'unset',
                }}
                height={{
                  base: '100%',
                  lg: 'none',
                }}
                right={{
                  base: '-70rem',
                  lg: 'none',
                }}
                className="header_style"
              >
                <Text as={Link} href="/hackathons">
                  Hackathons
                </Text>
                {!userSlice?.isAuthenticated ? (
                  <>
                    <Text as={Link} href="/login">
                      Login
                    </Text>
                    <Button
                      as={Link}
                      href="/user-signup"
                      bg="brand.primary"
                      color="white"
                      size={'md'}
                      _hover={{
                        bg: 'white',
                        color: 'brand.primary',
                        borderWidth: '1px',
                        borderColor: 'brand.primary',
                        outline: 'none',
                      }}
                    >
                      Signup
                    </Button>
                  </>
                ) : (
                  <Button
                    as={Link}
                    href={
                      userSlice?.isAuthenticated &&
                      userSlice?.user?.roles.includes(Role.Client)
                        ? '/cdashboard'
                        : userSlice?.user?.roles.includes(Role.Admin)
                        ? '/adashboard'
                        : userSlice?.user?.roles.includes(Role.User)
                        ? '/dashboard'
                        : '/login'
                    }
                    bg="brand.primary"
                    color="white"
                    size={'md'}
                    _hover={{
                      bg: 'white',
                      color: 'brand.primary',
                      borderWidth: '1px',
                      borderColor: 'brand.primary',
                      outline: 'none',
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>

              <Box
                onClick={onShowMenu}
                display={{ lg: 'none' }}
                cursor={'pointer'}
                as={Button}
              >
                <Icon
                  height={'25px'}
                  width={'25px'}
                  as={activeMenu ? AiOutlineClose : AiOutlineMenu}
                />
              </Box>
            </Flex>
          </Flex>
        </Box>
      </BodyWrapper>
    </Flex>
  );
}

export default HomeNavbar;
