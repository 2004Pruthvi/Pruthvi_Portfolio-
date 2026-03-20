/*
  =====================================================
  script.js — The Brain of Pruthvi's Portfolio Website
  =====================================================
  This file controls everything that MOVES and REACTS
  on the website. Things like:
    - The glowing dot that follows your mouse around
    - The floating particles in the background
    - The typing animation in the hero section
    - Cards fading in as you scroll down the page
    - The contact form sending messages to my email
    - Showing and hiding the resume section

  Written by Pruthvi Raj D S
  =====================================================
*/


/* ─────────────────────────────────────────────────────
   1. FOOTER YEAR
   Shows the current year automatically in the footer.
   So I never have to manually update "2024", "2025"...
───────────────────────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────────────────
   2. CUSTOM MOUSE CURSOR
   Instead of the plain arrow cursor, we show:
     - A small glowing dot (follows mouse instantly)
     - A bigger ring (lazily follows behind the dot)

   On phones/tablets — there is no mouse, so we
   hide the custom cursor completely.
───────────────────────────────────────────────────── */
var dot  = document.getElementById('cur-dot');   // small cyan dot
var ring = document.getElementById('cur-ring');  // bigger purple ring

var mx = 0, my = 0; // where the mouse is RIGHT NOW
var rx = 0, ry = 0; // where the ring currently is (moves slower)

// Detect if the user is on a touch screen (phone/tablet)
var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouchDevice) {
  // No mouse on touch screens — hide the custom cursor
  dot.style.display  = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';

} else {
  // On desktop: move the dot exactly where the mouse is
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Fade out when mouse leaves the browser window
  document.addEventListener('mouseleave', function() {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  // Fade back in when mouse enters
  document.addEventListener('mouseenter', function() {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // The ring slowly "chases" the dot — like a ball on a rubber band!
  // It moves 12% of the remaining distance every single frame (60fps).
  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick); // repeat every frame
  })();
}

// When hovering over links, buttons, and cards — ring grows bigger
document.querySelectorAll('a, button, .tl-body, .edu-card, .tl-r-body').forEach(function(el) {
  el.addEventListener('mouseenter', function() { ring.classList.add('hov'); });
  el.addEventListener('mouseleave', function() { ring.classList.remove('hov'); });
});


/* ─────────────────────────────────────────────────────
   3. FLOATING PARTICLE BACKGROUND
   We draw 65 tiny glowing dots on an invisible canvas
   that sits behind the entire page. They float around
   and when two dots get close, a faint line connects
   them — like a star constellation or a neural network!
───────────────────────────────────────────────────── */
(function() {
  var cv  = document.getElementById('particles');
  var ctx = cv.getContext('2d'); // our "drawing pen"
  var pts = [];                  // list of all particles

  // Make canvas fill the full screen
  function resize() {
    cv.width  = innerWidth;
    cv.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create 65 particles at random positions, speeds, and sizes
  for (var i = 0; i < 65; i++) {
    pts.push({
      x:  Math.random() * innerWidth,    // random X position
      y:  Math.random() * innerHeight,   // random Y position
      r:  Math.random() * 1.4 + 0.3,    // random radius (tiny!)
      dx: (Math.random() - 0.5) * 0.38, // random horizontal speed
      dy: (Math.random() - 0.5) * 0.38, // random vertical speed
      o:  Math.random() * 0.45 + 0.1    // random opacity
    });
  }

  // Draw one frame of the animation (runs 60 times per second)
  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height); // clear previous frame

    // Draw and move every particle
    pts.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
      ctx.fill();

      p.x += p.dx; // move horizontally
      p.y += p.dy; // move vertically

      // Bounce off edges (like a ball hitting a wall!)
      if (p.x < 0 || p.x > cv.width)  p.dx *= -1;
      if (p.y < 0 || p.y > cv.height) p.dy *= -1;
    });

    // Draw connecting lines between nearby particles
    // (uses the Pythagorean theorem to calculate distance)
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy); // distance formula!

        if (d < 115) {
          // Closer = more visible line
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(99,102,241,' + (0.13 * (1 - d / 115)) + ')';
          ctx.lineWidth   = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw); // draw the next frame
  }

  draw(); // kick off the animation!
})();


/* ─────────────────────────────────────────────────────
   4. NAVBAR GLASS EFFECT ON SCROLL
   When you scroll down more than 40px, the navbar
   gets a blurry glass background so it looks nice
   over the content below it.
───────────────────────────────────────────────────── */
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 40);
});


