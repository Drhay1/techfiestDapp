import styled from 'styled-components';

export const AuthInput = styled('input')`
  box-shadow: none;
  background-color: ${(props: any) => (props.bg ? props.bg : 'none')};
  border-color: rgba(208, 213, 221, 1);
  border-width: 1px;
  width: 100%;
  fontsize: 12px;
  color: rgba(102, 112, 133, 1);
  font-weight: medium;
  padding: 10px 16px;
  outline: none;
  border-radius: 4px;
  border-color: ${(props: any) => (props.borderColor ? props.borderColor : '')};
  &::placeholder {
    font-size: 12px;
  }
`;

export const RegisterCheckBox = styled('input')`
  box-shadow: unset;
`;

export const TermsLink = styled.a`
  color: black;
  font-weight: medium;
  margin-left: 2px;
  color: #2e25f2;
`;

const Tag = styled.div`
  display: inline-block;
  border-radius: 4px;
  font-weight: bold;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
`;

export const PendingStatus = styled(Tag)`
  background-color: #f7e0a4;
  color: #603509;
`;

export const PublishedStatus = styled(Tag)`
  background-color: #bff9c7;
  color: #0e4a20;
  white-space: nowrap;
`;

export const ReviewingStatus = styled(Tag)`
  background-color: #d1eaff;
  color: #1e66b3;
  white-space: nowrap;
`;

export const RejectedStatus = styled(Tag)`
  background-color: #fad2d0;
  color: #8c1f32;
  white-space: nowrap;
`;

export const EndedStatus = styled(Tag)`
  background-color: #ffcccc;
  color: #b30000;
  white-space: nowrap;
`;

const DetailsTag = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.16px;
`;

export const DetailsPendingStatus = styled(DetailsTag)`
  background-color: #ffd700;
  color: #000000;
  border-radius: 3px;
  font-size: 10px;
`;

export const DetailsPublishedStatus = styled(DetailsTag)`
  background-color: #0e4a20;
  color: #ffffff;
  border-radius: 3px;
  font-size: 10px;
`;

export const DetailsRejectedStatus = styled(DetailsTag)`
  background-color: #8c1f32;
  color: #ffffff;
  border-radius: 3px;
  font-size: 10px;
`;

export const DetailsEndedStatus = styled(DetailsTag)`
  background-color: #b30000;
  color: #ffffff;
  border-radius: 3px;
  font-size: 10px;
`;

export const TagCircleWhite = styled.div`
  display: inline-flex;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  margin-right: 8px;
`;

export const TagCircleBlack = styled.div`
  display: inline-flex;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #000000;
  margin-right: 8px;
`;

export const FormattingWrapper = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
  }

  h4 {
    font-size: 1rem;
    font-weight: bold;
  }

  h5 {
    font-size: 0.875rem;
    font-weight: bold;
  }

  h6 {
    font-size: 0.75rem;
    font-weight: bold;
  }

  ul {
    list-style-type: disc;
    padding-left: 2rem;

    li {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }

  ol {
    list-style-type: decimal;
    padding-left: 2rem;

    li {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }

  a {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  a.external {
    position: relative;
    padding-right: 20px;

    &:after {
      content: '→';
      position: absolute;
      top: 0;
      right: 0;
      color: #0ba5ec;
    }
  }
`;
