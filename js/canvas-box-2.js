const canvas2 = document.querySelector("#canvas-box-2");
const ctx2 = canvas2.getContext("2d");

// Resize observer to make canvas responsive to container
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const box = entry.target;
    canvas2.width = box.clientWidth;
    canvas2.height = box.clientHeight;
    init(); // Reinitialize particles when size changes
  }
});

// Start observing the container
resizeObserver.observe(document.querySelector(".box:nth-child(3)"));

// Particle class
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas2.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas2.height || this.y < 0) this.speedY *= -1;
  }

  draw() {
    ctx2.fillStyle = "#56efdf";
    ctx2.beginPath();
    ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx2.fill();
  }
}

let particles = [];

function init() {
  particles = [];
  const numberOfParticles = (canvas2.width * canvas2.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(
      new Particle(
        Math.random() * canvas2.width,
        Math.random() * canvas2.height
      )
    );
  }
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx2.beginPath();
        ctx2.strokeStyle = `rgba(86, 239, 223, ${1 - distance / 100})`;
        ctx2.lineWidth = 1;
        ctx2.moveTo(particles[i].x, particles[i].y);
        ctx2.lineTo(particles[j].x, particles[j].y);
        ctx2.stroke();
      }
    }
  }
}

function animate() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connect();
  requestAnimationFrame(animate);
}

// Initial setup
init();
animate();
