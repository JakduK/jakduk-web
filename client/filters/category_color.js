export default function (category) {
  switch (category) {
    case 'FREE':
      return 'green';
    case 'FOOTBALL':
      return 'orange';
    default:
      return 'grey';
  }
}