/* ─────────────────────────────────────────────────────
   5. HAMBURGER MENU (for mobile screens)
   On small screens, all nav links are hidden.
   The three-lines button (☰) opens a fullscreen menu.
───────────────────────────────────────────────────── */
var ham = document.getElementById('ham');     // the ☰ button
var mob = document.getElementById('mobMenu'); // the fullscreen overlay

ham.addEventListener('click', function() {
  ham.classList.toggle('open'); // animates ☰ into ✕
  mob.classList.toggle('open'); // shows/hides the menu
});

document.getElementById('mobClose').addEventListener('click', function() {
  ham.classList.remove('open');
  mob.classList.remove('open');
});

// Close menu automatically when any link is clicked
document.querySelectorAll('.mob-link').forEach(function(link) {
  link.addEventListener('click', function() {
    ham.classList.remove('open');
    mob.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────────────
   6. TYPING ANIMATION (Hero Section)
   Makes it look like someone is typing job titles
   one letter at a time, then deleting them!

   e.g:  "IoT Engineer|"  →  deletes  →  "Cloud Architect|"
───────────────────────────────────────────────────── */
(function() {
  var words = [
    'IoT Engineer',
    'Cloud Architect',
    'DevOps Practitioner',
    'Full-Stack Developer',
    'Embedded Systems Dev'
  ];

  var el  = document.getElementById('typed');
  var wi  = 0;     // index of current word
  var ci  = 0;     // index of current character
  var del = false; // are we typing or deleting?

  function tick() {
    var w = words[wi];

    if (!del) {
      // TYPING: reveal one more character
      el.textContent = w.slice(0, ci + 1);
      if (ci + 1 === w.length) {
        del = true;
        setTimeout(tick, 1600); // pause before deleting
        return;
      }
      ci++;
      setTimeout(tick, 88); // type speed: 88ms per letter

    } else {
      // DELETING: remove one character from the end
      el.textContent = w.slice(0, ci - 1);
      if (ci - 1 === 0) {
        del = false;
        wi  = (wi + 1) % words.length; // move to next word
        ci  = 0;
        setTimeout(tick, 300);
        return;
      }
      ci--;
      setTimeout(tick, 48); // delete speed: faster than typing
    }
  }

  tick(); // start!
})();


/* ─────────────────────────────────────────────────────
   7. SCROLL REVEAL ANIMATIONS
   Elements with class "reveal" are invisible at first.
   When they scroll into view — they fade in and slide up.
   IntersectionObserver watches when elements appear on screen.
───────────────────────────────────────────────────── */
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('in'); // CSS does the animation when "in" is added
    }
  });
}, { threshold: 0.08 }); // trigger when 8% of the element is on screen

document.querySelectorAll('.reveal').forEach(function(el) {
  revObs.observe(el);
});


/* ─────────────────────────────────────────────────────
   8. TECH STACK SKILL CARDS
   Instead of writing all 8 cards directly in HTML,
   we store the data here and build the cards with JS
   when the section scrolls into view.
   This keeps the HTML cleaner and easier to update!
───────────────────────────────────────────────────── */
var skills = [
  { e: '&#128268;',       n: 'IoT & Embedded',   s: 'ESP32  &middot;  Arduino  &middot;  Sensors',      c: '#06b6d4' },
  { e: '&#9729;&#65039;', n: 'Cloud Computing',  s: 'AWS  &middot;  EC2  &middot;  S3  &middot;  IAM',  c: '#8b5cf6' },
  { e: '&#9881;&#65039;', n: 'DevOps',           s: 'Docker  &middot;  CI/CD  &middot;  Kubernetes',    c: '#10b981' },
  { e: '&#127760;',       n: 'Web Dev',          s: 'HTML  &middot;  CSS  &middot;  JavaScript',        c: '#f59e0b' },
  { e: '&#128013;',       n: 'Python',           s: 'ML  &middot;  Automation  &middot;  Scripts',      c: '#6366f1' },
  { e: '&#128451;',       n: 'Databases',        s: 'SQL  &middot;  Firebase  &middot;  Cloud DB',      c: '#ec4899' },
  { e: '&#128737;&#65039;', n: 'Security',       s: 'IAM  &middot;  VPN  &middot;  Firewalls',          c: '#14b8a6' },
  { e: '&#127959;&#65039;', n: 'IaC / Infra',    s: 'Terraform  &middot;  Ansible  &middot;  Linux',    c: '#f97316' }
];

var sg = document.getElementById('skillsGrid');

var skillObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      skills.forEach(function(s, i) {
        var card = document.createElement('div');
        card.className = 'skill-card';
        card.style.animationDelay = (i * 80) + 'ms'; // stagger cards one by one

        card.innerHTML =
          '<div class="skill-icon" style="background:' + s.c + '18">' + s.e + '</div>' +
          '<div class="skill-name">' + s.n + '</div>' +
          '<div class="skill-sub">'  + s.s + '</div>';

        // Glow with the card's own color on hover
        card.addEventListener('mouseenter', function() {
          card.style.boxShadow   = '0 0 30px ' + s.c + '44';
          card.style.borderColor = s.c + '44';
          ring.classList.add('hov');
        });
        card.addEventListener('mouseleave', function() {
          card.style.boxShadow   = 'none';
          card.style.borderColor = 'var(--gb)';
          ring.classList.remove('hov');
        });

        sg.appendChild(card);
      });
      skillObs.unobserve(e.target); // done — stop watching
    }
  });
}, { threshold: 0.1 });

skillObs.observe(sg);


/* ─────────────────────────────────────────────────────
   9. PROJECT CARDS
   Same idea as skills — data stored here, cards
   built when the user scrolls to the projects section.
───────────────────────────────────────────────────── */
var projs = [
  {
    e: '&#127968;', c: '#06b6d4',
    t: 'Smart Home Monitoring',
    d: 'Real-time environment monitoring using ESP32 and cloud dashboard. Tracks temperature, humidity and motion with instant alerts deployed on AWS IoT Core.',
    tags: ['ESP32', 'AWS IoT', 'Python', 'Cloud'],
    l: 'https://github.com/2004Pruthvi'
  },
  {
    e: '&#129302;', c: '#8b5cf6',
    t: 'Parenting Assistant Robot',
    d: 'AI-powered robot supporting parents with child monitoring and safety alerts using computer vision and ROS middleware.',
    tags: ['Python', 'AI/ML', 'Computer Vision', 'ROS', 'IoT'],
    l: 'https://github.com/2004Pruthvi'
  },
  {
    e: '&#128225;', c: '#10b981',
    t: 'Home Automation System',
    d: 'Full-stack automation platform with voice control, scheduling and energy monitoring. ESP32 sensor nodes with REST API backend.',
    tags: ['ESP32', 'HTML/CSS/JS', 'REST API', 'IoT'],
    l: 'https://github.com/2004Pruthvi'
  }
];

var pg = document.getElementById('projectsGrid');

var projObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      projs.forEach(function(p, i) {
        var card = document.createElement('div');
        card.className = 'proj-card';
        card.style.animationDelay = (i * 120) + 'ms';

        var tagHTML = p.tags.map(function(t) {
          return '<span class="tag">' + t + '</span>';
        }).join('');

        card.innerHTML =
          '<div class="proj-glow" style="background:radial-gradient(circle at 50% 0%,' + p.c + '18,transparent 70%)"></div>' +
          '<div class="proj-icon" style="background:' + p.c + '18">' + p.e + '</div>' +
          '<div class="proj-title">' + p.t + '</div>' +
          '<div class="proj-desc">'  + p.d + '</div>' +
          '<div class="tags">'       + tagHTML + '</div>';

        card.addEventListener('mouseenter', function() {
          card.style.boxShadow   = '0 20px 60px ' + p.c + '22';
          card.style.borderColor = p.c + '44';
          ring.classList.add('hov');
        });
        card.addEventListener('mouseleave', function() {
          card.style.boxShadow   = 'none';
          card.style.borderColor = 'var(--gb)';
          ring.classList.remove('hov');
        });

        pg.appendChild(card);
      });
      projObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });

projObs.observe(pg);


/* ─────────────────────────────────────────────────────
   10. RESUME SKILL BAR ANIMATIONS
   The bars start at 0% width. When you scroll to them
   they animate to their real percentage.
   Like:  [░░░░░░░░░░] → [████████░░] 80%
───────────────────────────────────────────────────── */
var barObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(function(bar) {
        var target = bar.style.width; // save real % (e.g. "88%")
        bar.style.width = '0';        // reset to 0 first

        setTimeout(function() {
          bar.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
          bar.style.width = target;   // animate to the real %
        }, 100);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-list-r').forEach(function(el) {
  barObs.observe(el);
});


