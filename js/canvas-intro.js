const canvas = document.querySelector("#resize");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colorArray = ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2", "#E29578"];

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

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  update() {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

const circleArray = [];

for (let i = 0; i < 300; i++) {
  let radius = Math.random() * (10 - 2) + 5;
  let x = Math.random() * (innerWidth - radius * 2) + radius;
  let y = Math.random() * (innerHeight - radius * 2) + radius;
  let dx = (Math.random() - 0.5) * 3;
  let dy = (Math.random() - 0.5) * 3;
  let circle = new Circle(x, y, dx, dy, radius);
  circleArray.push(circle);
  circle.draw();
}

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  circleArray.forEach((circle) => {
    circle.update();
  });

  // ctx.beginPath();
  // ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  // ctx.strokeStyle = "blue";
  // ctx.stroke();

  // if (x + radius > innerWidth || x - radius < 0) {
  //   dx = -dx;
  // }

  // if (y + radius > innerHeight || y - radius < 0) {
  //   dy = -dy;
  // }

  // x += dx;
  // y += dy;

  // for (let i = 0; i < 5; i++) {
  //   let x = Math.random() * window.innerWidth;
  //   let y = Math.random() * window.innerHeight;
  //   let circ = Math.random() * 10 + 5;
  //   ctx.beginPath();
  //   ctx.arc(x, y, circ, 0, Math.PI * 2, false);
  //   ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
  //   ctx.stroke();
  // }
};

animate();
