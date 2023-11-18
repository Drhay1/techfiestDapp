import { Box } from '@chakra-ui/react';

interface ComponentType {
  bgColor?: string;
  children: JSX.Element;
  id?: string;
  props?: any;
}

function BodyWrapper({ id, bgColor, props, children }: ComponentType) {
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
      {...props}
    >
      {children}
    </Box>
  );
}

export default BodyWrapper;
