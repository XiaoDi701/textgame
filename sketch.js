let font;
let angle = 0;
let radius = 250;
let textStr = "fat cat we are here with you";
let charPoints = [];
let chars = [];
let numRows = 1;

// 定义滑块变量
let slider, radiusSlider, charWidthSlider, rayLengthSlider;
let colorSlider, swingslider, howbigpoints, thicknessSlider, alphaSlider;

function preload() {
  font = loadFont('Alfarn Regular.ttf');
}

function setup() {
  createCanvas(1000, 600, WEBGL); 
  //this part is to make it 3d using webgl
  textFont(font);
  textSize(40);
  textAlign(CENTER, CENTER);
  chars = textStr.split(""); //separate individual characters

//making all the sliders
  slider = createSlider(1, 4, 1, 1); //the number of the lines：createSlider(min, max, defaultValue, step);
  slider.position(20, 20);

  radiusSlider = createSlider(100, 600, 250, 10); //hight
  radiusSlider.position(20, 50);

  charWidthSlider = createSlider(0.5, 3, 1, 0.1); // width
  charWidthSlider.position(20, 80);

  rayLengthSlider = createSlider(0, 50, 0, 1); // length of the raycast
  rayLengthSlider.position(20, 110);

  colorSlider = createSlider(0, 255, 0, 1); // colorrrr
  colorSlider.position(20, 140);

  swingslider = createSlider(0, 20, 5, 0.5); // swinging the characters around
  swingslider.position(20, 170);

  howbigpoints = createSlider(0.1, 0.5, 0.3, 0.01); // how much points there is
  howbigpoints.position(20, 200);

  thicknessSlider = createSlider(1, 10, 3, 1); //how big the points are
  thicknessSlider.position(20, 230);

  alphaSlider = createSlider(50, 255, 255, 1); // alpha
  alphaSlider.position(20, 260);


  for (let i = 0; i < chars.length; i++) {
    let bbox = font.textBounds(chars[i], 0, 0, 40);//返回一个【现在这个字体多大的值】，这样子我们知道现在字多大
    let points = font.textToPoints(chars[i], -bbox.w / 2, bbox.h / 2, 40, {
      sampleFactor: howbigpoints.value(), 
      simplifyThreshold: 0
    });
    charPoints.push(points);
  }
}

function draw() {
  background(31, 24, 232); 
  rotateY(angle); 
  rotateX(PI / 6);

  numRows = slider.value(); 
  let charCount = chars.length; 
  let step = TWO_PI / charCount; 
  let radius = radiusSlider.value(); 
  let charWidthFactor = charWidthSlider.value();
  let rayLength = rayLengthSlider.value(); 
  let colorProgress = colorSlider.value(); 
  let distortion = swingslider.value(); 
  let thickness = thicknessSlider.value();
  let alphaVal = alphaSlider.value(); 
  
  //calculate howbigpoints
   charPoints = [];
  for (let i = 0; i < chars.length; i++) {
    let bbox = font.textBounds(chars[i], 0, 0, 40);
    let points = font.textToPoints(chars[i], -bbox.w / 2, bbox.h / 2, 40, {
      sampleFactor: howbigpoints.value(), 
      simplifyThreshold: 0
    });
    charPoints.push(points);
  }

  for (let row = 0; row < numRows; row++) {
    let yOffset = row * 100 - (numRows - 1) * 100 / 2; //the y axis offset

    for (let i = 0; i < charCount; i++) {
      let theta = i * step - PI / 2; //angle
      let x = radius * cos(theta);
      let z = radius * sin(theta); 

      push();
      translate(x, yOffset, z); 
      rotateY(-theta); 
      //the color
      let r = map(colorProgress, 0, 255, 255, 255);
      let g = map(colorProgress, 0, 255, 255, 165); 
      let b = map(colorProgress, 0, 255, 255, 0);   

      fill(r, g, b, alphaVal); 
      stroke(r, g, b, alphaVal); 

      // draw points
      for (let pt of charPoints[i]) {
        let xOffset = pt.x * charWidthFactor; 
        let yOffset = pt.y; 

        // swinging
        let distortionEffect = sin(frameCount * 0.05 + xOffset * 0.1) * distortion;
        let distortedY = yOffset + distortionEffect;

        push();
        translate(xOffset, distortedY, 0);
        ellipse(0, 0, thickness, thickness); 
        pop();
      }

      // raycast
      if (rayLength > 0) {
        for (let pt of charPoints[i]) {
          let xOffset = pt.x * charWidthFactor;
          let yOffset = pt.y;
          let distortionEffect = sin(frameCount * 0.05 + xOffset * 0.1) * distortion;
          let distortedY = yOffset + distortionEffect;

          stroke(r, g, b, alphaVal); 
          line(xOffset, distortedY, 0, xOffset, distortedY, rayLength);
        }
      }
      pop();
    }
  }
  angle += 0.02; 
}
