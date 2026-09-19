/* =========================================================
   SADOWAY CHEMISTRY
   INTERACTION + ANIMATION
========================================================= */

"use strict";

/* =========================================================
   HELPERS
========================================================= */

const qs = (selector, parent = document) =>
  parent.querySelector(selector);

const qsa = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   YEAR
========================================================= */

const yearElement = qs("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   ANNOUNCEMENT CLOSE
========================================================= */

const announcement =
  qs("#announcement");

const announcementClose =
  qs("#announcementClose");

if (announcementClose) {

  announcementClose.addEventListener(
    "click",
    () => {

      announcement.classList.add("hidden");

      localStorage.setItem(
        "sadowayAnnouncementClosed",
        "true"
      );

    }
  );

}

if (
  localStorage.getItem(
    "sadowayAnnouncementClosed"
  ) === "true"
) {
  announcement?.classList.add("hidden");
}


/* =========================================================
   MOBILE NAV
========================================================= */

const mobileMenuBtn =
  qs("#mobileMenuBtn");

const navLinks =
  qs("#navLinks");

if (
  mobileMenuBtn &&
  navLinks
) {

  mobileMenuBtn.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle("open");

      const icon =
        mobileMenuBtn.querySelector("i");

      if (
        navLinks.classList.contains("open")
      ) {

        icon.className =
          "fa-solid fa-xmark";

      } else {

        icon.className =
          "fa-solid fa-bars";

      }

    }
  );


  qsa("a", navLinks).forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navLinks.classList.remove("open");

        const icon =
          mobileMenuBtn.querySelector("i");

        icon.className =
          "fa-solid fa-bars";

      }
    );

  });

}


/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const siteHeader =
  qs("#siteHeader");

const backToTop =
  qs("#backToTop");

window.addEventListener(
  "scroll",
  () => {

    const scrollY =
      window.scrollY;

    if (siteHeader) {

      siteHeader.classList.toggle(
        "scrolled",
        scrollY > 20
      );

    }

    if (backToTop) {

      backToTop.classList.toggle(
        "show",
        scrollY > 600
      );

    }

  },
  { passive: true }
);


/* =========================================================
   BACK TO TOP
========================================================= */

if (backToTop) {

  backToTop.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================================
   SCROLL REVEALS
========================================================= */

const revealElements = [

  ...qsa(".concept-card"),

  ...qsa(".stat"),

  ...qsa(".timeline-item"),

  ...qsa(".pathway-card"),

  ...qsa(".bio-line"),

  ...qsa(".enquiry-card"),

  ...qsa(".youtube-card"),

  ...qsa(".lecture-sidebar")

];

revealElements.forEach(element => {

  element.classList.add("reveal");

});


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          "revealed"
        );

        revealObserver.unobserve(
          entry.target
        );

      });

    },
    {
      threshold: 0.10
    }
  );


revealElements.forEach(
  element =>
    revealObserver.observe(element)
);


/* =========================================================
   COUNTERS
========================================================= */

const counters =
  qsa(".counter");


let countersStarted = false;


function animateCounter(
  element,
  target,
  duration = 1300
) {

  const start = performance.now();

  function update(now) {

    const progress =
      Math.min(
        (now - start) / duration,
        1
      );

    // ease out
    const eased =
      1 - Math.pow(
        1 - progress,
        3
      );

    const value =
      Math.round(
        target * eased
      );

    element.textContent =
      value.toLocaleString();

    if (progress < 1) {

      requestAnimationFrame(
        update
      );

    }

  }

  requestAnimationFrame(update);

}


const statsSection =
  qs(".stats-section");


if (statsSection) {

  const statsObserver =
    new IntersectionObserver(
      entries => {

        if (
          entries[0].isIntersecting &&
          !countersStarted
        ) {

          countersStarted = true;

          counters.forEach(
            counter => {

              const target =
                Number(
                  counter.dataset.target
                );

              animateCounter(
                counter,
                target
              );

            }
          );

          statsObserver.disconnect();

        }

      },
      {
        threshold: 0.35
      }
    );

  statsObserver.observe(
    statsSection
  );

}


