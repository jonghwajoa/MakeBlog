function submit() {
  const title = document.getElementById('title').value;
  let content = editor
    .getValue()
    .trim()
    .replace(/`/g, '&grave;');

  if (!title) {
    alert('제목을 입력하세요..');
    return false;
  }

  if (!content) {
    alert('내용을 입력하세요.');
    return false;
  }

  const category = document.getElementById('category');
  const categoryText = '#' + category[category.value - 1].text;
  const tag =
    categoryText +
    ' #' +
    document
      .getElementById('tag')
      .value.trim()
      .replace(/\s*,+\s*|\s+/g, ' #');
  const params = {
    title,
    tag,
    content,
    category: category.value,
  };
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 201) {
      location.href = '/posts/';
    } else {
      alert(`작성 실패\n${xhr.responseText}`);
    }
  };
  xhr.open('POST', '/posts/', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(params));
}
