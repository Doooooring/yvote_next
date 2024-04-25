import React from 'react';
import styled from 'styled-components';
import typesData from './types.json';

interface Section {
  heading?: string;
  paragraph?: string[];
}

interface Type {
  id: number;
  title: string;
  content: string[];
  subSections: Section[];
}

interface TypesProps {
  id: number;
}

const Types: React.FC<TypesProps> = ({ id }) => {
  const type = typesData.find((type: Type) => type.id === id);

  return (
    <Wrapper>
      {type ? (
        <div>
          <h1>{type.title}</h1>
          {type.content.map((content, index) => (
            <p key={index}>{content}</p>
          ))}
          {type.subSections.map((section, secIndex) => (
            <div key={secIndex}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.paragraph &&
                section.paragraph.map((paragraph, paraIndex) => <p key={paraIndex}>{paragraph}</p>)}
            </div>
          ))}
        </div>
      ) : (
        <p>Type with ID {id} not found.</p>
      )}
    </Wrapper>
  );
};

export default Types;

const Wrapper = styled.div`
  background-color: white;
  margin-top: 40px;
  padding: 30px 40px;
  border: 0;
  border-radius: 10px;
  height: auto;
  h1 {
    font: inherit;
    font-size: 1.8rem;
    font-weight: 550;
    margin: 10px 0;
    display: inline-block;
  }
  h2 {
    font: inherit;
    font-size: 1.3rem;
    line-height: 1.5rem;
    margin: 2.5rem 0 0 0;
    color: rgb(64, 64, 64);
    font-weight: 550;
  }
  p {
    margin: 0.8rem 0 0 0;
    font-family: summary-font;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.6rem;
  }
`;