/* =========================================================
   HERO CHEMISTRY CANVAS
========================================================= */

const chemCanvas =
  qs("#chemCanvas");

const chemCtx =
  chemCanvas?.getContext("2d");


let chemParticles = [];

let chemAnimationId;


/* Responsive canvas */

function resizeChemCanvas() {

  if (!chemCanvas || !chemCtx)
    return;

  const rect =
    chemCanvas.getBoundingClientRect();

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  chemCanvas.width =
    rect.width * dpr;

  chemCanvas.height =
    rect.height * dpr;

  chemCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  createChemParticles(
    rect.width,
    rect.height
  );

}


function createChemParticles(
  width,
  height
) {

  chemParticles = [];

  const count =
    Math.max(
      34,
      Math.floor(width / 15)
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {

    chemParticles.push({

      x:
        Math.random() *
        width,

      y:
        Math.random() *
        height,

      radius:
        1.5 +
        Math.random() * 2.8,

      vx:
        (Math.random() - 0.5) *
        0.35,

      vy:
        (Math.random() - 0.5) *
        0.35,

      alpha:
        0.18 +
        Math.random() * 0.55

    });

  }

}


function drawChemScene() {

  if (!chemCanvas || !chemCtx)
    return;

  const width =
    chemCanvas.clientWidth;

  const height =
    chemCanvas.clientHeight;


  chemCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* Background grid */

  chemCtx.save();

  chemCtx.strokeStyle =
    "rgba(137,211,163,0.035)";

  chemCtx.lineWidth = 1;

  const spacing = 46;


  for (
    let x = 0;
    x < width;
    x += spacing
  ) {

    chemCtx.beginPath();

    chemCtx.moveTo(x, 0);

    chemCtx.lineTo(x, height);

    chemCtx.stroke();

  }


  for (
    let y = 0;
    y < height;
    y += spacing
  ) {

    chemCtx.beginPath();

    chemCtx.moveTo(0, y);

    chemCtx.lineTo(width, y);

    chemCtx.stroke();

  }

  chemCtx.restore();


  /* Electrodes */

  const leftX =
    width * 0.27;

  const rightX =
    width * 0.73;


  const topY =
    height * 0.23;

  const bottomY =
    height * 0.79;


  drawElectrode(
    leftX,
    topY,
    bottomY,
    "rgba(110,180,135,0.75)"
  );


  drawElectrode(
    rightX,
    topY,
    bottomY,
    "rgba(222,190,110,0.7)"
  );


  /* electrolyte field */

  const gradient =
    chemCtx.createLinearGradient(
      leftX,
      0,
      rightX,
      0
    );

  gradient.addColorStop(
    0,
    "rgba(137,211,163,0.04)"
  );

  gradient.addColorStop(
    0.5,
    "rgba(255,255,255,0.02)"
  );

  gradient.addColorStop(
    1,
    "rgba(230,221,139,0.05)"
  );


  chemCtx.fillStyle =
    gradient;

  chemCtx.fillRect(
    leftX + 26,
    topY,
    rightX - leftX - 52,
    bottomY - topY
  );


  /* central ion path */

  chemCtx.setLineDash([
    6,
    10
  ]);

  chemCtx.strokeStyle =
    "rgba(137,211,163,0.16)";

  chemCtx.beginPath();

  chemCtx.moveTo(
    leftX + 35,
    (topY + bottomY) / 2
  );

  chemCtx.bezierCurveTo(
    width * 0.40,
    height * 0.30,
    width * 0.60,
    height * 0.70,
    rightX - 35,
    (topY + bottomY) / 2
  );

  chemCtx.stroke();

  chemCtx.setLineDash([]);


  /* particles */

  chemParticles.forEach(
    particle => {

      particle.x +=
        particle.vx;

      particle.y +=
        particle.vy;


      if (
        particle.x < 0 ||
        particle.x > width
      ) {

        particle.vx *= -1;

      }

      if (
        particle.y < 0 ||
        particle.y > height
      ) {

        particle.vy *= -1;

      }


      chemCtx.beginPath();

      chemCtx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      chemCtx.fillStyle =
        `rgba(167,244,192,${particle.alpha})`;

      chemCtx.fill();

    }
  );


  /* electron path */

  const pulse =
    (Math.sin(
      Date.now() * 0.002
    ) + 1) / 2;


  chemCtx.strokeStyle =
    `rgba(230,221,139,${0.30 + pulse * 0.18})`;

  chemCtx.lineWidth = 2;

  chemCtx.beginPath();

  chemCtx.moveTo(
    leftX,
    topY + 50
  );

  chemCtx.bezierCurveTo(
    width * 0.42,
    height * 0.03,
    width * 0.58,
    height * 0.03,
    rightX,
    topY + 50
  );

  chemCtx.stroke();


  chemCtx.beginPath();

  chemCtx.arc(
    width * 0.5,
    height * 0.09,
    4 + pulse * 2,
    0,
    Math.PI * 2
  );

  chemCtx.fillStyle =
    "#e6dd8b";

  chemCtx.fill();


  chemAnimationId =
    requestAnimationFrame(
      drawChemScene
    );

}


function drawElectrode(
  x,
  top,
  bottom,
  color
) {

  chemCtx.save();

  chemCtx.strokeStyle =
    color;

  chemCtx.lineWidth = 3;

  chemCtx.shadowColor =
    color;

  chemCtx.shadowBlur = 15;

  chemCtx.beginPath();

  chemCtx.moveTo(
    x,
    top
  );

  chemCtx.lineTo(
    x,
    bottom
  );

  chemCtx.stroke();

  chemCtx.restore();

}


if (chemCanvas) {

  resizeChemCanvas();

  window.addEventListener(
    "resize",
    resizeChemCanvas
  );

  drawChemScene();

}


/* =========================================================
   ELECTROCHEMISTRY CANVAS
========================================================= */

const electroCanvas =
  qs("#electroCanvas");

const electroCtx =
  electroCanvas?.getContext("2d");


let electroRunning =
  true;

let electroParticles = [];

let electroAnimationId;


function resizeElectroCanvas() {

  if (
    !electroCanvas ||
    !electroCtx
  ) return;


  const rect =
    electroCanvas.getBoundingClientRect();

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  electroCanvas.width =
    rect.width * dpr;

  electroCanvas.height =
    rect.height * dpr;

  electroCtx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );


  createElectroParticles(
    rect.width,
    rect.height
  );

}


