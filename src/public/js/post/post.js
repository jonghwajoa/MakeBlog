let editor = new tui.Editor({
  el: document.getElementById('editSection'),
  initialEditType: 'markdown',
  previewStyle: 'vertical',
  height: '120vh',
  exts: [
    'scrollSync',
    'table',
    'uml',
    {
      name: 'chart',
      minWidth: 100,
      maxWidth: 600,
      minHeight: 100,
      maxHeight: 300,
    },
    'colorSyntax',
  ],
  hooks: {
    addImageBlobHook(fileOrBlob, callback) {
      savePhoto(fileOrBlob, callback);
    },
  },
});

function submit() {
  const title = document.getElementById('title').value;
  let content = editor.getValue().trim();

  if (!title) {
    alert('제목을 입력하세요..');
    return false;
  }

  if (!content) {
    alert('내용을 입력하세요.');
    return false;
  }

  const category = document.getElementById('category');
  const categoryText = '#' + category[category.selectedIndex].text;
  let tag = document
    .getElementById('tag')
    .value.trim()
    .replace(/\s*,+\s*|\s+/g, ' #');

  if (tag) {
    tag = categoryText + ' #' + tag;
  } else {
    tag = categoryText;
  }

  const params = {
    title,
    tag,
    content,
    category: category.value,
  };

  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 201) {
      location.href = '/post/';
    } else {
      alert(`작성 실패\n${xhr.responseText}`);
    }
  };
  xhr.open('POST', '/post/', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(params));
}

function addCategory() {
  const categoryName = document.getElementById('addCategory').value;
  const selectBox = document.getElementById('category');
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      let select = document.createElement('option');
      let result = JSON.parse(xhr.responseText);
      select.text = categoryName;
      select.value = result.no;
      selectBox.options.add(select);
      alert(result.message);
    } else if (xhr.status === 400) {
      alert(`${xhr.responseText}`);
    } else {
      alert(`Error \n${xhr.responseText}`);
    }
  };
  xhr.open('POST', '/post/category/', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ categoryName }));
}
