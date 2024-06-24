import defaultImg from '@images/default_image.png';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import styles from './imageFallback.module.css'
/** image load error 일 경우 default image 표시 component */
export default function ImageFallback({
  src,
  width,
  height,
  fill,
}: {
  src: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const imageStyle = useMemo(() => {
    const style = { width: width ?? 'auto', height: height ?? 'auto' };
    return style;
  }, []);
  if (fill) {
    return (
      <Image
        className={isLoading ? styles.isLoading : ''}
        src={loadError ? defaultImg : src}
        fill
        alt="default"
        sizes="100vw"
        // style={imageStyle}
        onError={() => {
          setLoadError(true);
        }}
        onLoad={() => {
          setIsLoading(false)
        }}
        placeholder='blur'
        blurDataURL='/_next/image?url=%2Fassets%2Fimg%2Flogo_image.png&w=640&q=75'
      />
    );
  } else if (typeof width === 'number' && typeof height === 'number') {
    return (
      <Image
        className={isLoading ? styles.isLoading : ''}
        src={loadError ? defaultImg : src}
        height={height as number}
        width={width as number}
        alt="image"
        sizes="100vw"
        // style={imageStyle}
        onError={() => {
          setLoadError(true);
        }}
        onLoad={() => {
          setIsLoading(false)
        }}
        placeholder='blur'
        blurDataURL='/_next/image?url=%2Fassets%2Fimg%2Flogo_image.png&w=640&q=75'
      />
    );
  } else {
    return (
      <Image
      className={isLoading ? styles.isLoading : ''}

        src={loadError ? defaultImg : src}
        height={Number((height as string).split('%')[0])}
        width={Number((width as string).split('%')[0])}
        alt="image"
        style={imageStyle}
        sizes="100vw"
        onError={() => {
          setLoadError(true);
        }}
        onLoad={() => {
          setIsLoading(false)
        }}
        placeholder='blur'
        blurDataURL='/_next/image?url=%2Fassets%2Fimg%2Flogo_image.png&w=640&q=75'
      />
    );
  }
}
