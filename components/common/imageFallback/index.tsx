import { use, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { CSSProperties } from 'styled-components';

import defaultImg from '@images/default_image.png';

import styles from './imageFallback.module.css';

interface ImageFallbackProps extends ImageProps {
  blurImg?: string;
  imgStyle?: CSSProperties;
  suspense?: boolean;
}

export default function ImageFallback({
  src,
  alt,
  imgStyle = {},
  blurImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg==',
  suspense,
  ...others
}: ImageFallbackProps) {
  const [isError, setIsError] = useState<boolean>(false);
  return (
    <Image
      src={isError ? defaultImg : src}
      alt={alt ?? 'image'}
      onError={() => {
        setIsError(true);
      }}
      style={imgStyle}
      placeholder="blur"
      blurDataURL={blurImg}
      {...others}
    />
  );
}