function createElectroParticles(
  width,
  height
) {

  electroParticles = [];

  for (
    let i = 0;
    i < 32;
    i++
  ) {

    electroParticles.push({

      x:
        width * 0.3 +
        Math.random() *
        width * 0.4,

      y:
        105 +
        Math.random() *
        Math.max(
          90,
          height - 210
        ),

      vx:
        (Math.random() - 0.5) *
        0.28,

      vy:
        (Math.random() - 0.5) *
        0.35,

      r:
        2 +
        Math.random() * 2,

      type:
        Math.random() > 0.5
          ? "+"
          : "−"

    });

  }

}


function drawElectroScene() {

  if (
    !electroCanvas ||
    !electroCtx
  ) return;


  const width =
    electroCanvas.clientWidth;

  const height =
    electroCanvas.clientHeight;


  electroCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* Grid */

  electroCtx.strokeStyle =
    "rgba(137,211,163,0.035)";

  electroCtx.lineWidth = 1;


  for (
    let x = 0;
    x < width;
    x += 36
  ) {

    electroCtx.beginPath();

    electroCtx.moveTo(x, 0);

    electroCtx.lineTo(
      x,
      height
    );

    electroCtx.stroke();

  }


  for (
    let y = 0;
    y < height;
    y += 36
  ) {

    electroCtx.beginPath();

    electroCtx.moveTo(0, y);

    electroCtx.lineTo(
      width,
      y
    );

    electroCtx.stroke();

  }


  const left =
    width * 0.23;

  const right =
    width * 0.77;

  const top =
    height * 0.22;

  const bottom =
    height * 0.75;


  /* Electrodes */

  electroCtx.strokeStyle =
    "rgba(137,211,163,0.72)";

  electroCtx.lineWidth = 5;

  electroCtx.beginPath();

  electroCtx.moveTo(
    left,
    top
  );

  electroCtx.lineTo(
    left,
    bottom
  );

  electroCtx.stroke();


  electroCtx.strokeStyle =
    "rgba(230,221,139,0.74)";

  electroCtx.beginPath();

  electroCtx.moveTo(
    right,
    top
  );

  electroCtx.lineTo(
    right,
    bottom
  );

  electroCtx.stroke();


  /* Solution */

  electroCtx.fillStyle =
    "rgba(137,211,163,0.025)";

  electroCtx.fillRect(
    left + 18,
    top,
    right - left - 36,
    bottom - top
  );


  /* External circuit */

  electroCtx.strokeStyle =
    "rgba(230,221,139,0.45)";

  electroCtx.lineWidth = 2;

  electroCtx.beginPath();

  electroCtx.moveTo(
    left,
    top
  );

  electroCtx.bezierCurveTo(
    left,
    height * 0.10,
    right,
    height * 0.10,
    right,
    top
  );

  electroCtx.stroke();


  /* electrons */

  const time =
    performance.now() *
    0.00035;


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const t =
      (
        time +
        i / 5
      ) % 1;


    const x =
      left +
      (right - left) *
      t;

    const y =
      height * 0.105;


    electroCtx.beginPath();

    electroCtx.arc(
      x,
      y,
      4,
      0,
      Math.PI * 2
    );

    electroCtx.fillStyle =
      "#e6dd8b";

    electroCtx.shadowColor =
      "#e6dd8b";

    electroCtx.shadowBlur = 14;

    electroCtx.fill();

  }


  electroCtx.shadowBlur = 0;


  /* ions */

  if (electroRunning) {

    electroParticles.forEach(
      particle => {

        particle.x +=
          particle.vx;

        particle.y +=
          particle.vy;


        const minX =
          left + 25;

        const maxX =
          right - 25;

        const minY =
          top + 25;

        const maxY =
          bottom - 25;


        if (
          particle.x < minX ||
          particle.x > maxX
        ) {

          particle.vx *= -1;

        }


        if (
          particle.y < minY ||
          particle.y > maxY
        ) {

          particle.vy *= -1;

        }


        electroCtx.beginPath();

        electroCtx.arc(
          particle.x,
          particle.y,
          particle.r,
          0,
          Math.PI * 2
        );

        electroCtx.fillStyle =
          particle.type === "+"
            ? "rgba(167,244,192,0.75)"
            : "rgba(230,221,139,0.75)";

        electroCtx.fill();

      }
    );

  }


  /* center membrane */

  electroCtx.setLineDash([
    4,
    7
  ]);

  electroCtx.strokeStyle =
    "rgba(255,255,255,0.16)";

  electroCtx.beginPath();

  electroCtx.moveTo(
    width / 2,
    top + 20
  );

  electroCtx.lineTo(
    width / 2,
    bottom - 20
  );

  electroCtx.stroke();

  electroCtx.setLineDash([]);


  if (electroRunning) {

    electroAnimationId =
      requestAnimationFrame(
        drawElectroScene
      );

  }

}