/* ─────────────────────────────────────────────────────
   11. CONTACT FORM — sends to my email via Formspree
   Steps:
     1. Check all fields are filled correctly
     2. Send to Formspree (they email it to me)
     3. Show success message
     4. Show error if something goes wrong
───────────────────────────────────────────────────── */
document.getElementById('sendBtn').addEventListener('click', function() {
  var name  = document.getElementById('fname').value.trim();
  var email = document.getElementById('femail').value.trim();
  var msg   = document.getElementById('fmsg').value.trim();
  var ok    = true;

  // Clear previous error messages
  ['err-name', 'err-email', 'err-msg'].forEach(function(id) {
    document.getElementById(id).textContent = '';
  });

  // Validate each field
  if (!name) {
    document.getElementById('err-name').textContent = 'Name is required.';
    ok = false;
  }
  if (email.indexOf('@') < 1 || email.indexOf('.') < 3) {
    document.getElementById('err-email').textContent = 'Valid email required.';
    ok = false;
  }
  if (msg.length < 10) {
    document.getElementById('err-msg').textContent = 'Message is too short.';
    ok = false;
  }

  if (ok) {
    var btn = document.getElementById('sendBtn');
    btn.disabled    = true;
    btn.textContent = 'Sending...';

    // POST the form data to Formspree — they handle emailing it to me
    fetch('https://formspree.io/f/xjgazvjb', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({ name: name, email: email, message: msg })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.ok) {
        document.getElementById('formWrap').style.display    = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        btn.disabled    = false;
        btn.textContent = 'Send Message';
        document.getElementById('err-msg').textContent = 'Something went wrong. Please try again.';
      }
    })
    .catch(function() {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      document.getElementById('err-msg').textContent = 'Network error. Please try again.';
    });
  }
});


/* ─────────────────────────────────────────────────────
   12. SHOW / HIDE RESUME SECTION
   Resume is hidden by default to keep page clean.
   Clicking "View Resume" smoothly reveals it.
   Clicking "Hide Resume" fades it back out.
───────────────────────────────────────────────────── */
function toggleResume() {
  var content = document.getElementById('resumeContent');
  var btn     = document.getElementById('resumeToggleBtn');
  var btnText = document.getElementById('resumeBtnText');

  if (content.style.display === 'none' || content.style.display === '') {
    // --- SHOW ---
    content.style.display    = 'block';
    content.style.opacity    = '0';
    content.style.transform  = 'translateY(20px)';
    content.style.transition = 'opacity .5s ease, transform .5s ease';

    // Small delay lets the browser register the starting position before animating
    setTimeout(function() {
      content.style.opacity   = '1';
      content.style.transform = 'translateY(0)';
    }, 50);

    btnText.textContent  = 'Hide Resume';
    btn.style.background = 'linear-gradient(135deg,#6d28d9,#0e7490)';

    // Scroll to the resume after it opens
    setTimeout(function() {
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

  } else {
    // --- HIDE ---
    content.style.transition = 'opacity .4s ease, transform .4s ease';
    content.style.opacity    = '0';
    content.style.transform  = 'translateY(20px)';

    setTimeout(function() {
      content.style.display = 'none';
    }, 400);

    btnText.textContent  = 'View Resume';
    btn.style.background = 'linear-gradient(135deg,#0891b2,#10b981)';
  }
}


/* ─────────────────────────────────────────────────────
   13. DOWNLOAD RESUME AS PDF
   Opens a clean new window with just the resume
   (no dark background, no navbar, no particles).
   Then triggers the browser's print/save-as-PDF dialog.
   
   TIP: In the dialog — turn ON "Background graphics"
   and set paper to A4 for the best result!
───────────────────────────────────────────────────── */
function printResume() {
  var resume = document.getElementById('resumePaper');

  if (!resume) {
    alert('Please click "View Resume" first!');
    return;
  }

  // Open a clean blank window
  var printWin = window.open('', '_blank', 'width=1000,height=800');

  // Build a simple HTML page with just the resume inside
  printWin.document.write('<!DOCTYPE html><html><head>');
  printWin.document.write('<meta charset="UTF-8"/>');
  printWin.document.write('<title>Pruthvi Raj D S - Resume</title>');
  printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">');
  printWin.document.write('<style>');
  printWin.document.write('*{box-sizing:border-box;margin:0;padding:0}');
  printWin.document.write('body{font-family:Syne,sans-serif;background:#fff;color:#1a1a2e}');

  // Copy all styles from this page so resume looks the same
  var styles = document.querySelectorAll('style');
  styles.forEach(function(s) { printWin.document.write(s.innerHTML); });

  printWin.document.write('@page{margin:0;size:A4}');
  printWin.document.write('body{margin:0;padding:0}');
  printWin.document.write('</style></head><body>');
  printWin.document.write(resume.outerHTML);
  printWin.document.write('</body></html>');

  printWin.document.close();
  printWin.focus();

  // Wait for fonts to load (0.8s) then open the print dialog
  setTimeout(function() {
    printWin.print();
    setTimeout(function() { printWin.close(); }, 1000);
  }, 800);
}
