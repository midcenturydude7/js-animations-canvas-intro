const canvas = document.querySelector("#resize");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colorArray = ["red", "blue", "green", "yellow", "purple", "orange"];

// Rectangles
ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
ctx.fillRect(100, 100, 100, 100);
ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
ctx.fillRect(400, 100, 100, 100);
ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
ctx.fillRect(300, 300, 100, 100);

// Lines
ctx.beginPath();
ctx.moveTo(50, 300);
ctx.lineTo(300, 100);
ctx.lineTo(400, 300);
ctx.strokeStyle = "#FA34A3";
ctx.stroke();

// Circles
for (let i = 0; i < 500; i++) {
  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;
  let circ = Math.random(2, 3) * 10;
  ctx.beginPath();
  ctx.arc(x, y, circ, 0, Math.PI * 2, false);
  ctx.strokeStyle = colorArray[Math.floor(Math.random() * colorArray.length)];
  ctx.stroke();
}
