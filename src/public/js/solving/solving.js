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

    let category = document.getElementsByClassName('category');

    for (let i = 1; i < category.length; i++) {
      let e = category[i].getElementsByTagName('div')[0];
      if (e) {
        this.toggle(e.className.split(/\s+/)[1]);
      }
    }
  }

  solvingWrite() {
    this.postTitle = document.getElementById('title');
    this.postUrl = document.getElementById('url');
    this.postProblemNum = document.getElementById('problemNum');
    this.categorySelect = document.getElementById('category-select');
    this.deleteSelect = document.getElementById('category-delete');
    this.categoryAdd = document.getElementById('category-add');
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
    }
  }

  async write() {
    const title = this.postTitle.value;
    const content = this.editor.getMarkdown().trim();
    const category = this.categorySelect.value;
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
    const category = this.categorySelect.value;
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

  async addCategory() {
    let requestCategoryName = this.categoryAdd.value;

    let result;
    try {
      result = await ajaxUtil.sendPostAjax('/solving/category', { requestCategoryName });
    } catch (e) {
      alert(`${e.message}\n${e.status}`);
      return;
    }

    let newSelect = document.createElement('option');
    let newSelect2 = document.createElement('option');
    let { no, message } = JSON.parse(result);

    newSelect.text = requestCategoryName;
    newSelect.value = no;
    newSelect2.text = requestCategoryName;
    newSelect2.value = no;
    this.categorySelect.options.add(newSelect);
    this.deleteSelect.options.add(newSelect2);
    alert(message);
  }

  async deleteCategory() {
    let deleteSelect = this.deleteSelect;
    let reqeustDeleteCategoryName = deleteSelect.value;

    try {
      await ajaxUtil.sendDeleteAjax(`/solving/category/${reqeustDeleteCategoryName}`);
    } catch (e) {
      alert(`${e.message}`);
      return;
    }

    for (let i = 0; i < deleteSelect.length; i++) {
      if (deleteSelect.options[i].value == reqeustDeleteCategoryName) {
        deleteSelect.remove(i);
        this.categorySelect.remove(i);
      }
    }

    alert('카테고리 삭제 성공');
  }

  toggle(className) {
    if (parseInt(className)) {
      className = `category-content${className}`;
    }
    let id = document.getElementsByClassName(className);
    if (!id[0]) return;
    let statusCheck = 'none';

    if (id[0].style.display == statusCheck) {
      statusCheck = 'block';
    }

    for (let e of id) {
      e.style.display = statusCheck;
    }
  }
}
