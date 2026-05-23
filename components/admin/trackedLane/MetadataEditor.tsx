import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { proposedActionRepository } from '@repositories/proposedAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsType, newsTypesToKorFull } from '@utils/interface/news';
import { ProposedActionSource, ProposedActionType } from '@utils/interface/proposedAction';

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
      const fields: { title?: string; newsType?: NewsType } = {};
      if (draftTitle.trim() !== title.trim()) {
        fields.title = draftTitle.trim();
      }
      if (draftNewsType !== newsType) {
        fields.newsType = draftNewsType;
      }
      const created = await proposedActionRepository.create({
        actionType: ProposedActionType.EditNews,
        newsId,
        payload: { fields },
        source: ProposedActionSource.User,
        note: 'adminjae2 metadata edit',
      });
      return proposedActionRepository.approveAndApply(created.id);
    },
    onSuccess: async () => {
      onClose();
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['trackedNews'] }),
        qc.invalidateQueries({ queryKey: ['proposedActions'] }),
      ]);
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
