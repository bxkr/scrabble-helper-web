import generateAlphabeticalArray from '../../scripts/alphabetical';

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
  spacesInName: {
    english: 'Name cannot contain space(s)!',
    russian: 'Имя не может содержать пробел(ы)!',
  },
  notEnoughPlayers: {
    english: 'Not enough players! (only 2 and more players)',
    russian: 'Недостаточно игроков! (только 2 и больше игроков)',
  },
  emptyName: {
    english: 'Name cannot be empty!',
    russian: 'Имя не может быть пустым!',
  },
  score: {
    english: 'Score',
    russian: 'Очки',
  },
  name: {
    english: 'Name',
    russian: 'Имя',
  },
  playerNamePlaceholder: {
    english: 'Joe',
    russian: 'Владимир',
  },
  addPlayer: {
    english: 'Add player',
    russian: 'Добавить игрока',
  },
  wordScore: {
    english: 'Score for your word',
    russian: 'Очки за ваше слово',
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
  finishGame: {
    english: 'Finish!',
    russian: 'Закончить!',
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
