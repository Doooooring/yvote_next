import { useDevice } from '@utils/hook/useDevice';
import LoadingCommon from '../../loading';
import Modal from '../../modal';
import { useGlobalLoading } from '../../../../utils/hook/useGlobalLoading/useGlobalLoading';
import { Device } from '../../../../utils/interface/common';

export default function LoadingIndicator() {
  const { isLoading } = useGlobalLoading();
  const device = useDevice();

  return (
    <Modal state={isLoading} backgroundColor={'rgb(255,255,255, 0.3)'}>
      <LoadingCommon
        comment={''}
        fontColor="black"
        isRow={false}
        fontSize={device === Device.pc ? '2rem' : '1.3rem'}
        iconSize={device === Device.pc ? 64 : 32}
      />
    </Modal>
  );
}
