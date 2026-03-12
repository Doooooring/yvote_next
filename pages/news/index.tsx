import HeadMeta from '@components/common/HeadMeta';
import { CommonIconButton, CommonLayoutBox } from '@components/common/commonStyles';
import NewsListSection from '@/components/news/newsListSection';
import { PreNewsList } from '@/components/news/preNewsList';
import { useCustomSearchParams } from '@/utils/hook/router/useCustomSearchParams';
import NewsArticlesSection from '@components/news/recentarticles';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { NewsType, Preview, newsTypesToKor } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode, useRef, useState, useTransition } from 'react';
import { AiOutlineDown, AiOutlineUp, AiOutlineCalendar } from 'react-icons/ai';
import styled from 'styled-components';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

export default function NewsPage(props: pageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const searchParams = useCustomSearchParams();
  const keywordFilter = searchParams.get('keyword') ?? null;

  const showNewsContent = useNewsNavigate();
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [writingFilterOpen, setWritingFilterOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<NewsType | 'all'>('all');
  const [writingSelectedType, setWritingSelectedType] = useState<NewsType | 'all'>('all');
  const [writingTitleSearch, setWritingTitleSearch] = useState('');
  const [writingTitleSearchInput, setWritingTitleSearchInput] = useState('');
  const [allTitleSearch, setAllTitleSearch] = useState('');
  const [allTitleSearchInput, setAllTitleSearchInput] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateInputValue, setDateInputValue] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateTextChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    setDateInputValue(formatted);
    if (formatted === '') startTransition(() => setDateFilter(''));
  };

  const applyDateFilter = () => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInputValue)) {
      startTransition(() => setDateFilter(dateInputValue));
    } else if (dateInputValue === '') {
      startTransition(() => setDateFilter(''));
    }
  };

  return (
    <>
      <HeadMeta
        {...{
          title: '뉴스 모아보기',
          url: `https://yvoting.com/news`,
        }}
      />
      <Wrapper>
        <ArticlesWrapper>
          <NewsArticlesSection />
        </ArticlesWrapper>
        <div className="main-contents">
          <div className="main-contents-body" ref={ref}>
            <ToggleContainer initialHeight={200}>
              {(isOpen: boolean, initialHeight: number) => (
                <>
                  <SectionHeader>
                    <SectionTitle>작성 중 뉴스</SectionTitle>
                    <HeaderControls>
                      <TypeFilter>
                        <TypeFilterButton
                          onClick={() => {
                            setWritingFilterOpen((prev) => !prev);
                            setTypeFilterOpen(false);
                          }}
                          aria-expanded={writingFilterOpen}
                        >
                          {writingSelectedType === 'all'
                            ? '전체'
                            : newsTypesToKor(writingSelectedType)}
                        </TypeFilterButton>
                        {writingFilterOpen && (
                          <TypeFilterMenu>
                            <TypeFilterItem
                              onClick={() => {
                                setWritingFilterOpen(false);
                                startTransition(() => setWritingSelectedType('all'));
                              }}
                            >
                              전체
                            </TypeFilterItem>
                            {Object.values(NewsType).map((type) => (
                              <TypeFilterItem
                                key={type}
                                onClick={() => {
                                  setWritingFilterOpen(false);
                                  startTransition(() => setWritingSelectedType(type));
                                }}
                              >
                                {newsTypesToKor(type)}
                              </TypeFilterItem>
                            ))}
                          </TypeFilterMenu>
                        )}
                      </TypeFilter>
                      <InlineSearchBox>
                        <SearchInput
                          type="search"
                          placeholder="제목 검색"
                          value={writingTitleSearchInput}
                          onChange={(event) => {
                            setWritingTitleSearchInput(event.target.value);
                            startTransition(() => setWritingTitleSearch(event.target.value));
                          }}
                          aria-label="작성 중 뉴스 제목 검색"
                        />
                        <SearchButton type="button" onClick={() => startTransition(() => setWritingTitleSearch(writingTitleSearchInput))} aria-label="작성 중 뉴스 검색">
                          <SearchIcon src="/assets/img/ico_search.png" alt="" />
                        </SearchButton>
                      </InlineSearchBox>
                    </HeaderControls>
                  </SectionHeader>
                  <SectionDescription></SectionDescription>
                  <ScrollableContent $isOpen={isOpen} initialHeight={initialHeight}>
                    <PreNewsList
                      keywordFilter={keywordFilter ?? ''}
                      newsTypeFilter={writingSelectedType}
                      titleSearch={writingTitleSearch}
                      openModalOnClick
                    />
                  </ScrollableContent>
                </>
              )}
            </ToggleContainer>
            <SectionContainer>
              <SectionHeader>
                <SectionTitle>발행 완료 뉴스</SectionTitle>
                <HeaderControls>
                    <TypeFilter>
                    <TypeFilterButton
                      onClick={() => {
                        setTypeFilterOpen((prev) => !prev);
                        setWritingFilterOpen(false);
                      }}
                      aria-expanded={typeFilterOpen}
                    >
                      {selectedType === 'all' ? '전체' : newsTypesToKor(selectedType)}
                    </TypeFilterButton>
                    {typeFilterOpen && (
                      <TypeFilterMenu>
                        <TypeFilterItem
                          onClick={() => {
                            setTypeFilterOpen(false);
                            startTransition(() => setSelectedType('all'));
                          }}
                        >
                          전체
                        </TypeFilterItem>
                        {Object.values(NewsType).map((type) => (
                          <TypeFilterItem
                            key={type}
                            onClick={() => {
                              setTypeFilterOpen(false);
                              startTransition(() => setSelectedType(type));
                            }}
                          >
                            {newsTypesToKor(type)}
                          </TypeFilterItem>
                        ))}
                      </TypeFilterMenu>
                    )}
                  </TypeFilter>
                  <SearchBox
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      startTransition(() => setAllTitleSearch(allTitleSearchInput));
                    }}
                  >
                    <SearchInput
                      type="search"
                      placeholder="제목 검색"
                      value={allTitleSearchInput}
                      onChange={(event) => setAllTitleSearchInput(event.target.value)}
                      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          startTransition(() => setAllTitleSearch(allTitleSearchInput));
                        }
                      }}
                      aria-label="발행 완료 뉴스 제목 검색"
                    />
                    <SearchButton type="submit" aria-label="발행 완료 뉴스 검색">
                      <SearchIcon src="/assets/img/ico_search.png" alt="" />
                    </SearchButton>
                  </SearchBox>
                  <DatePickerWrapper>
                    <DesktopDateInput
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={dateInputValue}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleDateTextChange(event.target.value)}
                      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') applyDateFilter();
                      }}
                      onBlur={() => { if (dateInputValue === '') startTransition(() => setDateFilter('')); }}
                      aria-label="날짜 필터"
                    />
                    <HiddenDateInput
                      ref={dateInputRef}
                      type="date"
                      value={dateInputValue}
                      onChange={(event) => {
                        const val = event.target.value;
                        setDateInputValue(val);
                        startTransition(() => setDateFilter(val));
                      }}
                      aria-label="날짜 필터 (모바일)"
                    />
                    <DatePickerButton
                      onClick={() => dateInputRef.current?.showPicker()}
                      title={dateFilter || '날짜 필터'}
                      $active={!!dateFilter}
                    >
                      <AiOutlineCalendar />
                    </DatePickerButton>
                  </DatePickerWrapper>
                </HeaderControls>
              </SectionHeader>
              <SectionDescription></SectionDescription>
              <div style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                <NewsListSection
                  keywordFilter={keywordFilter ?? ''}
                  clickPreviews={showNewsContent}
                  newsTypeFilter={selectedType}
                  titleSearch={allTitleSearch}
                  dateFilter={dateFilter}
                />
              </div>
            </SectionContainer>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

