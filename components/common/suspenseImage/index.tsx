import Image, { ImageProps } from 'next/image';
import { use, useCallback, useEffect, useState } from 'react';
import { CSSProperties } from 'styled-components';

interface ImageFallbackProps extends ImageProps {
  blurImg?: string;
  imgStyle?: CSSProperties;
  suspense?: boolean;
}

const fetchImg = async (src: string) => {
  const response = await fetch(src);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

function usePromiseImg<T>(promise: Promise<T>) {
  const [promiseImg, setPromiseImg] = useState<{ state: Status; result: T | null }>({
    state: Status.pending,
    result: null,
  });

  const suspender = promise.then(
    (res: T) => {
      setPromiseImg({ state: Status.success, result: res });
    },
    (err) => {
      setPromiseImg({ state: Status.error, result: null });
    },
  );

  const read = useCallback(() => {
    switch (promiseImg.state) {
      case 'pending':
        throw suspender;
      case 'error':
        throw promiseImg.result;
      default:
        return promiseImg.result;
    }
  }, [promiseImg]);

  return { read };
}

export default function SuspenseImage({
  src,
  alt,
  imgStyle = {},
  blurImg = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBAB  bWyZJf74GZgAAAABJRU5ErkJggg==',
  suspense,
  ...others
}: ImageFallbackProps) {
  const promise = usePromiseImg(fetchImg(src as string));
  const img = promise.read();

  return <Image src={img!} alt={alt ?? 'image'} style={imgStyle} {...others} />;
}
