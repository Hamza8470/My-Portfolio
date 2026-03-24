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

// Eye tracking animation
function initializeEyeTracking() {
  var characterContainer = document.getElementById("character-container");
  var boySvg = document.getElementById("boy-svg");
  if (!characterContainer || !boySvg) return;

  // Wait for SVG to load
  var svgDoc = null;
  var leftPupil = null;
  var rightPupil = null;

  function loadSVGElements() {
    try {
      svgDoc = boySvg.contentDocument || boySvg.getSVGDocument();
      if (!svgDoc) {
        setTimeout(loadSVGElements, 100);
        return;
      }
      leftPupil = svgDoc.querySelector(".left-pupil");
      rightPupil = svgDoc.querySelector(".right-pupil");

      if (leftPupil && rightPupil) {
        startEyeTracking();
      }
    } catch (e) {
      console.log("SVG not loaded yet, retrying...");
      setTimeout(loadSVGElements, 100);
    }
  }

  function startEyeTracking() {
    var eyeCenterX = 100;
    var eyeCenterY = 70;
    var eyeRadius = 5;
    var maxDistance = 7;

    document.addEventListener("mousemove", function (e) {
      var containerRect = characterContainer.getBoundingClientRect();
      var mouseX = e.clientX - containerRect.left;
      var mouseY = e.clientY - containerRect.top;

      // Calculate eye ball position based on SVG viewBox coordinates
      var svgRect = boySvg.getBoundingClientRect();
      var svgWidth = svgRect.width;
      var svgHeight = svgRect.height;

      var leftEyeX = 75 * (svgWidth / 250);
      var leftEyeY = 70 * (svgHeight / 300);
      var rightEyeX = 125 * (svgWidth / 250);
      var rightEyeY = 70 * (svgHeight / 300);

      var leftEyeScreenX = containerRect.left + leftEyeX;
      var leftEyeScreenY = containerRect.top + leftEyeY;
      var rightEyeScreenX = containerRect.left + rightEyeX;
      var rightEyeScreenY = containerRect.top + rightEyeY;

      // Calculate angle for left eye
      var deltaX1 = e.clientX - leftEyeScreenX;
      var deltaY1 = e.clientY - leftEyeScreenY;
      var distance1 = Math.sqrt(deltaX1 * deltaX1 + deltaY1 * deltaY1);
      var angle1 = Math.atan2(deltaY1, deltaX1);

      // Calculate angle for right eye
      var deltaX2 = e.clientX - rightEyeScreenX;
      var deltaY2 = e.clientY - rightEyeScreenY;
      var distance2 = Math.sqrt(deltaX2 * deltaX2 + deltaY2 * deltaY2);
      var angle2 = Math.atan2(deltaY2, deltaX2);

      // Position left pupil
      var pupilX1 = Math.cos(angle1) * maxDistance;
      var pupilY1 = Math.sin(angle1) * maxDistance;
      leftPupil.setAttribute("cx", 75 + pupilX1);
      leftPupil.setAttribute("cy", 70 + pupilY1);

      // Position right pupil
      var pupilX2 = Math.cos(angle2) * maxDistance;
      var pupilY2 = Math.sin(angle2) * maxDistance;
      rightPupil.setAttribute("cx", 125 + pupilX2);
      rightPupil.setAttribute("cy", 70 + pupilY2);
    });
  }

  loadSVGElements();
}

initializeEyeTracking();

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
