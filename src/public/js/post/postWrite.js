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
        async addImageBlobHook(photo, cb) {
          try {
            let result = await ajaxUtil.saveFileAjax(photo);
            return cb(`http://localhost/images/${result}`);
          } catch (e) {
            alert(e.statusText);
          }
        },
      },
    });
  },

  async submit() {
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

    try {
      await ajaxUtil.sendPostAjax('/post/', params);
      location.href = '/post/';
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  },

  async submitSub(postNo) {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();

    if (!title) {
      alert('제목을 입력하세요..');
      return false;
    }

    if (!content) {
      alert('내용을 입력하세요.');
      return false;
    }

    const params = {
      title,
      content,
    };

    try {
      await ajaxUtil.sendPostAjax(`/post/${postNo}`, params);
      location.href = `/post/${postNo}`;
    } catch (e) {
      alert(`작성 실패\n${e.responseText}`);
    }
  },

  async addCategory() {
    const categoryName = this.categoryName.value;
    const selectBox = this.category;
    let result;
    console.log('에드 위');
    try {
      result = await ajaxUtil.sendPostAjax('/post/category/', categoryName);
    } catch (e) {
      alert(`${e.responseText}`);
      return;
    }
    console.log('에드 아래');

    let select = document.createElement('option');
    let { no, message } = JSON.parse(result.responseText);
    select.text = categoryName;
    select.value = no;
    selectBox.options.add(select);
    alert(message);
  },

  async addCategory() {
    const categoryName = this.categoryName.value;
    const selectBox = this.selectBox;
    let result;
    try {
      result = await ajaxUtil.sendPostAjax('/post/category/', { categoryName });
    } catch (e) {
      alert(`${e.message}\n${e.status}`);
      return;
    }
    let select = document.createElement('option');
    let { no, message } = JSON.parse(result);
    select.text = categoryName;
    select.value = no;
    selectBox.options.add(select);
    alert(message);
  },
};
