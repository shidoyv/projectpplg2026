/* =====================================================================
       Lelana Jateng — Travel Sketchbook Engine
       Original Component: MengToSketchbookLandingPage (ThreeUI registered source)
       Runtime: Full HTML + DOM/CSS + JavaScript.
       ===================================================================== */
const Q = new URLSearchParams(location.search);
const DIR = 'assets/sketchbook/';

/* ------------------------------------------------- page sound engine */
const PageAudio = (() => {
  let ctx = null;
  let enabled = true;
  let fallbackAudio = null;

  function initAudio() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }
  }

  try {
    fallbackAudio = new Audio(DIR + 'page-flip.wav');
    fallbackAudio.volume = 0.65;
  } catch (e) { }

  function playSynth(dir) {
    if (!ctx) initAudio();
    if (!ctx) {
      if (fallbackAudio) {
        fallbackAudio.currentTime = 0;
        fallbackAudio.play().catch(() => { });
      }
      return;
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }

    const t = ctx.currentTime;
    const isNext = dir !== 'prev';
    const dur = 0.22 + Math.random() * 0.05;

    // 1. Friction & Air displacement: pink/white noise through resonant bandpass
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.16;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    const startFreq = isNext ? (1650 + Math.random() * 150) : (1500 + Math.random() * 150);
    const endFreq = 700 + Math.random() * 80;
    bandpass.frequency.setValueAtTime(startFreq, t);
    bandpass.frequency.exponentialRampToValueAtTime(endFreq, t + dur * 0.85);
    bandpass.Q.setValueAtTime(2.2, t);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(320, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.38, t + 0.022);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noiseNode.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseNode.start(t);
    noiseNode.stop(t + dur);

    // 2. Paper Landing / Flutter Body (soft low thump when leaf lands)
    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thumpOsc.type = 'sine';

    const thumpStart = t + 0.045;
    const thumpDur = 0.075;
    thumpOsc.frequency.setValueAtTime(145 + Math.random() * 15, thumpStart);
    thumpOsc.frequency.exponentialRampToValueAtTime(65, thumpStart + thumpDur);

    thumpGain.gain.setValueAtTime(0.001, thumpStart);
    thumpGain.gain.linearRampToValueAtTime(0.18, thumpStart + 0.012);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, thumpStart + thumpDur);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(ctx.destination);

    thumpOsc.start(thumpStart);
    thumpOsc.stop(thumpStart + thumpDur);

    // 3. Crisp Paper Edge Snap (micro high frequency rustle)
    const snapLen = Math.floor(ctx.sampleRate * 0.035);
    const snapBuf = ctx.createBuffer(1, snapLen, ctx.sampleRate);
    const snapData = snapBuf.getChannelData(0);
    for (let j = 0; j < snapLen; j++) {
      snapData[j] = (Math.random() * 2 - 1) * Math.exp(-j / (snapLen * 0.3));
    }
    const snapOsc = ctx.createBufferSource();
    snapOsc.buffer = snapBuf;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(3200 + Math.random() * 300, t);
    snapFilter.Q.setValueAtTime(1.8, t);

    const snapGain = ctx.createGain();
    const snapTime = t + 0.03;
    snapGain.gain.setValueAtTime(0.12, snapTime);
    snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.035);

    snapOsc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(snapTime);
    snapOsc.stop(snapTime + 0.04);
  }

  function play(dir) {
    if (!enabled) return;
    try {
      playSynth(dir);
    } catch (e) {
      if (fallbackAudio) {
        fallbackAudio.currentTime = 0;
        fallbackAudio.play().catch(() => { });
      }
    }
  }

  function toggle() {
    initAudio();
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  const unlockEvents = ['pointerdown', 'keydown', 'click', 'touchstart'];
  function onFirstUserGesture() {
    initAudio();
    unlockEvents.forEach(evt => window.removeEventListener(evt, onFirstUserGesture, true));
  }
  unlockEvents.forEach(evt => window.addEventListener(evt, onFirstUserGesture, { capture: true, once: true }));

  return {
    play,
    toggle,
    isEnabled,
    init: initAudio
  };
})();

