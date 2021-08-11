import generateAlphabeticalArray from '../scripts/alphabetical';

interface Labels {
  [name: string]: {
    [language: string]: string;
  };
}

interface Arrays {
  [name: string]: {
    [language: string]: string[];
  };
}

export const labels: Labels = {
  players: {
    english: 'Players',
    russian: 'Игроки',
  },
  layout: {
    english: 'Toggle the layout or choose the normal letter!',
    russian: 'Переключите раскладку или выберите нормальную букву!',
  },
  clear: {
    english: 'Clear clicked cells',
    russian: 'Очистить нажатые плитки',
  },
  menu: {
    english: 'Game menu',
    russian: 'Игровое меню',
  },
  letter: {
    english: 'Letter',
    russian: 'Буква',
  },
  done: {
    english: 'Done!',
    russian: 'Готово!',
  },
};

export const arrays: Arrays = {
  board_additional: {
    english: generateAlphabeticalArray('A', 'O'),
    russian: generateAlphabeticalArray('А', 'О'),
  },
  letter_check: {
    english: generateAlphabeticalArray('A', 'z'),
    russian: generateAlphabeticalArray('А', 'я'),
  },
};
