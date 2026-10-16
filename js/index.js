const destinations = [
  {
    id: 0,
    number: "01",
    name: "Candi Borobudur",
    location: "Magelang, Jawa Tengah",
    scriptTitle: "Candi Borobudur",
    tagline: "Warisan Dunia UNESCO",
    description: "Jelajahi keagungan candi Buddha terbesar di dunia yang berdiri megah di hamparan lembah Menoreh. Nikmati pesona matahari terbit bernuansa magis di antara ratusan stupa relief bersejarah yang memikat jiwa.",
    image: "assets/borobudur.jpg",
    thumb: "assets/borobudur.jpg"
  },
  {
    id: 1,
    number: "02",
    name: "Dataran Tinggi Dieng",
    location: "Wonosobo, Jawa Tengah",
    scriptTitle: "Telaga Warna Dieng",
    tagline: "Negeri Para Dewa",
    description: "Saksikan fenomena telaga vulkanik memukau dengan gradasi warna air kehijauan di ketinggian 2.000 mdpl. Dikelilingi lanskap perbukitan sejuk berkabut dan gugusan candi purba penuh misteri.",
    image: "assets/dieng-plateau.jpg",
    thumb: "assets/dieng-plateau.jpg"
  },
  {
    id: 2,
    number: "03",
    name: "Karimunjawa",
    location: "Jepara, Jawa Tengah",
    scriptTitle: "Surga Karimunjawa",
    tagline: "Surga Bahari Tropis",
    description: "Nikmati pesona gugusan pulau tropis berpasir putih selembut sutra dengan kejernihan air laut toska bergradasi. Jelajahi keindahan terumbu karang alami dan berenang bersama fauna laut eksotis.",
    image: "assets/karimunjawa.jpg",
    thumb: "assets/karimunjawa.jpg"
  },
  {
    id: 3,
    number: "04",
    name: "Candi Prambanan",
    location: "Klaten, Jawa Tengah",
    scriptTitle: "Candi Prambanan",
    tagline: "Mahakarya Candi Hindu",
    description: "Kagumi kemegahan arsitektur candi Hindu tercantik dan termegah di Indonesia yang menjulang tinggi ke angkasa. Rasakan atmosfer magis kisah legenda Roro Jonggrang dan relief epos Ramayana.",
    image: "assets/prambanan.jpg",
    thumb: "assets/prambanan.jpg"
  },
  {
    id: 4,
    number: "05",
    name: "Grojogan Sewu",
    location: "Karanganyar, Jawa Tengah",
    scriptTitle: "Grojogan Sewu Lawu",
    tagline: "Kesejukan Lereng Lawu",
    description: "Rasakan kesegaran gemuruh air terjun setinggi 81 meter yang memancar deras di lereng Gunung Lawu yang asri. Hawa sejuk hutan pinus nan rimbun menghadirkan ketenangan jiwa yang hakiki.",
    image: "assets/grojogan-sewu.jpg",
    thumb: "assets/grojogan-sewu.jpg"
  }
];

let currentIndex = 0;
let isCanvasAActive = true;
let autoSlideTimer = null;
let audioCtx = null;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playGamelanSound(destIdx) {
  if (!isSoundEnabled) return;

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  const now = ctx.currentTime;

  const gamelanPitches = [
    { baseFreq: 220.0, isGong: true },
    { baseFreq: 275.0, isGong: false },
    { baseFreq: 330.0, isGong: false },
    { baseFreq: 412.5, isGong: false },
    { baseFreq: 165.0, isGong: true }
  ];

  const config = gamelanPitches[destIdx % gamelanPitches.length] || { baseFreq: 220, isGong: false };
  const baseFreq = config.baseFreq;

  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.setValueAtTime(0.65, now);

  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(baseFreq * 4.5, now);
  clickOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.035);
  clickGain.gain.setValueAtTime(0.28, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  clickOsc.connect(clickGain);
  clickGain.connect(masterGain);
  clickOsc.start(now);
  clickOsc.stop(now + 0.045);

  const partials = [
    { ratio: 1.00, gain: 0.55, decay: 3.2, detune: 0 },
    { ratio: 1.00, gain: 0.40, decay: 3.0, detune: 3.0 },
    { ratio: 2.01, gain: 0.32, decay: 2.1, detune: 1.5 },
    { ratio: 2.76, gain: 0.22, decay: 1.5, detune: -2.0 },
    { ratio: 4.07, gain: 0.14, decay: 0.9, detune: 4.0 },
    { ratio: 5.42, gain: 0.08, decay: 0.5, detune: -5.0 }
  ];

  if (config.isGong) {
    partials.push({ ratio: 0.50, gain: 0.45, decay: 4.0, detune: 0 });
  }

  partials.forEach(({ ratio, gain, decay, detune }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    const targetFreq = (baseFreq * ratio) + detune;

    osc.frequency.setValueAtTime(targetFreq * 1.015, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.05);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(gain * 0.45, now + 0.006);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay + 0.1);
  });
}

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const iconOn = document.getElementById('sound-icon-on');
  const iconOff = document.getElementById('sound-icon-off');
  const text = document.getElementById('sound-toggle-text');
  const btn = document.getElementById('sound-toggle-btn');

  if (isSoundEnabled) {
    iconOn.classList.remove('hidden');
    iconOff.classList.add('hidden');
    if (text) text.textContent = 'Gamelan: Aktif';
    if (btn) btn.classList.add('bg-white/10');
    getAudioContext();
    playGamelanSound(currentIndex);
  } else {
    iconOn.classList.add('hidden');
    iconOff.classList.remove('hidden');
    if (text) text.textContent = 'Gamelan: Mute';
    if (btn) btn.classList.remove('bg-white/10');
  }
}