const PAGES = [
  {
    file: 'borobudur.jpg',
    title: 'Candi Borobudur',
    place: 'Magelang, Jawa Tengah',
    plate: 'Pelat 01',
    subtitle: 'Magelang · Warisan Dunia UNESCO Dinasti Syailendra',
    headline: 'Mahakarya Dinasti Syailendra di Lembah Menoreh',
    bio: 'Didirikan pada abad ke-8 hingga ke-9 Masehi oleh Dinasti Syailendra, Candi Borobudur merupakan monumen Buddha terbesar di dunia yang memadukan arsitektur stupa dengan konsep mandala alam semesta. Terdiri dari sembilan teras berundak (enam bujur sangkar dan tiga lingkaran) yang melambangkan tingkatan spiritual Kamadhatu, Rupadhatu, dan Arupadhatu. Dindingnya dihiasi 2.672 panel relief naratif yang menceritakan Lalitavistara, Jataka, dan Gandavyuha, dipahat dari batu andesit vulkanik lembah Progo. Kehadirannya diapit Gunung Merapi, Merbabu, Sumbing, dan perbukitan Menoreh menjadikannya pusat peradaban spiritual Jawa Kuno yang telah diakui sebagai Warisan Dunia UNESCO.',
    tags: ['Warisan Dunia UNESCO', 'Abad ke-8 Masehi', 'Relief Andesit', 'Buddha Mahayana'],
    tokoh: {
      name: 'Mpu Gunadharma',
      role: 'Arsitek Agung Dinasti Syailendra (Abad ke-8 Masehi)',
      image: 'assets/tokoh/gunadharma.png',
      bio: 'Tokoh arsitek legendaris Dinasti Syailendra yang merancang keagungan Candi Borobudur dengan perhitungan mandala kosmos Buddhis yang presisi. Menurut tradisi tutur masyarakat Magelang, siluet jajaran Pegunungan Menoreh di kejauhan menyerupai sosok Gunadharma yang tengah beristirahat memandangi mahakaryanya.'
    }
  },
  {
    file: 'dieng.jpg',
    title: 'Dataran Tinggi Dieng',
    place: 'Wonosobo & Banjarnegara',
    plate: 'Pelat 02',
    subtitle: 'Wonosobo & Banjarnegara · Kaldera Vulkanik 2.000 mdpl',
    headline: 'Kaldera Vulkanik Purba dan Kahyangan Para Dewa',
    bio: 'Terletak pada ketinggian lebih dari 2.000 meter di atas permukaan laut, Dataran Tinggi Dieng berasal dari kata Sansekerta Di-Hyang yang bermakna tempat bersemayamnya para leluhur dan dewa. Kawasan kaldera vulkanik aktif ini menjadi saksi peninggalan percandian Hindu tertua di Jawa Tengah yang dibangun pada abad ke-7 hingga ke-8 Masehi, termasuk kompleks Candi Arjuna, Semar, Puntadewa, dan Gatotkaca. Dieng memiliki bentang alam dramatis berupa kawah solfatara Sikidang, telaga bersulfur Telaga Warna dan Telaga Pengilon, serta fenomena embun upas (kristal es) yang memukau di musim kemarau.',
    tags: ['Percandian Abad ke-7', 'Kaldera Vulkanik', 'Kawah Sikidang', '2.093 mdpl'],
    tokoh: {
      name: 'Maharani Shima',
      role: 'Penguasa Agung Kerajaan Kalingga (674–695 Masehi)',
      image: 'assets/tokoh/ratu-shima.png',
      bio: 'Pemimpin wanita legendaris di bumi Jawa Tengah yang memerintah Kerajaan Kalingga dengan prinsip keadilan dan kejujuran tanpa kompromi. Di bawah kepemimpinannya, wilayah dataran tinggi Dieng berkembang menjadi pusat suci keagamaan, peribadatan para dewa, dan peradaban ilmu pengetahuan tertua di tanah Jawa.'
    }
  },
  {
    file: 'kota-lama.jpg',
    title: 'Kota Lama Semarang',
    place: 'Semarang, Jawa Tengah',
    plate: 'Pelat 03',
    subtitle: 'Semarang · Kawasan Cagar Budaya Kolonial Abad ke-18',
    headline: 'Jejak Niaga Kolonial Abad ke-18 di Pesisir Utara',
    bio: 'Dikenal sebagai Oudstad atau Little Netherlands, Kota Lama Semarang adalah kawasan cagar budaya seluas 31 hektar yang menjadi pusat perdagangan dan administrasi kolonial Hindia Belanda pada abad ke-17 hingga ke-19. Ciri khas arsitekturnya mengadopsi gaya Indische Empire dan art deco dengan jendela lengkung besar, ventilasi jalusi, dan langit-langit tinggi. Landmark utamanya, Gereja Blenduk (Koepelkerk) yang dibangun tahun 1753 dengan kubah perunggu ikonik, berdiri berdampingan dengan Gedung Marba, Jembatan Berok, dan Taman Srigunting di sepanjang jalur kanal Kali Semarang.',
    tags: ['Gereja Blenduk 1753', 'Arsitektur Indische', 'Kanal Kali Semarang', 'Cagar Budaya'],
    tokoh: {
      name: 'Oei Tiong Ham',
      role: 'Raja Gula Semarang & Pionir Niaga Maritim Asia (1866–1924)',
      image: 'assets/tokoh/oei-tiong-ham.png',
      bio: 'Konglomerat terkemuka kelahiran Semarang yang dijuluki Raja Gula Asia Tenggara. Melalui konglomerasi Oei Tiong Ham Concern yang berpusat di Kota Lama Semarang, ia membangun jaringan perdagangan maritim internasional, pelabuhan modern, dan arsitektur niaga ikonik yang hingga kini menghiasi lanskap Kota Lama.'
    }
  },
  {
    file: 'karimunjawa.jpg',
    title: 'Kepulauan Karimunjawa',
    place: 'Jepara, Jawa Tengah',
    plate: 'Pelat 04',
    subtitle: 'Jepara · Taman Nasional Laut Tropis Laut Jawa',
    headline: 'Suaka Bahari Terumbu Karang di Laut Jawa',
    bio: 'Gugusan 27 pulau di utara Laut Jawa ini ditetapkan sebagai Taman Nasional Laut sejak tahun 2001 untuk melindungi keanekaragaman ekosistem pesisir tropis. Terkenal dengan hamparan pasir putih lembut, hutan bakau perawan, dan terumbu karang tepi (fringing reef) yang menjadi habitat penyu sisik serta penyu hijau. Legenda setempat mengisahkan nama Karimunjawa berasal dari ucapan Sunan Muria yang melihat pulau ini lamat-lamat (kremun-kremun saking kadohan) dari puncak Gunung Muria saat melepas putranya, Amir Hasan (Sunan Nyamplungan), untuk menyebarkan ilmu.',
    tags: ['Taman Nasional Laut', 'Terumbu Karang Tepi', 'Konservasi Penyu', 'Gugusan 27 Pulau'],
    tokoh: {
      name: 'Sunan Nyamplungan (Amir Hasan)',
      role: 'Wali Pelindung & Perintis Peradaban Karimunjawa',
      image: 'assets/tokoh/sunan-nyamplungan.png',
      bio: 'Putra Sunan Muria dari Wali Songo yang diutus berlayar ke arah kepulauan yang tampak kremun-kremun (samar-samar) di utara Laut Jawa. Beliau menetap, menyebarkan ajaran kebajikan, serta menanam pohon kayu Nyamplung dan Dewandaru yang menjadi tanaman keramat khas kepulauan Karimunjawa.'
    }
  },
  {
    file: 'prambanan.jpg',
    title: 'Candi Prambanan',
    place: 'Klaten, Jawa Tengah',
    plate: 'Pelat 05',
    subtitle: 'Klaten · Kompleks Percandian Trimurti Abad ke-9',
    headline: 'Mahakarya Percandian Hindu Trimurti Nusantara',
    bio: 'Dibangun sekitar tahun 850 Masehi oleh Rakai Pikatan dari Dinasti Sanjaya dan disempurnakan oleh Dyah Lokapala serta Raja Balitung, Kompleks Percandian Prambanan (Candi Roro Jonggrang) merupakan candi Hindu teragung di Indonesia. Arsitekturnya menjulang vertikal setinggi 47 meter yang melambangkan Gunung Meru suci. Tiga candi utama dipersembahkan untuk Trimurti: Dewa Siwa (Mahadewa), Brahma (Pencipta), dan Wisnu (Pemelihara). Pada dinding teras candi terpahat relief epos Ramayana dan Krishnayana yang luar biasa detail, memotret kejayaan seni pahat klasik abad ke-9.',
    tags: ['Trimurti Siwa', 'Tinggi 47 Meter', 'Relief Ramayana', 'Warisan Dunia UNESCO'],
    tokoh: {
      name: 'Rakai Pikatan & Pramodhawardhani',
      role: 'Raja Sanjaya & Putri Syailendra (Abad ke-9 Masehi)',
      image: 'assets/tokoh/rakai-pikatan.png',
      bio: 'Pernikahan politik dan cinta suci antara Rakai Pikatan (penganut Hindu Siwa) dan Pramodhawardhani (putri penganut Buddha Mahayana) menjadi simbol keharmonisan spiritual Mataram Kuno. Dari kepemimpinan mereka, berdirilah mahakarya Kompleks Percandian Prambanan setinggi 47 meter sebagai wujud toleransi agung Nusantara.'
    }
  },
  {
    file: 'lawang-sewu.jpg',
    title: 'Lawang Sewu',
    place: 'Semarang, Jawa Tengah',
    plate: 'Pelat 06',
    subtitle: 'Semarang · Kantor NIS & Ikon Perkeretaapian Hindia Belanda',
    headline: 'Monumen Kejayaan Kereta Api Nusantara',
    bio: 'Gedung bersejarah monumental di bundaran Tugu Muda ini dibangun antara tahun 1904 hingga 1907 sebagai kantor pusat perusahaan kereta api swasta Hindia Belanda, Nederlandsch-Indische Spoorweg Maatschappij (NIS). Dinamai Lawang Sewu karena barisan pintu dan jendela jalusi lengkungnya yang berjumlah ratusan sehingga tampak seribu pintu. Dirancang oleh arsitek ternama J.F. Klinkhamer dan B.J. Ouëndag, bangunan ini memiliki mahakarya kaca patri Johannes Lourens Schouten asal Delft yang menggambarkan kemakmuran flora Batavia, industri kereta api, dan pelabuhan Semarang.',
    tags: ['NIS Kantor Pusat', 'Arsitektur Klinkhamer', 'Kaca Patri Delft', 'Tugu Muda'],
    tokoh: {
      name: 'Prof. Jacob F. Klinkhamer',
      role: 'Arsitek Perintis Gedung Lawang Sewu (1854–1928)',
      image: 'assets/tokoh/klinkhamer.png',
      bio: 'Arsitek terkemuka asal Amsterdam yang bersama B.J. Ouëndag merancang kantor pusat NIS Lawang Sewu di Semarang. Klinkhamer secara brilian memadukan estetika megah Eropa dengan sains iklim tropis Jawa melalui lorong berlipat, ruang bawah tanah pendingin alami, serta kubah menara tembaga yang megah.'
    }
  },
  {
    file: 'ranggawarsita.jpg',
    title: 'Museum Ranggawarsita',
    place: 'Semarang, Jawa Tengah',
    plate: 'Pelat 07',
    subtitle: 'Semarang · Museum Budaya & Arkeologi Terlengkap Jawa Tengah',
    headline: 'Khazanah Ensiklopedis Arkeologi dan Budaya Jawa',
    bio: 'Mengambil nama dari pujangga besar Keraton Surakarta, Raden Ngabehi Ranggawarsita, museum negeri terlengkap di Jawa Tengah ini menyimpan lebih dari 59.000 koleksi benda cagar budaya. Terbagi ke dalam empat gedung pameran permanen yang merekam geologi dan bebatuan fosil purba Sangiran, artefak perunggu dan gerabah masa prasejarah, warisan klasik Hindu-Buddha, era kesultanan Islam, hingga busana adat dan seni pedalangan wayang kulit dari berbagai karesidenan di Jawa Tengah.',
    tags: ['59.000 Koleksi', 'Fosil Sangiran', 'Pujangga Jawa', 'Arkeologi Klasik'],
    tokoh: {
      name: 'Raden Ngabehi Ranggawarsita',
      role: 'Pujangga Besar Keraton Kasunanan Surakarta (1802–1873)',
      image: 'assets/tokoh/ranggawarsita.png',
      bio: 'Sastrawan, filsuf, dan pujangga pamungkas Jawa yang menggubah karya-karya abadi seperti Serat Kalatidha, Serat Jayengbaya, dan Serat Wirid Hidayat Jati. Ketajaman intuisi dan kedalaman spiritualnya merekam denyut zaman tanah Jawa, yang kini namanya diabadikan sebagai nama museum kebudayaan terlengkap di Jawa Tengah.'
    }
  },
  {
    file: 'keraton-surakarta.jpg',
    title: 'Keraton Surakarta Hadiningrat',
    place: 'Surakarta, Jawa Tengah',
    plate: 'Pelat 08',
    subtitle: 'Surakarta · Istana Adat & Pusat Kebudayaan Mataram Islam',
    headline: 'Istana Penerus Dinasti Mataram Islam',
    bio: 'Didirikan oleh Susuhunan Pakubuwana II pada tahun 1744 setelah perpindahan pusat kekuasaan dari Kartasura, Keraton Surakarta Hadiningrat merupakan pilar utama pelestari adat, seni tari, karawitan, dan kesusastraan Jawa klasik. Kompleks istana ini memadukan filosofi kosmos Jawa dengan sentuhan dekorasi Eropa, terlihat pada Menara Sanggabuwana tempat bertapa raja, Sasana Sewaka yang beralaskan pasir hitam Pantai Selatan, serta Sasana Sumewa. Hingga kini, keraton tetap menjadi pusat ritual agung seperti Kirab Pusaka Malam Satu Sura.',
    tags: ['Paku Buwana II (1744)', 'Menara Sanggabuwana', 'Seni Bedhaya Ketawang', 'Pusat Kebudayaan Jawa'],
    tokoh: {
      name: 'Sri Susuhunan Pakubuwana X',
      role: 'Raja Terbesar Kasunanan Surakarta (1866–1939)',
      image: 'assets/tokoh/pakubuwana-x.png',
      bio: 'Raja Kasunanan Surakarta yang berkuasa selama 46 tahun dan membawa era keemasan kebudayaan, modernisasi, dan kemakmuran Jawa Tengah. Dikenal sebagai pelindung seniman, pembangun Stadion Sriwedari, Rumah Sakit Kadipolo, dan pendukung pergerakan kebangsaan nasional yang bergelar Pahlawan Nasional Indonesia.'
    }
  },
  {
    file: 'batik-pekalongan.jpg',
    title: 'Kawasan Batik Pekalongan',
    place: 'Pekalongan, Jawa Tengah',
    plate: 'Pelat 09',
    subtitle: 'Pekalongan · Jaringan Kota Kreatif Dunia UNESCO',
    headline: 'Dinamika Seni Kriya Pesisiran Berstatus UNESCO',
    bio: 'Pekalongan diakui oleh UNESCO sebagai bagian dari Jaringan Kota Kreatif Dunia berkat tradisi membatiknya yang mengakar kuat di denyut nadi warganya. Berbeda dengan batik pedalaman Solo dan Yogyakarta yang bernuansa sogan cokelat sakral, batik pesisir Pekalongan kaya akan warna cerah berani seperti merah, pirus, dan ungu. Ragam motifnya dipengaruhi oleh akulturasi perdagangan maritim dengan saudagar Tionghoa (motif Buketan dan Liong), Arab, dan Belanda (batik kumpeni), menjadikannya cermin keterbukaan budaya Nusantara di pesisir utara.',
    tags: ['Kota Kreatif UNESCO', 'Batik Pesisiran', 'Motif Buketan & Jlamprang', 'Akulturasi Bahari'],
    tokoh: {
      name: 'Oey Soe Tjoen',
      role: 'Maestro Batik Tulis Peranakan Pekalongan (1901–1975)',
      image: 'assets/tokoh/oey-soe-tjoen.png',
      bio: 'Pematik dan maestro batik legendaris Kedungwuni, Pekalongan, yang karyanya diakui dunia sebagai puncak kehalusan batik tulis peranakan Nusantara. Setiap helai kainnya dikerjakan berbulan-bulan dengan canting jarum super halus, motif flora fauna Buketan yang anggun, dan kini menjadi koleksi berharga di museum-museum seni tekstil terkemuka dunia.'
    }
  }
];

