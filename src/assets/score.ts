interface LocalizedScore {
  [lang: string]: {
    [score: number]: string[];
  };
}

interface RawScore {
  [letter: string]: number;
}
const scorePretty: LocalizedScore = {
  english: {
    0: [' '],
    1: 'AEILNORSTU'.split(''),
    2: 'DG'.split(''),
    3: 'BCMP'.split(''),
    4: 'FHVWY'.split(''),
    5: ['K'],
    8: 'JX'.split(''),
    10: 'ZQ'.split(''),
  },
  russian: {
    0: [' '],
    1: 'АВЕИНОРСТ'.split(''),
    2: 'ДКЛМПУ'.split(''),
    3: 'БГЁЬЯ'.split(''),
    4: 'ЙЫ'.split(''),
    5: 'ЖЗХЧЦ'.split(''),
    8: 'ШЭЮ'.split(''),
    10: 'ФЩЪ'.split(''),
  },
};

export const scoreRaw = (lang: string) => {
  const raw: RawScore = {};
  Object.entries(scorePretty[lang]).forEach((scoreEntry) => {
    scoreEntry[1].forEach((letter) => {
      Object.assign(raw, { [letter]: scoreEntry[0] });
    });
  });
  return raw;
};
