var canvas = document.getElementById("canvas")
var shadowCanvas = document.getElementById("shadowCanvas")
var ctx = canvas.getContext('2d')
var shadowCtx = shadowCanvas.getContext('2d')
var active = false
var length, width, height, data, i

function draw(text) {
  var img = canvas
  width = canvas.width
  height = canvas.height
  var pixels = canvas.width * canvas.height
  ctx.fillStyle="white"
  ctx.fillRect(0,0,canvas.width, canvas.height)
  ctx.fillStyle="black"
  ctx.font="64px Georgia"
  ctx.fillText(text, 50, 50);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;
  length = data.length
  var fps = 20;
  var interval = 1000 / fps
  var once = true
  var ultraFilter = function(){
    var scale = 1
      for (i = 0; i < data.length; i += 4){
        if (chance(24)){
          slideDown()
        }
        if (
          false
          && !Math.floor(Math.random() * (1000 * scale))
        ){ // gray-b-gone
          var grayThreshold = 10
          while ((Math.abs(data[i] - data[i+1]) < grayThreshold || Math.abs(data[i] - data[i+2]) < grayThreshold) && data[i] < 250 && data[i] > 5){
            [index1, index2, index3] = randDirs(i)
            var shift = 5
            data[i] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+1] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
            data[i+2] += shift * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
          }
        }
        if (
          false
          && !Math.floor(Math.random() * (500 * scale))
        ){ // bright-b-gone
          var diffThreshold = 230
          while (diffThreshold(data[i], data[i + 1], diffThreshold) || diffThreshold(data[i], data[i + 2], diffThreshold) && data[i] < 250 && data[i] > 5){
            [index1, index2, index3] = randDirs(i)
            var shift = 5
            if (data[i] > 192){
              data[i] -= shift
            } else if (data[i] < 64){
              data[i] += shift
            } else {
              data[i] += randSignFlip(shift)
            }
            if (data[i + 1] > 192){
              data[i + 1] -= shift
            } else if (data[i + 1] < 64){
              data[i + 1] += shift
            } else {
              data[i + 1] += randSignFlip(shift)
            }
            if (data[i + 2] > 192){
              data[i + 2] -= shift
            } else if (data[i + 2] < 64){
              data[i + 2] += shift
            } else {
              data[i + 2] += randSignFlip(shift)
            }
          }
        }
        if (
          true
          && !Math.floor(Math.random() * (10000 * scale))
          && data[i] < 192 && data[i] >= 64
        ){ // horizontal bleed
          var resonance = 1.01
          if (data[i] > data[i+1] && data[i] > data[i+2]){
            data[i] /= randSignFlip(resonance)
            data[i-4 % data.length] *= randSignFlip(resonance)
            data[i+4 % data.length] *= randSignFlip(resonance)
          } else if (data[i+1] > data[i+2]){
            data[i + 1] /= randSignFlip(resonance)
            data[i-3 % data.length] *= randSignFlip(resonance)
            data[i+5 % data.length] *= randSignFlip(resonance)
          } else {
            data[i + 2] /= randSignFlip(resonance)
            data[i-2 % data.length] *= randSignFlip(resonance)
            data[i+6 % data.length] *= randSignFlip(resonance)
          }
        }
        if (
          true
          //&& !Math.floor(Math.random() * (10000 * scale))
          && i > canvas.width * 4
        ){ // minor blur
          setColor("s", "r", avgColor("r"))
          setColor("s", "g", avgColor("g"))
          setColor("s", "b", avgColor("b"))
        }
        if (
          false
          && !Math.floor(Math.random() * (1000 * scale))
        ){ // scatter
          var index1, index2, index3
          [index1, index2, index3] = randDir(i)
          data[index1 % data.length] = data[i]
          data[index2 % data.length] = data[i + 1]
          data[index3 % data.length] = data[i + 2]
        }
        if (
          false
          && !Math.floor(Math.random() * (20000 * scale))
        ){
          data[i] += 1
          data[i + 1] += 1
          data[i + 2] += 1
          data[i] %= 256
          data[i + 1] %= 256
          data[i + 2] %= 256
        }
        if (
          false
          && !Math.floor(Math.random() * (5000 * scale))
          && (data[i] + data[i+1] + data[i+2]) / 3 < 64
        ){
          data[i] += 2
          data[i + 1] += 2
          data[i + 2] += 2
          data[i] %= 256
          data[i + 1] %= 256
          data[i + 2] %= 256
        }
      }
    ctx.putImageData(imageData, 0, 0);
  }

  var slideDown = function(){
    setPixel("d", "s")
  }

  var chance = function(num){
    return !Math.floor(Math.random() * (num))
  }

var avgColor = function(color){
  return avg([getColor("s", color),getColor("u", color), getColor("d", color), getColor("l", color), getColor("r", color)])
}

var diffThreshold = function(a, b, threshold){
    return Math.abs(a - b) > threshold
  }

var setPixel = function(dest, source){
    setColor(dest, "r", getColor("s", "r"))
    setColor(dest, "g", getColor("s", "g"))
    setColor(dest, "b", getColor("s", "b"))
  }

var setColor = function(neighbor, color, value){
    data[get(neighbor, color)] = value
  }

var getColor = function(neighbor, color){
    return data[get(neighbor, color)]
  }

var randSignFlip = function(num){
    return num * (Math.floor((Math.floor(Math.random() * 2)) * 1.5)) - 2
  }

var get = function(neighbor, color){
    var val = i
    switch (neighbor){
      case "r":
        val += 4
        break
      case "l":
        val -= 4
        break
      case "u":
        val -= width * 4
        break
      case "d":
        val += width * 4
        break
      case "s":
        val += 0
    }
    switch (color){
      case "r":
        val += 0
        break
      case "g":
        val += 1
        break
      case "b":
        val += 2
        break
    }
    val %= length
    return val
  }

var avg = function(list){
    var sum = 0
    for (var x = 0; x < list.length; x++){
      sum += list[x]
    }
    sum /= list.length
    return sum
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
  setInterval(ultraFilter, interval)
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
