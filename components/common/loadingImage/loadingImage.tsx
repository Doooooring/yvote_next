import { ImageProps } from 'next/image';
import { CSSProperties } from 'styled-components';

interface ImageFallbackProps extends ImageProps {
  blurImg?: string;
  imgStyle?: CSSProperties;
  suspense?: boolean;
}

export default function LoadingImage({
  src,
  alt,
  imgStyle = {},
  blurImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg==',
  suspense,
  ...others
}: ImageFallbackProps) {}
