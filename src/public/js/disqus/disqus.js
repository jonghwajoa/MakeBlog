class Disqus {
  constructor(url, id) {
    this.page = {};
    this.page.url = url;
    this.page.identifier = id;
    this.init();
    console.log(url);
    console.log(id);
  }

  init() {
    var d = document,
      s = d.createElement('script');
    s.src = 'https://weknowjs-xyz.disqus.com/embed.js';
    s.async = true;
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  }

  reload(newIdentifier, newUrl) {
    console.log(newIdentifier);
    console.log(newUrl);
    window.DISQUS.reset({
      reload: true,
      config: function() {
        this.page.identifier = newIdentifier;
        this.page.url = newUrl;
        this.language = 'ko';
      },
    });
  }
}
