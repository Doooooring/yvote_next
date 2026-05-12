const EDITABLE_COMMENT_BATCH_KEYS = ['commentPayloads', 'initialComments'];

function destinationComments(payload) {
  const destinations = payload.destinations;
  if (!Array.isArray(destinations)) return [];
  return destinations.flatMap((destination) => {
    if (!destination || typeof destination !== 'object' || Array.isArray(destination)) return [];
    const comments = destination.commentPayloads;
    return Array.isArray(comments) ? comments : [];
  });
}

function getEditableCommentBatch(payload) {
  for (const key of EDITABLE_COMMENT_BATCH_KEYS) {
    const comments = payload[key];
    if (Array.isArray(comments) && comments.length > 0) {
      return { key, comments };
    }
  }
  const comments = destinationComments(payload);
  if (comments.length > 0) return { key: 'destinations', comments };
  return null;
}

function excludeDestinationComment(payload, index) {
  const destinations = payload.destinations;
  if (!Array.isArray(destinations) || index < 0) return { ...payload };

  let cursor = 0;
  let removed = false;
  const nextDestinations = destinations
    .map((destination) => {
      if (!destination || typeof destination !== 'object' || Array.isArray(destination)) {
        return destination;
      }
      const comments = destination.commentPayloads;
      if (!Array.isArray(comments)) return destination;
      const nextComments = comments.filter((_, localIndex) => {
        const flatIndex = cursor + localIndex;
        return flatIndex !== index;
      });
      if (index >= cursor && index < cursor + comments.length) removed = true;
      cursor += comments.length;
      return {
        ...destination,
        commentPayloads: nextComments,
      };
    })
    .filter((destination) => {
      if (!destination || typeof destination !== 'object' || Array.isArray(destination)) {
        return true;
      }
      const comments = destination.commentPayloads;
      return !Array.isArray(comments) || comments.length > 0;
    });

  if (!removed) return { ...payload };
  const next = {
    ...payload,
    destinations: nextDestinations,
  };
  const replacements = payload.sourceReplacements;
  if (Array.isArray(replacements) && replacements.length === cursor) {
    next.sourceReplacements = replacements.filter((_, i) => i !== index);
  }
  return next;
}

function excludeCommentFromPayload(payload, key, index) {
  if (key === 'destinations') {
    return excludeDestinationComment(payload, index);
  }
  const comments = payload[key];
  if (!Array.isArray(comments) || index < 0 || index >= comments.length) {
    return { ...payload };
  }
  return {
    ...payload,
    [key]: comments.filter((_, i) => i !== index),
  };
}

exports.excludeCommentFromPayload = excludeCommentFromPayload;
exports.getEditableCommentBatch = getEditableCommentBatch;
