import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
        <IconWrapper>
          <FontAwesomeIcon icon={faEnvelope as IconProp} />
        </IconWrapper>
        <span> 8gundogan@yonsei.ac.kr </span>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-bottom: 100px;
  border: 0;
  border-radius: 10px;
`;

const Header = styled.div`
  display: block;
  align-items: center;
  font-size: 0.8em;
  padding: 30px 40px 0 40px;
  color: rgb(64, 64, 64);
  h2 {
    font: inherit;
    font-size: 1.6rem;
    font-weight: 550;
    border-bottom: 2px solid rgb(64, 64, 64);
    padding-bottom: 5px;
    display: inline-block;
  }
  hr {
    margin: 20px 0 0 0;
  }
`;

const Body = styled.div`
  padding: 0 40px 30px;
  font-size: 0.9rem;
  line-height: 1.8em;
  font-weight: 400;
  text-align: baseline;
`;

const IconWrapper = styled.div`
  display: inline-flex;
  width: 13px;
  height: auto;
`;
