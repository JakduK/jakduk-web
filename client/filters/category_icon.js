export default function (category) {
  switch (category) {
    case 'FREE':
      return 'newspaper';
    case 'FOOTBALL':
      return 'soccer';
    default:
      return 'unordered list';
  }
}
