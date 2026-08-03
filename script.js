/*=========================================================
    SHIRA ONI INTERACTIVE — SCRIPT.JS
=========================================================*/

document.addEventListener('DOMContentLoaded', () => {

  /*==============================
      PRELOADER
  ==============================*/
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // fallback in case load event already fired / is slow
    setTimeout(() => loader.classList.add('hidden'), 2200);
  }

  /*==============================
      CUSTOM CURSOR
  ==============================*/
  const cursor = document.querySelector('.cursor');
  if (cursor && matchMedia('(hover:hover)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const raf = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(raf);
    };
    raf();
    document.querySelectorAll('a, button, .game-card, .pillar, .info-box').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  /*==============================
      SAKURA PETALS
  ==============================*/
  const petalField = document.getElementById('petals');
  if (petalField) {
    const spawnPetal = () => {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const startX = Math.random() * window.innerWidth;
      const duration = 8 + Math.random() * 8;
      const size = 8 + Math.random() * 8;
      petal.style.left = startX + 'px';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.animationDuration = duration + 's';
      petalField.appendChild(petal);
      setTimeout(() => petal.remove(), duration * 1000);
    };
    setInterval(spawnPetal, 900);
    for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 300);
  }

  /*==============================
      HEADER / MOBILE MENU
  ==============================*/
  const header = document.querySelector('header');
  const navList = document.querySelector('nav ul');
  const menuBtn = document.querySelector('.menu');

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => navList.classList.toggle('active'));
    navList.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navList.classList.remove('active'))
    );
  }

  // mark active nav link by current page
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /*==============================
      SCROLL REVEAL + SEAL STAMP
  ==============================*/
  const revealEls = document.querySelectorAll('.seal-reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          const stamp = entry.target.querySelector('.seal-stamp');
          if (stamp && !stamp.classList.contains('stamped')) {
            setTimeout(() => stamp.classList.add('stamped'), 250);
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach(el => io.observe(el));
  }

  /*==============================
      GAME MODAL
  ==============================*/
  const modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    const modalTitle = modalOverlay.querySelector('#modalTitle');
    const modalGenre = modalOverlay.querySelector('#modalGenre');
    const modalSynopsis = modalOverlay.querySelector('#modalSynopsis');
    const modalList = modalOverlay.querySelector('#modalGameplayList');
    const modalClose = modalOverlay.querySelector('.modal-close');
    const videoBox = modalOverlay.querySelector('#modalVideo');

    const gameData = {
      'shattered-crown': {
        title: 'Shattered Crown',
        genre: 'Action-Adventure · Souls-like · Feudal Fantasy',
        // Replace with the real YouTube video ID for the Shattered Crown trailer
        // (the part after "v=" in the YouTube URL)
        youtubeId: 'M2NXpEy-gXk',
        gameplay: [
          'Weighted, punish-and-reward sword combat built around stance-breaking and precise parries',
          'A crumbling realm that changes shape around your choices, not just your path',
          'Boss encounters designed as duels — one honorable, readable rhythm each',
          'A relic system that trades power for corruption, rewriting your character over time',
          'Hand-painted ink-wash environments that shift tone as the crown\'s influence spreads',
          'New Game+ "Ronin Mode" that remixes boss patterns for returning players'
        ],
        synopsis: 'A kingdom shatters the night its crown is stolen, and its warlords turn on one another to reclaim it. You play a nameless blade for hire pulled into the fracture, cutting a path through broken oaths and half-truths to decide who — if anyone — deserves to rule what is left. Shattered Crown pairs deliberate, high-stakes swordplay with a world that keeps score of every skirmish you win and every mercy you refuse.'
      }
    };

    const resetVideo = () => {
      if (!videoBox) return;
      videoBox.innerHTML = `
        <img src="samurai.png" alt="Shattered Crown trailer thumbnail" class="video-poster">
        <button class="play-btn" id="playTrailer" aria-label="Play trailer">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <span class="video-label">Watch the Trailer</span>
      `;
    };

    const playTrailer = (youtubeId) => {
      if (!videoBox) return;
      if (!youtubeId) {
        videoBox.innerHTML = `<span class="video-label" style="position:static; text-align:center; padding:0 20px;">Trailer coming soon — add a YouTube video ID in script.js to enable playback.</span>`;
        return;
      }
      videoBox.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" title="Shattered Crown trailer" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    };

    // delegated click so it works after resetVideo() re-renders the button
    videoBox && videoBox.addEventListener('click', (e) => {
      if (e.target.closest('#playTrailer')) {
        playTrailer(gameData['shattered-crown'].youtubeId);
      }
    });

    const openModal = (key) => {
      const data = gameData[key];
      if (!data) return;
      resetVideo();
      modalTitle.textContent = data.title;
      modalGenre.textContent = data.genre;
      modalSynopsis.textContent = data.synopsis;
      modalList.innerHTML = data.gameplay.map(item => `<li>${item}</li>`).join('');
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(resetVideo, 400);
    };

    document.querySelectorAll('[data-game]').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.game));
    });

    modalClose && modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /*==============================
      CONTACT FORM (live submission)
  ==============================*/
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const note = document.querySelector('.form-note');
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (note) {
        note.textContent = '';
        note.classList.remove('show', 'success', 'error');
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formsubmit.co/ajax/klakshit678@gmail.com', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });

        if (!response.ok) throw new Error('Request failed');

        if (note) {
          note.textContent = 'Message sealed. We read every dispatch and reply within a few days.';
          note.classList.add('show', 'success');
        }
        contactForm.reset();
      } catch (err) {
        if (note) {
          note.textContent = 'Something went wrong sending your message. Please email us directly at hello@shiraoni.studio.';
          note.classList.add('show', 'error');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  /*==============================
      FOOTER YEAR
  ==============================*/
  document.querySelectorAll('.year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
