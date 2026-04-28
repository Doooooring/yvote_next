function describeError(result) {
  if (result instanceof Error) return result.message;
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object') {
    if (typeof result.message === 'string') return result.message;
    if (typeof result.error === 'string') return result.error;
  }
  return 'unknown server error';
}

function parseProposedActionListResponse(data) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    if (Array.isArray(data.result)) return data.result;
    if (data.success === false) {
      throw new Error(`proposed-action list failed: ${describeError(data.result)}`);
    }
  }

  throw new Error('unexpected proposed-action list response');
}

module.exports = { parseProposedActionListResponse };
