const ACTION_TYPE = {
  CreateNews: 'create_news',
  RouteComment: 'route_comment',
  SplitComment: 'split_comment',
  PromoteType: 'promote_type',
  Publish: 'publish',
  Track: 'track',
  Untrack: 'untrack',
  EditComment: 'edit_comment',
  FillNews: 'fill_news',
};

const TYPE_LABEL = {
  [ACTION_TYPE.CreateNews]: 'create news',
  [ACTION_TYPE.RouteComment]: 'route comment',
  [ACTION_TYPE.SplitComment]: 'split comment',
  [ACTION_TYPE.Publish]: 'publish',
  [ACTION_TYPE.PromoteType]: 'promote type',
  [ACTION_TYPE.Track]: 'track',
  [ACTION_TYPE.Untrack]: 'untrack',
  [ACTION_TYPE.EditComment]: 'edit comment',
  [ACTION_TYPE.FillNews]: 'fill news',
};

function asRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value;
}

function asString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function getProposedActionTargetNewsId(action) {
  const payload = action.payload ?? {};
  const destinations = Array.isArray(payload.destinations) ? payload.destinations : [];
  const firstDestination =
    destinations.length > 0 && destinations[0] && typeof destinations[0] === 'object'
      ? destinations[0]
      : undefined;
  return (
    asNumber(payload.targetNewsId) ??
    asNumber(firstDestination?.targetNewsId) ??
    asNumber(payload.newsId) ??
    asNumber(action.newsId)
  );
}

function commentFromRecord(value) {
  const record = asRecord(value);
  if (!record) return null;
  const title = asString(record.title) ?? asString(record.sourceCommentTitle);
  const body = asString(record.comment) ?? asString(record.commentBody) ?? asString(record.body);
  const commentType = asString(record.commentType) ?? asString(record.sourceCommentType);
  const date = asString(record.date);
  const bytes = asNumber(record.commentBytes);
  if (!title && !body && !commentType) return null;
  return {
    ...(commentType ? { commentType } : {}),
    ...(title ? { title } : {}),
    ...(body ? { body } : {}),
    ...(date ? { date } : {}),
    ...(bytes != null ? { bytes } : {}),
  };
}

function commentsFromArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(commentFromRecord).filter((comment) => comment !== null);
}

function destinationComments(payload) {
  if (!Array.isArray(payload.destinations)) return [];
  return payload.destinations.flatMap((destination) => {
    const record = asRecord(destination);
    return commentsFromArray(record?.commentPayloads);
  });
}

function extractActionComments(action) {
  const payload = action.payload ?? {};
  const destinationBound = destinationComments(payload);
  if (destinationBound.length) {
    return destinationBound;
  }

  const arrays = [
    payload.commentPayloads,
    payload.initialComments,
    asRecord(payload.commentPayloadsSummary)?.previews,
  ];

  for (const candidate of arrays) {
    const comments = commentsFromArray(candidate);
    if (comments.length) return comments;
  }

  const single = commentFromRecord(payload.commentPayload) ?? commentFromRecord(payload);
  return single ? [single] : [];
}

function getProposedActionMainTitle(action, comments, targetTitle) {
  const payload = action.payload ?? {};
  const payloadTitle = asString(payload.title);

  if (
    action.actionType === ACTION_TYPE.RouteComment ||
    action.actionType === ACTION_TYPE.SplitComment
  ) {
    const targetNewsId = getProposedActionTargetNewsId(action);
    return (
      targetTitle ??
      (targetNewsId ? `news #${targetNewsId}` : undefined) ??
      payloadTitle ??
      comments[0]?.title ??
      TYPE_LABEL[action.actionType]
    );
  }

  return (
    payloadTitle ??
    comments[0]?.title ??
    targetTitle ??
    (action.newsId ? `news #${action.newsId}` : TYPE_LABEL[action.actionType])
  );
}

exports.ACTION_TYPE = ACTION_TYPE;
exports.TYPE_LABEL = TYPE_LABEL;
exports.extractActionComments = extractActionComments;
exports.getProposedActionMainTitle = getProposedActionMainTitle;
exports.getProposedActionTargetNewsId = getProposedActionTargetNewsId;