destinations.forEach(item => {
  const img = new Image();
  img.src = item.image;
  const th = new Image();
  th.src = item.thumb;
});

function renderArc() {
  const container = document.getElementById('arc-destinations');
  container.innerHTML = '';

  destinations.forEach((dest, idx) => {
    const isActive = idx === currentIndex;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick = () => {
      changeDestination(idx);
      restartAutoSlide();
    };
    btn.className = `group relative flex items-center justify-end gap-3 sm:gap-4 p-1 rounded-full transition-all duration-300 focus:outline-none shrink-0 arc-pos-${idx} ${isActive ? 'scale-105 z-10' : 'opacity-70 hover:opacity-100 scale-95 hover:scale-100'
      }`;

    btn.innerHTML = `
          <div class="text-right hidden sm:flex flex-col justify-center transition-all duration-300">
            <span class="text-xs sm:text-sm font-semibold tracking-tight ${isActive ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'
      }">
              ${dest.name}
            </span>
            <span class="text-[10px] sm:text-xs text-white/60 font-light">
              ${dest.location}
            </span>
          </div>

          <div class="relative flex items-center justify-center">
            <div class="${isActive ? 'p-1.5 rounded-full bg-white/15 ring-1 ring-white/40 shadow-2xl' : ''
      }">
              <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-full overflow-hidden border border-white/60 transition-transform duration-300 group-hover:scale-105 bg-black/40">
                <img 
                  src="${dest.thumb}" 
                  alt="${dest.name}" 
                  class="w-full h-full object-cover block"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        `;

    container.appendChild(btn);
  });
}

function changeDestination(index) {
  if (index === currentIndex && document.getElementById('bg-canvas-a').style.backgroundImage) return;

  currentIndex = index;
  const data = destinations[currentIndex];

  playGamelanSound(currentIndex);

  const canvasA = document.getElementById('bg-canvas-a');
  const canvasB = document.getElementById('bg-canvas-b');

  if (isCanvasAActive) {
    canvasB.style.backgroundImage = `url('${data.image}')`;
    canvasB.classList.remove('opacity-0', 'scale-105');
    canvasB.classList.add('opacity-100', 'scale-100');

    canvasA.classList.remove('opacity-100', 'scale-100');
    canvasA.classList.add('opacity-0', 'scale-105');
    isCanvasAActive = false;
  } else {
    canvasA.style.backgroundImage = `url('${data.image}')`;
    canvasA.classList.remove('opacity-0', 'scale-105');
    canvasA.classList.add('opacity-100', 'scale-100');

    canvasB.classList.remove('opacity-100', 'scale-100');
    canvasB.classList.add('opacity-0', 'scale-105');
    isCanvasAActive = true;
  }

  const cursiveTitle = document.getElementById('hero-cursive-title');
  const destName = document.getElementById('hero-dest-name');
  const desc = document.getElementById('hero-description');
  const tagline = document.getElementById('hero-tagline');
  const footerActive = document.getElementById('footer-active-name');

  [cursiveTitle, destName, desc].forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
  });

  setTimeout(() => {
    cursiveTitle.textContent = data.scriptTitle;
    destName.textContent = `${data.name}, ${data.location}`;
    desc.textContent = data.description;
    tagline.textContent = data.tagline;
    footerActive.textContent = `${data.number} ${data.name}`;

    [cursiveTitle, destName, desc].forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 150);

  for (let i = 0; i < destinations.length; i++) {
    const dot = document.getElementById(`indicator-dot-${i}`);
    if (dot) {
      if (i === currentIndex) {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.9)]';
      } else {
        dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-white/30';
      }
    }
  }

  renderArc();
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(() => {
    const nextIdx = (currentIndex + 1) % destinations.length;
    changeDestination(nextIdx);
  }, 8000);
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

function restartAutoSlide() {
  startAutoSlide();
}

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (window.scrollY < 400 && ['1', '2', '3', '4', '5'].includes(e.key)) {
    changeDestination(parseInt(e.key, 10) - 1);
    restartAutoSlide();
  }
});

const unlockAudio = () => {
  getAudioContext();
  window.removeEventListener('click', unlockAudio);
  window.removeEventListener('keydown', unlockAudio);
  window.removeEventListener('touchstart', unlockAudio);
};
window.addEventListener('click', unlockAudio);
window.addEventListener('keydown', unlockAudio);
window.addEventListener('touchstart', unlockAudio);

document.addEventListener('DOMContentLoaded', () => {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSound();
    });
  }

  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');
  if (mobileNavToggle && mobileNavDropdown) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavDropdown.classList.toggle('hidden');
    });
    mobileNavDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDropdown.classList.add('hidden');
      });
    });
  }

  document.getElementById('bg-canvas-a').style.backgroundImage = `url('${destinations[0].image}')`;
  renderArc();
  startAutoSlide();
});
