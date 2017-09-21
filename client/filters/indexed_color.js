const PRESET = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'purple', 'violet', 'pink', 'brown', 'grey'].reverse();

export default function (index, random) {
  return `${PRESET[(random ? (Math.random() * 10).toFixed() % PRESET.length : index) % PRESET.length]}`;
};

export const COLORS = PRESET;
