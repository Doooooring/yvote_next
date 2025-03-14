import { useSuspense } from '@utils/hook/useSuspense';
import { Preview } from '@utils/interface/news';
import { fetchImg } from '@utils/tools/async';
import PreviewBox from '../previewBox';

interface NewsBlockProps {
  previews: Array<Preview>;
  onPreviewClick: (id: number) => void;
}

const fetchNewsImages = async (previews: Array<Preview>) => {
  const promises = previews.map(({ newsImage }) => {
    const response = fetchImg(newsImage);
    return response;
  });
  const response = await Promise.all(promises);
  return response;
};

export default function NewsBlock({ previews, onPreviewClick }: NewsBlockProps) {
  const read = useSuspense(
    'previewImages' + previews.reduce((acc, cur) => acc + String(cur.id), ''),
    async () => await fetchNewsImages(previews),
  );

  const images = read();

  return (
    <>
      {previews.map((preview, idx) => {
        return (
          <PreviewBox key={preview.id} preview={preview} img={images[idx]} click={onPreviewClick} />
        );
      })}
    </>
  );
}
