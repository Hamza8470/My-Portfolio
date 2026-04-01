if (window.Swiper) {
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function initializeHeroAutoTyper() {
  var phrases = [
    "MERN Stack apps.",
    "React interfaces.",
    "REST APIs.",
    "real-time features.",
    "things that ship.",
  ];
  var el = document.getElementById("typedText");
  if (!el) {
    return;
  }

  var pIdx = 0;
  var cIdx = 0;
  var deleting = false;
  var typeSpeed = 80;
  var deleteSpeed = 45;
  var pauseAfter = 1800;
  var pauseBefore = 400;

  function type() {
    var current = phrases[pIdx];

    if (!deleting) {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, pauseAfter);
        return;
      }
      setTimeout(type, typeSpeed);
      return;
    }

    el.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(type, pauseBefore);
      return;
    }
    setTimeout(type, deleteSpeed);
  }

  setTimeout(type, 1200);
}

function initializeHeroParticles() {
  var container = document.getElementById("heroParticles");
  if (!container) {
    return;
  }

  var count = 30;
  for (var i = 0; i < count; i++) {
    var p = document.createElement("div");
    p.className = "particle";

    var size = Math.random() * 2.5 + 1;
    var left = Math.random() * 100;
    var delay = Math.random() * 12;
    var duration = Math.random() * 10 + 8;
    var opacity = Math.random() * 0.5 + 0.2;

    p.style.left = left + "%";
    p.style.bottom = "-10px";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.opacity = String(opacity);
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";

    container.appendChild(p);
  }
}

function initializeHeroStatCounters() {
  var stats = [
    { selector: ".hero-stat:nth-child(2) .hero-stat-num", target: 370, suffix: "" },
    { selector: ".hero-stat:nth-child(3) .hero-stat-num", target: 450, suffix: "+" },
  ];

  var heroStats = document.querySelector(".hero-stats");
  if (!heroStats || !("IntersectionObserver" in window)) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      observer.disconnect();

      stats.forEach(function (item) {
        var el = document.querySelector(item.selector);
        if (!el) {
          return;
        }

        var count = 0;
        var step = Math.ceil(item.target / 60);
        var interval = setInterval(function () {
          count = Math.min(count + step, item.target);
          el.textContent = String(count) + item.suffix;
          if (count >= item.target) {
            clearInterval(interval);
          }
        }, 20);
      });
    });
  }, { threshold: 0.4 });

  observer.observe(heroStats);
}

initializeHeroAutoTyper();
initializeHeroParticles();
initializeHeroStatCounters();

var revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
if ("IntersectionObserver" in window) {
  var observer = new IntersectionObserver(function (entries, currentObserver) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  revealTargets.forEach(function (node) {
    observer.observe(node);
  });
} else {
  revealTargets.forEach(function (node) {
    node.classList.add("is-visible");
  });
}

var form = document.getElementById("contact-form");
var statusText = document.getElementById("form-status");
if (form && statusText) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      statusText.textContent = "Please fill out your name, email, and message.";
      return;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      statusText.textContent = "Please enter a valid email address.";
      return;
    }

    var subject = encodeURIComponent("Portfolio inquiry from " + name);
    var body = encodeURIComponent(
      "Name: " + name + "\n" +
      "Email: " + email + "\n\n" +
      message
    );

    statusText.textContent = "message ready to send! Opening your email client...";
    window.location.href = "mailto:ahmadsalim8470@gmail.com?subject=" + subject + "&body=" + body;
    form.reset();
  });
}

var footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}
