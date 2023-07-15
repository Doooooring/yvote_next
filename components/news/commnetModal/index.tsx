import Modal from '@components/common/modal';
import indexStore from '@store/indexStore';
import styled from 'styled-components';

export default function CommentModal() {
  const { currentStore } = indexStore();
  const { isCommentModalUp, setIsCommentModalUp } = currentStore;

  return (
    <Modal state={isCommentModalUp}>
      <Wrapper>
        <div className='modal-head'>
            <div className="type-image">

            </div>
            <div className='head-body'>
                <div className="head-title">
                    <p className="type-name"></p>
                    <div className="keyword-wrapper">

                    </div>
                </div>
                <div className="type-explain">

                </div>
            </div>
        </div>
        <div className='modal-body'>

        </div>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.div`
  width: 40%;
  padding-top : 1.5rem;
  padding-left: 2rem;
  padding-right: 2rem;
`;
