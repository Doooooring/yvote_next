import React from 'react';
import styled from 'styled-components';
import typesData from './types.json';
import ImageFallback from '@components/common/imageFallback';

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
          <div className="header">
            <div className="img-wrapper">
              <ImageFallback
                src={`/assets/img/test_${id}.svg`}
                width="100%"
                height="100%"
                fill={true}
              />
            </div>
            <h1>{type.title}</h1>
          </div>
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
        <p>Error : result not found.</p>
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
    font-size: 1.6rem;
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
  .header {
    display: flex;
    align-items: center;
  }
  .img-wrapper {
    display: inline-block;
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
    margin: 0 10px 0 0;
    padding: 0;
    flex-shrink: 0;
  }
`;
