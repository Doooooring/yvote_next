const { ACTION_TYPE, getProposedActionTargetNewsId } = require('./rowDisplayCore');

function hasSourceReplacements(action) {
  const replacements = action.payload?.sourceReplacements;
  return Array.isArray(replacements) && replacements.length > 0;
}

function payloadTitle(action) {
  const value = action.payload?.title;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function groupShape(action) {
  if (
    action.actionType === ACTION_TYPE.RouteComment ||
    action.actionType === ACTION_TYPE.SplitComment
  ) {
    const targetNewsId = getProposedActionTargetNewsId(action);
    if (targetNewsId != null) {
      return {
        key: `comments-to-existing:${targetNewsId}`,
        kind: 'comments_to_existing',
        targetNewsId,
      };
    }
  }

  if (action.actionType === ACTION_TYPE.CreateNews && hasSourceReplacements(action)) {
    return {
      key: `create-with-extractions:${action.id}`,
      kind: 'create_with_extractions',
      title: payloadTitle(action),
    };
  }

  return {
    key: `single:${action.id}`,
    kind: 'single',
  };
}

function groupProposedActionsForReview(actions) {
  const groups = [];
  const byKey = new Map();

  for (const action of actions) {
    const shape = groupShape(action);
    const existing = byKey.get(shape.key);
    if (existing) {
      existing.actions.push(action);
      continue;
    }
    const group = { ...shape, actions: [action] };
    byKey.set(shape.key, group);
    groups.push(group);
  }

  return groups;
}

exports.groupProposedActionsForReview = groupProposedActionsForReview;
