export function getConstantVowel(wor: string, testWord = false) {
  const f = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const s = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const t = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const ga = 44032;

  function wordToCharSub(w: string) {
    let res = "";
    let uni = w.charCodeAt(0);
    if (uni < ga) {
      res = `1${w}`;
      return res;
    }
    uni = uni - ga;
    const fn = parseInt(`${uni / 588}`);
    const sn = parseInt(`${(uni - fn * 588) / 28}`);
    const tn = parseInt(`${uni % 28}`);
    if (tn === 0) {
      res += `1${f[fn]}2${s[sn]}`;
    } else {
      res += `1${f[fn]}2${s[sn]}3${t[tn]}`;
    }
    return res;
  }

  let result;
  if (testWord) {
    result = [];
    const lastCharUni = wor.slice(-1).charCodeAt(0) - ga;
    const lastCharTn = parseInt(`${lastCharUni & 28}`);
    if (lastCharUni < 0 || lastCharTn === 0) {
      let result1 = ``;
      for (const kor of wor) {
        result1 += wordToCharSub(kor);
      }
      result.push(result1);
    } else {
      let result1 = "";
      let result2 = "";
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
    result = ``;
    for (const kor of wor) {
      result += wordToCharSub(kor);
    }
  }
  return result;
}
