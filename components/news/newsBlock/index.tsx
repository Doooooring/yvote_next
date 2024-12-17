import { HOST_URL } from '@public/assets/url';
import { useSuspense } from '@utils/hook/useSuspense';
import { Preview } from '@utils/interface/news';
import PreviewBox from '../previewBox';
import { fetchImg } from '@utils/tools/async';

interface NewsBlockProps {
  previews: Array<Preview>;
  onPreviewClick: (id: string) => void;
}

const fetchNewsImages = async (previews: Array<Preview>) => {
  const promises = previews.map(({ _id }) => {
    const response = fetchImg(`${HOST_URL}/images/news/${_id}`);
    return response;
  });
  const response = await Promise.all(promises);
  return response;
};

export default function NewsBlock({ previews, onPreviewClick }: NewsBlockProps) {
  const read = useSuspense(previews[0]._id, async () => await fetchNewsImages(previews));
  const images = read();

  return (
    <>
      {previews.map((preview, idx) => {
        return (
          <PreviewBox
            key={preview._id}
            preview={preview}
            img={images[idx]}
            click={onPreviewClick}
          />
        );
      })}
    </>
  );
}
