import Head from 'next/head';

// Defaults — kept as constants so caller-passed `null` (which JS default-
// params do NOT coalesce) can fall back to the same values inside the body.
// See `keywords/[keyword]/index.tsx` passing `keyword.keywordImage` which is
// `string | null` from the DB.
const DEFAULT_TITLE = '와이보트';
const DEFAULT_DESCRIPTION = '와이보트를 통해 최소한의 필요한 뉴스만을 가장 효율적인 방법으로 만나보세요.';
const DEFAULT_IMAGE = `https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75`;
const DEFAULT_URL = `https://yvoting.com`;
const DEFAULT_TYPE = 'website';

interface HeadMetaProps {
  // Allow null in addition to undefined — call sites pass DB columns
  // directly (e.g. `image: keyword.keywordImage`) which are nullable.
  title?: string | null;
  description?: string | null;
  image?: string | null;
  url?: string | null;
  type?: string | null;
}

function HeadMeta({
  title,
  description,
  image,
  url,
  type,
}: HeadMetaProps) {
  // Nullish-coalesce so both `undefined` (prop omitted) and `null`
  // (DB column) fall back to the defaults. `.startsWith` / `new URL()`
  // below would crash on null otherwise.
  const safeTitle = title ?? DEFAULT_TITLE;
  const safeDescription = description ?? DEFAULT_DESCRIPTION;
  const safeImage = image ?? DEFAULT_IMAGE;
  const safeUrl = url ?? DEFAULT_URL;
  const safeType = type ?? DEFAULT_TYPE;
  const resolvedImage = safeImage.startsWith('http')
    ? safeImage
    : `${new URL(safeUrl).origin}${safeImage}`;
  return (
    <Head>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <meta name="author" content={'와이보트'} />
      <link rel="canonical" href={safeUrl} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="content-language" content="ko" />
      <meta name="application-name" content="와이보트" />
      <meta name="apple-mobile-web-app-title" content={safeTitle} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:url" content={safeUrl} />
      <meta property="og:type" content={safeType} />
      <meta property="og:article:author" content={'와이보트'} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1"
      />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta
        content="minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no"
        name="viewport"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
      />
    </Head>
  );
}

export default HeadMeta;

// export default function HeadMeta() {
//   return (
//     <Head>
//       <title>{'와이보트'}</title>
//       <meta
//         name="description"
//         content={'와이보트를 통해 최소한의 필요한 뉴스만을 가장 효율적인 방법으로 만나보세요.'}
//       />
//       <meta property="og:title" content={'와이보트'} />
//       <meta property="og:type" content="website" />
//       <meta property="og:url" content={'https://yvoting.com'} />
//       <meta
//         property="og:description"
//         content={'와이보트를 통해 최소한의 필요한 뉴스만을 가장 효율적인 방법으로 만나보세요.'}
//       />
//       <meta
//         property="og:image"
//         content={
//           'https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75'
//         }
//       />
//       <meta property="og:article:author" content="와이보트" />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="192x192"
//         href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="32x32"
//         href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="96x96"
//         href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
//       />
//       <link
//         rel="icon"
//         type="image/png"
//         sizes="16x16"
//         href="https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75"
//       />
//     </Head>
//   );
// }
