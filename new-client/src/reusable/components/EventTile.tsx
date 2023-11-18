import { Flex, GridItem, Image, Text } from '@chakra-ui/react';
import { CalendarIcon, ViewIcon } from '@chakra-ui/icons';
import { InternalLink } from '../../utils/Link';
interface EventTileProps {
  eventImage: string;
  eventName: string;
  hackathonName: string;
  link: string;
  mStartDate: string;
}

function EventTile({
  eventImage,
  eventName,
  mStartDate,
  hackathonName,
}: EventTileProps) {
  return (
    <InternalLink to="/aeventdetail">
      <GridItem
        bg="white"
        borderRadius={'0.5rem'}
        boxShadow="rgba(0, 0, 0, 0.08) 0px 1px 4px"
        color="brand.secondary"
        display={'flex'}
        flexDirection={'column'}
        w={{ lg: '320px' }}
        h={{ lg: '330px' }}
      >
        <Image
          w="full"
          h={'160px'}
          borderRadius={'10px'}
          src={eventImage}
          backgroundSize="cover"
          backgroundPosition="center"
        />
        <Flex
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={'column'}
          textAlign={'left'}
          h={'full'}
          p={'1rem'}
        >
          <Flex
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            alignContent={'center'}
          >
            <Text fontSize={{ lg: '14px' }}>
              <CalendarIcon color={'brand.primary'} /> {mStartDate} EST
            </Text>

            <Text fontSize={{ lg: '14px' }}>
              <ViewIcon color={'brand.primary'} /> Online
            </Text>
          </Flex>

          <Text fontSize={'16px'} fontWeight={'700'}>
            {eventName}
          </Text>

          <Text fontSize={'12px'}>By {hackathonName}</Text>
        </Flex>
      </GridItem>
    </InternalLink>
  );
}

export default EventTile;
