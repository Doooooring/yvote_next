import defaultImg from '@images/img_thumb@2x.png';
import Image from 'next/image';
import { useState } from 'react';

/** image load error 일 경우 default image 표시 component */
export default function ImageFallback({
  src,
  width,
  height,
}: {
  src: string;
  width: number;
  height: number;
}) {
  const [loadError, setLoadError] = useState<boolean>(false);
  return (
    <Image
      src={loadError ? defaultImg : src}
      height={height}
      width={width}
      alt="image"
      onError={() => {
        setLoadError(true);
      }}
    />
  );
}
