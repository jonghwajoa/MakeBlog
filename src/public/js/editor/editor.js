class Editor {
  readEditor(editText) {
    return new tui.Editor({
      el: document.getElementById(editText),
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
  }

  writeEditor(editText) {
    return new tui.Editor({
      el: document.getElementById(editText),
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
            return cb(`https://weknowjs.xyz/images/${result}`);
          } catch (e) {
            alert(e.statusText);
          }
        },
      },
    });
  }
}
