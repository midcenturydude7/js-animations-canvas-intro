const canvas = document.querySelector("#resize");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration
const minCircleRadius = 2; // Minimum starting radius
const maxCircleRadius = 15; // Maximum starting radius

const colorArray = [
  "#00E3CC",
  "#32A89C",
  "#009688",
  "#44E3D3",
  "#00635A",
  "#000504",
];

class WavyLine {
  constructor(y) {
    this.y = y;
    this.amplitude = 25; // Reduced amplitude
    this.frequency = 0.0025; // Lower frequency for smoother waves
    this.phase = Math.random() * Math.PI * 2;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.speed = 0.007; // Slower speed for smoother movement
    this.stepSize = 10; // Smaller steps for smoother curves
  }

  easeInOut(t) {
    // Add easing function for smoother movement
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  getWaveY(x) {
    // Helper function to calculate wave y position with easing
    const raw = Math.sin(this.phase + x * this.frequency);
    return (
      this.y + this.easeInOut(Math.abs(raw)) * Math.sign(raw) * this.amplitude
    );
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;

    ctx.moveTo(0, this.getWaveY(0));

    for (let x = 0; x < canvas.width; x += this.stepSize) {
      const x1 = x + this.stepSize / 3;
      const x2 = x + (2 * this.stepSize) / 3;
      const x3 = x + this.stepSize;

      const y1 = this.getWaveY(x1);
      const y2 = this.getWaveY(x2);
      const y3 = this.getWaveY(x3);

      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }

    ctx.stroke();
    this.phase += this.speed;
  }

  fillToNext(nextWave, fillColor) {
    ctx.beginPath();
    ctx.moveTo(0, this.getWaveY(0));

    // Draw current wave
    for (let x = 0; x < canvas.width; x += this.stepSize) {
      const x1 = x + this.stepSize / 3;
      const x2 = x + (2 * this.stepSize) / 3;
      const x3 = x + this.stepSize;

      const y1 = this.getWaveY(x1);
      const y2 = this.getWaveY(x2);
      const y3 = this.getWaveY(x3);

      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }

    // Draw path back through next wave
    for (let x = canvas.width; x >= 0; x -= this.stepSize) {
      const x1 = x - this.stepSize / 3;
      const x2 = x - (5 * this.stepSize) / 3;
      const x3 = x - this.stepSize;

      const y1 = nextWave.getWaveY(x1);
      const y2 = nextWave.getWaveY(x2);
      const y3 = nextWave.getWaveY(x3);

      ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }

    ctx.fillStyle = fillColor;
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

let wavyLines = [];

const mouse = {
  x: undefined,
  y: undefined,
  isInCanvas: false,
  lastMoveTime: 0,
};

const maxRadius = 40;
const minRadius = 10;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  mouse.isInCanvas = true;
  mouse.lastMoveTime = Date.now();
});

window.addEventListener("mouseleave", () => {
  mouse.isInCanvas = false;
  mouse.x = undefined;
  mouse.y = undefined;
  // Reset all circles to their original state
  circleArray.forEach((circle) => {
    circle.targetRadius = circle.minRadius;
  });
});

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.initialDx = dx;
    this.initialDy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.maxRadius = maxRadius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.targetRadius = radius;

    // Glow effect properties
    this.isGlowing = false;
    this.glowIntensity = 20;
    this.maxGlowIntensity = 80;
    this.glowSpeed = 1;
    this.glowProbability = 0.01; // Chance to start glowing
  }

  draw() {
    ctx.beginPath();

    if (this.isGlowing) {
      ctx.shadowBlur = this.glowIntensity;
      ctx.shadowColor = this.color;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Reset shadow settings
    ctx.shadowBlur = 0;
  }

  update() {
    // Random chance to start glowing
    if (!this.isGlowing && Math.random() < this.glowProbability) {
      this.isGlowing = true;
      this.glowIntensity = 0;
    }

    // Handle glowing effect
    if (this.isGlowing) {
      if (this.glowIntensity < this.maxGlowIntensity) {
        this.glowIntensity += this.glowSpeed;
      } else {
        this.glowIntensity -= this.glowSpeed;
        if (this.glowIntensity <= 0) {
          this.isGlowing = false;
          this.glowIntensity = 0;
        }
      }
    }

    // Update position first
    this.x += this.dx;
    this.y += this.dy;

    // Wall collision detection and response
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;

      // Reset velocity if it's too slow
      if (Math.abs(this.dx) < Math.abs(this.initialDx) * 0.5) {
        this.dx = this.dx > 0 ? this.initialDx : -this.initialDx;
      }

      // Adjust position to prevent sticking
      if (this.x + this.radius > innerWidth) {
        this.x = innerWidth - this.radius;
      }
      if (this.x - this.radius < 0) {
        this.x = this.radius;
      }
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;

      // Reset velocity if it's too slow
      if (Math.abs(this.dy) < Math.abs(this.initialDy) * 0.5) {
        this.dy = this.dy > 0 ? this.initialDy : -this.initialDy;
      }

      // Adjust position to prevent sticking
      if (this.y + this.radius > innerHeight) {
        this.y = innerHeight - this.radius;
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
      }
    }
    this.y = Math.max(this.radius, Math.min(innerHeight - this.radius, this.y));

    // Mouse interaction with time-based check
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - mouse.lastMoveTime;

    if (mouse.isInCanvas && timeSinceLastMove < 100) {
      // Only respond to recent mouse movements
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 75) {
        this.targetRadius = this.maxRadius;
      } else {
        this.targetRadius = this.minRadius;
      }
    } else {
      this.targetRadius = this.minRadius;
    }

    // Smooth size transition with preserved velocity
    if (this.radius > this.targetRadius) {
      // Gradual shrinking
      const shrinkRate = 0.2;
      this.radius = Math.max(this.radius - shrinkRate, this.targetRadius);
    } else if (this.radius < this.targetRadius) {
      // Quick growing for responsiveness
      const growRate = 1;
      this.radius = Math.min(this.radius + growRate, this.targetRadius);
    }

    this.draw();
  }
}

let circleArray = [];

function init() {
  circleArray = [];
  wavyLines = [];

  // Create three waves in the top third
  wavyLines.push(new WavyLine(100));
  wavyLines.push(new WavyLine(150));
  wavyLines.push(new WavyLine(200));
  for (let i = 0; i < 200; i++) {
    const radius =
      Math.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius;
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 1.5; // Slightly faster initial velocity
    const dy = (Math.random() - 0.5) * 1.5;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // Draw waves first as background
  for (let i = 0; i < wavyLines.length - 1; i++) {
    wavyLines[i].fillToNext(wavyLines[i + 1], colorArray[i + 3]);
  }
  for (let wave of wavyLines) {
    wave.draw();
  }

  for (let circle of circleArray) {
    circle.update();
  }
}

init();
animate();
