import { forwardRef, Link } from '@chakra-ui/react';
import {
  Link as RouterLink,
  useMatch,
  useResolvedPath,
} from 'react-router-dom';

const NavLink = forwardRef(({ children, to, ...rest }, ref) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });
  return (
    <Link
      ref={ref}
      as={RouterLink}
      p={2.5}
      to={to}
      rounded={'md'}
      bg={match ? 'accent2.200' : 'transparent'}
      _hover={{
        textDecoration: 'none',
        bg: 'accent2.100',
      }}
      _focus={{ outline: 'none' }}
      {...rest}
    >
      {children}
    </Link>
  );
});

const InternalLink = forwardRef(({ children, to, ...rest }, ref) => (
  <Link as={RouterLink} to={to || '/'} ref={ref} {...rest}>
    {children}
  </Link>
));

const ExternalLink = forwardRef(
  ({ children, href, ...rest }: any, ref: any) => (
    <Link
      p={2.5}
      href={href}
      ref={ref}
      rounded={'md'}
      isExternal
      _hover={{
        textDecoration: 'none',
      }}
      {...rest}
    >
      {children}
    </Link>
  ),
);

export const proxyAddress = 'http://127.0.0.1:5000';
// export const proxyAddress = 'https://techfiesta.dev';
// export const proxyAddress = 'https://techfiesta.thelle.io';
export const IDBackendApi = 'http://localhost:5001/api';

export { NavLink, ExternalLink, InternalLink };
