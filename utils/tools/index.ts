import { load } from 'cheerio';

export function deepCompare(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const arrBatch = <T>(arr: Array<T>, batchSize: number) => {
  const result: Array<Array<T>> = [];
  let tmp: Array<T> = [];

  arr.forEach((e, i) => {
    tmp.push(e);
    if (tmp.length == batchSize || i == arr.length - 1) {
      result.push(tmp);
      tmp = [] as Array<T>;
    }
  });

  return result;
};

export function arrObjIncludeProp<T extends object, K extends keyof T>(
  arr: T[],
  key: K,
  value: T[K],
): T | null {
  return (
    arr.find((obj) => {
      if (obj == null || typeof obj !== 'object') return false;
      return deepCompare(obj[key], value);
    }) ?? null
  );
}

export const fillArr = <T, K>(arr: Array<T>, size: number, element: K) => {
  const newArr = [...arr] as Array<T | K>;
  if (size < newArr.length) return newArr;
  return newArr.concat(new Array(size - newArr.length).fill(element));
};

export const ffToInt = (ff: string) => {
  return parseInt(ff, 16);
};

export const hexToRgb = (hex: string) => {
  const hstr = hex.split('#')[1];
  return [ffToInt(hstr.slice(0, 2)), ffToInt(hstr.slice(2, 4)), ffToInt(hstr.slice(4, 6))];
};

export const RGB = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
};

export const RgbToRgba = (rgb: string, opacity: number) => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (!match) {
    throw new Error("Invalid RGB format. Expected format: 'rgb(r,g,b)'");
  }

  const [_, r, g, b] = match;
  return `rgba(${r},${g},${b},${opacity})`;
};

export const RGBA = (hex: string, opacity: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getDotDateForm = (date: Date) => {
  if (typeof date === 'string') date = new Date(date);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

export const getStandardDateForm = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getTextContentFromHtmlText = (html: string) => {
  if (typeof window !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent;
  } else {
    const $ = load(html);

    return $('body').text();
  }
};

export function clone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}
export function getConstantVowel(wor: string, testWord = false) {
  // testWord 는 true일 경우 유저의 인풋을 의미한다.
  const f = [
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
  ]; //초성 리스트
  const s = [
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
  ]; //중성 리스트
  const t = [
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
  ]; //종성 리스트

  const ga = 44032; // 가 아스키코드

  function wordToCharSub(w: string) {
    let res = '';
    let uni = w.charCodeAt(0);
    // 입력이 자음 하나일 경우
    if (uni < ga) {
      res = `1${w}`;
      return res;
    }

    // 음절의 시작 "가"로부터 떨어진 거리
    uni = uni - ga;

    // 초성의 주기가 588임을 이용
    const fn = parseInt(`${uni / 588}`);

    // 종성의 주기가 28이므로 588(초성 주기)로 나눈 나머지를 몫이 중성을 나머지가 종성임을 나타냄을
    // 이용해 찾았다
    const sn = parseInt(`${(uni - fn * 588) / 28}`);
    const tn = parseInt(`${uni % 28}`);

    // 초성, 중성, 종성은 자음,모음 앞에 숫자 1,2,3을 표시해줌으로써 구분했다.
    if (tn === 0) {
      // 종성이 없는 경우
      res += `1${f[fn]}2${s[sn]}`;
    } else {
      // 종성이 있는 경우
      res += `1${f[fn]}2${s[sn]}3${t[tn]}`;
    }
    return res;
  }

  let result;
  // 유저의 인풋일 경우
  if (testWord) {
    result = [];
    const lastCharUni = wor.slice(-1).charCodeAt(0) - ga;
    const lastCharTn = parseInt(`${lastCharUni & 28}`);

    // 결국 문제가 되는 것은 마지막 음절이기 때문에, 마지막 음절에 받침이 없을 경우 그냥 처리한다.
    if (lastCharUni < 0 || lastCharTn === 0) {
      let result1 = ``;
      for (const kor of wor) {
        result1 += wordToCharSub(kor);
      }
      result.push(result1);
      // 마지막 음절에 받침이 있을 경우, 다음 음절의 초성이 될 수 있으므로 두개의 결과를 내놓는다
    } else {
      let result1 = '';
      let result2 = '';
      for (const kor of wor.slice(0, -1)) {
        result1 += wordToCharSub(kor);
        result2 += wordToCharSub(kor);
      }
      const lastFn = parseInt(`${lastCharUni / 588}`);
      const lastSn = parseInt(`${(lastCharUni - lastFn * 588) / 28}`);
      const lastTn = parseInt(`${lastCharUni % 28}`);
      result1 += `1${f[lastFn]}2${s[lastSn]}3${t[lastTn]}`;
      result2 += `1${f[lastFn]}2${s[lastSn]}1${t[lastTn]}`;
      result.push(result1);
      result.push(result2);
    }
  } else {
    // 탐색용 단어 집합의 단어일 경우
    result = ``;
    for (const kor of wor) {
      result += wordToCharSub(kor);
    }
  }
  return result;
}
