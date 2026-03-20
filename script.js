/*
  =====================================================
  script.js — The Brain of Pruthvi's Portfolio Website
  =====================================================
  Controls everything interactive:
    - Custom mouse cursor (dot + ring)
    - Floating particle background
    - Typing animation in hero
    - Scroll reveal animations
    - Skill & project cards
    - Contact form (sends to Gmail via Formspree)
    - Show/Hide resume section
    - Download resume as PDF

  Written by Pruthvi Raj D S
  =====================================================
*/


/* ─────────────────────────────────────────
   1. FOOTER YEAR — auto-updates every year
───────────────────────────────────────── */
document.getElementById('yr').textContent = new Date().getFullYear();


/* ─────────────────────────────────────────
   2. CUSTOM CURSOR
   Small dot follows mouse instantly.
   Bigger ring lazily chases it behind.
   Hidden on touch screens (phones/tablets).
───────────────────────────────────────── */
var dot  = document.getElementById('cur-dot');
var ring = document.getElementById('cur-ring');
var mx = 0, my = 0, rx = 0, ry = 0;

var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouchDevice) {
  dot.style.display  = 'none';
  ring.style.display = 'none';
  document.body.style.cursor = 'auto';
} else {
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });
  document.addEventListener('mouseleave', function() {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function() {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();
}

document.querySelectorAll('a, button, .tl-body, .edu-card, .tl-r-body').forEach(function(el) {
  el.addEventListener('mouseenter', function() { ring.classList.add('hov'); });
  el.addEventListener('mouseleave', function() { ring.classList.remove('hov'); });
});


/* ─────────────────────────────────────────
   3. FLOATING PARTICLES BACKGROUND
   65 tiny dots float around on a canvas.
   Lines connect nearby dots — like stars!
───────────────────────────────────────── */
(function() {
  var cv = document.getElementById('particles');
  var ctx = cv.getContext('2d');
  var pts = [];

  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 65; i++) {
    pts.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.38,
      dy: (Math.random() - 0.5) * 0.38,
      o: Math.random() * 0.45 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(function(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,92,246,' + p.o + ')';
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > cv.width)  p.dx *= -1;
      if (p.y < 0 || p.y > cv.height) p.dy *= -1;
    });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(99,102,241,' + (0.13 * (1 - d / 115)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ─────────────────────────────────────────
   4. NAVBAR — glass effect when scrolled
───────────────────────────────────────── */
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 40);
});


/* ─────────────────────────────────────────
   5. HAMBURGER MENU (mobile)
───────────────────────────────────────── */
var ham = document.getElementById('ham');
var mob = document.getElementById('mobMenu');

ham.addEventListener('click', function() {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});
document.getElementById('mobClose').addEventListener('click', function() {
  ham.classList.remove('open');
  mob.classList.remove('open');
});
document.querySelectorAll('.mob-link').forEach(function(l) {
  l.addEventListener('click', function() {
    ham.classList.remove('open');
    mob.classList.remove('open');
  });
});


/* ─────────────────────────────────────────
   6. TYPING ANIMATION
   Types each title letter by letter,
   then deletes it and types the next one.
───────────────────────────────────────── */
(function() {
  var words = [
    'IoT Engineer',
    'Cloud Architect',
    'DevOps Practitioner',
    'Full-Stack Developer',
    'Embedded Systems Dev'
  ];
  var el = document.getElementById('typed');
  var wi = 0, ci = 0, del = false;

  function tick() {
    var w = words[wi];
    if (!del) {
      el.textContent = w.slice(0, ci + 1);
      if (ci + 1 === w.length) { del = true; setTimeout(tick, 1600); return; }
      ci++; setTimeout(tick, 88);
    } else {
      el.textContent = w.slice(0, ci - 1);
      if (ci - 1 === 0) { del = false; wi = (wi + 1) % words.length; ci = 0; setTimeout(tick, 300); return; }
      ci--; setTimeout(tick, 48);
    }
  }
  tick();
})();


/* ─────────────────────────────────────────
   7. SCROLL REVEAL ANIMATIONS
   Elements fade + slide up when they
   come into view as you scroll.
───────────────────────────────────────── */
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(function(el) { revObs.observe(el); });


