import { Center } from '@components/common/commonStyles';
import Modal from '@components/common/modal';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

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

export default function HomeModal({ show, onClose, content }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      if (show) {
        document.body.style.overflowY = 'auto';
        setTimeout(() => {
          modalRef.current!.style.opacity = '1';
          modalRef.current!.style.filter = 'blur(0px)';
        }, 10);
      } else {
        document.body.style.overflowY = 'unset';
        modalRef.current!.style.opacity = '0';
        modalRef.current!.style.filter = 'blur(10px)';
      }
    }
  }, [show]);

  if (!show || !content) return <></>;

  if (content.name === 'Contact') {
    return (
      <Modal state={show} outClickAction={onClose}>
        <Wrapper
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <ModalBox ref={modalRef}>
            <Link href={content.linkUrl}>
              <ModalTitle>{content.title}</ModalTitle>
            </Link>
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
        </Wrapper>
      </Modal>
    );
  }

  return (
    <Modal state={show} outClickAction={onClose}>
      <Wrapper
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <ModalBox ref={modalRef}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Link href={content.linkUrl}>
            <ModalTitle>{content.title}</ModalTitle>
          </Link>
          {content.description?.split('\n').map((paragraph, index) => (
            <ModalParagraph key={index}>{paragraph}</ModalParagraph>
          ))}
          <ImageContainer>
            <Image
              src={content.imageUrl}
              alt={content.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ImageContainer>
        </ModalBox>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled(Center)`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 1rem;

  * {
    box-sizing: content-box;
    text-decoration: none !important;
  }
`;

const ModalBox = styled.div`
  max-height: 85%;
  -webkit-text-size-adjust: none;
  color: #ffffff;
  margin-top: 0;
  border: 0;
  max-width: 600px;
  font-family: 'Noto Sans KR', Helvetica, sans-serif;
  vertical-align: baseline;
  transition: opacity 0.325s ease-in-out, transform 0.325s ease-in-out;
  padding: 2rem 2rem 1rem 2rem;
  position: relative;
  background-color: rgb(27, 31, 34);
  border-radius: 4px;
  transform: translateY(0);
  opacity: 0;
  filter: blur(100px);
  transition: opacity 500ms, filter 300ms;
  line-height: 1.5rem;
  overflow-y: scroll;

  @media screen and (max-width: 768px) {
    max-height: 80%;
    padding: 1rem 1rem 0.5rem 1rem;
    transform: translateY(-10%);
  }
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
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  text-indent: 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.5rem;
`;

const ModalTitle = styled.h2`
  -webkit-text-size-adjust: none;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  color: #ffffff;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 18px;
  line-height: 1.4rem;
  letter-spacing: 0.5rem;
  border-bottom: solid 1px #ffffff;
  width: max-content;
  padding-bottom: 0.4rem;
  margin: 0 0 1.2rem 0;
  align-self: flex-start;
`;

const ModalParagraph = styled.p`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  padding: 0;
  border: 0;
  font: inherit;
  font-size: 15px;
  vertical-align: baseline;
  margin: 0 0 1.5rem 0;
  width: 100%;
  font-weight: 300;
`;

const ModalLink = styled.a`
  -webkit-text-size-adjust: none;
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
  align-self: flex-start;
  font: inherit;
  font-size: 12px;
  opacity: 0.7;
`;

const ImageContainer = styled.div`
  -webkit-text-size-adjust: none;
  color: #ffffff;
  padding: 0;
  font: inherit;
  vertical-align: baseline;
  border-radius: 4px;
  border: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 0 1.5rem 0;
  width: 100%;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  -webkit-text-size-adjust: none;
  padding: 0;
  border: 0;
  font: inherit;
  color: #ffffff;
  display: block;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.2rem;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
`;

const InputsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
`;

const FieldContainer = styled.div`
  width: 100%;
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  &:last-child {
    margin-right: 0;
  }
`;

const Input = styled.input`
  width: 120px;
  padding: 0.5rem;
  font: inherit;
  font-size: 0.8rem;
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  font: inherit;
  font-size: 0.8rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ffffff;
  background: transparent;
  color: #ffffff;
  border-radius: 4px;
  resize: none;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const SubmitButton = styled.button`
  -webkit-text-size-adjust: none;
  list-style: none;
  box-sizing: inherit;
  font-family: 'Noto Sans KR', Helvetica, sans-serif;
  appearance: none;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  border-radius: 4px;
  border: 0;
  box-shadow: inset 0 0 0 1px #ffffff;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  height: 2.4rem;
  letter-spacing: 0.15rem;
  outline: 0;
  padding: 0 1rem 0 1rem;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: calc(2.75rem - 2px);
  background-color: #ffffff;
  color: #1b1f22;
  font-weight: 500;
  margin: auto;
  width: 30%;
`;
