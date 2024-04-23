import { Device, useDevice } from '@utils/hook/useDevice';
import LoadingCommon from '../../loading';
import Modal from '../../modal';

export default function LoadingIndicator({ state }: { state: boolean }) {
  const device = useDevice();

  return (
    <Modal state={state}>
      <LoadingCommon
        comment={'소식을 받아오고 있어요 !!!'}
        isRow={device === Device.pc ? false : true}
        fontSize={device === Device.pc ? '2rem' : '1.3rem'}
        iconSize={device === Device.pc ? 64 : 32}
      />
    </Modal>
  );
}
