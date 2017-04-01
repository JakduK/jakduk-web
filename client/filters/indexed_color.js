const COLORS = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];

export default function (index, random) {
  return `${COLORS[(random ? (Math.random() * 10).toFixed() % COLORS.length : index) % COLORS.length]}`;
};
