import { HackathonStatus } from '../../store/interfaces/hackathon.interface';
import {
  EndedStatusIcon,
  PendingStatusIcon,
  RejectedStatusIcon,
  ReviewingStatusIcon,
  PublishedStatusIcon,
  TagText,
} from '../styled';

interface HackathonListStatusComponentProps {
  status?: HackathonStatus;
}

function HackathonListStatusComponent({
  status,
}: HackathonListStatusComponentProps) {
  switch (status) {
    case HackathonStatus.pending:
      return (
        <>
          <PendingStatusIcon />
          <TagText>{status}</TagText>
        </>
      );
    case HackathonStatus.published:
      return (
        <>
          <PublishedStatusIcon />
          <TagText>active</TagText>
        </>
      );
    case HackathonStatus.reviewing:
      return (
        <>
          <ReviewingStatusIcon />
          <TagText>{'in review'}</TagText>
        </>
      );
    case HackathonStatus.upcoming:
      return (
        <>
          <ReviewingStatusIcon />
          <TagText>Upcoming</TagText>
        </>
      );
    case HackathonStatus.ended:
      return (
        <>
          <EndedStatusIcon />
          <TagText>{status}</TagText>
        </>
      );
    case HackathonStatus.rejected:
      return (
        <>
          <RejectedStatusIcon />
          <TagText>{status}</TagText>
        </>
      );
    default:
      return null;
  }
}

export default HackathonListStatusComponent;