/* ─────────────────────────────────────────
   8. SKILL CARDS — built from JS data
───────────────────────────────────────── */
var skills = [
  { e: '&#128268;',       n: 'IoT & Embedded',  s: 'ESP32  &middot;  Arduino  &middot;  Sensors',      c: '#06b6d4' },
  { e: '&#9729;&#65039;', n: 'Cloud Computing', s: 'AWS  &middot;  EC2  &middot;  S3  &middot;  IAM',  c: '#8b5cf6' },
  { e: '&#9881;&#65039;', n: 'DevOps',          s: 'Docker  &middot;  CI/CD  &middot;  Kubernetes',    c: '#10b981' },
  { e: '&#127760;',       n: 'Web Dev',         s: 'HTML  &middot;  CSS  &middot;  JavaScript',        c: '#f59e0b' },
  { e: '&#128013;',       n: 'Python',          s: 'ML  &middot;  Automation  &middot;  Scripts',      c: '#6366f1' },
  { e: '&#128451;',       n: 'Databases',       s: 'SQL  &middot;  Firebase  &middot;  Cloud DB',      c: '#ec4899' },
  { e: '&#128737;&#65039;', n: 'Security',      s: 'IAM  &middot;  VPN  &middot;  Firewalls',          c: '#14b8a6' },
  { e: '&#127959;&#65039;', n: 'IaC / Infra',   s: 'Terraform  &middot;  Ansible  &middot;  Linux',    c: '#f97316' }
];

