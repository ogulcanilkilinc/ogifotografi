/* ogifotografi — main.js */

document.addEventListener('DOMContentLoaded', () => {
  // ---- 0. Brand (ogifotografi) logosuna tıklayınca en üste git ----
  const brandLinks = document.querySelectorAll('.brand');
  brandLinks.forEach(brand => {
    brand.addEventListener('click', (e) => {
      const isHomePage = window.location.pathname.endsWith('index.html') ||
                         window.location.pathname.endsWith('/') ||
                         !window.location.pathname.includes('.html');
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash) {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        }
      }
    });
  });

  // ---- 1. Mobil menü ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- 2. Galeri filtresi ----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const photoCards = document.querySelectorAll('.photo-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      photoCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden-card', !match);
      });
    });
  });

  // ---- 3. İletişim formu: Web3Forms ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formNote = document.getElementById('formNote');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Gönderiliyor...';
      submitBtn.disabled = true;
      
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        if (data.success) {
          formNote.textContent = '✓ Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.';
          formNote.style.color = 'var(--accent)';
          contactForm.reset();
        } else {
          formNote.textContent = '✗ Bir hata oluştu. Lütfen tekrar deneyin veya doğrudan e-posta gönderin.';
          formNote.style.color = '#c0392b';
        }
      } catch (error) {
        formNote.textContent = '✗ Bağlantı hatası. Lütfen tekrar deneyin.';
        formNote.style.color = '#c0392b';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // ---- 4. Footer yılı ----
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- 5. Scroll reveal (IntersectionObserver) ----
  const revealTargets = document.querySelectorAll(
    '.section-head, .photo-card, .roadmap-step, .about-photo, .about-text, .contact-form, .contact-side'
  );
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  // ---- 6. Scroll-spy: aktif nav linkini vurgula (yalnızca sayfa-içi # linkleri) ----
  const spySections = ['galeri', 'hakkimda', 'iletisim']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const anchorNavLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ('IntersectionObserver' in window && spySections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          anchorNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    spySections.forEach(sec => spyObserver.observe(sec));
  }

  // ---- 7. Lightbox ile İleri / Geri Gezinme ----
  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxExif = document.getElementById('lightboxExif');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentCardIndex = -1;
  let visibleCards = [];

  function getVisiblePhotoCards() {
    return Array.from(document.querySelectorAll('.photo-card')).filter(card => {
      return !card.classList.contains('hidden-card') && card.offsetParent !== null;
    });
  }

  function showCardAtIndex(index) {
    visibleCards = getVisiblePhotoCards();
    if (visibleCards.length === 0) return;

    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;

    currentCardIndex = index;
    const card = visibleCards[currentCardIndex];

    const title = card.querySelector('.cap-title')?.textContent || '';
    const exif = card.querySelector('.cap-exif')?.textContent || '';
    const img = card.querySelector('img');
    const photoContainer = lightbox.querySelector('.lightbox-photo');

    if (photoContainer) {
      if (img) {
        photoContainer.classList.remove('has-ph');
        photoContainer.innerHTML = `<img src="${img.src}" alt="${title}" style="max-width:100%; max-height:75vh; height:auto; width:auto; object-fit:contain; display:block; margin:0 auto; border-radius:6px 6px 0 0;">`;
      } else {
        photoContainer.classList.add('has-ph');
        photoContainer.innerHTML = `<span class="ph-icon">📷</span><span class="ph-label">Fotoğraf eklenecek</span>`;
      }
    }

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxExif) lightboxExif.textContent = exif;
    lightbox.classList.add('open');
  }

  if (lightbox && lightboxTitle && lightboxExif) {
    document.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', () => {
        visibleCards = getVisiblePhotoCards();
        const cardIndex = visibleCards.indexOf(card);
        showCardAtIndex(cardIndex >= 0 ? cardIndex : 0);
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showCardAtIndex(currentCardIndex - 1); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showCardAtIndex(currentCardIndex + 1); });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showCardAtIndex(currentCardIndex - 1);
      if (e.key === 'ArrowRight') showCardAtIndex(currentCardIndex + 1);
    });
  }

  // ---- 8. Instagram embed işleme (embed.js yüklendiyse) ----
  window.addEventListener('load', () => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  });

  // ---- 9. Floating Yukarı Çık (Scroll to top) Butonu ----
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- 10. E-posta linkleri için otomatik kopyalama ve Toast bildirimi ----
  let toastEl = document.getElementById('toastNotification');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toastNotification';
    toastEl.className = 'toast-notification';
    document.body.appendChild(toastEl);
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailLinks.forEach(link => {
    link.addEventListener('click', () => {
      const email = link.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('✓ E-posta kopyalandı: ' + email);
        }).catch(() => {});
      }
    });
  });
});
