import { FormEvent, useEffect, useState } from 'react';
import HeadMeta from '@components/common/HeadMeta';
import TrackedLane from '@components/admin/trackedLane';
import ProposedActionsLane from '@components/admin/proposedActionsLane';
import IncidentsLane from '@components/admin/incidentsLane';
import {
  ADMINJAE2_STORAGE_KEY,
  isAdminJae2Password,
} from '@components/admin/adminjae2Auth';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 300,
  };
};

export default function AdminJae2() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthenticated(localStorage.getItem(ADMINJAE2_STORAGE_KEY) === 'true');
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAdminJae2Password(password)) {
      setError('Wrong password.');
      return;
    }
    localStorage.setItem(ADMINJAE2_STORAGE_KEY, 'true');
    setError('');
    setAuthenticated(true);
  };

  const handleLock = () => {
    localStorage.removeItem(ADMINJAE2_STORAGE_KEY);
    setPassword('');
    setAuthenticated(false);
  };

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
            {authenticated ? (
              <>
                <div className="adminjae2-toolbar">
                  <button type="button" onClick={handleLock}>
                    Lock
                  </button>
                </div>
                <ProposedActionsLane />
                <TrackedLane />
                <IncidentsLane />
              </>
            ) : (
              <form className="adminjae2-login" onSubmit={handleSubmit}>
                <label htmlFor="adminjae2-password">Password</label>
                <div className="adminjae2-login-row">
                  <input
                    id="adminjae2-password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    autoFocus
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                  />
                  <button type="submit">Enter</button>
                </div>
                {error ? <p role="alert">{error}</p> : null}
              </form>
            )}
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

  .adminjae2-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;

    button {
      height: 36px;
      padding: 0 14px;
      border: 1px solid ${({ theme }) => theme.colors.gray400};
      border-radius: 6px;
      background: ${({ theme }) => theme.colors.yvote01};
      color: ${({ theme }) => theme.colors.yvote12};
      font-size: 14px;
      cursor: pointer;
    }
  }

  .adminjae2-login {
    width: min(100%, 360px);
    margin: 96px auto 0;
    padding: 22px;
    border: 1px solid ${({ theme }) => theme.colors.gray400};
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.yvote01};
    display: flex;
    flex-direction: column;
    gap: 10px;

    label {
      color: ${({ theme }) => theme.colors.yvote12};
      font-size: 14px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #b3261e;
      font-size: 13px;
      line-height: 1.4;
    }
  }

  .adminjae2-login-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 84px;
    gap: 8px;

    input,
    button {
      height: 38px;
      border-radius: 6px;
      font-size: 14px;
    }

    input {
      min-width: 0;
      border: 1px solid ${({ theme }) => theme.colors.gray400};
      padding: 0 10px;
      color: ${({ theme }) => theme.colors.yvote12};
    }

    button {
      border: 0;
      background: ${({ theme }) => theme.colors.yvote12};
      color: ${({ theme }) => theme.colors.yvote01};
      font-weight: 600;
      cursor: pointer;
    }
  }
`;
