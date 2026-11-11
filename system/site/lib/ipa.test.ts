import { describe, expect, it } from 'vitest';
import { ipaMap, lookup, wordsOf } from './ipa';

describe('lookup', () => {
  it.each([
    ['strike', 'straɪk'],
    ['option', 'ˈɑpʃən'],
    ['market', 'ˈmɑrkət'],
    ['president', 'ˈprɛzəˌdɛnt'],
    ['constitution', 'ˌkɑnstəˈtuʃən'],
  ])('%s → /%s/', (word, ipa) => {
    expect(lookup(word)).toBe(ipa);
  });

  it('handles curly apostrophes and possessives', () => {
    expect(lookup('market’s')).toBe('ˈmɑrkəts');
  });

  it('returns undefined for unknown words', () => {
    expect(lookup('qwzx')).toBeUndefined();
  });
});

describe('ipaMap', () => {
  it('maps each known word once', () => {
    expect(wordsOf('The Strike, the strike.')).toEqual(['the', 'strike', 'the', 'strike']);
    expect(Object.keys(ipaMap('The Strike, the strike qwzx.'))).toEqual(['the', 'strike']);
  });
});