PAGES.forEach(p => p.url = DIR + p.file);
const M = PAGES.length, LAND = 0;

const wrap = document.getElementById('sbWrap');
const stage = document.getElementById('sbStage');
const sb3d = document.getElementById('sb3d');
const book = document.getElementById('sbBook');
const capBox = document.getElementById('sbCaptions');
const hint = document.getElementById('sbHint');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------ the turning leaf */
const N = 18;            /* strips for smooth curve */
const SPAN = 0.449;      /* gutter to outer page edge */
const BETA = 0.60;       /* peak curl radians */
let idx = 0, turn = null;
let strips = [];

function el(t, c) {
  const e = document.createElement(t);
  if (c) e.className = c;
  return e;
}

function imgEl(i, side) {
  const im = new Image();
  im.className = 'sb-half-img ' + side;
  im.draggable = false;
  im.alt = PAGES[i].title;
  im.src = PAGES[i].url;
  return im;
}

function halfEl(pos, i) {
  const d = el('div', 'sb-half ' + pos);
  d.appendChild(imgEl(i, pos));
  d.appendChild(el('div', 'gutter-shade ' + pos));
  return d;
}

/* Build strip chain once per turn */
function buildCurl(dir, from, to) {
  strips = [];
  const c = el('div', 'curl ' + dir);
  c.style.setProperty('--n', N);
  c.style.setProperty('--span', SPAN);
  let host = c;

  for (let i = 0; i < N; i++) {
    const s = el('div', 'strip');
    s.style.setProperty('--i', i);
    const gut = 'calc(var(--bw) * 0.5)';
    const sw = 'calc(var(--bw) * ' + SPAN + ' / ' + N + ')';
    const A = 'calc(-1 * (' + gut + ' + ' + i + ' * ' + sw + '))';
    const B = 'calc(' + (i + 1) + ' * ' + sw + ' - ' + gut + ')';

    const f = el('div', 'face front'), b = el('div', 'face back');
    const dress = (e, url, px) => {
      e.style.backgroundImage = 'url(' + url + ')';
      e.style.backgroundPositionX = px;
    };

    dress(f, PAGES[from].url, dir === 'next' ? A : B);
    dress(b, PAGES[to].url, dir === 'next' ? B : A);

    f.appendChild(el('div', 'sh'));
    f.appendChild(el('div', 'gl'));
    b.appendChild(el('div', 'sh'));
    b.appendChild(el('div', 'gl'));

    s.appendChild(f);
    s.appendChild(b);
    if (i === N - 1) s.classList.add('edge');
    host.appendChild(s);
    host = s;
    strips.push(s);
  }
  return c;
}

