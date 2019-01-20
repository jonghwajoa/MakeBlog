let editor = new tui.Editor({
  el: document.querySelector('#content'),
  exts: [
    'table',
    'uml',
    {
      name: 'chart',
      minWidth: 100,
      maxWidth: 600,
      minHeight: 100,
      maxHeight: 300,
    },
  ],
});
const content = document.getElementById('hiddenContent');
editor.setMarkdown(content.innerHTML.trim());

function getContent(postNo, subNo) {
  const viewCount = document.getElementById('viewCount');
  const date = document.getElementById('createDate');
  const postTitle = document.getElementById('title');

  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      let { content, title, count, created_at } = JSON.parse(
        xhr.responseText,
      ).post;
      date.innerHTML = `${created_at} |`;
      viewCount.innerHTML = `View ${count}`;
      postTitle.innerHTML = title;
      editor.setValue(content.trim());
    } else {
      alert(`작성 실패\n${xhr.responseText}`);
    }
  };
  xhr.open('GET', `/post/${postNo}/${subNo}`, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send();
}
