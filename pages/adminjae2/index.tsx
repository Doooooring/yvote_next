import HeadMeta from '@components/common/HeadMeta';
import TrackedLane from '@components/admin/trackedLane';
import ProposedActionsLane from '@components/admin/proposedActionsLane';
import IncidentsLane from '@components/admin/incidentsLane';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 300,
  };
};

export default function AdminJae2() {
  return (
    <>
      <HeadMeta
        {...{
          title: '제안/추적 (관리자)',
          url: `https://yvoting.com/adminjae2`,
        }}
      />
      <Wrapper>
        <div className="main-contents">
          <div className="main-contents-body">
            <ProposedActionsLane />
            <IncidentsLane />
            <TrackedLane />
          </div>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0 80px;

  @media (max-width: 768px) {
    padding-top: 0;
  }
  background-color: ${({ theme }) => theme.colors.yvote02};

  .main-contents {
    display: flex;
    flex-direction: row;
    width: 92%;
    max-width: 1200px;
    min-width: 0px;
    margin: 0;
    padding: 0;

    @media screen and (max-width: 768px) {
      width: 96%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    width: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }
`;
