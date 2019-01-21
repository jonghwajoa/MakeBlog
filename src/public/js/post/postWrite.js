document.addEventListener('DOMContentLoaded', function() {
  postWrite.init();
});

let postWrite = {
  postTitle: document.getElementById('title'),
  category: document.getElementById('category'),
  categoryName: document.getElementById('addCategory'),
  selectBox: document.getElementById('category'),
  tag: document.getElementById('tag'),

  init() {
    this.editor = new tui.Editor({
      el: document.getElementById('editSection'),
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      height: '100vh',
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
        addImageBlobHook(photo, cb) {
          const xhr = new XMLHttpRequest();
          const formData = new FormData();
          formData.append('photo', photo);
          xhr.onload = function() {
            if (xhr.status === 200) {
              return cb(`http://localhost/images/${xhr.responseText}`);
            }
            return alert('업로드 실패');
          };
          xhr.open('POST', '/post/file', true);
          xhr.send(formData);
        },
      },
    });
  },

  submit() {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.category;
    const categoryText = '#' + category[category.selectedIndex].text;
    let tag = this.tag.value.trim().replace(/\s*,+\s*|\s+/g, ' #');

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

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

    ajaxUtil
      .sendPostAjax('/post/', params)
      .then(result => {
        location.href = '/post/';
      })
      .catch(e => {
        alert(`작성 실패\n${e.responseText}`);
      });
  },

  addCategory() {
    const categoryName = this.categoryName.value;
    const selectBox = this.category;

    ajaxUtil
      .sendPostAjax('/post/category/', categoryName)
      .then(result => {
        let select = document.createElement('option');
        let { no, message } = JSON.parse(result.responseText);
        select.text = categoryName;
        select.value = no;
        selectBox.options.add(select);
        alert(message);
      })
      .catch(e => {
        alert(`${e.responseText}`);
      });
  },
};
