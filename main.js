/* ════════════════════════════════════════
   SOULROOT HEALING — main.js
   ════════════════════════════════════════ */

/* ── STEP 1: Paste your Google Apps Script Web App URL below ──
   After deploying your Apps Script (see Code.gs), replace the
   placeholder URL with your actual deployment URL.             */
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwuvr5q-hKS0amGQdYGE4txuaVOE227T5SarSacT1agPZpwqt4v5to_W0gFI2t8MOU/exec';


   /* ════════════════════════════════════════
      NAV — add .scrolled on scroll
      ════════════════════════════════════════ */
   const nav = document.getElementById('nav');
   window.addEventListener('scroll', () => {
     nav.classList.toggle('scrolled', window.scrollY > 40);
   });
   
   
   /* ════════════════════════════════════════
      HAMBURGER / MOBILE MENU
      ════════════════════════════════════════ */
   const hamburgerBtn = document.getElementById('hamburgerBtn');
   const mobileMenu   = document.getElementById('mobileMenu');
   
   hamburgerBtn.addEventListener('click', () => {
     const isOpen = mobileMenu.classList.toggle('open');
     hamburgerBtn.classList.toggle('open', isOpen);
     document.body.style.overflow = isOpen ? 'hidden' : '';
   });
   
   function closeMenu() {
     mobileMenu.classList.remove('open');
     hamburgerBtn.classList.remove('open');
     document.body.style.overflow = '';
   }
   
   
   /* ════════════════════════════════════════
      SCROLL REVEAL (IntersectionObserver)
      ════════════════════════════════════════ */
   const revealEls = document.querySelectorAll('.reveal');
   const revealObserver = new IntersectionObserver(
     (entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting) {
           entry.target.classList.add('visible');
           revealObserver.unobserve(entry.target);
         }
       });
     },
     { threshold: 0.12 }
   );
   revealEls.forEach((el) => revealObserver.observe(el));
   
   
   /* ════════════════════════════════════════
      FORM SUBMISSION → GOOGLE SHEETS
      ════════════════════════════════════════ */
   async function submitForm() {
     // ── 1. Collect values ──
     const firstName = document.getElementById('firstName').value.trim();
     const lastName  = document.getElementById('lastName').value.trim();
     const email     = document.getElementById('email').value.trim();
     const phone     = document.getElementById('phone').value.trim();
     const service   = document.getElementById('service').value;
     const message   = document.getElementById('message').value.trim();
   
     // ── 2. Validate required fields ──
     if (!firstName)                     { shakeField('firstName'); return; }
     if (!email || !email.includes('@')) { shakeField('email');     return; }
   
     // ── 3. Show loading state on button ──
     const btn = document.querySelector('.form-submit');
     const originalText = btn.textContent;
     btn.textContent = 'Sending…';
     btn.disabled    = true;
     btn.style.opacity = '0.7';
   
     // ── 4. Build payload ──
     const payload = {
       firstName,
       lastName,
       email,
       phone    : phone   || '—',
       service  : service || '—',
       message  : message || '—',
       submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
     };
   
     // ── 5. Send to Google Apps Script ──
     try {
       await fetch(APPS_SCRIPT_URL, {
         method : 'POST',
         // Apps Script requires no-cors for cross-origin POST from plain HTML
         mode   : 'no-cors',
         headers: { 'Content-Type': 'application/json' },
         body   : JSON.stringify(payload)
       });
   
       // no-cors means we can't read the response status, but if fetch didn't
       // throw, the request was dispatched successfully.
       showSuccess();
   
     } catch (err) {
       console.error('Submission error:', err);
       btn.textContent  = originalText;
       btn.disabled     = false;
       btn.style.opacity = '1';
       showError();
     }
   }
   
   /* ── Show success panel ── */
   function showSuccess() {
     document.getElementById('formContent').style.display = 'none';
     document.getElementById('formSuccess').classList.add('show');
     // Hide any previous error banner
     const errBanner = document.getElementById('formError');
     if (errBanner) errBanner.remove();
   }
   
   /* ── Show inline error banner ── */
   function showError() {
     if (document.getElementById('formError')) return; // already shown
     const banner = document.createElement('p');
     banner.id = 'formError';
     banner.style.cssText = `
       color: #b94a3a;
       background: #fdf0ee;
       border: 1px solid #f5c6c0;
       border-radius: 8px;
       padding: 0.7rem 1rem;
       font-size: 0.85rem;
       margin-top: 0.8rem;
       text-align: center;
     `;
     banner.textContent = '⚠️ Something went wrong. Please try again or email us directly.';
     document.querySelector('.form-submit').insertAdjacentElement('afterend', banner);
   }
   
   
   /* ════════════════════════════════════════
      SHAKE INVALID FIELD
      ════════════════════════════════════════ */
   function shakeField(id) {
     const el = document.getElementById(id);
     el.style.borderColor = 'var(--terracotta)';
     el.style.animation   = 'none';
     void el.offsetHeight;                   // force reflow
     el.style.animation   = 'shake 0.4s ease';
     setTimeout(() => { el.style.animation = ''; }, 500);
   }
   
   
   /* ════════════════════════════════════════
      SMOOTH ANCHOR SCROLL (with nav offset)
      ════════════════════════════════════════ */
   document.querySelectorAll('a[href^="#"]').forEach((link) => {
     link.addEventListener('click', (e) => {
       const target = document.querySelector(link.getAttribute('href'));
       if (target) {
         e.preventDefault();
         const offset = nav.offsetHeight + 16;
         window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
       }
     });
   });