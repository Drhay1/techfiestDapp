import { Box } from '@chakra-ui/react';

interface MiniWrapperProps {
  children: any;
}

function MiniWrapper({ children }: MiniWrapperProps) {
  return (
    <Box
      mx="auto"
      position={'relative'}
      width={{
        base: '100%',
        md: '100%',
        lg: '1024px',
        xll: '1199px',
        r: '1440px',
      }}
    >
      {children}
    </Box>
  );
}

export default MiniWrapper;
