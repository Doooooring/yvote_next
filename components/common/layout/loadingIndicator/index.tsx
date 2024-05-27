import { Device, useDevice } from '@utils/hook/useDevice';
import LoadingCommon from '../../loading';
import Modal from '../../modal';

export default function LoadingIndicator({ state }: { state: boolean }) {
  const device = useDevice();

  return (
    <Modal state={state} backgroundColor={'rgb(255,255,255, 0.3)'}>
      <LoadingCommon
        comment={''}
        fontColor = 'black'
        isRow={device === Device.pc ? false : true}
        fontSize={device === Device.pc ? '2rem' : '1.3rem'}
        iconSize={device === Device.pc ? 64 : 32}
      />
    </Modal>
  );
}
