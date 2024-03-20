export const letterToIndex = (letter: string): number => {
  switch (letter) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    case 'F':
      return 5;
    default:
      throw new Error('Invalid answer letter: ' + letter);
  }
};
