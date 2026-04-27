import HeadMeta from '@components/common/HeadMeta';
import { CommonIconButton, CommonLayoutBox } from '@components/common/commonStyles';
import NewsListSection from '@/components/news/newsListSection';
import { PreNewsList } from '@/components/news/preNewsList';
import { useCustomSearchParams } from '@/utils/hook/router/useCustomSearchParams';
// import NewsArticlesSection from '@components/news/recentarticles';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';
import { NewsType, Preview, newsTypesToKor, newsTypesToKorFull, NewsState } from '@utils/interface/news';
import { GetStaticProps } from 'next';
import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode, useRef, useState, useTransition } from 'react';
import { AiOutlineCalendar, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import styled from 'styled-components';

interface pageProps {
  data: Array<Preview>;
}

export const getStaticProps: GetStaticProps<pageProps> = async () => {
  //const data: Array<Preview> = await newsRepository.getPreviews(0, '');
  return {
    props: { data: [] },
    revalidate: 300,
  };
};

export default function NewsPage(props: pageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const searchParams = useCustomSearchParams();
  const keywordFilter = searchParams.get('keyword') ?? null;

  const showNewsContent = useNewsNavigate();
  const [isPending, startTransition] = useTransition();
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [writingFilterOpen, setWritingFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<NewsType | 'all'>('all');
  const [hiddenFilterOpen, setHiddenFilterOpen] = useState(false);
  const [hiddenSelectedType, setHiddenSelectedType] = useState<NewsType | 'all'>('all');
  const [hiddenTitleSearch, setHiddenTitleSearch] = useState('');
  const [hiddenTitleSearchInput, setHiddenTitleSearchInput] = useState('');
  const [writingSelectedType, setWritingSelectedType] = useState<NewsType | 'all'>('all');
  const [writingTitleSearch, setWritingTitleSearch] = useState('');
  const [writingTitleSearchInput, setWritingTitleSearchInput] = useState('');
  const [allTitleSearch, setAllTitleSearch] = useState('');
  const [allTitleSearchInput, setAllTitleSearchInput] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dateInputValue, setDateInputValue] = useState('');

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
          title: '뉴스 모아보기 (관리자)',
          url: `https://yvoting.com/adminjae`,
        }}
      />
      <Wrapper>
        <div className="main-contents">
          <div className="main-contents-body" ref={ref}>
            <ToggleContainer initialHeight={200}>
              {(isOpen: boolean, initialHeight: number) => (
                <>
                  <SectionHeader>
                    <SectionTitle>숨겨진 뉴스</SectionTitle>
                    <HeaderControls>
                      <TypeFilter>
                        <TypeFilterButton
                          onClick={() => {
                            setHiddenFilterOpen((prev) => !prev);
                            setWritingFilterOpen(false);
                            setTypeFilterOpen(false);
                          }}
                          aria-expanded={hiddenFilterOpen}
                        >
                          {hiddenSelectedType === 'all'
                            ? '전체'
                            : newsTypesToKor(hiddenSelectedType)}
                        </TypeFilterButton>
                        {hiddenFilterOpen && (
                          <TypeFilterMenu>
                            <TypeFilterItem
                              onClick={() => {
                                setHiddenFilterOpen(false);
                                startTransition(() => setHiddenSelectedType('all'));
                              }}
                            >
                              전체
                            </TypeFilterItem>
                            {Object.values(NewsType).map((type) => (
                              <TypeFilterItem
                                key={type}
                                onClick={() => {
                                  setHiddenFilterOpen(false);
                                  startTransition(() => setHiddenSelectedType(type));
                                }}
                              >
                                {newsTypesToKorFull(type)}
                              </TypeFilterItem>
                            ))}
                          </TypeFilterMenu>
                        )}
                      </TypeFilter>
                      <InlineSearchBox>
                        <SearchInput
                          type="search"
                          placeholder="제목 검색"
                          value={hiddenTitleSearchInput}
                          onChange={(event) => {
                            setHiddenTitleSearchInput(event.target.value);
                            startTransition(() => setHiddenTitleSearch(event.target.value));
                          }}
                          aria-label="숨겨진 뉴스 제목 검색"
                        />
                        <SearchButton type="button" onClick={() => startTransition(() => setHiddenTitleSearch(hiddenTitleSearchInput))} aria-label="숨겨진 뉴스 검색">
                          <SearchIcon src="/assets/img/ico_search.png" alt="" />
                        </SearchButton>
                      </InlineSearchBox>
                    </HeaderControls>
                  </SectionHeader>
                  <SectionDescription />
                  <ScrollableContent $isOpen={isOpen} initialHeight={initialHeight}>
                    <PreNewsList
                      keywordFilter={keywordFilter ?? ''}
                      newsTypeFilter={hiddenSelectedType}
                      titleSearch={hiddenTitleSearch}
                      showId={true}
                      state={NewsState.NotPublished}
                    />
                  </ScrollableContent>
                </>
              )}
            </ToggleContainer>

            <ToggleContainer initialHeight={200}>
              {(isOpen: boolean, initialHeight: number) => (
                <>
                  <SectionHeader>
                    <SectionTitle>한조, 대기 중...</SectionTitle>
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
                                {newsTypesToKorFull(type)}
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
                          aria-label="대기 중... 제목 검색"
                        />
                        <SearchButton type="button" onClick={() => startTransition(() => setWritingTitleSearch(writingTitleSearchInput))} aria-label="대기 중... 검색">
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
                      state={NewsState.Pending}
                      showId={true}
                    />
                  </ScrollableContent>
                </>
              )}
            </ToggleContainer>
            <SectionContainer>
              <SectionHeader>
                <SectionTitle>발행 완료</SectionTitle>
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
                            {newsTypesToKorFull(type)}
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
                      aria-label="발행 완료 제목 검색"
                    />
                    <SearchButton type="submit" aria-label="발행 완료 검색">
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
                  showId={true}
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
    <SectionContainer ref={ref}>
      <ContentContainer $isOpen={isOpen} initialHeight={initialHeight}>
        {children(isOpen, initialHeight)}
      </ContentContainer>
      <ToggleBar
        onClick={() => {
          if (isOpen && ref.current) {
            ref.current?.scrollIntoView({ block: 'start' });
          }
          setIsOpen(!isOpen);
        }}
      >
        <span>{isOpen ? '접기' : '더 보기'}</span>
      </ToggleBar>
    </SectionContainer>
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

