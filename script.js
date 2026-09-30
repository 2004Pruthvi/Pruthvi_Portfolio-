/*
  =====================================================
  Pruthvi Raj D S — DevOps & Cloud Engineer Portfolio
  =====================================================
  Interactive Features:
    - Custom cursor (dot & smooth lagging ring)
    - Animated starfield particle canvas
    - Scroll progress indicator
    - Dynamic DevOps typing animation
    - Scroll reveal intersection observers
    - Interactive 10-step DevOps Lifecycle Explorer
    - One-click copy email button with visual feedback
    - Contact form handling with validation
    - Interactive Resume reveal & print-to-PDF engine
  =====================================================
*/

(function() {
  'use strict';

  /* ─────────────────────────────────────────
     1. FOOTER CURRENT YEAR
  ───────────────────────────────────────── */
  var yrEl = document.getElementById('yr');
  if (yrEl) {
    yrEl.textContent = new Date().getFullYear();
  }

  /* ─────────────────────────────────────────
     2. SCROLL PROGRESS INDICATOR
  ───────────────────────────────────────── */
  var scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  }, { passive: true });

  /* ─────────────────────────────────────────
     3. CUSTOM CURSOR
  ───────────────────────────────────────── */
  var dot = document.getElementById('cur-dot');
  var ring = document.getElementById('cur-ring');
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;

  if (isTouch || !dot || !ring) {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
    document.body.style.cursor = 'auto';
  } else {
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    document.addEventListener('mouseleave', function() {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function() {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    (function loop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();

    // Hover effects for all interactive elements
    var hoverTargets = 'a, button, .pipe-node, .tech-category-card, .proj-card, .project-featured-card, .tc-card, .info-metric-card, .edu-card-modern';
    document.querySelectorAll(hoverTargets).forEach(function(el) {
      el.addEventListener('mouseenter', function() { ring.classList.add('hov'); });
      el.addEventListener('mouseleave', function() { ring.classList.remove('hov'); });
    });
  }

  /* ─────────────────────────────────────────
     4. PARTICLES BACKGROUND CANVAS
  ───────────────────────────────────────── */
  (function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var pts = [];
    var count = 55;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (var i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.4,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        o: Math.random() * 0.45 + 0.15
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, ' + p.o + ')';
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        for (var j = i + 1; j < pts.length; j++) {
          var p2 = pts[j];
          var dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(6, 182, 212, ' + (0.12 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  })();

  /* ─────────────────────────────────────────
     5. NAVBAR SCROLL GLASS EFFECT
  ───────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });

  /* ─────────────────────────────────────────
     6. MOBILE MENU
  ───────────────────────────────────────── */
  var ham = document.getElementById('ham');
  var mobMenu = document.getElementById('mobMenu');
  var mobClose = document.getElementById('mobClose');

  if (ham && mobMenu) {
    function toggleMobileMenu() {
      var isOpen = mobMenu.classList.toggle('open');
      ham.classList.toggle('open');
      ham.setAttribute('aria-expanded', isOpen);
      mobMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    ham.addEventListener('click', toggleMobileMenu);
    if (mobClose) mobClose.addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.mob-link').forEach(function(link) {
      link.addEventListener('click', function() {
        mobMenu.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        mobMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     7. HERO TYPING ANIMATION (DevOps Roles)
  ───────────────────────────────────────── */
  (function initTyping() {
    var words = [
      'DevOps Engineer',
      'Cloud Engineer',
      'CI/CD & Kubernetes Specialist',
      'AWS Infrastructure Builder',
      'DevSecOps Practitioner'
    ];
    var el = document.getElementById('typed');
    if (!el) return;

    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typeStep() {
      var currentWord = words[wordIndex];
      if (!isDeleting) {
        el.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeStep, 1700);
          return;
        }
        setTimeout(typeStep, 80);
      } else {
        el.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(typeStep, 350);
          return;
        }
        setTimeout(typeStep, 45);
      }
    }
    typeStep();
  })();

  /* ─────────────────────────────────────────
     8. SCROLL REVEAL OBSERVER
  ───────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     9. INTERACTIVE DEVOPS LIFECYCLE (10 Steps)
  ───────────────────────────────────────── */
  var pipelineData = {
    1: {
      badge: 'STAGE 1 OF 10 &middot; SOURCE CONTROL',
      title: 'Code & Feature Branching',
      desc: 'Developers write application features and infrastructure code locally in Git, adhere to branch protection rules, and run local linting and unit tests before staging changes.',
      techs: ['Git', 'Feature Branches', 'Conventional Commits', 'Local Tests']
    },
    2: {
      badge: 'STAGE 2 OF 10 &middot; REMOTE REPOSITORY',
      title: 'GitHub & Webhook Automation',
      desc: 'Code pushed to GitHub triggers automated webhooks configured on repository events (push, pull request) to initiate the continuous integration pipeline instantaneously.',
      techs: ['GitHub', 'Webhooks', 'Pull Requests', 'Branch Protection']
    },
    3: {
      badge: 'STAGE 3 OF 10 &middot; CI ORCHESTRATION',
      title: 'Jenkins Declarative Pipelines',
      desc: 'Jenkins server checks out source code, sets up execution agents, injects credentials securely from Jenkins credentials store, and executes pipeline stages in order.',
      techs: ['Jenkins', 'Declarative Jenkinsfile', 'Agent Nodes', 'Credentials Manager']
    },
    4: {
      badge: 'STAGE 4 OF 10 &middot; BUILD & COMPILE',
      title: 'Maven Build & Unit Testing',
      desc: 'Executes mvn clean compile test package to compile Java classes, run automated unit test suites, and package lean deployable artifacts (.war / .jar).',
      techs: ['Maven', 'Unit Tests', 'Artifact Packaging', 'Dependency Management']
    },
    5: {
      badge: 'STAGE 5 OF 10 &middot; CODE QUALITY',
      title: 'SonarQube Quality Gate',
      desc: 'Analyzes code for bugs, vulnerabilities, code smells, and test coverage. If Quality Gate rules fail, the pipeline immediately halts to prevent technical debt.',
      techs: ['SonarQube Scanner', 'Quality Gates', 'Static Analysis', 'Code Smells']
    },
    6: {
      badge: 'STAGE 6 OF 10 &middot; CONTAINERIZATION',
      title: 'Docker Multi-Stage Build',
      desc: 'Builds reproducible, lean container images using multi-stage Dockerfiles. Separates build dependencies from runtime image to ensure minimal attack surface.',
      techs: ['Docker', 'Multi-Stage Build', 'Alpine / Slim Base', 'Image Tagging']
    },
    7: {
      badge: 'STAGE 7 OF 10 &middot; VULNERABILITY SCANNING',
      title: 'Trivy Container Security Scan',
      desc: 'Trivy scans container layers, base OS packages, and language dependencies for known CVEs. Critical vulnerabilities fail the build before image registry upload.',
      techs: ['Trivy', 'CVE Scanner', 'DevSecOps', 'Security Policy']
    },
    8: {
      badge: 'STAGE 8 OF 10 &middot; ARTIFACT REGISTRY',
      title: 'Amazon ECR Image Registry',
      desc: 'Authenticates with AWS CLI and pushes immutable, tagged Docker containers to Amazon Elastic Container Registry (ECR) with KMS encryption and image scanning enabled.',
      techs: ['Amazon ECR', 'AWS CLI', 'Immutable Tags', 'KMS Encryption']
    },
    9: {
      badge: 'STAGE 9 OF 10 &middot; CLOUD DEPLOYMENT',
      title: 'Amazon EKS & Kubernetes Rollout',
      desc: 'Applies updated Kubernetes Deployment manifests to Amazon EKS cluster with 2 replicas, ConfigMaps, Secrets, and readiness probes for zero-downtime rolling updates.',
      techs: ['Amazon EKS', 'Kubectl', 'Rolling Update', 'Readiness Probes', 'Self-Healing']
    },
    10: {
      badge: 'STAGE 10 OF 10 &middot; OBSERVABILITY',
      title: 'Monitoring & Health Telemetry',
      desc: 'Continuous health verification with AWS ELB health checks (HTTP 200), Amazon CloudWatch alarms, Prometheus cluster scraping, and Grafana dashboard visualization.',
      techs: ['Amazon CloudWatch', 'Prometheus', 'Grafana', 'ELB Health Checks (HTTP 200)']
    }
  };

  var pipeNodes = document.querySelectorAll('.pipe-node');
  var pipeBadge = document.getElementById('pipeBadge');
  var pipeTitle = document.getElementById('pipeTitle');
  var pipeDesc = document.getElementById('pipeDesc');
  var pipeTechs = document.getElementById('pipeTechs');

  function selectPipelineStep(stepNum) {
    pipeNodes.forEach(function(node) {
      node.classList.toggle('active', parseInt(node.getAttribute('data-step'), 10) === stepNum);
    });

    var data = pipelineData[stepNum];
    if (data && pipeBadge && pipeTitle && pipeDesc && pipeTechs) {
      pipeBadge.innerHTML = data.badge;
      pipeTitle.textContent = data.title;
      pipeDesc.textContent = data.desc;
      pipeTechs.innerHTML = data.techs.map(function(t) {
        return '<span class="psd-pill">' + t + '</span>';
      }).join('');
    }
  }

  pipeNodes.forEach(function(node) {
    node.addEventListener('click', function() {
      var step = parseInt(this.getAttribute('data-step'), 10);
      selectPipelineStep(step);
    });
  });

  /* ─────────────────────────────────────────
     10. COPY EMAIL BUTTON INTERACTION
  ───────────────────────────────────────── */
  var copyBtn = document.getElementById('copyEmailBtn');
  var copyFeedback = document.getElementById('copyFeedback');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      var email = 'pruthviraj462004@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function() {
          showCopied();
        }).catch(function() {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });

    function showCopied() {
      copyBtn.classList.add('copied');
      if (copyFeedback) copyFeedback.textContent = 'Copied!';
      setTimeout(function() {
        copyBtn.classList.remove('copied');
        if (copyFeedback) copyFeedback.textContent = 'Copy';
      }, 2500);
    }

    function fallbackCopy(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showCopied();
      } catch (err) {
        window.location.href = 'mailto:' + text;
      }
      document.body.removeChild(textArea);
    }
  }

  /* ─────────────────────────────────────────
     11. CONTACT FORM HANDLING
  ───────────────────────────────────────── */
  var contactForm = document.getElementById('contactForm');
  var sendBtn = document.getElementById('sendBtn');
  if (contactForm && sendBtn) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('fname').value.trim();
      var email = document.getElementById('femail').value.trim();
      var msg = document.getElementById('fmsg').value.trim();
      var ok = true;

      ['err-name', 'err-email', 'err-msg'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '';
      });

      if (!name) {
        document.getElementById('err-name').textContent = 'Please enter your name.';
        ok = false;
      }
      if (!email || email.indexOf('@') < 1 || email.indexOf('.') < 3) {
        document.getElementById('err-email').textContent = 'Please enter a valid email address.';
        ok = false;
      }
      if (!msg || msg.length < 10) {
        document.getElementById('err-msg').textContent = 'Message should be at least 10 characters.';
        ok = false;
      }

      if (ok) {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

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
            // Formspree fallback to mailto
            window.location.href = 'mailto:pruthviraj462004@gmail.com?subject=' + encodeURIComponent('DevOps Inquiry from ' + name) + '&body=' + encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')');
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Message';
          }
        })
        .catch(function() {
          // Network fallback to mailto
          window.location.href = 'mailto:pruthviraj462004@gmail.com?subject=' + encodeURIComponent('DevOps Inquiry from ' + name) + '&body=' + encodeURIComponent(msg + '\n\nFrom: ' + name + ' (' + email + ')');
          sendBtn.disabled = false;
          sendBtn.textContent = 'Send Message';
        });
      }
    });
  }

  /* ─────────────────────────────────────────
     12. TOGGLE RESUME INLINE VIEW
  ───────────────────────────────────────── */
  window.toggleResume = function() {
    var content = document.getElementById('resumeContent');
    var btnText = document.getElementById('resumeBtnText');
    if (!content) return;

    var isHidden = (content.style.display === 'none' || content.style.display === '');
    if (isHidden) {
      content.style.display = 'block';
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
      content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      setTimeout(function() {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 30);

      if (btnText) btnText.textContent = 'Hide Interactive Resume';
      setTimeout(function() {
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    } else {
      content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      content.style.opacity = '0';
      content.style.transform = 'translateY(15px)';

      setTimeout(function() {
        content.style.display = 'none';
      }, 300);

      if (btnText) btnText.textContent = 'View Interactive Resume';
    }
  };

  /* ─────────────────────────────────────────
     13. PRINT RESUME (Clean Window Engine)
  ───────────────────────────────────────── */
  window.printResume = function() {
    var resumeContent = document.getElementById('resumeContent');
    var resumePaper = document.getElementById('resumePaper');
    if (!resumePaper) return;

    var wasHidden = (resumeContent && (resumeContent.style.display === 'none' || resumeContent.style.display === ''));
    if (wasHidden) {
      resumeContent.style.display = 'block';
    }

    var resumeHTML = resumePaper.outerHTML;

    if (wasHidden) {
      resumeContent.style.display = 'none';
    }

    var printWin = window.open('', '_blank', 'width=1000,height=800');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write('<!DOCTYPE html><html><head>');
    printWin.document.write('<meta charset="UTF-8"/>');
    printWin.document.write('<title>Pruthvi Raj D S — DevOps & Cloud Engineer Resume</title>');
    printWin.document.write('<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">');
    printWin.document.write('<link rel="stylesheet" href="style.css">');
    printWin.document.write('<style>');
    printWin.document.write('*{box-sizing:border-box;margin:0;padding:0}');
    printWin.document.write('body{background:#f1f5f9;padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center;font-family:"Inter",sans-serif;color:#0f172a}');
    printWin.document.write('.print-topbar{max-width:920px;width:100%;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.75rem;margin-bottom:1rem;background:#fff;padding:.85rem 1.25rem;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,.08)}');
    printWin.document.write('.print-topbar-info{font-size:.84rem;font-weight:600;color:#0f172a}');
    printWin.document.write('.print-topbar-btns{display:flex;gap:.6rem;flex-wrap:wrap}');
    printWin.document.write('.print-btn{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1.15rem;border-radius:7px;font-weight:700;font-size:.82rem;border:none;cursor:pointer;text-decoration:none;color:#fff}');
    printWin.document.write('.print-btn-dl{background:linear-gradient(135deg,#0891b2,#10b981)}');
    printWin.document.write('.print-btn-print{background:linear-gradient(135deg,#6366f1,#8b5cf6)}');
    printWin.document.write('.print-btn-cl{background:#64748b}');
    printWin.document.write('.resume-paper{box-shadow:0 8px 30px rgba(0,0,0,.15);border-radius:12px;overflow:hidden;max-width:920px;width:100%;background:#fff}');
    printWin.document.write('@page{size:A4 portrait;margin:5mm 7mm}');
    printWin.document.write('@media print{');
    printWin.document.write('body{background:#fff!important;padding:0!important;font-size:11px!important;line-height:1.35!important;overflow:hidden!important}');
    printWin.document.write('.print-topbar{display:none!important}');
    printWin.document.write('.resume-paper{box-shadow:none!important;border-radius:0!important;max-width:100%!important;margin:0!important;page-break-inside:avoid!important;break-inside:avoid!important}');
    printWin.document.write('.r-header{padding:.75rem 1.1rem!important;gap:1rem!important;background:#0f172a!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.r-photo-ring{width:56px!important;height:56px!important;padding:2px!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.r-name{font-size:1.35rem!important;line-height:1.1!important;margin-bottom:.15rem!important;color:#fff!important}');
    printWin.document.write('.r-role{font-size:.72rem!important;margin-top:.1rem!important;color:#a78bfa!important}');
    printWin.document.write('.r-contacts{margin-top:.35rem!important;gap:.25rem .8rem!important}');
    printWin.document.write('.r-contact-item{font-size:.65rem!important;color:#cbd5e1!important}');
    printWin.document.write('.r-contact-item svg{width:10px!important;height:10px!important}');
    printWin.document.write('.r-body{grid-template-columns:1fr 2.15fr!important;background:#fff!important}');
    printWin.document.write('.r-left{padding:.75rem .85rem!important;background:#f8fafc!important;border-right:1px solid #e2e8f0!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.r-right{padding:.75rem 1rem!important;background:#fff!important}');
    printWin.document.write('.r-sec-title{font-size:.58rem!important;margin-bottom:.4rem!important;padding-bottom:.2rem!important;letter-spacing:.12em!important;color:#4338ca!important;border-bottom:1.5px solid #e0e7ff!important}');
    printWin.document.write('.r-section{margin-bottom:.6rem!important}');
    printWin.document.write('.r-objective{font-size:.68rem!important;line-height:1.38!important;padding:.45rem .65rem!important;margin-bottom:.65rem!important;border-left:2.5px solid #10b981!important;background:#f0fdf4!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.skill-chips{gap:.2rem!important}');
    printWin.document.write('.chip{font-size:.55rem!important;padding:.08rem .35rem!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.edu-list{gap:.45rem!important}');
    printWin.document.write('.edu-card{padding:.4rem .55rem!important;margin-bottom:0!important;border-left:2.5px solid #4338ca!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.edu-year{font-size:.52rem!important;margin-bottom:.1rem!important}');
    printWin.document.write('.edu-degree{font-size:.68rem!important;line-height:1.2!important}');
    printWin.document.write('.edu-school{font-size:.62rem!important;margin-top:.1rem!important}');
    printWin.document.write('.edu-uni{font-size:.56rem!important;margin-top:.05rem!important}');
    printWin.document.write('.tl-list-r{gap:.65rem!important}');
    printWin.document.write('.tl-r-item{gap:.6rem!important}');
    printWin.document.write('.tl-r-dot{width:7px!important;height:7px!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.tl-r-line{min-height:15px!important}');
    printWin.document.write('.tl-r-header{margin-bottom:.1rem!important}');
    printWin.document.write('.tl-r-title{font-size:.76rem!important;line-height:1.25!important}');
    printWin.document.write('.tl-r-date{font-size:.55rem!important;padding:.06rem .3rem!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.tl-r-org{font-size:.65rem!important;margin-bottom:.2rem!important}');
    printWin.document.write('.tl-r-desc{font-size:.65rem!important;line-height:1.35!important}');
    printWin.document.write('.tl-r-tags{margin-top:.25rem!important;gap:.2rem!important}');
    printWin.document.write('.r-tag{font-size:.52rem!important;padding:.06rem .3rem!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.declaration{margin-top:.6rem!important;padding:.45rem .65rem!important;gap:.5rem!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}');
    printWin.document.write('.decl-text{font-size:.6rem!important;line-height:1.3!important}');
    printWin.document.write('.decl-sig{font-size:.8rem!important}');
    printWin.document.write('}');
    printWin.document.write('</style></head><body>');
    printWin.document.write('<div class="print-topbar">');
    printWin.document.write('<div class="print-topbar-info">📄 Pruthvi Raj D S — Resume</div>');
    printWin.document.write('<div class="print-topbar-btns">');
    printWin.document.write('<a href="Pruthvi_DevOps_Resume.pdf" download="Pruthvi_DevOps_Resume.pdf" class="print-btn print-btn-dl">⬇ Download PDF</a>');
    printWin.document.write('<button class="print-btn print-btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>');
    printWin.document.write('<button class="print-btn print-btn-cl" onclick="window.close()">✕ Close</button>');
    printWin.document.write('</div></div>');
    printWin.document.write(resumeHTML);
    printWin.document.write('</body></html>');
    printWin.document.close();
  };

})();
