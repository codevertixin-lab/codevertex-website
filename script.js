const canvas = document.getElementById("sphere");
const ctx = canvas.getContext("2d");

const SIZE = 500;
canvas.width = SIZE;
canvas.height = SIZE;

const center = SIZE / 2;
const particles = [];
const COUNT = 1800;
const RADIUS = 210;

/* Rotation angles */
let angleY = 0;
let angleX = 0;

/* Mouse interaction */
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

/* Create dotted Earth (surface only) */
for (let i = 0; i < COUNT; i++) {
  const lat = Math.acos(2 * Math.random() - 1) - Math.PI / 2;
  const lon = Math.random() * Math.PI * 2;

  const x = RADIUS * Math.cos(lat) * Math.cos(lon);
  const y = RADIUS * Math.sin(lat);
  const z = RADIUS * Math.cos(lat) * Math.sin(lon);

  particles.push({ x, y, z });
}

/* Rotation helpers */
function rotateY(p, a) {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    x: p.x * cos - p.z * sin,
    y: p.y,
    z: p.x * sin + p.z * cos,
  };
}

function rotateX(p, a) {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return {
    x: p.x,
    y: p.y * cos - p.z * sin,
    z: p.y * sin + p.z * cos,
  };
}

/* Mouse move interaction */
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = (e.clientX - rect.left - SIZE / 2) / SIZE;
  mouseY = (e.clientY - rect.top - SIZE / 2) / SIZE;
});

canvas.addEventListener("mouseleave", () => {
  mouseX = 0;
  mouseY = 0;
});

/* Animation loop */
function animate() {
  ctx.clearRect(0, 0, SIZE, SIZE);

  /* Smooth mouse follow */
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  /* Base rotation + hover influence */
  angleY += 0.0015 + targetX * 0.03;
  angleX += 0.0006 + targetY * 0.03;

  particles.forEach((p) => {
    let r = rotateY(p, angleY);
    r = rotateX(r, angleX);

    const depth = 700 / (700 + r.z);
    const x = center + r.x * depth;
    const y = center + r.y * depth;

    const alpha = Math.max(0.25, depth - 0.3);
    const size = depth * 1.2;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(140,160,255,${alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
// ------------------------------
//  PREMIUM MOBILE NAV SCRIPT
// ------------------------------

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mobileNav");

// Toggle menu
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

// Close on ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});

// Close when clicking any nav link
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close helper
function closeMenu() {
  hamburger.classList.remove("active");
  nav.classList.remove("active");
}

// Safety: Reset menu on resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    closeMenu();
  }
});

// Animate numbers
const counters = document.querySelectorAll(".value-card .number");

counters.forEach((counter) => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200; // speed of counting

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 15);
    } else {
      counter.innerText = target;
    }
  };

  updateCount();
});

const newsletterForm = document.getElementById("newsletter-form");
const emailInput = document.getElementById("newsletter-email");
const messageBox = document.getElementById("newsletter-msg");

newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    messageBox.innerText = "❌ Please enter a valid email!";
    messageBox.style.color = "#ff6b6b";
    return;
  }

  messageBox.innerText = "⏳ Subscribing...";
  messageBox.style.color = "#6f7cff";

  fetch(
    "https://script.google.com/macros/s/AKfycbz8Pgd9mGJp5eSnv7vJUnI5yv6a7PplppYJD76l2ln2O4n9TJuGZY3uDXEBpgxNTutfbQ/exec",
    {
      method: "POST",
      body: new URLSearchParams({ email }),
    }
  )
    .then((res) => res.text())
    .then((data) => {
      if (data === "success") {
        messageBox.innerText = "🎉 Thanks for subscribing to CodeVertex!";
        messageBox.style.color = "#6f7cff";
        emailInput.value = "";
      } else {
        messageBox.innerText = "❌ Something went wrong. Try again!";
        messageBox.style.color = "#ff6b6b";
      }
    })
    .catch(() => {
      messageBox.innerText = "⚠️ Network error. Please try later.";
      messageBox.style.color = "#ff6b6b";
    });
});
