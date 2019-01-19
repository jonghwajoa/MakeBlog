let editor = new tui.Editor({
  el: document.querySelector('#content'),
  exts: [
    'table',
    'uml',
    {
      name: 'chart',
      minWidth: 100,
      maxWidth: 600,
      minHeight: 100,
      maxHeight: 300,
    },
  ],
});
