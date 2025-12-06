// LockGram - Interactive Functionality
// ======================================

document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  initSmoothScrolling();
  initVideoControls();
  initScrollAnimations();
  initMobileMenu();
  initNavbarScroll();
  initFAQAccordion();
  initAnalytics();

  console.log('🚀 LockGram app initialized successfully!');
}

/* ---------- Smooth Scrolling for Navigation Links ---------- */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });

        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });
}

/* ---------- Video Controls & Lazy-Load ---------- */
function initVideoControls() {
  const videoContainer = document.querySelector('.video-container');
  const videoIframe = document.querySelector('.video-container iframe');
  if (!videoContainer || !videoIframe) return;

  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const src = videoIframe.src;
        if (!src.includes('autoplay=1')) videoIframe.src = src + '&autoplay=1';
      }
    });
  }, { threshold: 0.5 });
  videoObserver.observe(videoContainer);

  videoContainer.addEventListener('click', () => {
    const curr = videoIframe.src;
    videoIframe.src = curr.includes('autoplay=1')
      ? curr.replace('autoplay=1', 'autoplay=0')
      : curr + '&autoplay=1';
  });
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.feature-card, .testimonial-card, .step, .faq-item'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        const parent = entry.target.parentElement;
        if (parent && (parent.classList.contains('features-grid') ||
                       parent.classList.contains('testimonials-grid'))) {
          const siblings = Array.from(parent.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.animationDelay = `${idx * 0.1}s`;
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

/* ---------- Mobile Menu Toggle ---------- */
function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!navToggle || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
  });
}

/* ---------- Navbar Scroll Effect ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let last = 0;

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    st > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    if (st > last && st > 100) navbar.style.transform = 'translateY(-100%)';
    else navbar.style.transform = 'translateY(0)';
    last = st <= 0 ? 0 : st;
  });
}

/* ---------- FAQ Accordion ---------- */
function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const was = item.classList.contains('active');
      items.forEach(i => i !== item && i.classList.remove('active'));
      item.classList.toggle('active', !was);

      if (typeof gtag !== 'undefined') {
        const h3 = q.querySelector('h3');
        gtag('event', 'faq_interaction', {
          event_category: 'engagement',
          event_label: h3 ? h3.textContent : ''
        });
      }
    });
  });
}

/* ---------- Analytics ---------- */
function initAnalytics() {
  // CTA clicks
  document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', function () {
      const text = this.textContent.trim();
      const type = this.classList.contains('primary') ? 'primary' : 'secondary';
      if (typeof gtag !== 'undefined') gtag('event', 'cta_click', { event_category: 'engagement', event_label: text, button_type: type });
      trackEvent('cta_click', { button_text: text, button_type: type, page_section: getCurrentSection() });
    });
  });

  // Video interaction
  const vc = document.querySelector('.video-container');
  if (vc) vc.addEventListener('click', () => trackEvent('video_interaction', { action: 'play_toggle', page_section: 'hero' }));

  // Scroll depth
  let maxD = 0;
  window.addEventListener('scroll', throttle(() => {
    const st = window.pageYOffset;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.round((st / dh) * 100);
    if (pct > maxD) {
      maxD = pct;
      if (maxD >= 25 && maxD < 50) trackEvent('scroll_depth', { depth: '25%' });
      else if (maxD >= 50 && maxD < 75) trackEvent('scroll_depth', { depth: '50%' });
      else if (maxD >= 75 && maxD < 90) trackEvent('scroll_depth', { depth: '75%' });
      else if (maxD >= 90) trackEvent('scroll_depth', { depth: '90%' });
    }
  }, 1000));
}

/* ---------- Utility ---------- */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const navH = document.querySelector('.navbar')?.offsetHeight || 0;
  window.scrollTo({ top: el.offsetTop - navH, behavior: 'smooth' });
}

function openTelegramApp() {
  trackEvent('telegram_launch', { source: 'cta_button', page_section: getCurrentSection() });
  try {
    if (window.Telegram && window.Telegram.WebApp) window.Telegram.WebApp.expand();
    else window.open('https://t.me/LockGramBot', '_blank');
  } catch {
    window.open('https://t.me/LockGramBot', '_blank');
  }
}

function getCurrentSection() {
  const areas = ['home', 'features', 'guide', 'security', 'faq'];
  const pos = window.pageYOffset + 100;
  for (const a of areas) {
    const sec = document.getElementById(a);
    if (sec && pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) return a;
  }
  return 'unknown';
}

function trackEvent(name, data = {}) {
  console.log(`📊 Event: ${name}`, data);
  if (typeof gtag !== 'undefined') gtag('event', name, data);
  const evts = JSON.parse(localStorage.getItem('lockgram_events') || '[]');
  evts.push({ event: name, data, timestamp: Date.now(), url: window.location.href });
  if (evts.length > 100) evts.splice(0, evts.length - 100);
  localStorage.setItem('lockgram_events', JSON.stringify(evts));
}

