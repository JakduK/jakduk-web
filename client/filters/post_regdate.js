import moment from 'moment';

export default function (id, format) {
  return moment(new Date(parseInt(id.slice(0, 8), 16) * 1000)).format(format);
}