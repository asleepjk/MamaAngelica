/* ==========================================================================
   LÓGICA INTERACTIVA - SITIO WEB MEMORIAL ANGÉLICA GALLEGOS CCAPCHA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. REPRODUCTOR DE MÚSICA MEMORIAL
  // --------------------------------------------------------------------------
  const audio = document.getElementById('memorialAudio');
  const floatingMusicBtn = document.getElementById('floatingMusicBtn');
  const discIcon = document.getElementById('discIcon');
  const musicWave = document.getElementById('musicWave');
  const musicTooltip = document.getElementById('musicTooltip');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const heroPlayText = document.getElementById('heroPlayText');
  const heroPlayIcon = document.getElementById('heroPlayIcon');

  let isPlaying = false;

  // Iconos SVG para Play y Pausa
  const playIconSvg = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>`;
  
  const pauseIconSvg = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>`;

  function updatePlayerUI(playing) {
    isPlaying = playing;
    if (playing) {
      discIcon.classList.add('rotating');
      musicWave.classList.add('active');
      musicTooltip.textContent = 'Pausar música';
      heroPlayText.textContent = 'Pausar canción';
      heroPlayIcon.innerHTML = pauseIconSvg;
    } else {
      discIcon.classList.remove('rotating');
      musicWave.classList.remove('active');
      musicTooltip.textContent = 'Escuchar música';
      heroPlayText.textContent = 'Escuchar canción en su memoria';
      heroPlayIcon.innerHTML = playIconSvg;
    }
  }

  async function togglePlayAudio() {
    try {
      if (audio.paused) {
        await audio.play();
        updatePlayerUI(true);
      } else {
        audio.pause();
        updatePlayerUI(false);
      }
    } catch (err) {
      console.warn('Interacción del usuario requerida para reproducir audio:', err);
    }
  }

  floatingMusicBtn?.addEventListener('click', togglePlayAudio);
  heroPlayBtn?.addEventListener('click', togglePlayAudio);

  audio.addEventListener('play', () => updatePlayerUI(true));
  audio.addEventListener('pause', () => updatePlayerUI(false));
  audio.addEventListener('ended', () => updatePlayerUI(false));

  // Tooltip inicial que invita a interactuar
  setTimeout(() => {
    musicTooltip?.classList.add('show-initially');
    setTimeout(() => {
      musicTooltip?.classList.remove('show-initially');
    }, 4500);
  }, 1200);

  // --------------------------------------------------------------------------
  // 1.1 REPRODUCCIÓN DEL VIDEO MEMORIAL PRINCIPAL
  // --------------------------------------------------------------------------
  const mainVideo = document.getElementById('mainVideo');
  if (mainVideo) {
    const playVideoPromise = mainVideo.play();
    if (playVideoPromise !== undefined) {
      playVideoPromise.catch(() => {
        // En caso de que el navegador restrinja autoplay automático
        const resumeOnInteraction = () => {
          mainVideo.play();
          window.removeEventListener('touchstart', resumeOnInteraction);
          window.removeEventListener('click', resumeOnInteraction);
        };
        window.addEventListener('touchstart', resumeOnInteraction, { once: true });
        window.addEventListener('click', resumeOnInteraction, { once: true });
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. CONTADOR REGRESIVO (24 de Noviembre de 2026, 6:00 PM)
  // --------------------------------------------------------------------------
  const targetDate = new Date('2026-11-24T18:00:00');
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');
  const countdownGrid = document.getElementById('countdownGrid');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      if (countdownGrid) {
        countdownGrid.innerHTML = `
          <div style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--gold-deep); font-weight: 700;">
            ✦ Conmemorando hoy su memoria eterna ✦
          </div>`;
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
    if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --------------------------------------------------------------------------
  // 3. VELITA VIRTUAL EN SU MEMORIA
  // --------------------------------------------------------------------------
  const candleInteractive = document.getElementById('candleInteractive');
  const candleFlame = document.getElementById('candleFlame');
  const candleGlow = document.getElementById('candleGlow');
  const candleStatus = document.getElementById('candleStatus');
  const candleCounter = document.getElementById('candleCounter');

  const CANDLE_COUNT_KEY = 'memorial_candle_count_angelica';
  const CANDLE_LIT_KEY = 'memorial_candle_is_lit_angelica';

  let currentCount = parseInt(localStorage.getItem(CANDLE_COUNT_KEY) || '24', 10);
  let isLit = localStorage.getItem(CANDLE_LIT_KEY) === 'true';

  if (candleCounter) candleCounter.textContent = currentCount;

  function setCandleState(lit) {
    if (lit) {
      candleFlame.classList.add('lit');
      candleGlow.classList.add('lit');
      candleStatus.textContent = '✦ Tu velita está iluminando una plegaria ✦';
    } else {
      candleFlame.classList.remove('lit');
      candleGlow.classList.remove('lit');
      candleStatus.textContent = 'Toca la vela para encenderla';
    }
  }

  setCandleState(isLit);

  candleInteractive?.addEventListener('click', () => {
    isLit = !isLit;
    if (isLit) {
      currentCount += 1;
      localStorage.setItem(CANDLE_COUNT_KEY, currentCount);
      localStorage.setItem(CANDLE_LIT_KEY, 'true');
    } else {
      localStorage.setItem(CANDLE_LIT_KEY, 'false');
    }
    if (candleCounter) candleCounter.textContent = currentCount;
    setCandleState(isLit);
  });

  candleInteractive?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      candleInteractive.click();
    }
  });

  // --------------------------------------------------------------------------
  // 4. AGENDAR EN GOOGLE CALENDAR
  // --------------------------------------------------------------------------
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  addToCalendarBtn?.addEventListener('click', () => {
    const title = encodeURIComponent('Primer Aniversario - Angélica Gallegos Ccapcha');
    const details = encodeURIComponent('Santa Misa de Honras y posterior reunión familiar en memoria de nuestra querida Angélica Gallegos Ccapcha.');
    const location = encodeURIComponent('La Capitana Huachipa Mz B Lte 12 AA.HH San Pedro Costado Restaurant Mechita');
    const dates = '20261124T230000Z/20261125T020000Z'; // 6:00 PM a 9:00 PM en hora de Perú (UTC-5)

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  });

  // --------------------------------------------------------------------------
  // 5. VISUALIZADOR DE FOTOS / DIALOG (Modern Web Guidance)
  // --------------------------------------------------------------------------
  const photoDialog = document.getElementById('photoDialog');
  const dialogImg = document.getElementById('dialogImg');
  const dialogCaption = document.getElementById('dialogCaption');
  const dialogCloseBtn = document.getElementById('dialogCloseBtn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const photoSrc = item.getAttribute('data-photo');
      const caption = item.getAttribute('data-caption') || '';
      
      if (dialogImg && photoDialog) {
        dialogImg.src = photoSrc;
        dialogImg.alt = caption;
        if (dialogCaption) dialogCaption.textContent = caption;
        
        photoDialog.showModal();
      }
    });
  });

  dialogCloseBtn?.addEventListener('click', () => {
    photoDialog?.close();
  });

  // Fallback de "closedby" para cerrar al hacer clic en el backdrop
  if (photoDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    photoDialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e, photoDialog);
    });
    photoDialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e, photoDialog)) {
        photoDialog.close();
      }
    });
  }
});
