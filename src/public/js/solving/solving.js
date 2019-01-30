class Solving {
  constructor() {}

  solvingList() {
    this.readTitle = document.getElementById('content-title');
    this.showProblem = document.getElementById('showProblem');
    this.count = document.getElementById('count');
    this.updateAtag = document.getElementById('updateTag');
    this.createDate = document.getElementById('createDate');
    this.curPage = 1;
    this.listEditorInit();
    this.mapSaveSolving = new Map();
  }

  solvingWrite() {
    this.postTitle = document.getElementById('title');
    this.postUrl = document.getElementById('url');
    this.postProblemNum = document.getElementById('problemNum');
    this.postCategorySelect = document.getElementById('category-select');
    this.postCategoryDelete = document.getElementById('category-delete');
    this.writeEditorInit();
  }

  solvingUpdate() {
    this.solvingWrite();
    const hiddenContent = document.getElementById('content-hidden').value;
    this.editor.setMarkdown(hiddenContent.trim());
  }

  listEditorInit() {
    const content = document.getElementById('content-input').value;
    this.editor = new tui.Editor({
      el: document.getElementById('content-content'),
      height: '100vh',
      exts: [
        'table',
        'uml',
        {
          name: 'chart',
          minWidth: 100,
          minHeight: 100,
          maxHeight: 300,
        },
      ],
    });

    this.editor.setMarkdown(content.trim());
  }

  writeEditorInit() {
    this.editor = new tui.Editor({
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
  }

  async read(problemNum) {
    let result;

    if (this.mapSaveSolving.has(problemNum)) {
      result = this.mapSaveSolving.get(problemNum);
    } else {
      try {
        result = await ajaxUtil.sendGetAjax(`/solving/${problemNum}`);
        result = JSON.parse(result);
      } catch (e) {
        alert(`Server Error(${e.status})`);
        return;
      }
    }

    this.readTitle.innerHTML = result.title;
    this.createDate.innerHTML = result.created_at;
    this.count.innerHTML = `| view ${result.count}`;
    this.showProblem.innerHTML = result.url;
    this.showProblem.href = result.url;
    this.editor.setMarkdown(result.content);
    this.curPage = problemNum;
    window.history.replaceState(null, '', `/solving/${problemNum}`);
    if (this.updateAtag) {
      this.updateAtag.href = `/solving/${problemNum}/edit`;
    }

    if (!this.mapSaveSolving.has(problemNum)) {
      this.mapSaveSolving.set(problemNum, result);
      // let param = {
      //   title : this.readTitle.innerHTML.trim(),
      //   createDate : this.createDate.innerHTML,
      //   count : this.count.innerHTML,
      //   url : this.showProblem,
      //   content : this.
      // }
    }
  }

  async write() {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.postCategorySelect.value;
    let url = this.postUrl.value.trim();
    const problemNum = this.postProblemNum.value;

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
  }

  async update() {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.postCategorySelect.value;
    let url = this.postUrl.value.trim();
    const problemNum = this.postProblemNum.value;

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
      await ajaxUtil.sendPutAjax('/solving', params);
      location.href = `/solving/${problemNum}`;
    } catch (e) {
      alert(e.message);
    }
  }

  async delete() {
    try {
      await ajaxUtil.sendDeleteAjax(`/solving/${this.curPage}`);
      alert('삭제 성공');
    } catch (e) {
      alert(`삭제실패\n${e.message}`);
    }
    location.href = '/solving';
  }
}
