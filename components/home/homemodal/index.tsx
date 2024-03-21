import React from 'react';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  content: {
    name: string;
    title: string;
    description: string;
    imageUrl: StaticImageData;
    linkUrl: string;
    linkText: string;
  } | null;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, content }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      if (show) {
        setTimeout(() => {
          modalRef.current!.style.opacity = '1'; // fully opaque
          modalRef.current!.style.filter = 'blur(0px)'; // no blur
        }, 10);
      } else {
        modalRef.current!.style.opacity = '0'; // fully transparent
        modalRef.current!.style.filter = 'blur(10px)'; // return to initial blur
      }
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflowY = 'auto';
    } else {
      document.body.style.overflowY = 'unset';
    }
  }, [show]);

  if (!show || !content) return null;

  if (content.name === 'Contact') {
    return (
      <ModalWrapper>
        <ModalBox ref={modalRef}>
          <ModalTitle>{content.title}</ModalTitle>
          <ContactForm>
            <InputsRow>
              <FieldContainer>
                <Label htmlFor="name">Name</Label>
                <Input type="text" name="name" id="name" />
              </FieldContainer>
              <FieldContainer>
                <Label htmlFor="email">Email</Label>
                <Input type="text" name="email" id="email" />
              </FieldContainer>
            </InputsRow>
            <Label htmlFor="message">Message</Label>
            <TextArea name="message" id="message" rows={6}></TextArea>
            <SubmitButton type="submit">Submit</SubmitButton>
          </ContactForm>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalBox>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <ModalBox ref={modalRef}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>{content.title}</ModalTitle>
        {content.description?.split('\n').map((paragraph, index) => (
          <ModalParagraph key={index}>{paragraph}</ModalParagraph>
        ))}
        <ImageContainer>
          <Image src={content.imageUrl} alt={content.title} width={500} height={300} />
        </ImageContainer>
        <ModalLink href={content.linkUrl}>{content.linkText}</ModalLink>
      </ModalBox>
    </ModalWrapper>
  );
};

export default Modal;

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%; // Now includes padding
  padding: 2.5rem 0 7.5rem; // Move ModalBox's vertical padding here
  box-sizing: border-box; // Includes padding in height
  top: 80px;
  left: 0;
  display: flex;
  overflow-y: auto;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.2);
  ::-webkit-scrollbar {
    display: none; // for Chrome, Safari, and Opera
  }
  -ms-overflow-style: none; // for IE and Edge
  scrollbar-width: none; // for Firefox
`;

const ModalBox = styled.div`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  box-sizing: inherit;
  margin-top: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  transition: opacity 0.325s ease-in-out, transform 0.325s ease-in-out;
  padding: 2.5rem 2.5rem 1.5rem 2.5rem; // Removed vertical padding (moved to ModalWrapper)
  position: relative;
  width: 40rem;
  max-width: 100%;
  background-color: rgba(27, 31, 34, 0.85);
  border-radius: 4px;
  transform: translateY(0);
  opacity: 0; // initially fully transparent
  filter: blur(100px); // initially has significant blur
  transition: opacity 500ms, filter 300ms; // transition takes half second
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.65rem;
`;

const CloseButton = styled.button`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  background-color: transparent;
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  text-indent: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 2.5rem;
`;

const ModalTitle = styled.h2`
  -webkit-text-size-adjust: none;
  box-sizing: inherit;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.5rem;
  line-height: 1.4;
  letter-spacing: 0.5rem;
  border-bottom: solid 1px #ffffff;
  width: max-content;
  padding-bottom: 0.5rem;
  margin: 0 0 2rem 0;
  align-self: flex-start; // added this line
`;

const ModalParagraph = styled.p`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  box-sizing: inherit;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  margin: 0 0 2rem 0;
  width: 100%;
  font-weight: 250;
`;

const ModalLink = styled.a`
  -webkit-text-size-adjust: none;
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out,
    border-bottom-color 0.2s ease-in-out;
  border-bottom: dotted 1px rgba(255, 255, 255, 0.5);
  text-decoration: none;
  color: inherit;
  align-self: flex-start; // added this line
`;

const ImageContainer = styled.div`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  box-sizing: inherit;
  padding: 0;
  font: inherit;
  vertical-align: baseline;
  border-radius: 4px;
  border: 0;
  position: relative;
  display: flex; // Change block to flex
  justify-content: center; // Center the children horizontally
  margin: 0 0 1.5rem 0;
  width: 100%;
`;

// Styles for the form and its elements
const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%; // full width of the parent
`;

const Label = styled.label`
  -webkit-text-size-adjust: none;
  box-sizing: inherit;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  color: #ffffff;
  display: block;
  font-size: 0.8rem;
  font-weight: 300;
  letter-spacing: 0.2rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
`;

const InputsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FieldContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; // Stack the label and input vertically
  margin-right: 2rem; // Space between the field containers

  &:last-child {
    margin-right: 0; // No margin for the last field container
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font: inherit;
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff; // Border and border-radius applied here
  border-radius: 4px;
  width: 100%; // Input takes the full width of the FieldContainer
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ffffff;
  background: transparent;
  color: #ffffff;
  border-radius: 4px; // round borders
  resize: none; // Add this line to disable resizing
`;

const SubmitButton = styled.button`
  -webkit-text-size-adjust: none;
  list-style: none;
  box-sizing: inherit;
  font-family: "Source Sans Pro", sans-serif;
  appearance: none;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  border-radius: 4px;
  border: 0;
  box-shadow: inset 0 0 0 1px #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 0.8rem;
  height: 2.75rem;
  letter-spacing: 0.2rem;
  outline: 0;
  padding: 0 1.25rem 0 1.35rem;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: calc(2.75rem - 2px);
  background-color: #ffffff;
  color: #1b1f22
  font-weight: 600;
  margin: auto; // this will center the button
  width: 50%;   // this will restrict the width to 50% of the parent container

`;
