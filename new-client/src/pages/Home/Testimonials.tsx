import { Box, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { MainSliceProps } from '../../store/interfaces/mainSlice.interface';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

function Testimonials() {
  const mainSlice = useSelector<RootState, MainSliceProps>(
    (state) => state.main,
  );

  return (
    <Box mt="90px">
      <Text
        color="ek.primary"
        fontSize={{ base: '24', lg: '36px' }}
        textAlign={'center'}
      >
        Our{' '}
        <Text display={'inline'} color="brand.primary">
          Testimonials
        </Text>
      </Text>

      <Grid
        mt={{ base: '73px', lg: '120px' }}
        gridTemplateColumns={{ lg: 'repeat(3, 1fr)', md: 'repeat(2, 1fr)' }}
        borderRadius={'40px'}
        gap="1rem"
      >
        {mainSlice?.testimonials &&
          mainSlice?.testimonials.map((obj, index: number) => (
            <GridItem
              key={index}
              p={{ lg: '69px 40px', base: '25px 36px' }}
              boxShadow="0px 10px 20px rgba(0, 0, 0, 0.15)"
              borderRadius={{ lg: '40px', base: '20px' }}
            >
              <Text color="black"> {obj.testimony} </Text>

              <Text fontWeight={'bold'} fontSize="14px" mt={{ base: '50px' }}>
                {obj.userName} -{' '}
                <Text display={{ base: 'block', lg: 'inline' }}>
                  {obj.role}
                </Text>
              </Text>
              <Image
                src={obj.brandImage}
                alt={obj.from}
                w="20px"
                h="20px"
                mt={{ base: '10px' }}
              />
            </GridItem>
          ))}
      </Grid>
    </Box>
  );
}

export default Testimonials;
