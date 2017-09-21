import {COLORS} from './indexed_color';

export default function (source, includeAll) {
  const categories = {
    list: []
  };

  if (includeAll) {
    categories.ALL = {
      color: COLORS[0],
      index: 0,
      name: this.$t('board.category.all'),
      icon: ''
    };
  }

  source.forEach((category, index) => {
    categories[category.code] = {
      color: COLORS[index + 1],
      index: index + 1,
      name: category.names[0].name,
      icon: ''
    };
  });

  Object.keys(categories).forEach(key => {
    if (key === 'list') return;

    const category = categories[key];
    categories.list.push({
      code: key,
      name: category.name,
      icon: category.icon,
      color: category.color
    });
  });

  return categories;
}