const Header = styled.div`
  flex-shrink: 0;
  text-align: center;
  padding: 12px 10px;
`;

const ArticlesWrapper = styled.div`
  width: 92%;
  max-width: 1200px;
  margin-bottom: 0;

  @media screen and (max-width: 768px) {
    width: 96%;
    margin-bottom: 0;
    padding: 6px;
  }
`;

const SectionContainer = styled.section`
  background: transparent;
  border-top: 2px solid ${({ theme }) => theme.colors.yvote12};
  padding: 12px 0;
  margin-bottom: 24px;
  position: relative;

@media screen and (max-width: 768px) {
    padding: 12px 0;
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Noto Serif KR', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.yvote12};
  letter-spacing: -0.01em;
  flex-shrink: 0;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 17px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
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
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote11};
  padding: 5px 12px;
  border-radius: 2px;
  font-size: 0.82rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s, border-color 0.15s;

  &:after {
    content: '\\25BE';
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.yvote07};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.yvote13};
    border-color: ${({ theme }) => theme.colors.yvote13};
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  border-radius: 2px;
  height: 30px;
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
  color: ${({ theme }) => theme.colors.yvote12};
  padding: 5px 26px 5px 10px;
  font-size: 0.82rem;
  height: 30px;
  width: 125px;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.yvote07};
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
  color: ${({ $active, theme }) => ($active ? theme.colors.yvote12 : theme.colors.yvote07)};
  padding: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
  }

  @media screen and (max-width: 768px) {
    position: static;
    transform: none;
    border: 1px solid ${({ theme }) => theme.colors.yvote05};
    background: transparent;
    color: ${({ $active, theme }) => ($active ? theme.colors.yvote12 : theme.colors.yvote07)};
    padding: 5px 10px;
    border-radius: 2px;
    height: 30px;
    width: auto;
    white-space: nowrap;
    box-sizing: border-box;
  }
`;


const SearchBox = styled.form`
  position: relative;
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  border-radius: 2px;
  height: 30px;
  padding-right: 28px;
  box-sizing: border-box;
  width: 150px;
  min-width: 100px;
  flex: 0 1 150px;
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
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  background: transparent;
  border-radius: 2px;
  height: 30px;
  padding-right: 28px;
  box-sizing: border-box;
  width: 150px;
  min-width: 100px;
  flex: 0 1 150px;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote12};
  padding: 5px 10px;
  font-size: 0.82rem;
  min-width: 80px;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.yvote07};
  }

  @media screen and (max-width: 768px) {
    min-width: 60px;
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
  width: 16px;
  height: 16px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;

const SearchIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const TypeFilterMenu = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: ${({ theme }) => theme.colors.yvote02};
  border: 1px solid ${({ theme }) => theme.colors.yvote05};
  border-radius: 2px;
  padding: 4px;
  min-width: 140px;
  overflow: visible;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(40, 35, 28, 0.08);
`;

const TypeFilterItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 7px 10px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.yvote10};
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.82rem;

  &:hover {
    background: ${({ theme }) => theme.colors.yvote03};
    color: ${({ theme }) => theme.colors.yvote13};
  }
`;

const SectionDescription = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
  margin: 6px 0 6px;

  @media screen and (max-width: 768px) {
    margin: 4px 0 4px;
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

const ToggleBar = styled.button`
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  padding: 16px 0 4px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.yvote08};
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.15s;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.yvote05};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.yvote12};
  }
`;
