const canvas = document.querySelector("#resize");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configuration
const minCircleRadius = 4; // Minimum starting radius
const maxCircleRadius = 10; // Maximum starting radius

const colorArray = [
  "#00E3CC",
  "#32A89C",
  "#009688",
  "#44E3D3",
  "#00635A",
  "#000504",
];

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
  for (let i = 0; i < 500; i++) {
    const radius =
      Math.random() * (maxCircleRadius - minCircleRadius) + minCircleRadius;
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const dx = (Math.random() - 0.5) * 3; // Slightly faster initial velocity
    const dy = (Math.random() - 0.5) * 3;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let circle of circleArray) {
    circle.update();
  }
}

init();
animate();
