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
  playerNamePlaceholder: {
    english: 'Joe',
    russian: 'Владимир',
  },
  addPlayer: {
    english: 'Add player',
    russian: 'Добавить игрока',
  },
  score: {
    english: 'Score for your word',
    russian: 'Очки за ваше слово',
  },
  players: {
    english: 'Players',
    russian: 'Игроки',
  },
  layout: {
    english: 'Toggle the layout!',
    russian: 'Переключите раскладку!',
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
  board: {
    english: generateAlphabeticalArray('A', 'Z')
      .concat(generateAlphabeticalArray('a', 'z'))
      .concat([' ']),
    russian: generateAlphabeticalArray('А', 'я').concat([' ']),
  },
};
