import { useSuspense } from '@utils/hook/useSuspense';
import { fetchImg } from '@utils/tools/async';
import Image, { ImageProps } from 'next/image';
import { CSSProperties } from 'styled-components';

interface ImageFallbackProps extends ImageProps {
  blurImg?: string;
  imgStyle?: CSSProperties;
  suspense?: boolean;
}

export default function SuspenseImage({
  src,
  alt,
  imgStyle = {},
  blurImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg==',
  suspense,
  children,
  ...others
}: ImageFallbackProps) {
  const read = useSuspense(src as string, async () => await fetchImg(src as string));
  const result = read();

  return (
    <>
      <Image src={result} alt={alt ?? 'image'} style={imgStyle} {...others} />
      {children}
    </>
  );
}
