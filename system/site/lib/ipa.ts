// General American IPA from the CMU Pronouncing Dictionary (ARPAbet).
import { dictionary } from 'cmu-pronouncing-dictionary';

const VOWELS: Record<string, [string, string]> = {
  // [stressed, unstressed]
  AA: ['ɑ', 'ɑ'],
  AE: ['æ', 'æ'],
  AH: ['ʌ', 'ə'],
  AO: ['ɔ', 'ɔ'],
  AW: ['aʊ', 'aʊ'],
  AY: ['aɪ', 'aɪ'],
  EH: ['ɛ', 'ɛ'],
  ER: ['ɝ', 'ɚ'],
  EY: ['eɪ', 'eɪ'],
  IH: ['ɪ', 'ɪ'],
  IY: ['i', 'i'],
  OW: ['oʊ', 'oʊ'],
  OY: ['ɔɪ', 'ɔɪ'],
  UH: ['ʊ', 'ʊ'],
  UW: ['u', 'u'],
};
const CONSONANTS: Record<string, string> = {
  B: 'b',
  CH: 'tʃ',
  D: 'd',
  DH: 'ð',
  F: 'f',
  G: 'ɡ',
  HH: 'h',
  JH: 'dʒ',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  NG: 'ŋ',
  P: 'p',
  R: 'r',
  S: 's',
  SH: 'ʃ',
  T: 't',
  TH: 'θ',
  V: 'v',
  W: 'w',
  Y: 'j',
  Z: 'z',
  ZH: 'ʒ',
};
// Consonant clusters that can begin an English syllable; the stress mark goes before them.
const ONSETS = new Set([
  'p r',
  'p l',
  'b r',
  'b l',
  't r',
  'd r',
  'k r',
  'k l',
  'ɡ r',
  'ɡ l',
  'f r',
  'f l',
  'θ r',
  'ʃ r',
  's p',
  's t',
  's k',
  's m',
  's n',
  's l',
  's w',
  't w',
  'k w',
  'd w',
  'ɡ w',
  'p j',
  'b j',
  'k j',
  'f j',
  'm j',
  'h j',
  'v j',
  's p r',
  's t r',
  's k r',
  's p l',
  's k w',
]);

function toIpa(arpabet: string) {
  const out: string[] = [];
  for (const phone of arpabet.split(' ')) {
    const vowel = /^([A-Z]+)([012])$/.exec(phone);
    if (!vowel) {
      out.push(CONSONANTS[phone] ?? '');
      continue;
    }
    const [, base = '', stress] = vowel;
    if (stress !== '0') {
      // Move the stress mark back over the consonants that can begin this syllable.
      let start = out.length;
      for (let prev = out[start - 1]; prev !== undefined && !isVowel(prev) && !isStress(prev); prev = out[start - 1]) {
        if (start < out.length && !ONSETS.has(out.slice(start - 1).join(' '))) break;
        start--;
      }
      out.splice(start, 0, stress === '1' ? 'ˈ' : 'ˌ');
    }
    out.push(VOWELS[base]?.[stress === '0' ? 1 : 0] ?? '');
  }
  const ipa = out.join('');
  return out.filter(isVowel).length > 1 ? ipa : ipa.replace(/[ˈˌ]/g, '');
}

const VOWEL_SYMBOLS = new Set(Object.values(VOWELS).flat());
const isVowel = (s: string) => VOWEL_SYMBOLS.has(s);
const isStress = (s: string) => s === 'ˈ' || s === 'ˌ';

export const wordsOf = (text: string) =>
  text
    .toLowerCase()
    .replace(/’/g, "'")
    .match(/[a-z][a-z']*/g) ?? [];

export function lookup(word: string) {
  const w = word
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/^'+|'+$/g, '');
  const arpabet = dictionary[w] ?? (w.endsWith("'s") ? dictionary[w.slice(0, -2)] : undefined);
  return arpabet ? toIpa(arpabet) : undefined;
}

export function ipaMap(text: string) {
  const map: Record<string, string> = {};
  for (const w of new Set(wordsOf(text))) {
    const ipa = lookup(w);
    if (ipa) map[w] = ipa;
  }
  return map;
}
