var canvas = document.getElementById("canvas")
var shadowCanvas = document.getElementById("shadowCanvas")
var ctx = canvas.getContext('2d')
var shadowCtx = shadowCanvas.getContext('2d')
var active = false

function draw(text) {
  var img = canvas
  var pixels = canvas.width * canvas.height
  ctx.fillStyle="white"
  ctx.fillRect(0,0,canvas.width, canvas.height)
  ctx.fillStyle="black"
  ctx.font="64px Georgia"
  ctx.fillText(text, 50, 50);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  shadowCtx.fillStyle="white"
  shadowCtx.fillRect(0,0,canvas.width, canvas.height)
  shadowCtx.fillStyle="black"
  shadowCtx.font="64px Georgia"
  shadowCtx.fillText(text, 50, 50);
  var shadowImageData = shadowCtx.getImageData(0, 0, canvas.width, canvas.height);
  var shadowData = shadowImageData.data;

  var ultraFilter = function(){
      for (var i = 0; i < data.length; i += 4){
      if (!Math.floor(Math.random() * (12)) && Math.floor(Math.random() * (data.length)) < i + (canvas.width * 100)){ // slide down
          data[(i + (canvas.width * 4)) % data.length] = data[i]
          data[((i + (canvas.width * 4)) + 1) % data.length] = data[i + 1]
          data[((i + (canvas.width * 4)) + 2) % data.length] = data[i + 2]
        }
        if (!Math.floor(Math.random() * (50))){ // gray-b-gone
          var grayThreshold = 3
          if ((Math.abs(data[i] - data[i+1]) < grayThreshold || Math.abs(data[i] - data[i+2]) < grayThreshold) && data[i] != 255 && data[i] != 0){
            [index1, index2, index3] = randDirs(i)
            var shift = 5
            data[i] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+1] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+2] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
          }
        }
        if (!Math.floor(Math.random() * 10000) && data[i] < 192 && data[i] >= 64){ // horizontal bleed
          var resonance = 1.01
          if (data[i] > data[i+1] && data[i] > data[i+2]){
            data[i-4 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+4 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
          } else if (data[i+1] > data[i+2]){
            data[i-3 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+5 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
          } else {
            data[i-2 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+6 % data.length] *= resonance * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
          }
        }
        if (!Math.floor(Math.random() * 1000) && i > canvas.width * 4){ // minor blur
          data[i] = (data[(i-4) % data.length] + data[(i+4) % data.length] + data[(i - (img.width * 4)) % data.length] + data[(i + (img.width * 4)) % data.length]) / 4
          data[i+1] = ( data[(i-3) % data.length] + data[(i+5) % data.length] + data[(i - (img.width * 4) + 1) % data.length] + data[(i + (img.width * 4) + 1) % data.length]) / 4
          data[i+2] = (data[(i-2) % data.length] + data[(i+6) % data.length] + data[(i - (img.width * 4) + 2) % data.length] + data[(i + (img.width * 4) + 2) % data.length]) / 4
        }
        if (!Math.floor(Math.random() * (500))){ // scatter
          var index1, index2, index3
          [index1, index2, index3] = randDir(i)
          data[index1 % data.length] = data[i]
          data[index2 % data.length] = data[i + 1]
          data[index3 % data.length] = data[i + 2]
        }
        if (!Math.floor(Math.random() * 20000)){
          data[i] += 1
          data[i + 1] += 1
          data[i + 1] += 1
          data[i] %= 256
          data[i + 1] %= 256
          data[i + 1] %= 256
        }
      }
    ctx.putImageData(imageData, 0, 0);
  }

  var randDirs = function(i){
    var dirs = [
      (i - 4), // left
      (i + 4), // right
      (i - (canvas.width * 4)), // up
      (i + (canvas.width * 4)) // down
    ]
    var index1 = 1, index2 = 1, index3 = 1;
    while (index1 == index2 || index2 == index3 || index1 == index3){
      index1 = Math.floor(Math.random()*dirs.length)
      index2 = Math.floor(Math.random()*dirs.length)
      index3 = Math.floor(Math.random()*dirs.length)
    }
    index1 = dirs[index1]
    index2 = (dirs[index2] + 1)
    index3 = (dirs[index3] + 2)
    return [index1, index2, index3]
  }

  var randDir = function(i){
    var dirs = [
      (i - 4), // left
      (i + 4), // right
      (i - (canvas.width * 4)), // up
      (i + (canvas.width * 4)) // down
    ]
    var tmp = Math.floor(Math.random()*dirs.length)
    var index1 = dirs[tmp]
    var index2 = (dirs[tmp] + 1)
    var index3 = (dirs[tmp] + 2)
    return [index1, index2, index3]
  }
  setInterval(ultraFilter, 12)
}

var apply = function(){
  if (!active){
    canvas.width = 500
    canvas.height = 400
    var text = document.getElementById('text').value
    draw(text)
    active = !active
  }
}

  document.getElementById('apply').addEventListener('click', apply)
