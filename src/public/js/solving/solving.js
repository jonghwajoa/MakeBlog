let solving = (() => {
  const readTitle = document.getElementById('content-title');
  const showProblem = document.getElementById('showProblem');
  const count = document.getElementById('count');
  let updateAtag = document.getElementById('updateTag');

  let editor;
  let module = {};

  module.editorInit = () => {
    const content = document.getElementById('content-input').value;
    editor = new tui.Editor({
      el: document.getElementById('content-content'),
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

    editor.setMarkdown(content.trim());
  };

  module.read = async problemNum => {
    let result;
    try {
      result = await ajaxUtil.sendGetAjax(`/solving/${problemNum}`);
    } catch (e) {
      alert(`Server Error(${e.status})`);
      return;
    }

    result = JSON.parse(result);
    readTitle.innerHTML = result.title;
    createDate.innerHTML = result.created_at;
    count.innerHTML = `| view ${result.count}`;
    showProblem.innerHTML = result.url;
    editor.setMarkdown(result.content);
    window.history.replaceState(null, '', `/solving/${problemNum}`);

    updateAtag.href = `/solving/${problemNum}/edit`;
  };

  return module;
})();

document.addEventListener('DOMContentLoaded', function() {
  solving.editorInit();
});
