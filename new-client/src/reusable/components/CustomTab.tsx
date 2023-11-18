import { Tab } from '@chakra-ui/react';

const CustomTab = (props: any) => {
  const { children } = props;

  return (
    <Tab
      _selected={{
        color: 'brand.secondary',
        borderBottomColor: 'brand.primary',
        fontWeight: '700',
      }}
      fontSize={'16px'}
      fontWeight={'400'}
      color="brand.lightsecondary"
    >
      {children}
    </Tab>
  );
};

export default CustomTab;
