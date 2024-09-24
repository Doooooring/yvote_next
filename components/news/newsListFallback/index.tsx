import PreviewBoxFallback from '../previewsBoxFallback';

export default function NewsListFallback({ length }: { length: number }) {
  const arr = new Array(length).fill(0);
  return (
    <>
      {arr.map(() => (
        <PreviewBoxFallback />
      ))}
    </>
  );
}
