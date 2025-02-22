const canvas = document.querySelector("#resize");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colorArray = ["#00E3CC", "#32A89C", "#009688", "#44E3D3", "#00635A"];

// Rectangles
// ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
// ctx.fillRect(100, 100, 100, 100);
// ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
// ctx.fillRect(400, 100, 100, 100);
// ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
// ctx.fillRect(300, 300, 100, 100);

// Lines
// ctx.beginPath();
// ctx.moveTo(50, 300);
// ctx.lineTo(300, 100);
// ctx.lineTo(400, 300);
// ctx.strokeStyle = "#FA34A3";
// ctx.stroke();

// Circles
// for (let i = 0; i < 500; i++) {
//   let x = Math.random() * window.innerWidth;
//   let y = Math.random() * window.innerHeight;
//   let circ = Math.random(2, 3) * 10;
//   ctx.beginPath();
//   ctx.arc(x, y, circ, 0, Math.PI * 2, false);
//   ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
//   ctx.stroke();
// }

const mouse = {
  x: undefined,
  y: undefined,
  isInCanvas: false,
  lastMoveTime: 0,
};

const maxRadius = 40;
const minRadius = 2;

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
  // Trigger random reduction for each circle
  circleArray.forEach((circle) => {
    circle.targetRadius = circle.minRadius + Math.random() * 2;
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
    this.shrinkSpeed = Math.random() * 0.5 + 0.5; // Random shrink speed for each circle
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Wall collisions
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Keep within bounds
    this.x = Math.max(this.radius, Math.min(innerWidth - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(innerHeight - this.radius, this.y));

    // Mouse interaction with time-based check
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - mouse.lastMoveTime;

    if (mouse.isInCanvas && timeSinceLastMove < 100) {
      // Only respond to recent mouse movements
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        this.targetRadius = this.maxRadius;
      } else {
        this.targetRadius = this.minRadius + Math.random() * 2;
      }
    } else if (timeSinceLastMove >= 100) {
      // Gradually return to near minimum radius with some randomness
      this.targetRadius = this.minRadius + Math.random() * 2;
    }

    // Smooth size transition with variable speed
    if (this.radius > this.targetRadius) {
      this.radius = Math.max(this.radius - this.shrinkSpeed, this.targetRadius);
    } else if (this.radius < this.targetRadius) {
      this.radius = Math.min(this.radius + 1, this.targetRadius);
    }

    this.draw();
  }
}

let circleArray = [];

function init() {
  circleArray = [];
  for (let i = 0; i < 800; i++) {
    const radius = Math.random() * 3 + 1;
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