function applyTurn(t) {
  const th = Math.PI * t;
  const beta = BETA * Math.sin(Math.PI * t);
  const D = 180 / Math.PI;
  const tt = th + beta, td = 2 * beta / N;

  sb3d.style.setProperty('--tt', (tt * D).toFixed(2) + 'deg');
  sb3d.style.setProperty('--td', (td * D).toFixed(3) + 'deg');
  sb3d.style.setProperty('--shade', Math.sin(Math.PI * t).toFixed(3));
  fadeCaption(t);

  for (let i = 0; i < strips.length; i++) {
    const l1 = Math.abs(Math.cos(tt - i * td));
    const l2 = Math.abs(Math.cos(tt - (i + 1) * td));
    const st = strips[i].style;
    st.setProperty('--lit', l1.toFixed(3));
    st.setProperty('--a1', ((1 - l1) * .62).toFixed(3));
    st.setProperty('--a2', ((1 - l2) * .62).toFixed(3));
  }
}

function paint() {
  book.textContent = '';
  if (!turn) {
    const f = el('div', 'sb-full');
    const im = new Image();
    im.src = PAGES[idx].url;
    im.alt = PAGES[idx].title;
    im.draggable = false;
    f.appendChild(im);
    book.appendChild(f);
    sb3d.style.setProperty('--shade', '0');
    updateAboutBio();
  } else {
    const next = turn.dir === 'next';
    book.appendChild(halfEl('left', next ? turn.from : turn.to));
    book.appendChild(halfEl('right', next ? turn.to : turn.from));
    book.appendChild(buildCurl(turn.dir, turn.from, turn.to));
    applyTurn(turn.t);
  }

  const a = el('button', 'sb-zone sb-prev'), b = el('button', 'sb-zone sb-next');
  a.setAttribute('aria-label', 'Halaman Sebelumnya');
  b.setAttribute('aria-label', 'Halaman Selanjutnya');
  book.appendChild(a);
  book.appendChild(b);

  layout();
  caption();
  marks();
  if (typeof syncZoomLayer === 'function') syncZoomLayer();
  if (typeof placeLoupe === 'function') placeLoupe();
}

