import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface ContactBoxProps {}

export function ContactBox() {
  return (
    <Wrapper>
      <Header>
        <h2>Contact</h2>
        <hr />
      </Header>
      <Body>
        <p>함께 새로운 언론을 만들어나갈 팀원을 모집합니다</p>
        <p>
          <FontAwesomeIcon icon={faEnvelope} />
          <span> 8gundogan@yonsei.ac.kr </span>
        </p>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-bottom: 60px;
`;

const Header = styled.div`
  display: block;
  align-items: center;
  font-size: 0.8em;
  padding: 30px 40px 0 40px;
  h2 {
    margin: 0 0 0 0;
  }
  hr {
    margin: 20px 0 0 0;
  }
`;

const Body = styled.div`
  display: block;
  padding: 30px 40px;
  p {
    margin: 5px 0;
  }
`;
