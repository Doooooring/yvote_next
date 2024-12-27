import { HOST_URL } from '@public/assets/url';
import { useSuspense } from '@utils/hook/useSuspense';
import { Preview } from '@utils/interface/news';
import PreviewBox from '../previewBox';
import { fetchImg } from '@utils/tools/async';

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
    'previewImages' + String(previews[0].id),
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