function throttle(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function debounce(fn, wait, imm) {
  let t;
  return (...args) => {
    const call = imm && !t;
    clearTimeout(t);
    t = setTimeout(() => { t = null; if (!imm) fn(...args); }, wait);
    if (call) fn(...args);
  };
}

/* ---------- Enhanced UX ---------- */
class LockGramUX {
  constructor() {
    this.init();
  }
  init() {
    this.typing();
    this.particles();
    this.progress();
    this.keys();
  }
  typing() {
    const h = document.querySelector('.hero-title');
    if (!h) return;
    const txt = h.innerHTML;
    const words = txt.split(' ');
    h.innerHTML = '';
    let i = 0;
    const type = () => {
      if (i < words.length) {
        const s = document.createElement('span');
        s.textContent = words[i] + (i < words.length - 1 ? ' ' : '');
        s.style.opacity = '0';
        s.style.transform = 'translateY(20px)';
        h.appendChild(s);
        setTimeout(() => {
          s.style.transition = 'all 0.3s ease';
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        }, 50);
        i++;
        setTimeout(type, 100);
      }
    };
    setTimeout(type, 500);
  }
  particles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.style = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;`;
    hero.appendChild(c);
    const resize = () => {
      c.width = hero.offsetWidth;
      c.height = hero.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const P = [];
    for (let i = 0; i < 50; i++) P.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.1 });
    const anim = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      P.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(anim);
    };
    anim();
  }
  progress() {
    const b = document.createElement('div');
    b.style = `position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg, #00E5FF, #8B5CF6);z-index:9999;transition:width 0.1s ease;`;
    document.body.appendChild(b);
    window.addEventListener('scroll', () => {
      const st = window.pageYOffset;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      b.style.width = Math.min((st / dh) * 100, 100) + '%';
    });
  }
  keys() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        openTelegramApp();
      }
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        scrollToSection('home');
      }
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        scrollToSection('faq');
      }
    });
  }
}

/* ---------- Service Worker ---------- */
class LockGramSW {
  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(r => {
          console.log('🔧 SW registered:', r);
          r.addEventListener('updatefound', () => {
            const w = r.installing;
            w.addEventListener('statechange', () => {
              if (w.state === 'installed' && navigator.serviceWorker.controller) {
                if (confirm('New version available. Reload?')) location.reload();
              }
            });
          });
        })
        .catch(e => console.log('❌ SW fail:', e));
      navigator.serviceWorker.addEventListener('message', e => {
        if (e.data?.type === 'CACHE_UPDATED') console.log('📦 cache updated:', e.data.url);
      });
    }
  }
}

/* ---------- Performance ---------- */
class LockGramPerformance {
  constructor() {
    window.addEventListener('load', () => {
      const nav = performance.getEntriesByType('navigation')[0];
      trackEvent('page_performance', {
        load_time: nav.loadEventEnd - nav.loadEventStart,
        dom_content_loaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        page_load_time: nav.loadEventEnd - nav.fetchStart
      });
    });
    new PerformanceObserver(list => {
      const v = list.getEntries().pop().startTime;
      trackEvent('web_vitals', { metric: 'LCP', value: v });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    new PerformanceObserver(list => {
      list.getEntries().forEach(e => trackEvent('web_vitals', { metric: 'FID', value: e.processingStart - e.startTime }));
    }).observe({ entryTypes: ['first-input'] });
    let cls = 0;
    new PerformanceObserver(list => {
      list.getEntries().forEach(e => { if (!e.hadRecentInput) cls += e.value; });
      trackEvent('web_vitals', { metric: 'CLS', value: cls });
    }).observe({ entryTypes: ['layout-shift'] });
    new PerformanceObserver(list => {
      list.getEntries().forEach(e => {
        if (e.duration > 1000) trackEvent('slow_resource', { name: e.name, duration: e.duration, size: e.transferSize || 0 });
      });
    }).observe({ entryTypes: ['resource'] });
  }
}

/* ---------- Init Enhancements ---------- */
document.addEventListener('DOMContentLoaded', () => {
  new LockGramUX();
  new LockGramSW();
  new LockGramPerformance();
});

/* ---------- Global Error Handlers ---------- */
window.addEventListener('error', e => {
  console.error('🚨 JS Error:', e.error);
  trackEvent('javascript_error', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno });
});
window.addEventListener('unhandledrejection', e => {
  console.error('🚨 Promise Rejection:', e.reason);
  trackEvent('promise_rejection', { reason: e.reason.toString() });
});

/* ---------- Expose Globals ---------- */
window.scrollToSection = scrollToSection;
window.openTelegramApp = openTelegramApp;
window.trackEvent = trackEvent;
