// Fibonacci Forever - Minimal Golden Spirals

const colors = [
  { h: 0, s: 90, l: 60 },      // Red
  { h: 300, s: 85, l: 55 },    // Magenta
  { h: 200, s: 80, l: 65 },    // Cyan
  { h: 45, s: 100, l: 60 },    // Orange
  { h: 270, s: 75, l: 60 }     // Purple
];

let fibs = [];
const goldenRatio = (1 + Math.sqrt(5)) / 2;

function generateFibonacci(count) {
  const fib = [1, 1];
  for (let i = 2; i < count; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL);
  fibs = generateFibonacci(8);
}

function draw() {
  background(30); // Dark background
  
  push();
  translate(width / 2, height / 2);
  
  // Draw multiple spirals based on Fibonacci numbers
  for (let s = 0; s < fibs.length; s++) {
    drawSpiral(s);
  }
  
  // Mouse interaction
  const distance = dist(mouseX - width / 2, mouseY - height / 2, 0, 0);
  if (distance < 250) {
    const brightness = map(distance, 0, 250, 100, 0);
    stroke(255, brightness);
    strokeWeight(1.5);
    noFill();
    circle(mouseX - width / 2, mouseY - height / 2, 50);
  }
  
  pop();
}

function drawSpiral(index) {
  const fibNum = fibs[index];
  const colorIndex = index % colors.length;
  const color = colors[colorIndex];
  
  const maxAngle = PI * fibNum * goldenRatio * 1.5;
  const maxRadius = 100 + index * 40;
  const steps = fibNum * 15;
  
  const colorBrightness = 50 + sin(frameCount * 0.01 + index) * 20;
  
  // Spiral guide (keep the motion effect)
  noFill();
  stroke(color.h, color.s, colorBrightness, 180);
  strokeWeight(1.5);
  
  beginShape();
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const angle = maxAngle * t + frameCount * 0.003 * (index + 1);
    const radius = t * maxRadius;
    
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    
    vertex(x, y);
    
    // Place flowers along the spiral
    if (i % 8 === 0) {
      const petalCount = 5 + (index % 4);
      const petalSize = 6 + t * 14;
      const rot = angle + frameCount * 0.01;
      drawFlower(x, y, petalSize, petalCount, rot, color, colorBrightness);
    }
  }
  endShape();
}

function drawFlower(x, y, r, petals, rotation, color, brightness) {
  push();
  translate(x, y);
  rotate(rotation);
  noStroke();
  fill(color.h, color.s, brightness + 10, 200);
  
  for (let i = 0; i < petals; i++) {
    const a = (TWO_PI / petals) * i;
    push();
    rotate(a);
    ellipse(r * 0.6, 0, r, r * 0.5);
    pop();
  }
  
  // center
  fill(color.h, color.s, brightness + 30, 220);
  circle(0, 0, r * 0.6);
  pop();
}

function mousePressed() {
  fibs = generateFibonacci(floor(random(6, 10)));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
