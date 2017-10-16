export default function convertBoardName(id) {
  if (!id) {
    return '';
  }

  if (id === 'DEVELOPER') {
    id = 'swdev';
  }

  return `board.name.${id.toLowerCase()}`;
}