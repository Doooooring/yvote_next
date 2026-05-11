import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  newsId: number;
  initialTitle: string;
  onSaved?: (newTitle: string) => void;
}

export default function EditableTitle({ newsId, initialTitle, onSaved }: Props) {
  const [value, setValue] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setValue(initialTitle);
    setError(null);
  }, [initialTitle, newsId]);

  const save = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === initialTitle.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const r = await fetch('/api/adminjae2/update-news-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news_id: newsId, title: trimmed }),
      });
      const data = await r.json();
      if (!data.success) {
        setError(data.error || 'update failed');
        return;
      }
      onSaved?.(trimmed);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrap>
      <Label>제목 편집</Label>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setTouched(true);
        }}
        onBlur={() => {
          if (touched) save();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        disabled={saving}
      />
      {saving && <Hint>저장 중…</Hint>}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 6px;
`;
const Label = styled.span`
  font-size: 10px;
  color: #888;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;
const Input = styled.input`
  font-size: 14px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 100%;
`;
const Hint = styled.span`
  font-size: 11px;
  color: #888;
`;
const ErrorText = styled.span`
  font-size: 11px;
  color: #b00020;
`;
