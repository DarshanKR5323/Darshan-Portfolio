/* ===================================================
   VIDEO EDITOR PORTFOLIO — INTERACTIONS & ANIMATIONS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- LOADER ----------
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  // Fallback in case load already fired
  setTimeout(() => loader.classList.add('hidden'), 2000);

  // ---------- CUSTOM CURSOR ----------
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .work-card, .service-card, .testimonial-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '12px';
      dot.style.height = '12px';
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(200,255,0,.6)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '6px';
      dot.style.height = '6px';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(200,255,0,.35)';
    });
  });

  // ---------- NAV SCROLL ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- MOBILE MENU ----------
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('[data-mobile-nav]').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- SCROLL REVEAL ----------
  const reveals = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ---------- COUNTER ANIMATION ----------
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));
        const tick = () => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current < target) requestAnimationFrame(tick);
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---------- PORTFOLIO FILTER ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---------- SMOOTH SCROLL FOR NAV LINKS ----------
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- CONTACT FORM ----------
  // ⚠️ SETUP REQUIRED FOR WHATSAPP (one-time):
  // 1. Save +34 644 71 87 68 in your phone contacts as "CallMeBot"
  // 2. Open WhatsApp and send this message to that number:
  //    "I allow callmebot to send me messages"
  // 3. You'll receive an API key. Replace YOUR_API_KEY below with it.
  const CALLMEBOT_API_KEY = 'YOUR_API_KEY'; // ← Replace with your actual key
  const WHATSAPP_NUMBER = '919036288956';

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !message) {
      alert('Please fill out all fields before sending.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // ---- 1. SEND EMAIL via Formsubmit.co (silent, no new tab) ----
    let emailSuccess = false;
    let emailErrorMsg = '';

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello.darshankr@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          message: message,
          _subject: 'New Portfolio Contact: ' + name,
          _template: 'table'
        })
      });

      const data = await response.json();
      // FormSubmit can return data.success as a boolean or as the string "true" / "false"
      if (response.ok && (data.success === true || data.success === 'true')) {
        emailSuccess = true;
      } else {
        emailErrorMsg = data.message || 'Failed to submit form.';
        console.error('FormSubmit Error:', data);
      }
    } catch (err) {
      console.error('Email network error:', err);
      emailErrorMsg = 'Network error: ' + err.message;
    }

    // ---- 2. SEND WHATSAPP via CallMeBot (silent, no new tab) ----
    if (CALLMEBOT_API_KEY && CALLMEBOT_API_KEY !== 'YOUR_API_KEY') {
      const waText = `📩 New Portfolio Contact\n\n👤 Name: ${name}\n📧 Email: ${email}\n📞 Phone: ${phone}\n💬 Message: ${message}`;
      try {
        await fetch(
          `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(waText)}&apikey=${CALLMEBOT_API_KEY}`,
          { mode: 'no-cors' }
        );
      } catch (err) {
        console.error('WhatsApp error:', err);
      }
    } else {
      console.log('CallMeBot API key not configured, skipping WhatsApp send.');
    }

    // ---- 3. FEEDBACK TO USER ----
    if (emailSuccess) {
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    } else {
      btn.textContent = 'Failed to Send ✗';
      btn.style.background = '#ef4444';
      alert('Email Delivery Issue:\n' + emailErrorMsg);
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
  // ---------- VIDEO PLAYBACK DYNAMICS ----------
  const videoCards = document.querySelectorAll('.card-visual');
  videoCards.forEach(visual => {
    const video = visual.querySelector('.card-video');
    const overlay = visual.querySelector('.card-play-overlay');
    if (video && overlay) {
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Pause other running videos
        document.querySelectorAll('.card-video.playing').forEach(v => {
          if (v !== video) {
            v.pause();
            v.classList.remove('playing');
            if (v.nextElementSibling) v.nextElementSibling.classList.remove('hidden');
            v.removeAttribute('controls');
          }
        });

        video.currentTime = 0;
        video.play();
        video.classList.add('playing');
        overlay.classList.add('hidden');
        video.setAttribute('controls', 'true');
      });
      
      video.addEventListener('pause', () => {
        // Prevent hiding overlay if user is simply scrubbing/seeking
        if (!video.seeking) {
           video.classList.remove('playing');
           overlay.classList.remove('hidden');
           video.removeAttribute('controls');
        }
      });
      
      video.addEventListener('ended', () => {
        video.classList.remove('playing');
        overlay.classList.remove('hidden');
        video.removeAttribute('controls');
      });
    }
  });

  // ---------- TILT EFFECT ON WORK CARDS ----------
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
