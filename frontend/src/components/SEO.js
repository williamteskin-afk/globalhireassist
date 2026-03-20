import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Global Hire Assist';
const DEFAULT_DESC = 'Your Trusted Visa Partner. Connecting job seekers with overseas work opportunities and visa processing support in the United States.';
const SITE_URL = window.location.origin;
const LOGO = 'https://customer-assets.emergentagent.com/job_hire-assist-portal/artifacts/z27n0xxm_22178.png';

export default function SEO({ title, description, path = '', image, type = 'website', noIndex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Your Trusted Visa Partner`;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || LOGO;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="US-AZ" />
      <meta name="geo.placename" content="Mesa, Arizona" />
    </Helmet>
  );
}