if (electroCanvas) {

  resizeElectroCanvas();

  window.addEventListener(
    "resize",
    resizeElectroCanvas
  );

  drawElectroScene();

}


/* =========================================================
   PAUSE / PLAY PARTICLES
========================================================= */

const toggleParticles =
  qs("#toggleParticles");


if (toggleParticles) {

  toggleParticles.addEventListener(
    "click",
    () => {

      electroRunning =
        !electroRunning;


      const icon =
        toggleParticles.querySelector("i");


      if (electroRunning) {

        toggleParticles.innerHTML =
          `Pause animation
           <i class="fa-solid fa-pause"></i>`;

        drawElectroScene();

      } else {

        cancelAnimationFrame(
          electroAnimationId
        );

        toggleParticles.innerHTML =
          `Play animation
           <i class="fa-solid fa-play"></i>`;

      }

    }
  );

}


/* =========================================================
   ENQUIRY FORM
========================================================= */

const enquiryForm =
  qs("#enquiryForm");

const formMessage =
  qs("#formMessage");


if (enquiryForm) {

  enquiryForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        qs("#studentName")?.value.trim();

      const mobile =
        qs("#mobile")?.value.trim();

      const course =
        qs("#course")?.value;


      if (!name || !mobile || !course) {

        if (formMessage) {

          formMessage.textContent =
            "Please complete all fields.";

        }

        return;

      }


      /* Basic phone validation */

      const cleanMobile =
        mobile.replace(
          /[\s()-]/g,
          ""
        );


      if (
        !/^\+?\d{10,13}$/.test(
          cleanMobile
        )
      ) {

        formMessage.textContent =
          "Please enter a valid mobile number.";

        return;

      }


      /*
       * Front-end demo only.
       * Connect this form to Formspree,
       * Google Forms, EmailJS, Apps Script,
       * or your own backend for real submissions.
       */

      formMessage.textContent =
        `Thanks ${name}. Your ${course} enquiry is ready to be connected.`;


      enquiryForm.reset();

    }
  );

}


