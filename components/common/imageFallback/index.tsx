import defaultImg from '@images/default_image.png';
import Image from 'next/image';
import { useMemo, useState } from 'react';

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
  const [loadError, setLoadError] = useState<boolean>(false);
  const imageStyle = useMemo(() => {
    const style = { width: width ?? 'auto', height: height ?? 'auto' };
    return style;
  }, []);
  if (fill) {
    return (
      <Image
        src={loadError ? defaultImg : src}
        fill
        alt="default"
        sizes="100vw"
        // style={imageStyle}
        onError={() => {
          setLoadError(true);
        }}
      />
    );
  } else if (typeof width === 'number' && typeof height === 'number') {
    return (
      <Image
        src={loadError ? defaultImg : src}
        height={height as number}
        width={width as number}
        alt="image"
        sizes="100vw"
        // style={imageStyle}
        onError={() => {
          setLoadError(true);
        }}
      />
    );
  } else {
    return (
      <Image
        src={loadError ? defaultImg : src}
        height={Number((height as string).split('%')[0])}
        width={Number((width as string).split('%')[0])}
        alt="image"
        style={imageStyle}
        sizes="100vw"
        onError={() => {
          setLoadError(true);
        }}
      />
    );
  }
}
