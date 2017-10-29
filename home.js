(function () {
  var validColors = ["PuOr", "BrBG", "PRGn", "PiYG", "RdBu", "RdYlBu", "Spectral", "RdYlGn"]
  var sessionColor = validColors[Math.floor(Math.random() * (validColors.length - 0))];

  window.addEventListener("resize", function () {
    clearTimeout(this.id);
    this.id = setTimeout(refreshBackground, 200);
  });

  function refreshBackground() {
    pattern = Trianglify({
      height: window.innerHeight,
      width: window.innerWidth,
      cell_size: 40,
      x_colors: sessionColor,
    })
    pattern.canvas(document.getElementById('background'))
  }

  refreshBackground();
})()
