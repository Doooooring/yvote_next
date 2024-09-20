import Image, { ImageProps } from 'next/image';
import React, { use, useCallback, useEffect, useState } from 'react';
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

function usePromiseImg(src: string) {
  //   const [promiseImg, setPromiseImg] = useState<{
  //     state: Status;
  //     result: string | Promise<any> | null;
  //   }>({
  //     state: Status.pending,
  //     result: null,
  //   });
  let status = Status.pending;
  let result: any;
  let suspender: Promise<any> | null = null;

  useEffect(() => {
    const promise = fetchImg(src);
    suspender = promise.then(
      (res: string) => {
        status = Status.success;
        result = res;
      },
      (err) => {
        status = Status.error;
        result = null;
      },
    );
  }, [src]);

  const read = useCallback(() => {
    switch (status) {
      case Status.success:
        return result as string;
      default:
        throw suspender;
    }
  }, [status, suspender]);

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
  const img = use(fetchImg(src as string));

  return <Image src={img as string} alt={alt ?? 'image'} style={imgStyle} {...others} />;
}
