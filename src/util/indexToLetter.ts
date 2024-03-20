export const indexToLetter = (
  idx: number,
): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
  switch (idx) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    case 4:
      return 'E';
    case 5:
      return 'F';
    default:
      throw new Error('Invalid answer index: ' + idx);
  }
};
