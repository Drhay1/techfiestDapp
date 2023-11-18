import { Box, TabPanel } from '@chakra-ui/react';
import { FormattingWrapper } from '../styled';

interface CustomTabPanelProps {
  data: string | undefined;
}

const CustomTabPanel = ({ data }: CustomTabPanelProps) => {
  return (
    <FormattingWrapper>
      <TabPanel bg="white">
        <Box
          borderColor={'brand.secondary'}
          color="black"
          p={{ md: '1rem' }}
          // @ts-ignore
          dangerouslySetInnerHTML={{
            // @ts-ignore
            __html: data?.replace(
              /<a\b([^>]*)>(.*?)<\/a>/g,
              `<a $1 style='color: #0F5EFE;'>$2</a>`,
            ),
          }}
        />
      </TabPanel>
    </FormattingWrapper>
  );
};

export default CustomTabPanel;
