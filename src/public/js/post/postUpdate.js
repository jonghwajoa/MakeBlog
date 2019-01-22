document.addEventListener('DOMContentLoaded', function() {
  postUpdate.init();
});

let postUpdate = {
  content: document.getElementById('hiddenContent'),
  postTitle: document.getElementById('title'),
  tag: document.getElementById('tag'),
  category: document.getElementById('category'),

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
    this.editor.setMarkdown(this.content.innerHTML.trim());

    if (this.tag) {
      let tagVal = this.tag.value.split(' ');
      tagVal.shift();

      this.tag.value = tagVal
        .map(item => item.substr(1, item.length))
        .join(' ');
    }
  },

  async update(postNo, subNo = 1) {
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

    let url = `/post/${postNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/post/${postNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
    }
  },

  async updateSub(postNo, subNo) {
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

    let url = `/post/${postNo}/${subNo}`;

    try {
      await ajaxUtil.sendPutAjax(url, params);
      location.href = `/post/${postNo}/${subNo}`;
    } catch (e) {
      alert(`업데이트 실패\n${e.responseText}`);
    }
  },
};
