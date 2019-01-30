let hmm = (() => {
  function temp() {
    this.hoho = 'hoho';
  }

  temp.prototype.print = () => {
    console.log(this.hoho);
  };

  return temp;
})();

console.log(hmm);

let test = new hmm();

console.log(test.hoho);
