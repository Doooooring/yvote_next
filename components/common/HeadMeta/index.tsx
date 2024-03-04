import Head from 'next/head';

export default function HeadMeta() {
  return (
    <Head>
      <title>{'와이보트'}</title>
      <meta
        name="description"
        content={'와이보트를 통해 최소한의 필요한 뉴스만을 가장 효율적인 방법으로 만나보세요.'}
      />
      <meta property="og:title" content={'와이보트'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={'https://yvoting.com'} />
      <meta
        property="og:description"
        content={'와이보트를 통해 최소한의 필요한 뉴스만을 가장 효율적인 방법으로 만나보세요.'}
      />
      <meta
        property="og:image"
        content={
          'https://yvoting.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_image.d0e9b968.png&w=128&q=75'
        }
      />
      <meta property="og:article:author" content="와이보트" />
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
