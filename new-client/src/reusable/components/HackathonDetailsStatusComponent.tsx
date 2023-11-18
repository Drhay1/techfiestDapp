import { HackathonStatus } from '../../store/interfaces/hackathon.interface';
import {
  DetailsEndedStatus,
  DetailsPendingStatus,
  DetailsPublishedStatus,
  DetailsRejectedStatus,
  TagCircleBlack,
  TagCircleWhite,
} from '../styled';

interface HackathonDetailsStatusComponentProps {
  status?: HackathonStatus;
}

function HackathonDetailsStatusComponent({
  status,
}: HackathonDetailsStatusComponentProps) {
  switch (status) {
    case HackathonStatus.pending:
      return (
        <DetailsPendingStatus>
          <TagCircleBlack />
          {status.toUpperCase()}
        </DetailsPendingStatus>
      );
    case HackathonStatus.published:
      return (
        <DetailsPublishedStatus>
          <TagCircleWhite />
          {'active'.toUpperCase()}
        </DetailsPublishedStatus>
      );
    case HackathonStatus.ended:
      return (
        <DetailsEndedStatus>
          <TagCircleWhite />
          {status.toUpperCase()}
        </DetailsEndedStatus>
      );
    case HackathonStatus.rejected:
      return (
        <DetailsRejectedStatus>
          <TagCircleWhite />
          {status.toUpperCase()}
        </DetailsRejectedStatus>
      );
    default:
      return null;
  }
}

export default HackathonDetailsStatusComponent;
