var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d');
var target = document.getElementById("drop-target");
target.addEventListener("dragover", function(e){e.preventDefault();}, true);
target.addEventListener("drop", function(e){e.preventDefault();
  loadImage(e.dataTransfer.files[0]);
}, true);

function draw(img) {
  var pixels = img.width * img.height
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;

  var invert = function() {
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];     // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var grayscale = function() {
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

var crazy = function() {
  grayscale()
  for (var i = 0; i < data.length; i += 4) {
    var avg = data[i]
    var randoms = [(Math.round(avg * (1/2))), (avg + Math.round(avg * (1/8))), (avg + Math.round(avg * (3/8)))]
    var avgRandoms = Math.round((randoms[0] + randoms[1] + randoms[2]) / 3)
    if (Math.abs(avg-avgRandoms) > 3 && avgRandoms == 128){
      console.log("ohno!")
    }
    var index1 = 1, index2 = 1, index3 = 1
    while (index1 == index2 || index2 == index3 || index1 == index3){
      index1 = Math.floor(Math.random()*3)
      index2 = Math.floor(Math.random()*3)
      index3 = Math.floor(Math.random()*3)
    }
    var t1 = randoms[index1]
    var t2 = randoms[index2]
    var t3 = randoms[index3]

    data[i]     = t1; // red
    data[i + 1] = t2; // green
    data[i + 2] = t3; // blue
  }
  ctx.putImageData(imageData, 0, 0)
}

var bw = function(){
  for (var i = 0; i < data.length; i += 4) {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    var upOrDown = avg - 128
    if (upOrDown >= 0){
      avg = 255
    } else {
      avg = 0
    }
    data[i]     = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var confetti = function(){
  bw()
  invert()
  crazy()
  invert()
  crazy()
}

var colorSplit = function(){
  var iter = pixels / 600
  var chance = iter / 10
  for (var loops = 0; loops < iter; loops += 1){
    for (var i = 0; i < data.length; i += 4){
      var rand = Math.floor(Math.random() * (chance))
      if (rand == 0){
        data[(i - 4) % data.length] = data[i]
        data[(i + 5) % data.length] = data[(i + 1) % data.length]
        data[((i - (img.width*4)) + 2) % data.length] = data[(i + 2) % data.length]
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

var scatter = function(){
  var iter = pixels / 600
  var chance = iter / 10
  for (var loops = 0; loops < iter; loops += 1){
    for (var i = 0; i < data.length; i += 4){
      var rand = Math.floor(Math.random() * (chance))
      if (rand == 0){
        var dirs = [
          (i-4), // left
          (i + 4), // right
          (i - (img.width * 4)), // up
          (i + (img.width * 4)) // down
        ]
        var dir = dirs[(Math.floor(Math.random() * dirs.length))]
        data[dir % data.length] = data[i]
        data[(dir + 1) % data.length] = data[(i + 1) % data.length]
        data[(dir + 2) % data.length] = data[(i + 2) % data.length]
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

var test = function(){
  for (var x = 0; x < 100; x += 1){
    scatter()
    colorSplit()
  }
}

var hueShift = function(){
  for (var i = 0; i < data.length; i += 4) {
    tmp1 = data[i]
    tmp2 = data[i+1]
    tmp3 = data[i+2]
    data[i]     = tmp2; // red
    data[i + 1] = tmp3; // green
    data[i + 2] = tmp1; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var contrastBoost = function(){
  for (var i = 0; i < data.length; i += 4) {
    var tmp1 = data[i]
    var tmp2 = data[i+1]
    var tmp3 = data[i+2]
    var avg = (data[i] + data[i+1] + data[i+2]) / 3
    if (avg > 128){
      tmp1 = Math.min(tmp1*1.1, 255)
      tmp2 = Math.min(tmp2*1.1, 255)
      tmp3 = Math.min(tmp3*1.1, 255)
    } else {
      tmp1 = Math.max(tmp1*.9, 0)
      tmp2 = Math.max(tmp2*.9, 0)
      tmp3 = Math.max(tmp3*.9, 0)
    }
    data[i]     = tmp1; // red
    data[i + 1] = tmp2; // green
    data[i + 2] = tmp3; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var brightnessBoost = function(){
  for (var i = 0; i < data.length; i += 4) {
    var tmp1 = data[i]
    var tmp2 = data[i+1]
    var tmp3 = data[i+2]
    brightenAmount = 5
    tmp1 += brightenAmount
    tmp2 += brightenAmount
    tmp3 += brightenAmount
    data[i]     = tmp1; // red
    data[i + 1] = tmp2; // green
    data[i + 2] = tmp3; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var saturationBoost = function(){
  for (var i = 0; i < data.length; i += 4) {
    var tmp1 = data[i]
    var tmp2 = data[i+1]
    var tmp3 = data[i+2]
    var avg = (data[i] + data[i+1] + data[i+2]) / 3
    saturationAmount = .1
    if (tmp1 > avg){
      tmp1 *= 1 + saturationAmount
    } else {
      tmp1 *= 1 - saturationAmount
    }
    if (tmp2 > avg){
      tmp2 *= 1 + saturationAmount
    } else {
      tmp2 *= 1 - saturationAmount
    }
    if (tmp3 > avg){
      tmp3 *= 1 + saturationAmount
    } else {
      tmp3 *= 1 - saturationAmount
    }
    data[i]     = tmp1; // red
    data[i + 1] = tmp2; // green
    data[i + 2] = tmp3; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var desaturate = function(){
  for (var i = 0; i < data.length; i += 4) {
    var tmp1 = data[i]
    var tmp2 = data[i+1]
    var tmp3 = data[i+2]
    var avg = (data[i] + data[i+1] + data[i+2]) / 3
    saturationAmount = .02
    if (tmp1 < avg){
      tmp1 *= 1 + saturationAmount
    } else {
      tmp1 *= 1 - saturationAmount
    }
    if (tmp2 < avg){
      tmp2 *= 1 + saturationAmount
    } else {
      tmp2 *= 1 - saturationAmount
    }
    if (tmp3 < avg){
      tmp3 *= 1 + saturationAmount
    } else {
      tmp3 *= 1 - saturationAmount
    }
    data[i]     = tmp1; // red
    data[i + 1] = tmp2; // green
    data[i + 2] = tmp3; // blue
  }
  ctx.putImageData(imageData, 0, 0);
}

var blur = function(){
  var iter = 1
  for (var x = 0; x < iter; x += 4){
    var tmpdata = []
    for (var i = 0; i < data.length; i += 4){
      tmpdata[i] = (data[(i-4) % data.length] + data[(i+4) % data.length] + data[(i - (img.width * 4)) % data.length] + data[(i + (img.width * 4)) % data.length]) / 4
      tmpdata[i+1] = ( data[(i-3) % data.length] + data[(i+5) % data.length] + data[(i - (img.width * 4) + 1) % data.length] + data[(i + (img.width * 4) + 1) % data.length]) / 4
      tmpdata[i+2] = (data[(i-2) % data.length] + data[(i+6) % data.length] + data[(i - (img.width * 4) + 2) % data.length] + data[(i + (img.width * 4) + 2) % data.length]) / 4
    }
    for (var i = 0; i < data.length; i+=4){
      data[i] = tmpdata[i]
      data[i+1] = tmpdata[i+1]
      data[i+2] = tmpdata[i+2]
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

var abstractColors = function(){
  for (var x = 0; x < 8; x += 1){
    saturationBoost()
  }
  colorSplit()
  for (var x = 0; x < 20; x += 1){
    scatter()
  }
  for (var x = 0; x < 5; x += 1){
    desaturate()
  }
}

var load = function(){
  img.crossOrigin = "anonymous"
  img.src = document.getElementById("imgURL").value
  draw(img)
}

var save = function (){
  document.write("<img src='"+canvas.toDataURL("image/png")+"' alt='from canvas'/>");
}

var processing = function (state){
  var stateText = document.getElementById("state")
  if (state == "Working"){
    console.log("Processing...")
  } else if (state == "Done") {
    console.log("Done.")
  }
}

var revert = function(){
  ctx.drawImage(img, 0, 0);
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;
}

var wrapper = function(filter){
  processing("Working")
  filter()
  processing("Done")
}

var filter = function(){
  var filterChoice = document.getElementById("filterChoice").options[document.getElementById("filterChoice").selectedIndex].value
  switch (filterChoice){
    case "invert":
      invert()
      break
    case "grayscale":
      grayscale()
      break
    case "bw":
      bw()
      break
    case "colorNoise":
      crazy()
      break
    case "confetti":
      confetti()
      break
    case "colorSplit":
      colorSplit()
      break
    case "scatter":
      scatter()
      break
    case "hueshift":
      hueShift()
      break
    case "contrastBoost":
      contrastBoost()
      break
    case "saturationBoost":
      saturationBoost()
      break
    case "desaturate":
      desaturate()
      break
    case "brightnessBoost":
      brightnessBoost()
      break
    case "blur":
      blur()
      break
    case "abstractColors":
      abstractColors()
      break
  }
}

  document.getElementById('savebtn').addEventListener('click', save)
  document.getElementById('revertbtn').addEventListener('click', revert)
  document.getElementById('filterbtn').addEventListener('click', filter);
} // where is the open brace?

var render = function(src){
      MAX_HEIGHT = 600
			var img = new Image();
			img.onload = function(){
				if(img.height > MAX_HEIGHT) {
					img.width *= MAX_HEIGHT / img.height;
					img.height = MAX_HEIGHT;
				}
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				canvas.width = img.width;
				canvas.height = img.height;
				draw(img)
			};
			img.src = src;
		};

function loadImage(src){
	//	Prevent any non-image file type from being read.
	if(!src.type.match(/image.*/)){
		console.log("The dropped file is not an image: ", src.type);
		return;
	}

	//	Create our FileReader and run the results through the render function.
	var reader = new FileReader();
	reader.onload = function(e){
		render(e.target.result);
	};
	reader.readAsDataURL(src);
}
