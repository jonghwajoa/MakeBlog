let solving = (() => {
  let postTitle = document.getElementById('title');
  let postUrl = document.getElementById('url');
  const postProblemNum = document.getElementById('problemNum');
  const postCategorySelect = document.getElementById('category-select');
  const postCategoryDelete = document.getElementById('category-delete');

  let editor;
  let module = {};

  module.editorInit = () => {
    editor = new tui.Editor({
      el: document.getElementById('content-input'),
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
  };

  module.write = async () => {
    const title = postTitle.value;
    const content = editor.getMarkdown().trim();
    const category = postCategorySelect.value;
    let url = postUrl.value.trim();
    const problemNum = postProblemNum.value;

    if (!url) {
      url = `https://www.acmicpc.net/problem/${problemNum}`;
    }

    let params = {
      title,
      content,
      category,
      url,
      problemNum,
    };
    try {
      await ajaxUtil.sendPostAjax('/solving', params);
      location.href = `/solving/${problemNum}`;
    } catch (e) {
      alert(e.message);
    }
  };

  module.updateInit = () => {
    
  }

  return module;
})();

document.addEventListener('DOMContentLoaded', function() {
  solving.editorInit();
});
