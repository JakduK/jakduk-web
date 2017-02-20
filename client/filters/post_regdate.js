import moment from 'moment';

export default function (id, format) {
  const timestamp = parseInt(id.slice(0, 8), 16) * 1000;
  return Date.now() - (1000 * 60 * 60 * 24 * 7) > timestamp ? moment(timestamp).format(format) : moment(timestamp).fromNow();
}