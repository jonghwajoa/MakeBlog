const disqus_config = function() {
  this.page.url = '/posts/<%=post.no%>';
  this.page.identifier = `<%=post.no%>`;
};

(function() {
  // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement('script');
  s.src = 'https://weknowjs-xyz.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
