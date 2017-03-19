export default function (editor, options = {min: 3, max: 800}) {
  const commentText = editor.getContent({format: 'text'}).trim();
  const existVideo = editor.getDoc().querySelector('iframe') || editor.getDoc().querySelector('video');
  const existImage = editor.getDoc().querySelector('img');

  return existVideo || existImage || (commentText.length >= options.min && commentText.length <= options.max);
};