let capOut = null, capIn = null;
function caption() {
  capBox.textContent = '';
  capOut = capIn = null;
  if (turn) {
    capOut = el('p', 'sb-caption live');
    capOut.textContent = PAGES[turn.from].title;
    capBox.appendChild(capOut);
    capIn = el('p', 'sb-caption live');
    capIn.textContent = PAGES[turn.to].title;
    capBox.appendChild(capIn);
    fadeCaption(turn.t);
  } else {
    const p = el('p', 'sb-caption');
    p.textContent = PAGES[idx].title;
    capBox.appendChild(p);
  }
}

function fadeCaption(t) {
  if (!capOut || !capIn) return;
  const out = 1 - Math.max(0, Math.min(1, (t - 0.10) / 0.28));
  const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.30));
  capOut.style.opacity = out.toFixed(3);
  capIn.style.opacity = inn.toFixed(3);
}

function layout() {
  sb3d.style.setProperty('--bw', book.clientWidth + 'px');
}
addEventListener('resize', layout);

/* ------------------------------------------------------ spring loop */
let spring = null;
function animateTo(target, onDone, stiff, damp) {
  spring = { kind: 'spring', v: 0, target: target, done: onDone, k: stiff || 150, c: damp || 22 };
  kick();
}

function tweenTo(target, dur, onDone) {
  spring = { kind: 'tween', from: turn ? turn.t : 0, target: target, dur: dur, e: 0, done: onDone };
  kick();
}

