/*==================== Import necessary components and libraries ====================*/
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from '@chakra-ui/react';
import BodyWrapper from '../../../reusable/components/BodyWrapper';
import ConditionalRoute from '../../../routes/ConditionalRoute';
import { RootState } from '../../../store/store';
import { Role, UserStateProps } from '../../../store/interfaces/user.interface';
import { useDispatch, useSelector } from 'react-redux';
import { AdminMain, AdminSideMenu } from '.';
import { getAllHackathons } from '../../../store/slices/hackathonSlice';
import { useEffect } from 'react';
import AuthNavbar from '../../../reusable/components/AuthNavbar';
import { ChevronRightIcon } from '@chakra-ui/icons';

function AdminDashboard() {
  /*=========== Initialize dispatch function from Redux ==========*/
  const dispatch = useDispatch<any>();

  /*========== Get user state from Redux ==========*/
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user,
  );

  /*========== Get all hackathons from Redux ==========*/
  useEffect(() => {
    dispatch(getAllHackathons());
  }, []);

  /*========== Return the AdminDashboard component ==========*/
  return (
    /*========== Render the ConditionalRoute component ==========*/
    <ConditionalRoute
      redirectTo="/login"
      condition={userSlice?.isAuthenticated || false}
    >
      <ConditionalRoute
        redirectTo="/404"
        condition={
          userSlice.user && userSlice.user?.roles.includes(Role.Admin)
            ? true
            : false
        }
      >
        {/*=============== Render the BodyWrapper component ===============*/}
        <BodyWrapper>
          <>
            {/*========== Render the HomeNavbar component ==========*/}
            <AuthNavbar />

            {/*========== Css container chackra ui ==========*/}

            <Flex minH="100vh">
              <Box
                transform={{ base: 'translateX(-1000%)', lg: 'none' }}
                position="fixed"
                h="100vh"
                w="280px"
                zIndex="1"
                className="side-menu"
                transition="transform 0.3s"
                overflow={'hidden'}
                bg="white"
                px="20px"
              >
                <AdminSideMenu />
              </Box>
              <Box
                flex="1"
                overflowX="auto"
                ml={{ base: '0', lg: '280px' }}
                px={{ lg: '2rem' }}
                mt={{ base: '60px', lg: '20px' }}
              >
                <Breadcrumb
                  mb={'1rem'}
                  mt={'0.5rem'}
                  spacing="8px"
                  separator={<ChevronRightIcon color="gray.500" />}
                  fontSize={'12px'}
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/adashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <AdminMain />
              </Box>
            </Flex>
          </>
        </BodyWrapper>
      </ConditionalRoute>
    </ConditionalRoute>
  );
}

export default AdminDashboard;
