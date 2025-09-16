/* script.js
   Shared script for nav toggle, typing effect, contact form handling
   Keep this single file referenced at the bottom of every page.
*/

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------
     NAVIGATION (mobile toggle)
     - Uses event delegation and id="menu-toggle"
     - Adds/removes .show on .main-nav
  ------------------------- */
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', nav.classList.contains('show'));
    });

    // close nav on link click (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('show')) nav.classList.remove('show');
      });
    });

    // ensure nav hidden on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 995 && nav.classList.contains('show')) nav.classList.remove('show');
    });
  }

  /* -------------------------
     TYPING EFFECT (home)
     - Non-blocking, small tic rate for smoothness
  ------------------------- */
  const typingSpan = document.querySelector('.typing-text span');
  const roles = ['Web Designer', 'CPU-HARDWARE EXPERT', 'STUDENT' , 'FRONT-END WEB DEV'];

  if (typingSpan) {
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    const DELAY_NEXT = 800;
    const TYPING_SPEED = 90;
    const DELETING_SPEED = 50;

    (function tick() {
      const current = roles[roleIndex];
      if (isDeleting) {
        charIndex--;
        typingSpan.textContent = current.substring(0, charIndex);
        if (charIndex <= 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
        setTimeout(tick, DELETING_SPEED);
      } else {
        charIndex++;
        typingSpan.textContent = current.substring(0, charIndex);
        if (charIndex >= current.length) {
          isDeleting = true;
          setTimeout(tick, DELAY_NEXT);
          return;
        }
        setTimeout(tick, TYPING_SPEED);
      }
    })();
  }

  /* -------------------------
     CONTACT FORM (contact.html)
     - Posts to /api/contact (expects JSON)
     - If server unreachable or non-200, falls back to mailto:
  ------------------------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const fallbackEmail = 'sidweb397@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // gather values
      const name = (form.name.value || '').trim();
      const email = (form.email.value || '').trim();
      const subject = (form.subject.value || '').trim();
      const message = (form.message.value || '').trim();

      // basic validation
      if (!name || !email || !message) {
        showStatus('Please fill required fields.', 'error');
        return;
      }

      // disable submit
      const submitBtn = form.querySelector('button[type="submit"]');
      const previous = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
      }

      // payload
      const payload = { name, email, subject, message };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // if server returns ok response
        if (res.ok) {
          const json = await res.json().catch(() => ({ ok: true }));
          if (json && json.ok !== false) {
            showStatus('Message sent — thank you!', 'success');
            form.reset();
          } else {
            // server side returned error or invalid body
            showStatus('Server error — opening email client.', 'error');
            fallbackToMail(payload);
          }
        } else {
          // non-200 -> fallback
          showStatus('Could not send (server). Opening email client...', 'error');
          fallbackToMail(payload);
        }
      } catch (err) {
        // network error -> fallback
        showStatus('Network error — opening email client...', 'error');
        fallbackToMail(payload);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = previous;
        }
        // clear status after 6s
        setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 6000);
      }
    });
  }

  function showStatus(text, type) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.style.color = (type === 'success') ? 'var(--accent)' : '#ff6b6b';
  }

  function fallbackToMail({ name, email, subject, message }) {
    const mailSubject = encodeURIComponent(subject || `Contact from ${name || 'Website'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:${fallbackEmail}?subject=${mailSubject}&body=${body}`;
    // open user mail client
    window.location.href = mailto;
  }
});