let raf = null, last = 0;
function tick(now) {
  raf = null;
  const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
  last = now;

  if (spring && turn) {
    const s = spring;
    if (s.kind === 'tween') {
      s.e += dt;
      const k = Math.min(1, s.e / s.dur);
      turn.t = s.from + (s.target - s.from) * k;
      applyTurn(turn.t);
      if (k >= 1) {
        spring = null;
        const d = s.done;
        d && d();
      }
    } else {
      const x = turn.t - s.target;
      s.v += (-s.k * x - s.c * s.v) * dt;
      turn.t += s.v * dt;
      if (Math.abs(turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
        turn.t = s.target;
        spring = null;
        applyTurn(turn.t);
        const d = s.done;
        d && d();
      } else {
        applyTurn(turn.t);
      }
    }
  }

  viewSpring();
  const lmoved = loupeEase();
  if ((spring || viewActive || lmoved) && raf === null) {
    raf = requestAnimationFrame(tick);
  }
}

function kick() {
  if (raf === null) {
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
}

/* ------------------------------------------- tilt + zoom of the book */
const TILT_X = 4.5, TILT_Y = 7;
const ZOOM_MIN = 0.9, ZOOM_MAX = 1.5;
const view = { rx: 0, ry: 0, z: 1, trx: 0, try_: 0, tz: 1 };
let viewActive = false;
let lastZ = 1;

function applyView() {
  sb3d.style.setProperty('--rx', view.rx.toFixed(2) + 'deg');
  sb3d.style.setProperty('--ry', view.ry.toFixed(2) + 'deg');
  sb3d.style.setProperty('--zoom', view.z.toFixed(3));
  if (view.z !== lastZ) {
    lastZ = view.z;
    if (typeof placeLoupe === 'function') placeLoupe();
  }
}

function viewSpring() {
  const e = 0.14;
  let moved = false;
  for (const [k, t] of [['rx', 'trx'], ['ry', 'try_'], ['z', 'tz']]) {
    const d = view[t] - view[k];
    if (Math.abs(d) > 0.0006) {
      view[k] += d * e;
      moved = true;
    } else {
      view[k] = view[t];
    }
  }
  if (moved) applyView();
  viewActive = moved;
  return moved;
}

function setView(rx, ry, z) {
  view.trx = Math.max(-TILT_X, Math.min(TILT_X, rx));
  view.try_ = Math.max(-TILT_Y, Math.min(TILT_Y, ry));
  view.tz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
  viewActive = true;
  kick();
  if (typeof syncZoom === 'function') syncZoom();
}

function tiltTo(cx, cy) {
  if (drag) return;
  const r = book.getBoundingClientRect();
  if (!r.width) return;
  const nx = Math.max(-1, Math.min(1, (cx - (r.left + r.width / 2)) / (r.width * 0.62)));
  const ny = Math.max(-1, Math.min(1, (cy - (r.top + r.height / 2)) / (r.height * 0.9)));
  setView(-ny * TILT_X, nx * TILT_Y, view.tz);
}

addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  tiltTo(e.clientX, e.clientY);
}, { passive: true });

addEventListener('pointerout', e => {
  if (!e.relatedTarget) setView(0, 0, view.tz);
});
addEventListener('blur', () => setView(0, 0, view.tz));

stage.addEventListener('dblclick', () => setView(view.trx, view.try_, 1));

/* ------------------------------------------------------- pointer work */
let drag = null;
function bookRect() { return book.getBoundingClientRect(); }
function hideHint() { hint.classList.add('gone'); }

stage.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  e.preventDefault();
  const onBook = e.target.closest('.sb-zone');
  stage.setPointerCapture(e.pointerId);
  hideHint();
  if (!onBook || introOn) return;
  const r = bookRect();
  const dir = (e.clientX - r.left) / r.width > 0.5 ? 'next' : 'prev';
  startTurn(dir, 0);
  drag = { dir: dir, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now() };
});

stage.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x0;
  drag.moved = Math.max(drag.moved, Math.abs(dx));
  const raw = (drag.dir === 'next' ? -dx : dx) / (drag.w * 0.62);
  const t = Math.max(0, Math.min(1, raw));
  const now = performance.now();
  drag.vel = (t - (turn ? turn.t : 0)) / Math.max(0.001, (now - drag.tPrev) / 1000);
  drag.tPrev = now;
  if (turn) { turn.t = t; applyTurn(t); }
});

function endDrag(e) {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (!turn) return;
  if (d.moved < 6) {
    PageAudio.play(turn.dir);
    commit();
    return;
  }
  const go = turn.t > 0.42 || d.vel > 1.1;
  if (go) {
    PageAudio.play(turn.dir);
    commit();
  } else {
    cancel();
  }
}

stage.addEventListener('dragstart', e => e.preventDefault());
stage.addEventListener('selectstart', e => e.preventDefault());
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

/* ------------------------------------------------------ turn control */
function startTurn(dir, t) {
  spring = null;
  if (turn) { idx = turn.to; turn = null; }
  if (typeof shoveLoupe === 'function') shoveLoupe(dir);
  const from = idx;
  turn = { dir: dir, from: from, to: dir === 'next' ? (from + 1) % M : (from - 1 + M) % M, t: t || 0 };
  paint();
}

function commit() {
  if (!turn) return;
  if (REDUCED) {
    idx = turn.to;
    turn = null;
    paint();
    return;
  }
  animateTo(1, () => {
    idx = turn.to;
    turn = null;
    paint();
  }, 170, 26);
  kick();
}

function cancel() {
  if (!turn) return;
  animateTo(0, () => {
    turn = null;
    paint();
  }, 150, 24);
  kick();
}

function step(dir) {
  if (introOn) endIntro();
  if (turn) { idx = turn.to; turn = null; }
  PageAudio.play(dir);
  startTurn(dir, 0);
  commit();
}

function goTo(i) {
  if (introOn) endIntro();
  if (i === idx) return;
  if (turn) { idx = turn.to; turn = null; }
  const fwd = (i - idx + M) % M, back = (idx - i + M) % M;
  if (Math.min(fwd, back) === 1) {
    step(fwd === 1 ? 'next' : 'prev');
    return;
  }
  PageAudio.play(fwd < back ? 'next' : 'prev');
  idx = i;
  paint();
  updateAboutBio();
}

document.getElementById('sbLeft').onclick = () => step('prev');
document.getElementById('sbRight').onclick = () => step('next');

addEventListener('keydown', e => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  e.preventDefault();
  hideHint();
  step(e.key === 'ArrowRight' ? 'next' : 'prev');
});

document.getElementById('heroDown').onclick = () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* --------------------------------------------------- loupe + controls */
const loupe = document.getElementById('loupe');
const lens = document.getElementById('loupeLens');
const mag = document.getElementById('loupeMag');
const zRead = document.getElementById('zRead');
const loupeBtn = document.getElementById('loupeBtn');
const zInBtn = document.getElementById('zIn'), zOutBtn = document.getElementById('zOut');
const MAG = 2.3;
let loupeOn = true, lx = null, ly = null, lgrab = null, lTarget = null;

