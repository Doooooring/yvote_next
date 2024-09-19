import styles from './imageFallback.module.css';
import defaultImg from '@images/default_image.png';
import Image, { ImageProps } from 'next/image';
import { use, useEffect, useState } from 'react';
import { CSSProperties } from 'styled-components';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  return (
    <Image
      src={isError ? defaultImg : src}
      className={isLoading ? styles.isLoading : ''}
      alt={alt ?? 'image'}
      onError={() => {
        setIsError(true);
      }}
      onLoad={() => {
        setIsLoading(false);
      }}
      style={imgStyle}
      placeholder="blur"
      blurDataURL={blurImg}
      {...others}
    />
  );
}
