let solving = (() => {
  const postTitle = document.getElementById('title');
  const postResource = document.getElementById('resource');
  const postCategorySelect = document.getElementById('category-select');
  const postCategoryDelete = document.getElementById('category-delete');
  let editor;
  let module = {};

  module.editorInit = () => {
    editor = new tui.Editor({
      el: document.getElementById('content'),
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
    let result;
    const title = postTitle.value;
    const content = editor.getMarkdown().trim();
    const category = postCategorySelect.value;
    const resource = postResource;
    let params = {
      title,
      content,
      category,
      resource,
    };
    try {
      await ajaxUtil.sendPostAjax('/solving', params);
    } catch (e) {
      alert(e.message);
    }
  };

  return module;
})();

document.addEventListener('DOMContentLoaded', function() {
  solving.editorInit();
  console.log('흐음...?');
});
