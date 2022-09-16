import React from 'react';
import { Helmet } from 'react-helmet-async';
import { IMetaTags } from '../SplashPage/splashPage.types';

const MetaTags: React.FC<IMetaTags> = ({ seoMetaTags }) => {
  return (
    <Helmet>
      <title>{seoMetaTags?.title}</title>
      <meta name={seoMetaTags?.contentName} content={seoMetaTags?.content} />
      <meta name="description" content={seoMetaTags?.description} />
      <meta property="og:title" content={seoMetaTags?.title} />
      <meta property="og:description" content={seoMetaTags?.description} />
      {seoMetaTags?.image && (
        <meta property="og:image" content={seoMetaTags.image} />
      )}
      <meta name="twitter:title" content={seoMetaTags?.title} />
      <meta name="twitter:description" content={seoMetaTags?.description} />
      <link rel="icon" href={seoMetaTags?.favicon} />
      <link
        rel="apple-touch-icon"
        href="https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW"
      />
    </Helmet>
  );
};

export default MetaTags;