/* =========================================================
   MAGNETIC-STYLE BUTTON MICRO INTERACTION
========================================================= */

const magneticButtons =
  qsa(".btn, .nav-cta, .round-arrow");


magneticButtons.forEach(button => {

  button.addEventListener(
    "mousemove",
    event => {

      const rect =
        button.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left -
        rect.width / 2;

      const y =
        event.clientY -
        rect.top -
        rect.height / 2;


      button.style.transform =
        `translate(${x * 0.06}px, ${y * 0.06}px)`;

    }
  );


  button.addEventListener(
    "mouseleave",
    () => {

      button.style.transform =
        "";

    }
  );

});


/* =========================================================
   PARALLAX FOR HERO VISUAL
========================================================= */

const heroVisual =
  qs(".hero-visual");


if (
  heroVisual &&
  window.matchMedia(
    "(pointer:fine)"
  ).matches
) {

  heroVisual.addEventListener(
    "mousemove",
    event => {

      const rect =
        heroVisual.getBoundingClientRect();

      const x =
        (event.clientX -
          rect.left) /
        rect.width -
        0.5;

      const y =
        (event.clientY -
          rect.top) /
        rect.height -
        0.5;


      heroVisual.style.transform =
        `perspective(900px)
         rotateY(${x * 2}deg)
         rotateX(${y * -2}deg)`;

    }
  );


  heroVisual.addEventListener(
    "mouseleave",
    () => {

      heroVisual.style.transform =
        "";

    }
  );

}


/* =========================================================
   CLEANUP ON PAGE HIDDEN
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden
    ) {

      cancelAnimationFrame(
        chemAnimationId
      );

      cancelAnimationFrame(
        electroAnimationId
      );

    } else {

      if (chemCanvas) {
        drawChemScene();
      }

      if (
        electroCanvas &&
        electroRunning
      ) {
        drawElectroScene();
      }

    }

  }
);
