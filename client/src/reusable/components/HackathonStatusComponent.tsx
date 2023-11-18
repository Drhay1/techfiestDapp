import { HackathonStatus } from '../../store/interfaces/hackathon.interface';
import {
  EndedStatus,
  PendingStatus,
  PublishedStatus,
  ReviewingStatus,
  RejectedStatus,
} from '../styled';

interface HackathonStatusComponentProps {
  status?: HackathonStatus;
}

function HackathonStatusComponent({ status }: HackathonStatusComponentProps) {
  switch (status) {
    case HackathonStatus.pending:
      return <PendingStatus>{status}</PendingStatus>;
    case HackathonStatus.published:
      return <PublishedStatus>active</PublishedStatus>;
    case HackathonStatus.reviewing:
      return <ReviewingStatus>{'in review'}</ReviewingStatus>;
    case HackathonStatus.ended:
      return <EndedStatus>{status}</EndedStatus>;
    case HackathonStatus.rejected:
      return <RejectedStatus>{status}</RejectedStatus>;
    default:
      return null;
  }
}

export default HackathonStatusComponent;
