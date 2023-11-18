import { Box } from '@chakra-ui/react';

interface ComponentType {
  bgColor?: string;
  children: JSX.Element;
  id?: string;
}

function BodyWrapper({ id, bgColor, children }: ComponentType) {
  return (
    <Box
      id={id}
      bg={bgColor}
      width={{
        base: 'full',
        r: '1440px',
        md: '768px',
        lg: '960px',
        xl: '1200px',
      }}
      mx="auto"
      position={'relative'}
    >
      {children}
    </Box>
  );
}

export default BodyWrapper;
