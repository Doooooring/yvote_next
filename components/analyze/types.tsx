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

export default function Types() {
  return (
    <Wrapper>
      <div>
        {typesData.map((type: Type) => (
          <div key={type.id}>
            <h1>{type.title}</h1>
            {type.content.map((content, index) => (
              <p key={index}>{content}</p>
            ))}
            {type.subSections.map((section, secIndex) => (
              <div key={secIndex}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraph &&
                  section.paragraph.map((paragraph, paraIndex) => (
                    <p key={paraIndex}>{paragraph}</p>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-top: 40px;
  padding: 30px 40px;
  border: 0;
  border-radius: 10px;
  height: auto;
  h1 {
    font: inherit;
    font-size: 1.6rem;
    font-weight: 550;
    margin: 10px 0;
    display: inline-block;
  }
  h2 {
    font: inherit;
    font-size: 1.2rem;
    line-height: 1.5rem;
    margin: 2.5rem 0 0 0;
    color: rgb(64, 64, 64);
    font-weight: 550;
  }
  p {
    margin: 0.8rem 0 0 0;
    font-family: summary-font;
    font-weight: 400;
    font-size: 0.9rem;
    line-height: 1.6rem;
  }
`;
