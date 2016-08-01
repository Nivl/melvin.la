function randomColor(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var colors = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,

  maxR: randomColor(70, 180),
  maxB: randomColor(70, 180),
  maxG: randomColor(70, 180),

  set: function (wPosRatio, hPosRatio) {
    this.setRandom(wPosRatio, hPosRatio);

    var style = 'rgba(' + ~~this.r + ',' + ~~this.g + ',' + ~~this.b + ',' + ~~this.a + ')';
    document.body.style['background-color'] = style;
  },

  setBlue: function (wPosRatio, hPosRatio) {
    this.g = (64 - 160) * hPosRatio + 160;
    this.b = (64 - 160) * hPosRatio + 160;
    this.r = ((64 - 160) * hPosRatio + 160);
    this.r = ((0 - this.r) * wPosRatio + this.r);
  },

  setRandom: function (wPosRatio, hPosRatio) {
    this.g = (64 - this.maxG) * hPosRatio + this.maxG;
    this.b = (64 - this.maxB) * hPosRatio + this.maxB;
    this.r = ((64 - this.maxR) * hPosRatio + this.maxR);
    this.r = ((0 - this.r) * wPosRatio + this.r);
  },
}

document.addEventListener('mousemove', function draw(e) {
  var hPosRatio = e.pageY / window.innerHeight;
  var wPosRatio = e.pageX / window.innerWidth;
  colors.set(wPosRatio, hPosRatio);
});