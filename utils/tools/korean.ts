const GA_ASKI = 44032;

const CHO_CNT = 19;
const JUNG_CNT = 21;
const JONG_CNT = 28;

const cho = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const jung = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

const jong = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

export function getChar(char: string) {
  let uni = char.charCodeAt(0);
  uni = uni - GA_ASKI;
  const tn = uni % JONG_CNT;
  const sn = Math.floor(uni / JONG_CNT) % JUNG_CNT;
  const fn = Math.floor(uni / (JONG_CNT * JUNG_CNT));
  return { cho: cho[fn], jung: jung[sn], jong: jong[tn] };
}

export function formatChar(w: string) {
  let res = '';
  let unit = w.charCodeAt(0);
  if (unit < GA_ASKI) {
    res = `1${w}`;
    return res;
  }

  const { cho, jung, jong } = getChar(w);
  if (jong == '') {
    return `1${cho}2${jung}`;
  } else {
    return `1${cho}2${jung}3${jong}`;
  }
}

export function formatWord(w: string) {
  let result = '';
  for (const char of w) {
    result += formatChar(char);
  }
  return result;
}

export function wordToCharAble(word: string) {
  const result = [];
  const lastCharUni = word.slice(-1).charCodeAt(0) - GA_ASKI;
  if (lastCharUni < 0 || lastCharUni == 0) {
    result.push(formatWord(word));
  } else {
    const { cho, jung, jong } = getChar(word.slice(-1));
    result.push(formatWord(word));
    result.push(formatWord(word.slice(0, -1)) + `1${cho}2${jung}1${jong}`);
  }

  return result;
}

export function searchWordIncluded(
  target: string,
  wordListOrg: string[],
  limit: number,
  wordListConverted: boolean = false,
) {
  let wordList = wordListOrg;
  if (!wordListConverted) {
    wordList = wordList.map((word) => formatWord(word));
  }
  const targetAble = wordToCharAble(target);
  const result = [];
  for (let i in wordList) {
    const w = wordList[i];
    const is = targetAble.filter((t) => w.includes(t)).length > 0;

    if (is) result.push(wordListOrg[i]);
    if (result.length >= limit) break;
  }

  return result;
}
