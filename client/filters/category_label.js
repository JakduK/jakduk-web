export default function (category) {
  switch (category) {
    case 'FREE':
      return 'board.category.free';
    case 'FOOTBALL':
      return 'board.category.football';
    default:
      return 'board.category.all';
  }
}
