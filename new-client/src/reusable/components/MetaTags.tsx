import { Helmet } from 'react-helmet-async';

type MetaTagsProps = {
  title: string;
  description: string;
  keywords: string;
  pageUrl: string;
};

const MetaTags = ({ title, description, keywords, pageUrl }: MetaTagsProps) => {
  return (
    <Helmet>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href={'/images/logo.png'} />
      <link rel="canonical" href={`${pageUrl}`} />
      <title>{title}</title>
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={'/images/logo.png'} />
      <meta name="og:url" content={`${pageUrl}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={'/images/logo.png'} />
    </Helmet>
  );
};

MetaTags.defaultProps = {
  title: 'techFiesta',
  keywords:
    'techFiesta, hackathon, developers, web3, blockchain, smart contracts, solidity, Decentralized applications, DApps, dapps, smart conract development, web development, innovation, ekolance, human protocol, rewards, tech, Fiesta, Hackathons',
  description:
    'Particpate in hackathons where developers thrive, ideas flourish, and success begins',
  pageUrl: window.location.href,
};

export default MetaTags;
