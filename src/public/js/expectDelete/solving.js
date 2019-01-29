class solv {
  constructor() {
    this.readTitle = document.getElementById('content-title');
    this.showProblem = document.getElementById('showProblem');
    this.count = document.getElementById('count');
    this.updateAtag = document.getElementById('updateTag');
    this.createDate = document.getElementById('createDate');
    this.editor;
    this.module = {};
  }

  editorInit() {
    const content = document.getElementById('content-input').value;
    this.editor = new tui.Editor({
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

    this.editor.setMarkdown(content.trim());
  }

  async read(problemNum) {
    let result;
    try {
      result = await ajaxUtil.sendGetAjax(`/solving/${problemNum}`);
    } catch (e) {
      alert(`Server Error(${e.status})`);
      return;
    }

    result = JSON.parse(result);
    this.readTitle.innerHTML = result.title;
    this.createDate.innerHTML = result.created_at;
    this.count.innerHTML = `| view ${result.count}`;
    this.showProblem.innerHTML = result.url;
    this.showProblem.href = result.url;
    this.editor.setMarkdown(result.content);
    window.history.replaceState(null, '', `/solving/${problemNum}`);
    if (this.updateAtag) {
      this.updateAtag.href = `/solving/${problemNum}/edit`;
    }
  }
}

let solving = new solv();
solving.editorInit();
