let fibs = [];
let stars = [];
const starConfig = {
  count: 120,
  distance: 140,
  radius: 160,
  speed: 0.2
};

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  angleMode(DEGREES);
  stroke(205, 50, 100);
  strokeWeight(4);
  fibs = generateFibonacci(8);
  stars = createStars(starConfig.count);
}

function draw() {
  background(0, 0, 0);
  drawConstellationBackground();
  drawBeluLines();
  orbitControl(4, 4);

  rotateX(-30);
  rotateY(frameCount * 0.2);

  const hovered = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  const baseHue = hovered ? map(mouseX, 0, width, 0, 360) : 205;
  // Controlled glow (avoid white blowout)
  blendMode(ADD);
  dahlia(baseHue, 0.05, false, 5);
  blendMode(BLEND);
  dahlia(baseHue, 0.35, false, 1.5);

}

function dahlia(baseHue, alphaMul, useFiboShimmer, weight) {
  for (let r = 0; r <= 1; r += 0.03) {
    beginShape(POINTS);
    for (let theta = 0; theta <= 180 * 30; theta += 1.5) {
      const fib = fibs[(Math.floor(theta / 30) % fibs.length)];
      const shimmer = useFiboShimmer ? 0.35 + 0.65 * abs(sin(theta / fib)) : 1;
      const hue = (baseHue + 160 * sin(theta * 0.15) + r * 40) % 360;
      const sat = 85 + 15 * sin(theta * 0.05);
      const bri = 10 + 20 * (1 - r) + 4 * sin(theta * 0.12);
      const centerAtten = 0.02 + 0.98 * r;
      const alpha = 120 * alphaMul * shimmer * (0.25 + 0.75 * r);
      stroke(hue, sat, bri * centerAtten, alpha);
      strokeWeight(weight);

      const phi = (180 / 1.75) * Math.exp(-theta / (11 * 180));
      const petalCut = 0.6 + abs(asin(sin(4.75 * theta)) + 420 * sin(4.75 * theta)) / 2000;
      const hangDown = 2.3 * pow(r, 2) * pow(0.9 * r - 1, 2) * sin(phi);

      if (0 < petalCut * (r * sin(phi) + hangDown * cos(phi))) {
        const pX = 300 * (1 - theta / 20000) * petalCut * (r * sin(phi) + hangDown * cos(phi)) * sin(theta);
        const pY = -300 * (1 - theta / 20000) * petalCut * (r * cos(phi) - hangDown * sin(phi));
        const pZ = 300 * (1 - theta / 20000) * petalCut * (r * sin(phi) + hangDown * cos(phi)) * cos(theta);
        vertex(pX, pY, pZ);
      }
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function generateFibonacci(count) {
  const fib = [1, 1];
  for (let i = 2; i < count; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}

function createStars(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * starConfig.speed,
      vy: (Math.random() - 0.5) * starConfig.speed,
      r: Math.random() * 1.2 + 0.2
    });
  }
  return arr;
}

function drawConstellationBackground() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2, 0);

  noFill();
  strokeWeight(1);

  const mx = constrain(mouseX, 0, width);
  const my = constrain(mouseY, 0, height);

  // Stars
  for (const s of stars) {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0 || s.x > width) s.vx *= -1;
    if (s.y < 0 || s.y > height) s.vy *= -1;

    stroke(0, 0, 90, 180);
    point(s.x, s.y);
  }

  // Lines
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const a = stars[i];
      const b = stars[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < starConfig.distance) {
        const dm = Math.sqrt((a.x - mx) ** 2 + (a.y - my) ** 2);
        if (dm < starConfig.radius) {
          const alpha = map(d, 0, starConfig.distance, 120, 0);
          stroke(200, 30, 80, alpha);
          line(a.x, a.y, b.x, b.y);
        }
      }
    }
  }

  pop();
}

function drawBeluLines() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2, 0);

  const label = "BELU";
  const size = Math.min(width, height) * 0.12;
  const x0 = width * 0.06;
  const y0 = height * 0.12;

  stroke(200, 30, 90, 120);
  strokeWeight(2);
  noFill();

  const w = size * 0.75;
  const h = size;
  const gap = size * 0.22;

  // B
  line(x0, y0, x0, y0 + h);
  line(x0, y0, x0 + w * 0.6, y0);
  line(x0, y0 + h * 0.5, x0 + w * 0.6, y0 + h * 0.5);
  line(x0, y0 + h, x0 + w * 0.6, y0 + h);
  line(x0 + w * 0.6, y0, x0 + w * 0.6, y0 + h * 0.5);
  line(x0 + w * 0.6, y0 + h * 0.5, x0 + w * 0.6, y0 + h);

  // E
  const xE = x0 + w + gap;
  line(xE, y0, xE, y0 + h);
  line(xE, y0, xE + w * 0.6, y0);
  line(xE, y0 + h * 0.5, xE + w * 0.5, y0 + h * 0.5);
  line(xE, y0 + h, xE + w * 0.6, y0 + h);

  // L
  const xL = xE + w + gap;
  line(xL, y0, xL, y0 + h);
  line(xL, y0 + h, xL + w * 0.6, y0 + h);

  // U
  const xU = xL + w + gap;
  line(xU, y0, xU, y0 + h * 0.85);
  line(xU + w * 0.6, y0, xU + w * 0.6, y0 + h * 0.85);
  line(xU, y0 + h * 0.85, xU + w * 0.6, y0 + h * 0.85);

  pop();
}