function ToggleContainer({
  children,
  initialHeight = 300,
}: {
  children: (isOpen: boolean, initialHeight: number) => ReactNode;
  initialHeight?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <SectionContainer ref={ref} style={{}}>
      <ContentContainer $isOpen={isOpen} initialHeight={initialHeight}>
        {children(isOpen, initialHeight)}
      </ContentContainer>
      <OpenToggleButton
        onClick={() => {
          if (isOpen && ref.current) {
            ref.current?.scrollIntoView({ block: 'start' });
          }
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? (
          <>
            <AiOutlineUp size="20px" />
          </>
        ) : (
          <>
            <AiOutlineDown size="20px" />
          </>
        )}
      </OpenToggleButton>
    </SectionContainer>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Helvetica, sans-serif;
  box-sizing: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 50px;
  background-color: rgb(242, 244, 246);
  overflow: visible;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .main-header-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    height: 15px;
    .main-header {
      width: 70%;
      min-width: 800px;
      text-align: left;
      padding-left: 10px;
      .category-name {
        display: inline;
        width: 70%;
        margin-left: 10px;
        font-weight: 700;
        font-size: 18px;
        @media screen and (max-width: 768px) {
          width: 90%;
          min-width: 0px;
        }
      }
    }
  }

  .main-contents {
    display: flex;
    flex-direction: row;
    -webkit-text-size-adjust: none;
    width: 92%;
    max-width: 1200px;
    min-width: 0px;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;

    @media screen and (max-width: 768px) {
      width: 98%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    width: 100%;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
    position: relative;
  }
`;

const Header = styled(CommonLayoutBox)`
  flex-shrink: 0;
  text-align: center;
  padding: 12px 10px;

  .head {
    display: inline;
    color: ${({ theme }) => theme.colors.gray800};
    font-weight: 700;
    font-size: 1rem;
  }

  .sub-head {
    display: inline;
    color: ${({ theme }) => theme.colors.gray600};
    font-weight: 500;
    font-size: 0.9rem;
  }
`;

const ArticlesWrapper = styled.div`
  width: 92%;
  max-width: 1200px;
  min-width: 0px;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 98%;
    min-width: 0px;
  }
`;

const SectionContainer = styled(CommonLayoutBox)`
  padding: 20px;
  margin-bottom: 16px;
  position: relative;

  @media screen and (max-width: 768px) {
    padding: 16px 7px;
    margin-bottom: 12px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0 0 8px 0;
  text-align: left;
  position: relative;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    margin: 0 0 6px 0;
    white-space: nowrap;
    flex-shrink: 0;

    &::before {
      width: 3px;
      height: 16px;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: nowrap;
  overflow: visible;
`;

const HeaderControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    flex-shrink: 1;
    min-width: 0;
  }
`;

const TypeFilter = styled.div`
  position: relative;
  overflow: visible;
`;

const TypeFilterButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: #ffffff;
  color: ${({ theme }) => theme.colors.gray800};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
  &:after {
    content: '▾';
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: #ffffff;
  border-radius: 8px;
  height: 32px;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    border: none;
    background: transparent;
    height: auto;
  }
`;

const DesktopDateInput = styled.input`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray800};
  padding: 6px 28px 6px 10px;
  font-size: 0.85rem;
  height: 32px;
  width: 130px;
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const HiddenDateInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

interface DatePickerButtonProps {
  $active: boolean;
}

const DatePickerButton = styled.button<DatePickerButtonProps>`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray500};
  padding: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  @media screen and (max-width: 768px) {
    position: static;
    transform: none;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    background: #ffffff;
    color: ${({ theme }) => theme.colors.gray500};
    padding: 6px 10px;
    border-radius: 8px;
    height: 32px;
    width: auto;
    white-space: nowrap;
    box-sizing: border-box;
  }
`;


const SearchBox = styled.form`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: #ffffff;
  border-radius: 8px;
  height: 32px;
  padding-right: 30px;
  box-sizing: border-box;
  width: 160px;
  min-width: 110px;
  flex: 0 1 160px;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    flex-shrink: 1;
    min-width: 80px;
  }
`;

const InlineSearchBox = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background: #ffffff;
  border-radius: 8px;
  height: 32px;
  padding-right: 30px;
  box-sizing: border-box;
  width: 160px;
  min-width: 110px;
  flex: 0 1 160px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray800};
  padding: 6px 10px;
  font-size: 0.85rem;
  min-width: 140px;
  width: 100%;

  &:focus {
    outline: none;
  }

  @media screen and (max-width: 768px) {
    min-width: 100px;
  }

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  width: 18px;
  height: 18px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const TypeFilterMenu = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 6px;
  min-width: 140px;
  overflow: visible;
  z-index: 2;
`;

const TypeFilterItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray700};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background: ${({ theme }) => theme.colors.hovergray};
  }
`;

const SectionDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray600};
  margin: 0 0 16px 0;
  text-align: left;
  line-height: 1.5;

  @media screen and (max-width: 768px) {
    font-size: 13px;
    margin: 0 0 12px 0;
  }
`;

const ContentContainer = styled.div<{ $isOpen: boolean; initialHeight: number }>`
  width: 100%;
  position: relative;
`;

const ScrollableContent = styled.div<{ $isOpen?: boolean; initialHeight?: number }>`
  width: 100%;
  max-height: ${({ $isOpen, initialHeight }) => ($isOpen ? '500px' : `${initialHeight || 200}px`)};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* transition: max-height 0.8s ease; */

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::after {
    content: none;
  }
`;

const OpenToggleButton = styled(CommonIconButton)`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
`;

const LoadingWrapper = styled(CommonLayoutBox)`
  background-color: white;
`;
