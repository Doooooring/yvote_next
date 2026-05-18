import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Preview } from '@utils/interface/news';
import { NewsType, newsTypesToKorFull } from '@utils/interface/news';

type Props = {
  newsId: number;
  title: string;
  newsType: NewsType;
  onClose: () => void;
};

const NEWS_TYPE_OPTIONS = Object.values(NewsType) as NewsType[];

export default function MetadataEditor({ newsId, title, newsType, onClose }: Props) {
  const qc = useQueryClient();
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftNewsType, setDraftNewsType] = useState(newsType);

  useEffect(() => {
    setDraftTitle(title);
    setDraftNewsType(newsType);
  }, [title, newsType]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: { news_id: number; title?: string; newsType?: NewsType } = {
        news_id: newsId,
      };
      if (draftTitle.trim() !== title.trim()) {
        payload.title = draftTitle.trim();
      }
      if (draftNewsType !== newsType) {
        payload.newsType = draftNewsType;
      }
      const response = await fetch('/api/adminjae2/update-news-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(formatResponseError(data, response.statusText));
      }
      return data;
    },
    onSuccess: async () => {
      qc.setQueryData<Array<Preview>>(['trackedNews'], (current) =>
        current?.map((item) =>
          item.id === newsId
            ? {
                ...item,
                title: draftTitle.trim(),
                newsType: draftNewsType,
              }
            : item,
        ),
      );
      onClose();
      await qc.invalidateQueries({ queryKey: ['trackedNews'] });
    },
    onError: (error) => {
      window.alert(`Metadata update failed for news ${newsId}: ${formatError(error)}`);
    },
  });

  const trimmedTitle = draftTitle.trim();
  const changed = trimmedTitle !== title.trim() || draftNewsType !== newsType;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!changed || !trimmedTitle || mutation.isPending) return;
    mutation.mutate();
  }

  return (
    <EditorForm onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
      <TitleInput
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        aria-label={`news ${newsId} title`}
      />
      <TypeSelect
        value={draftNewsType}
        onChange={(e) => setDraftNewsType(e.target.value as NewsType)}
        aria-label={`news ${newsId} type`}
      >
        {NEWS_TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {newsTypesToKorFull(type)} ({type})
          </option>
        ))}
      </TypeSelect>
      <SaveButton type="submit" disabled={!changed || !trimmedTitle || mutation.isPending}>
        {mutation.isPending ? 'saving...' : 'save'}
      </SaveButton>
      <CancelButton type="button" onClick={onClose} disabled={mutation.isPending}>
        cancel
      </CancelButton>
    </EditorForm>
  );
}

function formatResponseError(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    const error = (data as { error?: unknown }).error;
    if (typeof error === 'string' && error) return error;
    const report = (data as { report?: unknown }).report;
    if (report && typeof report === 'object') {
      const title = (report as { title?: { error?: unknown } }).title?.error;
      if (typeof title === 'string' && title) return title;
      const newsType = (report as { newsType?: { error?: unknown } }).newsType?.error;
      if (typeof newsType === 'string' && newsType) return newsType;
    }
  }
  return fallback || 'unknown error';
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const EditorForm = styled.form`
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(140px, 220px) auto auto;
  gap: 6px;
  align-items: center;
  padding: 6px 4px 4px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TitleInput = styled.input`
  min-width: 0;
  height: 30px;
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid #aaa;
  border-radius: 4px;
`;

const TypeSelect = styled.select`
  min-width: 0;
  height: 30px;
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: white;
`;

const ActionButton = styled.button`
  height: 30px;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(ActionButton)`
  border: 1px solid #333;
  background: #333;
  color: white;

  &:hover:not(:disabled) {
    background: #111;
  }
`;

const CancelButton = styled(ActionButton)`
  border: 1px solid #aaa;
  background: white;
  color: #333;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;
