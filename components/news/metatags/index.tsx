import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, image, url, type }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
    </Head>
  );
};

export default MetaTags;