function loupeSize() {
  return Math.round(Math.max(165, Math.min(262, book.clientWidth * 0.235)));
}

function bookBox() {
  return { x: 0, y: 0, w: book.clientWidth, h: book.clientHeight };
}

function restLoupe() {
  const b = bookBox();
  lx = b.x + b.w * 0.88;
  ly = b.y + b.h * 0.855;
  placeLoupe();
}

const zoomWrap = document.getElementById('zoomWrap');
const zoomInner = document.getElementById('zoomInner');

function syncZoomLayer() {
  zoomInner.textContent = '';
  for (const c of book.children) {
    if (c.classList.contains('sb-zone')) continue;
    zoomInner.appendChild(c.cloneNode(true));
  }
}

function placeLoupe() {
  if (lx === null) return;
  const B = bookBox(), bw = B.w, bh = B.h;
  if (!bw) return;
  const R = loupeSize() / 2, bez = R * 2 * 0.058;
  loupe.style.setProperty('--lr', R * 2 + 'px');
  loupe.style.transform = 'translate3d(' + (lx - R).toFixed(1) + 'px,' + (ly - R).toFixed(1) + 'px,0)';
  if (loupeOn) loupe.classList.add('on');

  const z = view.z, cx = bw / 2, cy = bh / 2;
  const x0 = cx + (bw * .051 - cx) * z, x1 = cx + (bw * .949 - cx) * z;
  const y0 = cy + (bh * .218 - cy) * z, y1 = cy + (bh * .782 - cy) * z;

  const nx = Math.max(x0, Math.min(lx, x1));
  const ny = Math.max(y0, Math.min(ly, y1));
  const inside = (lx > x0 && lx < x1 && ly > y0 && ly < y1)
    ? Math.min(lx - x0, x1 - lx, ly - y0, y1 - ly)
    : -Math.hypot(lx - nx, ly - ny);
  const k = Math.max(0, Math.min(1, (inside + R * 0.30) / (R * 0.55)));

  zoomWrap.style.opacity = (loupeOn ? k : 0).toFixed(3);
  if (k <= 0.002) return;
  const r = (R - bez).toFixed(1);
  const mask = 'radial-gradient(circle ' + r + 'px at ' + lx.toFixed(1) + 'px ' + ly.toFixed(1) + 'px,#000 calc(100% - 1px),transparent 100%)';
  zoomWrap.style.webkitMaskImage = mask;
  zoomWrap.style.maskImage = mask;

  const px = cx + (lx - cx) / z, py = cy + (ly - cy) / z, s = MAG * z;
  zoomInner.style.transform = 'translate(' + (lx - px * s).toFixed(1) + 'px,' + (ly - py * s).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
}

function shoveLoupe(dir) {
  if (!loupeOn || lx === null || lgrab) return;
  const b = bookBox();
  const nx = (b.w / 2 + (lx - b.x - b.w / 2) / view.z) / b.w;
  const ny = (b.h / 2 + (ly - b.y - b.h / 2) / view.z) / b.h;
  if (nx < 0.02 || nx > 0.98 || ny < 0.17 || ny > 0.83) return;
  lTarget = { x: b.x + b.w * (dir === 'next' ? 0.12 : 0.88), y: b.y + b.h * 0.855 };
  kick();
}

function loupeEase() {
  if (!lTarget) return false;
  if (lgrab) { lTarget = null; return false; }
  const dx = lTarget.x - lx, dy = lTarget.y - ly;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
    lx = lTarget.x;
    ly = lTarget.y;
    lTarget = null;
    placeLoupe();
    return false;
  }
  lx += dx * 0.17;
  ly += dy * 0.17;
  placeLoupe();
  return true;
}

loupe.addEventListener('pointerdown', e => {
  if (!loupeOn || e.button !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  lTarget = null;
  lgrab = { cx: e.clientX, cy: e.clientY, lx0: lx, ly0: ly };
  loupe.classList.add('held');
  loupe.setPointerCapture(e.pointerId);
  hideHint();
});

loupe.addEventListener('pointermove', e => {
  if (!lgrab) return;
  const b = bookBox(), R = loupeSize() / 2;
  lx = Math.max(b.x - R * 0.7, Math.min(b.x + b.w + R * 0.7, lgrab.lx0 + (e.clientX - lgrab.cx)));
  ly = Math.max(b.y - R * 0.7, Math.min(b.y + b.h + R * 1.0, lgrab.ly0 + (e.clientY - lgrab.cy)));
  placeLoupe();
});

function dropLoupe() {
  lgrab = null;
  loupe.classList.remove('held');
}
loupe.addEventListener('pointerup', dropLoupe);
loupe.addEventListener('pointercancel', dropLoupe);

loupeBtn.onclick = () => {
  loupeOn = !loupeOn;
  loupeBtn.setAttribute('aria-pressed', String(loupeOn));
  loupe.classList.toggle('on', loupeOn);
  if (loupeOn && lx === null) restLoupe();
};

const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  soundBtn.onclick = () => {
    const on = PageAudio.toggle();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.title = on ? 'Sakelar Efek Suara Halaman (Aktif)' : 'Sakelar Efek Suara Halaman (Nonaktif)';
    const iconOn = soundBtn.querySelector('.icon-sound-on');
    const iconOff = soundBtn.querySelector('.icon-sound-off');
    if (iconOn && iconOff) {
      iconOn.style.display = on ? 'block' : 'none';
      iconOff.style.display = on ? 'none' : 'block';
    }
  };
}

addEventListener('resize', () => {
  lx = null;
  restLoupe();
});