var sg = document.getElementById('skillsGrid');
var skillObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      skills.forEach(function(s, i) {
        var card = document.createElement('div');
        card.className = 'skill-card';
        card.style.animationDelay = (i * 80) + 'ms';
        card.innerHTML =
          '<div class="skill-icon" style="background:' + s.c + '18">' + s.e + '</div>' +
          '<div class="skill-name">' + s.n + '</div>' +
          '<div class="skill-sub">'  + s.s + '</div>';
        card.addEventListener('mouseenter', function() {
          card.style.boxShadow = '0 0 30px ' + s.c + '44';
          card.style.borderColor = s.c + '44';
          ring.classList.add('hov');
        });
        card.addEventListener('mouseleave', function() {
          card.style.boxShadow = 'none';
          card.style.borderColor = 'var(--gb)';
          ring.classList.remove('hov');
        });
        sg.appendChild(card);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
skillObs.observe(sg);


/* ─────────────────────────────────────────
   9. PROJECT CARDS — built from JS data
───────────────────────────────────────── */
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
        var tagHTML = p.tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');
        card.innerHTML =
          '<div class="proj-glow" style="background:radial-gradient(circle at 50% 0%,' + p.c + '18,transparent 70%)"></div>' +
          '<div class="proj-icon" style="background:' + p.c + '18">' + p.e + '</div>' +
          '<div class="proj-title">' + p.t + '</div>' +
          '<div class="proj-desc">'  + p.d + '</div>' +
          '<div class="tags">'       + tagHTML + '</div>';
        card.addEventListener('mouseenter', function() {
          card.style.boxShadow = '0 20px 60px ' + p.c + '22';
          card.style.borderColor = p.c + '44';
          ring.classList.add('hov');
        });
        card.addEventListener('mouseleave', function() {
          card.style.boxShadow = 'none';
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


/* ─────────────────────────────────────────
   10. RESUME SKILL BAR ANIMATIONS
   Bars animate from 0% to real % on scroll.
───────────────────────────────────────── */
var barObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(function(bar) {
        var target = bar.style.width;
        bar.style.width = '0';
        setTimeout(function() {
          bar.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
          bar.style.width = target;
        }, 100);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-list-r').forEach(function(el) { barObs.observe(el); });


/* ─────────────────────────────────────────
   11. CONTACT FORM
   Sends to pruthviraj462004@gmail.com
   via Formspree when submitted.
───────────────────────────────────────── */
document.getElementById('sendBtn').addEventListener('click', function() {
  var name  = document.getElementById('fname').value.trim();
  var email = document.getElementById('femail').value.trim();
  var msg   = document.getElementById('fmsg').value.trim();
  var ok = true;

  ['err-name', 'err-email', 'err-msg'].forEach(function(id) {
    document.getElementById(id).textContent = '';
  });

  if (!name) { document.getElementById('err-name').textContent = 'Name is required.'; ok = false; }
  if (email.indexOf('@') < 1 || email.indexOf('.') < 3) { document.getElementById('err-email').textContent = 'Valid email required.'; ok = false; }
  if (msg.length < 10) { document.getElementById('err-msg').textContent = 'Message is too short.'; ok = false; }

  if (ok) {
    var btn = document.getElementById('sendBtn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    fetch('https://formspree.io/f/xjgazvjb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: name, email: email, message: msg })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.ok) {
        document.getElementById('formWrap').style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        document.getElementById('err-msg').textContent = 'Something went wrong. Please try again.';
      }
    })
    .catch(function() {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      document.getElementById('err-msg').textContent = 'Network error. Please try again.';
    });
  }
});


/* ─────────────────────────────────────────
   12. SHOW / HIDE RESUME
   Clicking "View Resume" smoothly reveals
   the resume inline on the same page.
   Clicking "Hide Resume" fades it back out.
───────────────────────────────────────── */
function toggleResume() {
  var content = document.getElementById('resumeContent');
  var btn     = document.getElementById('resumeToggleBtn');
  var btnText = document.getElementById('resumeBtnText');
  var isHidden = (content.style.display === 'none' || content.style.display === '');

  if (isHidden) {
    /* ── SHOW ── */
    content.style.display    = 'block';
    content.style.opacity    = '0';
    content.style.transform  = 'translateY(20px)';
    content.style.transition = 'opacity .5s ease, transform .5s ease';

    /* Tiny delay so browser registers start position before animating */
    setTimeout(function() {
      content.style.opacity   = '1';
      content.style.transform = 'translateY(0)';
    }, 50);

    btnText.textContent  = 'Hide Resume';
    btn.style.background = 'linear-gradient(135deg,#6d28d9,#0e7490)';

    /* Scroll to resume smoothly */
    setTimeout(function() {
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

  } else {
    /* ── HIDE ── */
    content.style.transition = 'opacity .4s ease, transform .4s ease';
    content.style.opacity    = '0';
    content.style.transform  = 'translateY(20px)';

    setTimeout(function() { content.style.display = 'none'; }, 400);

    btnText.textContent  = 'View Resume';
    btn.style.background = 'linear-gradient(135deg,#0891b2,#10b981)';
  }
}


/* ─────────────────────────────────────────
   13. DOWNLOAD RESUME AS PDF
   Opens a clean new window with ONLY the
   resume (no dark bg, nav, or particles).
   Automatically opens print/save dialog.

   TIP: In the print dialog set:
     - Background graphics: ON
     - Paper size: A4
     - Margins: None
───────────────────────────────────────── */
function printResume() {
  var resumeContent = document.getElementById('resumeContent');
  var resumePaper   = document.getElementById('resumePaper');

  /* Temporarily show resume content if it is hidden,
     so we can grab its HTML */
  var wasHidden = (resumeContent.style.display === 'none' || resumeContent.style.display === '');
  if (wasHidden) { resumeContent.style.display = 'block'; }

  /* Grab the full resume HTML */
  var resumeHTML = resumePaper.outerHTML;

  /* Restore hidden state */
  if (wasHidden) { resumeContent.style.display = 'none'; }

  /* Open a clean blank window */
  var printWin = window.open('', '_blank', 'width=1000,height=800');
  if (!printWin) {
    /* Pop-up blocked — tell user to allow pop-ups */
    alert('Please allow pop-ups for this site to download the resume as PDF!');
    return;
  }

  /* Write clean resume-only page */
  printWin.document.write('<!DOCTYPE html><html><head>');
  printWin.document.write('<meta charset="UTF-8"/>');
  printWin.document.write('<title>Pruthvi Raj D S — Resume</title>');
  printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">');
  printWin.document.write('<link rel="stylesheet" href="style.css">');
  printWin.document.write('<style>');
  printWin.document.write('*{box-sizing:border-box;margin:0;padding:0}');
  printWin.document.write('body{background:#f1f5f9;display:flex;flex-direction:column;align-items:center;padding:2rem 1rem;font-family:Syne,sans-serif}');
  printWin.document.write('.print-topbar{max-width:900px;width:100%;display:flex;justify-content:flex-end;gap:.75rem;margin-bottom:1rem}');
  printWin.document.write('.print-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:10px;font-weight:700;font-size:.88rem;border:none;cursor:pointer;font-family:Syne,sans-serif;color:#fff}');
  printWin.document.write('.print-btn-dl{background:linear-gradient(135deg,#0891b2,#10b981)}');
  printWin.document.write('.print-btn-cl{background:#64748b}');
  printWin.document.write('.resume-wrap{max-width:900px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.15);margin-bottom:2rem}');
  printWin.document.write('@media print{body{background:#fff;padding:0}.print-topbar{display:none!important}.resume-wrap{border-radius:0;box-shadow:none;max-width:100%}@page{margin:0;size:A4}}');
  printWin.document.write('</style></head><body>');

  /* Buttons bar */
  printWin.document.write('<div class="print-topbar">');
  printWin.document.write('<button class="print-btn print-btn-cl" onclick="window.close()">&#x2715; Close</button>');
  printWin.document.write('<button class="print-btn print-btn-dl" onclick="window.print()">&#8595; Download as PDF</button>');
  printWin.document.write('</div>');

  /* Resume content */
  printWin.document.write('<div class="resume-wrap">' + resumeHTML + '</div>');
  printWin.document.write('</body></html>');
  printWin.document.close();
}
