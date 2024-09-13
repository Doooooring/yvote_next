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

function loadImage(props: ImageProps): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new (Image(props) as any)();
    img.onload = () => resolve(img.src);
    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

type Status = 'pending' | 'success' | 'error';

interface ImageResource {
  read(): string;
}

function createImageResource(props: ImageProps): ImageResource {
  let status: Status = 'pending';
  let result: unknown;
  const suspender = loadImage(props).then(
    (imageSrc) => {
      status = 'success';
      result = imageSrc;
    },
    (error) => {
      status = 'error';
      result = error;
    },
  );

  return {
    read(): string {
      if (status === 'pending') {
        throw suspender; // Throw a promise to trigger Suspense
      } else if (status === 'error') {
        throw result; // Throw an error if the promise rejects
      } else if (status === 'success') {
        return result as string; // Return the loaded image source
      }
      throw new Error('Unexpected status'); // Fallback to handle any unexpected status
    },
  };
}

const fetchImg = async (src: string) => {
  const response = await fetch(src);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

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
  const [show, setShow] = useState<boolean>(false);

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