function syncZoom() {
  zRead.textContent = Math.round(view.tz * 100) + '%';
  zOutBtn.disabled = view.tz <= ZOOM_MIN + 0.001;
  zInBtn.disabled = view.tz >= ZOOM_MAX - 0.001;
}
zInBtn.onclick = () => { setView(view.trx, view.try_, view.tz * 1.16); hideHint(); };
zOutBtn.onclick = () => { setView(view.trx, view.try_, view.tz / 1.16); hideHint(); };

/* --------------------------------------------------------- the index */
const plateList = document.getElementById('plateList');
PAGES.forEach((p, i) => {
  const li = el('li');
  const b = el('button', 'plate');
  b.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
    '<span class="t"></span><span class="p"></span>';
  b.querySelector('.t').textContent = p.title;
  b.querySelector('.p').textContent = p.place;
  b.onclick = () => {
    goTo(i);
    document.getElementById('sketchbook').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  li.appendChild(b);
  plateList.appendChild(li);
});


let currentBioIdx = -1;
function updateAboutBio() {
  if (currentBioIdx === idx) return;
  currentBioIdx = idx;

  const p = PAGES[idx];
  if (!p) return;

  const contentBox = document.querySelector('.about-content');
  const labelEl = document.getElementById('about-heading');
  const titleEl = document.getElementById('aboutTitle');
  const subtitleEl = document.getElementById('aboutSubtitle');
  const bioEl = document.getElementById('aboutBio');
  const metaEl = document.getElementById('aboutMeta');

  const tokohCard = document.getElementById('tokohCard');
  const tokohImg = document.getElementById('tokohImg');
  const tokohName = document.getElementById('tokohName');
  const tokohRole = document.getElementById('tokohRole');
  const tokohBio = document.getElementById('tokohBio');

  const applyData = () => {
    if (labelEl) labelEl.textContent = 'Catatan Perjalanan · ' + (p.plate || ('Pelat ' + String(idx + 1).padStart(2, '0')));
    if (titleEl) titleEl.textContent = p.title;
    if (subtitleEl) subtitleEl.textContent = p.subtitle || p.place;
    if (bioEl) bioEl.textContent = p.bio;
    if (metaEl && p.tags) {
      metaEl.innerHTML = p.tags.map(t => '<span class="about-tag">' + t + '</span>').join('');
    }
    if (p.tokoh) {
      if (tokohImg) {
        tokohImg.src = p.tokoh.image;
        tokohImg.alt = p.tokoh.name;
      }
      if (tokohName) tokohName.textContent = p.tokoh.name;
      if (tokohRole) tokohRole.textContent = p.tokoh.role;
      if (tokohBio) tokohBio.textContent = p.tokoh.bio;
    }
  };

  if (contentBox) {
    contentBox.classList.add('updating');
    if (tokohCard) tokohCard.classList.add('updating');
    setTimeout(() => {
      applyData();
      contentBox.classList.remove('updating');
      if (tokohCard) tokohCard.classList.remove('updating');
    }, 130);
  } else {
    applyData();
  }
}

function marks() {
  const cur = turn ? turn.to : idx;
  plateList.querySelectorAll('.plate').forEach((b, i) => {
    b.setAttribute('aria-current', i === cur ? 'true' : 'false');
  });
}

/* ---------------------------------------------------------- the riffle */
let riffle = null, riffleAt = 0, introOn = false;
function endIntro() {
  introOn = false;
  wrap.classList.remove('intro', 'b2');
  updateAboutBio();
}

function riffleStep() {
  const s = riffle[riffleAt];
  wrap.classList.toggle('b2', s.bell > 0.55);
  startTurn('next', 0);
  tweenTo(1, s.dur, () => {
    idx = turn.to;
    turn = null;
    riffleAt++;
    if (introOn && riffleAt < riffle.length) {
      paint();
      riffleStep();
    } else {
      endIntro();
      paint();
    }
  });
}

function startIntro() {
  const coarse = matchMedia('(max-width: 640px), (pointer: coarse)').matches;
  if (coarse || REDUCED || Q.has('nointro')) {
    idx = LAND;
    paint();
    return;
  }
  const steps = M + LAND;
  riffle = [];
  for (let r = 0; r < steps; r++) {
    const bell = Math.sin(Math.PI * (r / (steps - 1)));
    riffle.push({ bell: bell, dur: 0.26 - 0.19 * bell });
  }
  riffleAt = 0;
  introOn = true;
  wrap.classList.add('intro');
  riffleStep();
}

/* Mobile Menu Toggle Handler */
const mobileToggle = document.getElementById('mobileMenuToggle');
const mobileDropdown = document.getElementById('mobileDropdown');
if (mobileToggle && mobileDropdown) {
  mobileToggle.addEventListener('click', () => {
    const isExp = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isExp));
    mobileDropdown.classList.toggle('open', !isExp);
  });
  mobileDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDropdown.classList.remove('open');
    });
  });
}

/* ------------------------------------------------------------- boot */
(async function boot() {
  idx = Q.has('shot') ? (parseInt(Q.get('shot'), 10) || 0) % M : 0;
  paint();
  applyView();

  await Promise.all(PAGES.map(p => {
    const im = new Image();
    im.src = p.url;
    return im.decode ? im.decode().catch(() => { }) : new Promise(r => { im.onload = im.onerror = r; });
  }));

  if (document.fonts && document.fonts.ready) await document.fonts.ready.catch(() => { });
  syncZoom();
  restLoupe();
  document.body.dataset.ready = '1';

  if (Q.has('shot')) {
    if (Q.has('t')) { startTurn(Q.get('dir') || 'next', parseFloat(Q.get('t'))); }
    return;
  }
  setTimeout(startIntro, 220);
})();
