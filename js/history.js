/**
 * Lelana Jateng — History Exhibition Module
 * Curated Historiographical Engine:
 * 1. Tempat Wisata (Candi, Kaldera, Alam & Kawasan Bersejarah)
 * 2. Museum (Khazanah Benda Cagar Budaya & Arsip Sejarah)
 * 3. Galeri Budaya (Seni Batik, Kriya Tradisi & Living Heritage)
 * Merekam sejarah dari awal mula pembuatan hingga sekarang.
 * 
 * Edisi Artikel Super Lengkap:
 * Setiap kartu destinasi (01–04) membuka monograf kuratorial komprehensif
 * berstandar ensiklopedia sejarah, dilengkapi daftar isi interaktif (TOC),
 * fakta cagar budaya, 4 bab kronologi, analisis arsitektur, garis waktu,
 * serta profil tokoh sejarah kunci.
 */

(function () {
  'use strict';

  const HISTORY_CATEGORIES = [
    {
      id: 'tempat-wisata',
      name: 'Tempat Wisata (Cagar Candi & Alam)',
      label: 'Tempat Wisata',
      categoryType: 'Kategori 01 · Tempat Wisata',
      period: 'Abad VII M – Sekarang',
      titleSmall: 'Historiografi & Asal-Usul',
      titleMain: 'Tempat Wisata',
      eraBadge: 'Tempat Wisata · Pembangunan Purba Abad VII Masehi hingga Wisata Global',
      narrative: 'Sejarah tempat wisata pusaka Jawa Tengah berawal dari abad ke-7 hingga ke-9 Masehi saat dataran tinggi Dieng dan lembah Kedu-Prambanan dipilih sebagai poros spiritual tanah Jawa. Dieng menjadi percandian dewata tertua (abad VII M), disusul pembangunan kolosal Candi Borobudur oleh Dinasti Syailendra (770–825 M) dengan 2.672 relief andesit, serta Candi Prambanan setinggi 47 meter oleh Dinasti Sanjaya (856 M). Akibat letusan dahsyat Gunung Merapi dan gempa pada abad ke-10, pusat peradaban pindah ke timur, menyebabkan candi-candi tertimbun abu vulkanik dan hutan rimba selama ratusan tahun. Pada 1814, Thomas Stamford Raffles menginisiasi pembersihan Borobudur. Setelah melalui pemugaran akbar internasional bersama UNESCO (1973–1983) dan penetapan Warisan Dunia (1991), tempat wisata ini kini berdiri megah sebagai magnet pariwisata berkelanjutan kelas dunia.',
      image: 'assets/history/mataram.jpg',
      plaque: 'Mahakarya Pahat Andesit & Stupa Mandala · Abad VII M – Sekarang (UNESCO World Heritage)',
      cards: [
        {
          num: '01',
          thumb: 'assets/borobudur.jpg',
          title: 'Candi Borobudur (Magelang)',
          desc: 'Mandala Buddha terbesar di dunia karya Mpu Gunadharma (770 M) dengan 2.672 relief andesit tanpa semen.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · CANDI BOROBUDUR',
            title: 'Mahakarya Stupa Mandala Borobudur: Dari Pahat Andesit Wangsa Syailendra 770 Masehi Hingga Monumen Warisan Kemanusiaan Dunia UNESCO',
            subtitle: 'Monograf komprehensif mengkaji kosmologi tiga ranah kesadaran jiwa, misteri 2.672 panel relief naratif, malapetaka erupsi kataklisik Merapi abad ke-10, ekskavasi Raffles 1814, hingga mega-restorasi teknik sipil berbantuan komputer UNESCO dan konservasi sandal ramah batu Upanat.',
            readTime: '12 Menit Waktu Baca',
            curator: 'Balai Konservasi Borobudur & Unit Kebudayaan UNESCO Situs No. 592',
            heroImg: 'assets/borobudur.jpg',
            heroCaption: 'Siluet stupa terawang Candi Borobudur di kala fajar menyingsing di atas Lembah Kedu dan Pegunungan Menoreh, Magelang (Dokumentasi UNESCO Situs No. 592).',
            lead: 'Di bentang Lembah Kedu yang subur nan permai, diapit empat gunung api purba—Merapi, Merbabu, Sumbing, dan Sindoro—Candi Borobudur berdiri megah sebagai puncak pencapaian spiritual, artistik, dan rekayasa sipil peradaban Nusantara. Dibangun sekitar tahun 770 hingga 825 Masehi di bawah naungan raja-raja Wangsa Syailendra, Borobudur bukan sekadar tumpukan batu mati, melainkan sebuah perpustakaan batu andesit raksasa tiga dimensi yang menerjemahkan kitab suci ajaran Buddha Mahayana ke dalam arsitektur kosmis berundak sepuluh tingkatan.',
            quickFacts: [
              { label: 'Tahun Pendirian', val: '770 – 825 Masehi (Wangsa Syailendra)' },
              { label: 'Prasasti Rujukan', val: 'Prasasti Karangtengah (824 M) & Tri Tepusan (842 M)' },
              { label: 'Arsitek Agung', val: 'Mpu Gunadharma' },
              { label: 'Volume & Material', val: '2 Juta Balok Andesit Vulkanik (±55.000 m³ Tanpa Semen)' },
              { label: 'Jumlah Relief', val: '2.672 Panel Pahat (1.460 Naratif & 1.212 Dekoratif)' },
              { label: 'Populasi Stupa & Arca', val: '504 Arca Buddha & 72 Stupa Terawang + 1 Stupa Induk' },
              { label: 'Status Warisan Dunia', val: 'UNESCO World Heritage Site No. 592 (Ditetapkan 1991)' },
              { label: 'Episentrum Administrasi', val: 'Kecamatan Borobudur, Kabupaten Magelang, Jawa Tengah' }
            ],
            destLink: {
              label: 'Buka Candi Borobudur di Buku Sketsa Destinasi',
              href: 'destinasi.html#borobudur'
            },
            chapters: [
              {
                id: 'ch-borobudur-1',
                num: 'BAB 01',
                period: 'Tahun 770 – 825 Masehi',
                title: 'Fajar Pahat Andesit, Arsitek Mpu Gunadharma & Kosmologi Mandala Tiga Ranah',
                paragraphs: [
                  'Pendirian Candi Borobudur diperkirakan dimulai pada masa pemerintahan Maharaja Rakai Panangkaran (760–775 M) atau putranya Dharanindra dari dinasti Syailendra, dan diselesaikan secara tuntas pada masa Raja Samaratungga sekitar tahun 825 Masehi. Informasi sejarah pembangunan ini diperkuat oleh analisis paleografi aksara Kawi pada Prasasti Karangtengah (bertarikh 824 M) yang menyebutkan peresmian bangunan suci bernama Jinalaya (tempat para penakluk hawa nafsu) dan Prasasti Tri Tepusan (bertarikh 842 M) yang menetapkan tanah sima bebas pajak bagi pemeliharaan bangunan suci Kamulan I Bhumisambhara (asal mula nama Borobudur).',
                  'Perancangan struktur raksasa ini dipimpin oleh seorang intelektual dan perancang agung bernama Mpu Gunadharma. Sekitar dua juta balok batu andesit vulkanik padat ditambang dari pertemuan Sungai Progo dan Sungai Elo yang berjarak sekitar 2,5 kilometer dari lokasi pembangunan. Balok-balok batu seberat ratusan kilogram tersebut diangkut memanfaatkan tenaga gajah, banteng, dan rakit kayu, lalu dipahat di tempat dengan ketelitian geometri sudut yang amat mengagumkan.',
                  'Tanpa mengenal perekat kapur maupun semen, Mpu Gunadharma menerapkan teknik interlocking (sambungan takik tak bertulang): sistem ekor burung (dovetail), takik pen, dan alur lidah yang saling mengunci rapat. Candi dibangun menyelimuti sebuah bukit alami yang dipadatkan dan diperkuat dinding penahan tanah bertingkat, membentuk denah mandala bujur sangkar berukuran 123 x 123 meter dengan tinggi asli mencapai 42 meter.',
                  'Secara kosmologis dan filosofis, Borobudur merupakan representasi alam semesta makrokosmos dan tingkatan batin manusia (mikrokosmos) yang terbagi menjadi tiga ranah kesadaran spiritual:\n1. Kamadhatu (Kaki Candi): Melambangkan dunia manusia fana yang masih terbelenggu oleh hawa nafsu, keterikatan duniawi, dan hukum karma sebab-akibat. Di bagian kaki ini terpahat 160 panel relief Mahakarmavibhangga yang kemudian ditutup oleh dinding penguat tambahan (dinding selubung) sebelum candi selesai disempurnakan.\n2. Rupadhatu (Empat Teras Berdenah Persegi): Melambangkan alam antara tempat manusia telah mampu membebaskan diri dari hawa nafsu kasar, namun masih terikat pada bentuk, nama, dan wujud rupa. Dinding teras ini dipenuhi 1.300 panel relief naratif yang membentang sepanjang 2,5 kilometer, memuat kisah riwayat hidup Sang Buddha (Lalitavistara), kisah kelahiran lampau dan kebajikan Bodhisattva (Jataka dan Avadana), serta perjalanan pencarian spiritual Sudhana (Gandavyuha dan Bhadracari).\n3. Arupadhatu (Tiga Teras Melingkar Tanpa Pagar Langkan): Melambangkan alam kemurnian spiritual tertinggi tanpa rupa, tanpa hasrat, dan tanpa bentuk jasmani. Teras ini dihiasi 72 stupa terawang berbentuk bel berlubang belah ketupat dan bujur sangkar yang di dalamnya menaungi arca Buddha bersila dengan sikap tangan Dharmachakra Mudra (memutar roda darma kebenaran). Di titik puncak sentral menjulang Stupa Induk raksasa berdiameter 9,9 meter yang sepenuhnya polos hampa dan kosong, menyimbolkan tercapainya Nirwana mutlak.'
                ],
                figure: {
                  img: 'assets/borobudur.jpg',
                  caption: 'Teras melingkar Arupadhatu dengan barisan stupa terawang berlatar belakang kabut vulkanik Lembah Menoreh.'
                },
                callout: {
                  title: 'Rahasia Teknik Sambungan Takik & Sistem Drainase Jaladwara',
                  text: 'Struktur Borobudur dilengkapi 100 pancuran air bermulut makhluk mitologis Makara yang disebut Jaladwara. Sistem drainase internal ini mengalirkan jutaan liter air hujan dari teras paling atas langsung keluar dinding candi tanpa merembes ke bukit tanah di dalamnya, mencegah tanah longsor selama berabad-abad.'
                }
              },
              {
                id: 'ch-borobudur-2',
                num: 'BAB 02',
                period: 'Abad X – XVIII Masehi',
                title: 'Bencana Kataklisik Merapi, Eksodus Dinasti & Tidur Panjang 9 Abad di Bawah Rimbun Rimba Tropis',
                paragraphs: [
                  'Zaman keemasan peradaban Mataram Kuno di Jawa Tengah berakhir secara dramatis pada paruh pertama abad ke-10 Masehi. Penelitian vulkano-arkeologi membuktikan terjadinya rangkaian letusan kataklisik dahsyat Gunung Merapi yang memuntahkan miliaran meter kubik material piroklastik, disusul banjir lahar dingin yang meluap dari Sungai Progo dan Sungai Opak serta gempa bumi tektonik hebat.',
                  'Bencana alam berskala masif ini menghancurkan lahan pertanian subur di lembah Kedu, merusak sistem irigasi persawahan, dan menimbulkan krisis pangan serta wabah penyakit. Pada tahun 929 Masehi, Raja Mpu Sindok mengambil keputusan strategis untuk mengevakuasi pusat peradaban dan takhta Kerajaan Mataram Kuno jauh ke Jawa Timur, mendirikan Dinasti Isyana di lembah Sungai Brantas.',
                  'Ditinggalkan oleh para biarawan dan rakyat pemujanya, Borobudur perlahan sunyi. Abu vulkanik tebal menimbun teras-teras berundak, sementara iklim tropis khatulistiwa yang lembap mempercepat pertumbuhan spora lumut, tanaman merambat, dan pohon beringin raksasa. Akar-akar pohon purba mencengkeram celah andesit, menenggelamkan stupa mandala ini ke dalam tidur panjang selama hampir 900 tahun.',
                  'Dalam kurun waktu berabad-abad tersebut, memori kolektif masyarakat lokal terhadap hakikat sebenarnya Borobudur perlahan memudar dan bermutasi menjadi mitos tutur lisan. Dalam naskah Babad Tanah Jawi (abad ke-18), bukit reruntuhan ini disebut sebagai "Redi Borobudur" yang dianggap sebagai tempat keramat berhawa wingit dan pembawa sial bagi para pemberontak yang berani mendekatinya.'
                ],
                figure: {
                  img: 'assets/articles/borobudur-relief.jpg',
                  caption: 'Dokumentasi panel pahat relief batu andesit Candi Borobudur yang memuat ajaran moralitas dan kisah kebajikan masa lalu.'
                }
              },
              {
                id: 'ch-borobudur-3',
                num: 'BAB 03',
                period: 'Tahun 1814 – 1983',
                title: 'Ekskavasi Raffles 1814, Pemugaran Van Erp hingga Mega-Restorasi Komputer UNESCO',
                paragraphs: [
                  'Titik balik kebangkitan Borobudur terjadi pada tahun 1814 saat masa transisi pemerintahan pendudukan Inggris di Hindia Belanda. Letnan Gubernur Jenderal Sir Thomas Stamford Raffles yang sangat menaruh minat pada riset antikuitas Jawa mendengar kabar desas-desus mengenai adanya gundukan bukit batu raksasa penuh ukiran di tengah hutan dekat Magelang.',
                  'Raffles segera mengutus insinyur militer berkebangsaan Belanda, Hermanus Christiaan Cornelius, bersama satu kompi berkekuatan 200 prajurit zeni. Selama hampir dua bulan penuh, Cornelius membabat semak belukar berduri, menebang pepohonan besar, dan menggali ribuan ton endapan tanah vulkanik hingga lapisan teras dan stupa mulai menampakkan keagungannya ke cahaya terang dunia.',
                  'Upaya pemugaran awal secara terpadu dipimpin oleh insinyur Theodoor van Erp pada tahun 1907 hingga 1911. Van Erp membongkar dan menata kembali tiga teras melingkar serta stupa-stupa terawang di puncak Arupadhatu. Namun, pembersihan permukaan batu tanpa perbaikan struktur tanah bukit bagian dalam justru menimbulkan ancaman baru: air hujan merembes ke pori-pori andesit, melunakkan bukit inti candi, dan mendorong dinding teras miring ke arah jurang dengan ancaman keruntuhan total.',
                  'Pasca kemerdekaan, Presiden pertama RI Ir. Soekarno dan kemudian Presiden Soeharto menyuarakan penyelamatan Borobudur sebagai isu kepedulian peradaban antarbangsa. Pada tahun 1973 hingga 1983, diluncurkan "Proyek Restorasi Candi Borobudur" bersama UNESCO dengan total pendanaan internasional mencapai 25 juta dolar AS.',
                  'Dipimpin oleh arkeolog terkemuka Prof. Dr. Soekmono, proyek ini menjadi operasi rekayasa teknik sipil dan pelestarian cagar budaya terbesar dalam sejarah manusia. Lebih dari 1.000.000 balok batu andesit dibongkar secara bertahap, diberi nomor registrasi kode komputer mainframe IBM, dibersihkan dari lumut di laboratorium mikrobiologi khusus, dipasangi sistem drainase internal anti-rembesan serta lapisan beton bertulang penyangga lereng, lalu dipasang kembali dengan toleransi ketepatan milimeter.'
                ],
                figure: {
                  img: 'assets/articles/borobudur-restorasi-1907.jpg',
                  caption: 'Arsip bersejarah Candi Borobudur dalam perancah bambu pemugaran awal oleh Theodoor van Erp tahun 1907–1911 (Koleksi Tropenmuseum).'
                },
                callout: {
                  title: 'Komputerisasi Arkeologi Pertama di Planet Bumi',
                  text: 'Proyek restorasi UNESCO 1973–1983 adalah pemugaran warisan budaya pertama di dunia yang memanfaatkan basis data komputer mainframe untuk memetakan koordinat spasial 3D, sudut kemiringan lereng, dan diagnosis kimiawi dari satu juta lebih balok batu andesit.'
                }
              },
              {
                id: 'ch-borobudur-4',
                num: 'BAB 04',
                period: 'Tahun 1991 – 2026',
                title: 'Living Heritage Kemanusiaan, Tri Suci Waisak Dunia & Konservasi Sandal Upanat',
                paragraphs: [
                  'Pada 13 Desember 1991, dalam Sidang Komite Warisan Dunia ke-15 di Carthage, UNESCO resmi menetapkan Kompleks Candi Borobudur sebagai Situs Warisan Budaya Dunia (World Heritage Site No. 592). Borobudur diakui memenuhi tiga kriteria ketat: mahakarya kejeniusan kreatif manusia (Kriteria i), pertukaran nilai kemanusiaan penting dalam kurun waktu bersejarah (Kriteria ii), dan kaitan langsung dengan peristiwa atau tradisi hidup keyakinan universal (Kriteria vi).',
                  'Kini, Borobudur tidak lagi diperlakukan semata-mata sebagai monumen arkeologis yang sunyi, melainkan sebagai Living Heritage (warisan hidup yang bernapas). Setiap tahun pada malam bulan purnama Mei, pelataran candi menjadi episentrum perayaan Hari Raya Tri Suci Waisak internasional yang dihadiri puluhan ribu biksu, samanera, dan umat Buddha dari puluhan negara yang menyalakan ribuan lampion perdamaian ke angkasa malam.',
                  'Menghadapi tantangan keausan batu akibat gesekan jutaan alas kaki wisatawan modern, Badan Otorita Borobudur dan Kementerian Kebudayaan menetapkan regulasi konservasi mutakhir: membatasi kuota kunjungan naik ke struktur candi maksimal 1.200 orang per hari, didampingi pemandu kuratorial bersertifikat, serta kewajiban mengenakan "Upanat"—sandal khusus berbahan anyaman daun pandan alami karya pengrajin UMKM lokal Magelang yang bertekstur empuk guna menjamin kelestarian relief andesit purba hingga ribuan tahun mendatang.'
                ]
              }
            ],
            timeline: [
              { year: '770 M', title: 'Peletakan Batu Pertama', desc: 'Wangsa Syailendra memulai ekskavasi dan perakitan andesit Sungai Progo di bawah arahan arsitek Mpu Gunadharma.' },
              { year: '825 M', title: 'Penyempurnaan Stupa Induk', desc: 'Maharaja Samaratungga menuntaskan pembangunan stupa mandala dan penutupan kaki relief Mahakarmavibhangga.' },
              { year: '842 M', title: 'Penetapan Tanah Bebas Pajak', desc: 'Prasasti Tri Tepusan mencatat peresmian tanah sima desa untuk menjamin biaya pemeliharaan Kamulan I Bhumisambhara.' },
              { year: '929 M', title: 'Erupsi Merapi & Eksodus Brantas', desc: 'Letusan kataklisik Merapi mengubur lembah Kedu; Mpu Sindok memindahkan istana Mataram Kuno ke Jawa Timur.' },
              { year: '1814 M', title: 'Penemuan Kembali oleh Raffles', desc: 'Thomas Stamford Raffles mengutus insinyur H.C. Cornelius membabat hutan belukar dan menyingkap relief andesit.' },
              { year: '1907–1911 M', title: 'Restorasi Theodoor van Erp', desc: 'Pembongkaran dan rekonstruksi teras Arupadhatu dan stupa terawang oleh Jawatan Purbakala Hindia Belanda.' },
              { year: '1973–1983 M', title: 'Mega-Pemugaran Akbar UNESCO', desc: 'Operasi pembongkaran 1 juta batu dengan mainframe komputer IBM dan pemasangan sistem drainase beton anti-longsor.' },
              { year: '1991 M', title: 'Pengukuhan Warisan Dunia UNESCO', desc: 'Borobudur secara resmi dinobatkan ke dalam UNESCO World Heritage List dengan nomor registrasi 592.' },
              { year: '2026 M', title: 'Pariwisata Berkelanjutan & Sandal Upanat', desc: 'Penerapan kuota cerdas, sandal pandan pelindung batu candi, dan pemberdayaan desa wisata ramah lingkungan.' }
            ],
            figures: [
              {
                name: 'Mpu Gunadharma',
                role: 'Arsitek Agung Wangsa Syailendra',
                avatar: 'assets/tokoh/gunadharma.png',
                bio: 'Tokoh intelektual dan perancang agung Borobudur yang memadukan ilmu arsitektur silpasastra, matematika geometri, dan kosmologi Buddha Mahayana.'
              },
              {
                name: 'Prof. Dr. Soekmono',
                role: 'Pemimpin Restorasi UNESCO 1973–1983',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Bapak Arkeologi Indonesia yang memimpin proyek penyelamatan teknik sipil terbesar dunia dalam membongkar dan merakit kembali 1 juta batu Borobudur.'
              },
              {
                name: 'H.C. Cornelius',
                role: 'Insinyur Militer Penemu Reruntuhan 1814',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Perwira zeni Belanda yang diutus Raffles memimpin 200 prajurit membakar semak belukar dan menyingkap kembali stupa Borobudur dari timbunan abu Merapi.'
              }
            ],
            quote: {
              text: 'Candi Borobudur bukanlah sekadar gundukan batu masa silam; ia adalah peta suci semesta tempat jiwa manusia diajak berjalan keluar dari kabut kegelapan nafsu menuju keheningan mutlak pencerahan budi.',
              cite: 'Wasiat Kuratorial Prof. Dr. Soekmono, Pemimpin Restorasi Candi Borobudur'
            },
            epilogue: 'Menapaki undakan batu andesit Borobudur adalah ziarah melintasi waktu. Keabadian candi ini menjadi saksi ketabahan leluhur kita menghadapi bencana alam, keagungan karya tangan yang melampaui zaman, serta janji generasi hari ini untuk menjaga pusaka kemanusiaan ini tetap tegak bercahaya bagi dunia.'
          }
        },
        {
          num: '02',
          thumb: 'assets/prambanan.jpg',
          title: 'Candi Prambanan (Klaten)',
          desc: 'Kompleks candi Hindu Siwa termegah (856 M) setinggi 47 meter dengan panggung Sendratari Ramayana.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · CANDI PRAMBANAN',
            title: 'Shivagrha di Tepian Kali Opak: Keagungan Trimurti Siwa 47 Meter dan Harmoni Toleransi Peradaban Mataram Kuno',
            subtitle: 'Kajian mendalam peresmian gugusan 240 candi Hindu Siwa tahun 856 Masehi, rekayasa hidrologi pengalihan aliran Kali Opak purba, relief epos agung Ramayana, mitos seribu candi Roro Jonggrang, hingga rehabilitasi seismik pasca-gempa tektonik 2006.',
            readTime: '11 Menit Waktu Baca',
            curator: 'Balai Pelestarian Kebudayaan Wilayah X & Badan Pengelola Candi Prambanan UNESCO #642',
            heroImg: 'assets/prambanan.jpg',
            heroCaption: 'Tiga menara utama Trimurti Candi Prambanan menjulang 47 meter di tepian Kali Opak, Klaten (UNESCO Situs No. 642).',
            lead: 'Menjulang setinggi 47 meter ke angkasa raya dengan siluet ramping menjulang vertikal khas arsitektur Hindu Klasik, Candi Prambanan (aslinya bernama Shivagrha yang bermakna Rumah Siwa) adalah kompleks percandian Hindu termegah dan terindah di Asia Tenggara. Didirikan pada pertengahan abad ke-9 Masehi oleh Raja Rakai Pikatan dari Dinasti Sanjaya, monumen ini merupakan manifestasi rasa syukur spiritual sekaligus perlambang keharmonisan toleransi antar-agama di tanah Jawa.',
            quickFacts: [
              { label: 'Tahun Peresmian', val: '856 Masehi (12 November 856 M)' },
              { label: 'Prasasti Rujukan', val: 'Prasasti Shivagrha (Prasasti Wantil / Siwagrha)' },
              { label: 'Pemrakarsa Utama', val: 'Maharaja Rakai Pikatan & Dyah Lokapala' },
              { label: 'Ketinggian Menara', val: '47 Meter (Candi Siwa Mahadewa Utama)' },
              { label: 'Total Struktur Candi', val: '240 Bangunan (3 Trimurti, 3 Wahana, 2 Apit, 4 Kelir, 4 Patok, 224 Perwara)' },
              { label: 'Relief Mahakarya', val: 'Epos Ramayana & Krishnayana Terlengkap di Dunia' },
              { label: 'Status Warisan Dunia', val: 'UNESCO World Heritage Site No. 642 (Ditetapkan 1991)' },
              { label: 'Lokasi Geografis', val: 'Perbatasan Kabupaten Klaten (Jawa Tengah) & Sleman (DI Yogyakarta)' }
            ],
            destLink: {
              label: 'Buka Candi Prambanan di Buku Sketsa Destinasi',
              href: 'destinasi.html#prambanan'
            },
            chapters: [
              {
                id: 'ch-prambanan-1',
                num: 'BAB 01',
                period: 'Tahun 856 Masehi',
                title: 'Prasasti Shivagrha, Rakai Pikatan & Rekayasa Hidrologi Kali Opak',
                paragraphs: [
                  'Peresmian Candi Prambanan tercatat dengan sangat akurat dalam sejarah Nusantara melalui Prasasti Shivagrha yang bertarikh 778 Saka (12 November 856 Masehi). Prasasti batu andesit bertuliskan huruf Kawi ini dibuat pada masa akhir pemerintahan Rakai Pikatan dan masa penobatan putranya, Dyah Lokapala (Rakai Kayuwangi).',
                  'Pembangunan gugusan candi ini melibatkan pencapaian luar biasa dalam ilmu rekayasa hidrologi purba. Agar pelataran kompleks suci tidak tergerus arus banjir bandang musim penghujan, para insinyur Mataram Kuno membendung dan membelokkan aliran alami Kali Opak yang awalnya melintasi area percandian, dialihkan ke arah barat menyusuri tanggul batu penahan arus.',
                  'Tata ruang kompleks dibangun menganut kosmologi mandala konsentris bertingkat tiga: pelataran dalam (zona tersuci jeroan) yang memuat 16 candi utama, pelataran tengah dengan empat deretan 224 Candi Perwara teratur, serta pelataran luar (jaba). Tiga candi inti dipersembahkan kepada Trimurti: Candi Siwa di tengah setinggi 47 meter dengan arca Siwa Mahadewa bertangan empat, diapit Candi Brahma (Dewa Pencipta) di sisi selatan setinggi 33 meter dan Candi Wisnu (Dewa Pemelihara) di sisi utara setinggi 33 meter.',
                  'Tepat di hadapan masing-masing candi Trimurti, berdiri tiga candi wahana kendaraan suci dewata: Candi Nandi (lembu jantan tunggangan Siwa), Candi Angsa (wahana Brahma), dan Candi Garuda (burung mitologis pembawa Wisnu yang menjadi lambang kedaulatan negara Republik Indonesia).'
                ],
                figure: {
                  img: 'assets/prambanan.jpg',
                  caption: 'Kompleks pelataran inti Candi Prambanan dengan kemegahan Candi Siwa, Candi Brahma, dan Candi Wisnu.'
                },
                callout: {
                  title: 'Monumen Harmoni Perkawinan Dua Wangsa Berbeda Agama',
                  text: 'Rakai Pikatan (penganut setia Hindu Siwa) memperistri Pramodhawardhani (putri penganut Buddha Mahayana dari Dinasti Syailendra). Pernikahan agung ini merajut persatuan politik dan budaya, terbukti dari kehadiran elemen stupika Buddha pada beberapa puncak candi perwara Prambanan.'
                }
              },
              {
                id: 'ch-prambanan-2',
                num: 'BAB 02',
                period: 'Abad XVI – 1733 Masehi',
                title: 'Gempa Dahsyat Abad XVI, Keruntuhan Menara & Legenda Arca Keseribu Roro Jonggrang',
                paragraphs: [
                  'Pasca migrasi ibu kota Mataram Kuno ke lembah Sungai Brantas Jawa Timur pada tahun 929 Masehi, kompleks Prambanan kehilangan perawatan harian. Bencana puncak terjadi sekitar abad ke-16 (diperkirakan tahun 1584 M) saat gempa bumi tektonik berkekuatan sangat dahsyat melanda wilayah selatan Yogyakarta dan Klaten.',
                  'Guncangan seismik tersebut meruntuhkan menara-menara utama Candi Siwa, Brahma, dan Wisnu, mengubah kawasan suci seluas puluhan hektar ini menjadi hamparan ribuan ton puing batu andesit yang berserakan dan ditumbuhi semak belukar liar.',
                  'Masyarakat Jawa tempo dulu yang telah kehilangan catatan tertulis mengenai asal-usul candi mulai menciptakan legenda tutur rakyat untuk menjelaskan keberadaan reruntuhan raksasa tersebut: mitos Bandung Bondowoso dan Putri Roro Jonggrang.',
                  'Dalam legenda itu, ksatria sakti Bandung Bondowoso ditantang membangun seribu candi dalam tempo satu malam demi meminang Roro Jonggrang. Mengetahui pekerjaan hampir selesai berkat bantuan ribuan makhluk halus, Roro Jonggrang menyuruh dayang-dayang menumbuk lesung padi dan membakar jerami di ufuk timur agar ayam jantan berkokok tanda fajar tiba. Merasa dicurangi pada candi ke-999, Bandung Bondowoso mengutuk Roro Jonggrang menjadi arca batu keseribu, yang oleh warga lokal diidentifikasikan sebagai arca elok bertangan delapan Dewi Durga Mahisasuramardini di bilik utara Candi Siwa.'
                ],
                figure: {
                  img: 'assets/articles/prambanan-durga-rorojonggrang.jpg',
                  caption: 'Arca asli Dewi Durga Mahisasuramardini di bilik utara Candi Siwa Prambanan yang dalam legenda tutur rakyat dikaitkan dengan wujud Roro Jonggrang.'
                }
              },
              {
                id: 'ch-prambanan-3',
                num: 'BAB 03',
                period: 'Tahun 1918 – 1953',
                title: 'Ekskavasi Ilmiah, Prinsip Anastilosis Arkeologi & Peresmian Ir. Soekarno 1953',
                paragraphs: [
                  'Dokumentasi modern Candi Prambanan pertama kali dicatat oleh penjelajah Belanda C.A. Lons pada tahun 1733. Namun, upaya pemugaran ilmiah berstandar internasional baru dirintis pada tahun 1918 oleh Jawatan Purbakala Hindia Belanda (Oudheidkundige Dienst) di bawah arahan Prof. Dr. F.D.K. Bosch dan insinyur P.J. Perquin.',
                  'Pemugaran menara Prambanan menghadapi tantangan teknis yang sangat rumit karena reruntuhan batu berserakan tanpa denah rancangan asli. Para arkeolog menerapkan metode anastilosis ketat: sebuah bangunan purba hanya boleh didirikan kembali jika sekurang-kurangnya 75% material batu aslinya berhasil ditemukan dan dicocokkan posisinya.',
                  'Penyusunan ribuan balok andesit ini berlangsung selama puluhan tahun melintasi masa penjajahan Jepang dan perang mempertahankan kemerdekaan Indonesia. Puncaknya, pada 23 Desember 1953, Presiden pertama RI Ir. Soekarno hadir secara langsung meresmikan selesainya pemugaran menara Candi Siwa setinggi 47 meter, menandai kembalinya kedaulatan dan kebanggaan peradaban bangsa Indonesia di mata dunia internasional.'
                ],
                callout: {
                  title: 'Relief Epos Ramayana Terpanjang di Dunia',
                  text: 'Dinding pagar langkan Candi Siwa dan Candi Brahma dihiasi 42 panel relief naratif epos Ramayana terlengkap di dunia, memuat adegan penculikan Dewi Sinta oleh Rahwana, pertempuran kera Sugriwa dan Subali, jembatan kera Rama Setu, hingga atraksi api kepahlawanan Hanoman di Alengka.'
                }
              },
              {
                id: 'ch-prambanan-4',
                num: 'BAB 04',
                period: 'Tahun 1991 – 2026',
                title: 'Warisan Dunia UNESCO, Sendratari Kolosal Purnama & Mitigasi Gempa Seismik Modern',
                paragraphs: [
                  'Pada tahun 1991, UNESCO resmi menetapkan Kompleks Candi Prambanan sebagai Situs Warisan Budaya Dunia Nomor 642. Bersamaan dengan pengakuan tersebut, pelataran terbuka di sisi barat seberang Kali Opak dibangun menjadi panggung terbuka teater kolosal pementasan Sendratari Ramayana (Ramayana Ballet).',
                  'Dipentaskan secara rutin tanpa henti sejak tahun 1961 di bawah naungan sinar rembulan purnama, pementasan kolosal ini melibatkan lebih dari 200 penari dan musisi gamelan Jawa klasik, memikat ratusan ribu wisatawan mancanegara setiap tahunnya.',
                  'Ujian ketahanan struktur kembali terjadi pada 27 Mei 2006 saat gempa bumi berkekuatan 5,9 Skala Richter mengguncang Yogyakarta dan Klaten. Meskipun ratusan batu ornamen mahkota terlempar dan menara Siwa mengalami retakan mikro, kehebatan konstruksi interlocking purba terbukti mampu mempertahankan struktur utama candi dari keruntuhan total.',
                  'Kini, Balai Pelestarian Kebudayaan telah memasang sensor seismograf mikrotremor canggih dan laser scanning 3D pemantau kestabilan tanah, memastikan mahakarya Trimurti ini tetap berdiri kokoh menginspirasi kemanusiaan hingga abad-abad mendatang.'
                ]
              }
            ],
            timeline: [
              { year: '856 M', title: 'Peresmian Shivagrha', desc: 'Raja Rakai Pikatan meresmikan kompleks candi Siwa dan membelokkan aliran Kali Opak purba.' },
              { year: '929 M', title: 'Pengungsian Mataram Kuno', desc: 'Ibu kota kerajaan dipindahkan ke Jawa Timur; Prambanan terlantar dan tertimbun semak belukar.' },
              { year: '1584 M', title: 'Gempa Runtuh Abad XVI', desc: 'Gempa bumi dahsyat meruntuhkan menara-menara andesit menjadi hamparan puing batu.' },
              { year: '1733 M', title: 'Laporan C.A. Lons', desc: 'Catatan perjalanan pertama yang mendokumentasikan reruntuhan candi berkubah tinggi di Prambanan.' },
              { year: '1918 M', title: 'Restorasi Ilmiah Bosch', desc: 'Jawatan Purbakala Hindia Belanda memulai perakitan kembali batu dengan prinsip anastilosis.' },
              { year: '1953 M', title: 'Peresmian oleh Bung Karno', desc: 'Presiden Ir. Soekarno meresmikan selesainya pemugaran menara agung Candi Siwa 47 meter.' },
              { year: '1961 M', title: 'Pementasan Perdana Sendratari', desc: 'Peluncuran Sendratari Ramayana kolosal panggung terbuka berlatar siluet Candi Siwa.' },
              { year: '1991 M', title: 'Penetapan Warisan Dunia UNESCO', desc: 'Kompleks Candi Prambanan resmi terdaftar sebagai Situs Warisan Budaya Dunia Nomor 642.' },
              { year: '2006 M', title: 'Rehabilitasi Gempa Yogya 2006', desc: 'Restorasi seismik dan pemasangan sistem sensor getaran mikrotremor pemantau kestabilan candi.' }
            ],
            figures: [
              {
                name: 'Rakai Pikatan',
                role: 'Raja Mataram Kuno (Dinasti Sanjaya)',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Maharaja besar pembangun kompleks Candi Prambanan yang menyatukan kekuatan politik dan toleransi beragama di bumi Mataram.'
              },
              {
                name: 'Pramodhawardhani',
                role: 'Permaisuri Ratu Mataram Kuno',
                avatar: 'assets/tokoh/gunadharma.png',
                bio: 'Putri Wangsa Syailendra berjiwa luhur yang menjadi simbol perdamaian abadi antara keyakinan Hindu Siwa dan Buddha Mahayana.'
              },
              {
                name: 'Ir. Soekarno',
                role: 'Presiden Pertama Republik Indonesia',
                avatar: 'assets/tokoh/pakubuwana-x.png',
                bio: 'Pemimpin proklamator kemerdekaan yang meresmikan selesainya pemugaran Candi Siwa tahun 1953 sebagai lambang kepribadian bangsa.'
              }
            ],
            quote: {
              text: 'Di bumi Prambanan, batu-batu andesit dipahat menjulang menari di bawah langit purnama, mengajarkan kepada anak bangsa tentang kekuatan cinta, kesetiaan pada janji, dan toleransi yang tak pernah usang dimakan zaman.',
              cite: 'Catatan Kuratorial Pementasan Sendratari Ramayana Prambanan'
            },
            epilogue: 'Menyaksikan matahari terbenam di balik menara Siwa Prambanan adalah menyaksikan dialog abadi antara keindahan seni pahat leluhur dan keagungan semesta. Prambanan membuktikan bahwa persatuan bangsa lahir dari kerelaan merajut perbedaan menjadi satu simfoni mahakarya peradaban.'
          }
        },
        {
          num: '03',
          thumb: 'assets/dieng-plateau.jpg',
          title: 'Dataran Tinggi Dieng (Wonosobo)',
          desc: 'Percandian Hindu tertua tanah Jawa di kaldera 2.093 mdpl berpagar Kawah Sikidang dan Telaga Warna.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · DATARAN TINGGI DIENG',
            title: 'Di-Hyang: Poros Kosmis Para Dewata di Kaldera Purba 2.093 MDPL Jawa Tengah',
            subtitle: 'Kajian ensiklopedis percandian Hindu tertua tanah Jawa abad ke-7, geologi vulkanik kawah lumpur Sikidang, pembiasan mineral Telaga Warna, pengeringan rawa purba Van Kinsbergen 1864, hingga tradisi sakral ruwatan rambut gimbal anak Dieng.',
            readTime: '10 Menit Waktu Baca',
            curator: 'Balai Pelestarian Kebudayaan Wilayah X & Komunitas Masyarakat Adat Dieng',
            heroImg: 'assets/dieng-plateau.jpg',
            heroCaption: 'Kompleks Candi Arjuna berselimut kabut belerang di kaldera vulkanik purba Dieng pada ketinggian 2.093 meter di atas permukaan laut, Wonosobo.',
            lead: 'Menempati dataran tinggi kaldera gunung api raksasa pada ketinggian 2.093 meter di atas permukaan laut di perbatasan Kabupaten Wonosobo dan Banjarnegara, Dataran Tinggi Dieng adalah negeri di atas awan yang menyimpan kelompok percandian batu tertua yang masih berdiri tegak di pulau Jawa. Berasal dari bahasa Kawi Jawa Kuno "Di" (tempat agung/gunung) dan "Hyang" (para dewata atau arwah leluhur), Dieng sejak abad ke-7 Masehi dipercaya sebagai poros kosmis tempat perjumpaan sakral antara manusia fana dan para dewata kahyangan.',
            quickFacts: [
              { label: 'Era Pembangunan', val: 'Abad VII – VIII Masehi (±650–750 Masehi)' },
              { label: 'Prasasti Rujukan', val: 'Prasasti Sojomerto (±670 M) & Prasasti Canggal (732 M)' },
              { label: 'Ketinggian Wilayah', val: '2.093 Meter di Atas Permukaan Laut (Suhu 0°C – 15°C)' },
              { label: 'Candi-Candi Inti', val: 'Kompleks Arjuna (Semar, Srikandi, Puntadewa), Candi Bima, Dwarawati, Gatotkaca' },
              { label: 'Fenomena Geologi', val: 'Kawah Sikidang, Telaga Warna (Danau Belerang), Telaga Pengilon' },
              { label: 'Tradisi Hidup Sakral', val: 'Ruwatan Pemotongan Rambut Gimbal Anak Bajang Dieng' },
              { label: 'Komoditas Endemik', val: 'Carica (Pepaya Gunung Dieng) & Purwaceng Pegunungan' },
              { label: 'Episentrum Administratif', val: 'Kecamatan Kejajar (Wonosobo) & Batur (Banjarnegara)' }
            ],
            destLink: {
              label: 'Buka Dataran Tinggi Dieng di Buku Sketsa Destinasi',
              href: 'destinasi.html#dieng'
            },
            chapters: [
              {
                id: 'ch-dieng-1',
                num: 'BAB 01',
                period: 'Abad VII – VIII Masehi',
                title: 'Asal-Usul Nama Di-Hyang & Pembangunan Percandian Tertua Tanah Jawa',
                paragraphs: [
                  'Dieng merupakan situs percandian batu tertua di tanah Jawa yang dibangun antara akhir abad ke-7 hingga pertengahan abad ke-8 Masehi oleh dinasti Mataram Kuno awal penganut agama Hindu Siwa, mendahului pembangunan Candi Borobudur dan Prambanan hampir satu abad. Keberadaan permukiman suci di kawasan ini berkaitan erat dengan isi Prasasti Sojomerto di pesisir Batang (bertarikh akhir abad ke-7) yang mencatat tokoh cikal bakal wangsa Syailendra bernama Dapunta Selendra.',
                  'Para pemuka agama purba sengaja memilih puncak kaldera vulkanik yang dingin, terisolasi, dan diselimuti kabut tebal karena menurut kosmologi kitab suci Veda, puncak gunung yang tinggi adalah Mahameru—tempat bersemayamnya para Dewa Trimurti. Candi-candi di Dieng tidak difungsikan sebagai makam raja, melainkan murni sebagai bangunan suci ziarah dan pertapaan permohonan berkah kesuburan.',
                  'Gugusan percandian tertata dalam beberapa kelompok fungsional: Kompleks Candi Arjuna (terdiri dari Candi Arjuna, Candi Semar, Candi Srikandi, Candi Puntadewa, dan Candi Sembadra), Candi Gatotkaca, Candi Dwarawati, serta Candi Bima. Pilihan batu andesit vulkanik padat yang ditambang di sekitar kaldera membuktikan keahlian pemahat purba dalam memilih material yang tahan terhadap serangan gas asam belerang dan siklus pembekuan embun upas es (frost).'
                ],
                figure: {
                  img: 'assets/dieng-plateau.jpg',
                  caption: 'Deretan Candi Arjuna dan Candi Semar di tengah pelataran kaldera vulkanik Dieng yang dingin berselimut embun.'
                },
                callout: {
                  title: 'Fenomena Embun Upas (Bun Upas) Es Dieng',
                  text: 'Pada puncak musim kemarau antara Juni hingga Agustus, suhu udara di dataran tinggi Dieng dapat anjlok hingga di bawah titik beku (-2°C sampai -5°C). Rumput dan atap candi tertutup lapisan kristal es putih yang oleh masyarakat lokal disebut "bun upas".'
                }
              },
              {
                id: 'ch-dieng-2',
                num: 'BAB 02',
                period: 'Abad VIII Masehi',
                title: 'Keistimewaan Arsitektur Candi Bima: Langgam Chalukya & Arca Kepala Kudu',
                paragraphs: [
                  'Di antara seluruh percandian di dataran tinggi Dieng, Candi Bima yang berdiri menyendiri di atas bukit selatan menempati posisi yang paling istimewa dan unik dalam sejarah arsitektur klasik Nusantara. Tidak seperti Candi Arjuna yang ramping beratap piramida bertingkat sederhana, Candi Bima memiliki denah segi delapan dengan struktur menara menjulang menyerupai candi-candi di India Selatan (langgam Kalinga dan Chalukya) serta candi di Orissa (Bhubaneswar).',
                  'Keunikan paling mencolok terletak pada relung-relung tingkatan atapnya yang dihiasi pahatan arca kepala manusia bermahkota yang disebut "Kudu". Arca Kudu ini tampak melongok keluar dari jendela tapal kuda kosmis, menyimbolkan para dewa kahyangan yang mengawasi manusia di bumi fana.',
                  'Konstruksi Candi Bima membuktikan bahwa pada abad ke-8 Masehi telah terjadi hubungan pelayaran budaya dan intelektual yang sangat intensif antara kerajaan Mataram Kuno di Jawa Tengah dengan pusat-pusat arsitektur sakral di anak benua India, sebelum akhirnya leluhur Jawa mengembangkan langgam arsitektur mandiri yang khas di Borobudur dan Prambanan.'
                ],
                callout: {
                  title: 'Relung Tapal Kuda Kudu: Satu-Satunya di Pulau Jawa',
                  text: 'Ornamen hiasan kepala dewa Kudu yang melongok dari jendela tapal kuda pada Candi Bima adalah satu-satunya contoh arsitektur Kalinga India Selatan yang ditemukan berdiri utuh di seluruh kepulauan Indonesia.'
                }
              },
              {
                id: 'ch-dieng-3',
                num: 'BAB 03',
                period: 'Abad IX – 1864 Masehi',
                title: 'Rawa Purba, Danau Belerang & Pengeringan Gua Aswatama Van Kinsbergen 1864',
                paragraphs: [
                  'Setelah peradaban Mataram Kuno berpindah ke Jawa Timur pada abad ke-10, saluran pembuangan air alami di cekungan kaldera Dieng tersumbat oleh material longsor dan endapan belerang kawah aktif. Akibatnya, air hujan dan rembesan telaga menggenangi pelataran candi, mengubah kawasan suci ini menjadi rawa purba dan danau air belerang yang luas.',
                  'Selama lebih dari delapan abad, candi-candi Dieng terendam air rawa hingga batas atapnya. Pada tahun 1814, tentara ekspedisi Inggris di bawah Raffles mencatat keberadaan puncak menara batu candi yang tampak mengapung aneh di tengah genangan air danau belerang.',
                  'Penyelamatan ilmiah baru berhasil diwujudkan pada tahun 1864 oleh fotografer dan arkeolog asal Belanda, Isidore van Kinsbergen. Van Kinsbergen memimpin proyek pengeringan air rawa dengan membongkar dan membersihkan terowongan saluran drainase bawah tanah kuno buatan leluhur Jawa yang dikenal dengan nama Gua Aswatama.',
                  'Setelah air rawa dan lumpur berhasil dikuras ke arah Sungai Tulis, puluhan bangunan candi yang terpendam kembali muncul ke permukaan tanah dan dipotret pertama kali secara rinci dalam sejarah fotografi arkeologi Hindia Belanda.'
                ]
              },
              {
                id: 'ch-dieng-4',
                num: 'BAB 04',
                period: 'Tahun 1900 – Sekarang',
                title: 'Geowisata Kawah Sikidang, Telaga Warna & Tradisi Sakral Ruwatan Rambut Gimbal 2026',
                paragraphs: [
                  'Selain khazanah percandian purba, Dieng dikaruniai bentang alam geologis vulkanik yang luar biasa memesona. Kawah Sikidang menyajikan fenomena kolam letupan lumpur panas mendidih yang lubang semburannya kerap berpindah-pindah dalam radius ratusan meter bagai kijang melompat (sikidang).',
                  'Di sisi tenggara terhampar Telaga Warna dan Telaga Pengilon. Kandungan mineral belerang yang sangat tinggi di Telaga Warna menciptakan efek pembiasan optik warna air yang berubah-ubah secara magis antara hijau toska, biru safir, hingga kuning keemasan saat tersorot cahaya mentari pagi.',
                  'Kekayaan Dieng disempurnakan oleh tradisi antropologi budaya hidup yang sakral: fenomena anak-anak berambut gimbal alami (anak bajang Dieng). Anak-anak ini terlahir normal, namun pada usia 2 hingga 4 tahun secara mendadak mengalami demam tinggi, dan setelah sembuh rambut mereka tumbuh menggumpal gimbal dengan sendirinya tanpa bisa disisir.',
                  'Masyarakat mempercayai anak-anak berambut gimbal adalah titipan berkah leluhur penguasa Dieng, Kyai Kolodete. Rambut gimbal ini hanya boleh dicukur melalui upacara adat suci "Ruwatan Rambut Gimbal", di mana seluruh permintaan barang anak bajang harus dipenuhi tanpa terkecuali sebelum rambut yang dipotong dilarung ke dasar Telaga Warna demi menjamin keselamatan hidup sang anak.',
                  'Kini, Dataran Tinggi Dieng berkembang sebagai Geopark Nasional berkelanjutan yang memadukan cagar cagar budaya purbakala, perlindungan tanaman endemik purwaceng dan carica pegunungan, serta festival budaya tahunan Dieng Culture Festival bertaraf internasional.'
                ],
                figure: {
                  img: 'assets/articles/dieng-telaga-warna.jpg',
                  caption: 'Pesona bentang alam vulkanik Telaga Warna Dieng dengan pembiasan gradasi air belerang dari puncak tebing batu ratapan angin.'
                }
              }
            ],
            timeline: [
              { year: '650–750 M', title: 'Pembangunan Percandian Dieng', desc: 'Pendirian kompleks Candi Arjuna dan Candi Bima oleh penganut Hindu Siwa era Mataram Kuno awal.' },
              { year: '929 M', title: 'Terbengkalai Menjadi Rawa', desc: 'Saluran air tersumbat; air danau belerang menenggelamkan pelataran candi Dieng selama 800 tahun.' },
              { year: '1814 M', title: 'Dokumentasi Ekspedisi Raffles', desc: 'Perwira zeni Inggris mendokumentasikan puncak menara candi yang menyembul dari genangan air rawa.' },
              { year: '1864 M', title: 'Pengeringan oleh Van Kinsbergen', desc: 'Isidore van Kinsbergen membersihkan terowongan Gua Aswatama dan mengeringkan air rawa Dieng.' },
              { year: '1908 M', title: 'Restorasi Arkeologi Awal', desc: 'Jawatan Purbakala Hindia Belanda mendata dan memperkuat pondasi Kompleks Candi Arjuna.' },
              { year: '2010 M', title: 'Peluncuran Dieng Culture Festival', desc: 'Inisiasi festival budaya tahunan memadukan ruwatan rambut gimbal dan edukasi pariwisata hijau.' },
              { year: '2026 M', title: 'Cagar Geopark Berkelanjutan', desc: 'Konservasi kaldera vulkanik, perlindungan tanaman purwaceng dan carica endemik pegunungan.' }
            ],
            figures: [
              {
                name: 'Kyai Kolodete',
                role: 'Tokoh Spiritual Cikal Bakal Dieng',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Figur leluhur sakral pembuka dataran tinggi Dieng pada abad ke-16 yang dipercaya menaungi anak-anak berambut gimbal.'
              },
              {
                name: 'Isidore van Kinsbergen',
                role: 'Fotografer & Ekskavator Dieng 1864',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Seniman dan arkeolog Belanda yang memimpin pengeringan danau rawa purba Dieng dan memotret candi pertama kali secara utuh.'
              }
            ],
            quote: {
              text: 'Di-Hyang adalah tempat di mana kepulan asap belerang bumi dan keheningan doa manusia berpadu dalam kesucian yang abadi di atas negeri awan Jawa Tengah.',
              cite: 'Falsafah Tetua Adat Masyarakat Dataran Tinggi Dieng'
            },
            epilogue: 'Menapaki tanah Dieng adalah menyadari kecilnya manusia di hadapan kekuatan geologi bumi dan keagungan spiritual masa lampau. Dinginnya embun upas Dieng merawat kehangatan budaya gotong royong yang tak lekang oleh zaman.'
          }
        },
        {
          num: '04',
          thumb: 'assets/karimunjawa.jpg',
          title: 'Kepulauan Karimunjawa (Jepara)',
          desc: 'Gugusan 27 pulau tropis terumbu karang dan penyu hijau di Laut Jawa yang dirintis Sunan Nyamplungan.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · KEPULAUAN KARIMUNJAWA',
            title: 'Kramun-Kramun: Dari Pengembaraan Spiritual Amir Hasan Menuju Suaka Konservasi Bahari Laut Jawa 111.000 Hektar',
            subtitle: 'Monograf sejarah maritim 27 gugusan pulau tropis terumbu karang, pohon bertuah kayu stigi Sunan Nyamplungan abad ke-15, pelaut Bugis-Jawa, penetapan Taman Nasional Konservasi Laut 2001, hingga rehabilitasi penyu dan ekowisata bahari modern.',
            readTime: '9 Menit Waktu Baca',
            curator: 'Balai Taman Nasional Karimunjawa & Komunitas Konservasi Maritim Jepara',
            heroImg: 'assets/karimunjawa.jpg',
            heroCaption: 'Kejernihan air toska dan terumbu karang tropis di gugusan Kepulauan Karimunjawa, Jepara.',
            lead: 'Terletak sekitar 83 kilometer di barat laut Kota Jepara di perairan Laut Jawa, Kepulauan Karimunjawa adalah permata ekologi bahari dan khazanah sejarah maritim Jawa Tengah. Membentang di atas area konservasi laut seluas 111.625 hektar dengan 27 gugusan pulau karang berpasir putih perawan, Karimunjawa merajut harmoni antara jejak dakwah spiritual abad ke-15 Sunan Nyamplungan dan suaka keanekaragaman hayati terumbu karang tropis Nusantara.',
            quickFacts: [
              { label: 'Asal-Usul Sejarah', val: 'Abad XV Masehi (Kisah Amir Hasan / Sunan Nyamplungan)' },
              { label: 'Luas Wilayah Konservasi', val: '111.625 Hektar (27 Pulau Tropis di Laut Jawa)' },
              { label: 'Spesies Penyu Langka', val: 'Penyu Sisik (Eretmochelys imbricata) & Penyu Hijau (Chelonia mydas)' },
              { label: 'Status Perlindungan', val: 'Taman Nasional Konservasi Laut (SK Menhut No. 78/Kpts-II/2001)' },
              { label: 'Flora Kayu Bertuah', val: 'Kayu Stigi (Pemphis acidula), Dewandaru, Kalimasada' },
              { label: 'Populasi Pulau', val: '5 Pulau Berpenghuni & 22 Pulau Tak Berpenghuni Perawan' },
              { label: 'Suku Masyarakat', val: 'Akulturasi Pelaut Suku Jawa, Bugis, dan Madura' },
              { label: 'Akses Pelabuhan', val: 'Penyeberangan Kapal Cepat Kartini & KMP Siginjai via Pelabuhan Kartini Jepara' }
            ],
            destLink: {
              label: 'Buka Karimunjawa di Buku Sketsa Destinasi',
              href: 'destinasi.html#karimunjawa'
            },
            chapters: [
              {
                id: 'ch-karimun-1',
                num: 'BAB 01',
                period: 'Abad XV Masehi',
                title: 'Pelayaran Amir Hasan & Penamaan Pulau Kramun-Kramun',
                paragraphs: [
                  'Riwayat peradaban Karimunjawa bermula dari kisah pengembaraan spiritual Amir Hasan, putra Syekh Ja\'far Shodiq (Sunan Kudus, salah satu Walisongo penyebar Islam terkemuka di tanah Jawa). Dikisahkan dalam tradisi tutur masyarakat Jepara, Amir Hasan yang berwatak pemberani diuji oleh sang ayah untuk memperdalam keteguhan iman dan kemandirian batin dengan berlayar ke arah barat laut menyeberangi Laut Jawa.',
                  'Dari puncak lereng Gunung Muria, Sunan Kudus menunjuk ke arah cakrawala laut lepas di mana tampak gugusan daratan pulau kecil yang tampak samar-samar. Dalam bahasa Jawa pesisiran, tampak samar-samar disebut "kramun-kramun". Dari ungkapan inilah pulau tersebut di kemudian hari dinamai Karimunjawa.',
                  'Amir Hasan berlayar menumpang perahu kayu bersama dua orang abdi setianya. Setibanya di pulau terbesar, beliau mendirikan surau pertapaan, mengajarkan ilmu navigasi perbintangan laut, budidaya kelapa, dan menyebarkan nilai-nilai kebajikan budi pekerti kepada para pelaut yang singgah. Karena gemar menanam pohon nyamplung rindang di sekitar pesisir, Amir Hasan dihormati masyarakat luas dengan sebutan Sunan Nyamplungan.'
                ],
                figure: {
                  img: 'assets/karimunjawa.jpg',
                  caption: 'Pesona terumbu karang dan pantai pasir putih pulau Menjangan Kecil di Kepulauan Karimunjawa.'
                },
                callout: {
                  title: 'Misteri Tiga Kayu Sakral Karimunjawa',
                  text: 'Karimunjawa terkenal dengan tiga jenis kayu langka bertuah: Kayu Stigi yang tumbuh di karang terjal dengan densitas sangat padat hingga tenggelam dalam air, Kayu Dewandaru pembawa wangi keteduhan, serta Kayu Kalimasada yang dipercaya para nelayan membawa ketenangan batin dalam mengarungi badai samudra.'
                }
              },
              {
                id: 'ch-karimun-2',
                num: 'BAB 02',
                period: 'Abad XVII – 1986 Masehi',
                title: 'Sentra Pemukiman Pelaut Bugis-Jawa & Akulturasi Maritim Abad XVII',
                paragraphs: [
                  'Memasuki abad ke-17 hingga ke-19, letak geografis Karimunjawa yang strategis di tengah jalur pelayaran Selat Karimata dan Laut Jawa menjadikannya pelabuhan singgah utama bagi para saudagar perahu pinisi suku Bugis Makassar dan pelaut suku Madura.',
                  'Akulturasi tiga suku (Jawa, Bugis, Madura) membentuk tatanan permukiman maritim yang unik di Pulau Karimunjawa dan Pulau Kemujan: rumah panggung kayu khas Bugis berdampingan damai dengan rumah joglo Jawa pesisir.',
                  'Menyadari keunikan ekosistem laut karang penghalang (barrier reef), hamparan padang lamun, dan hutan mangrove yang masih sangat utuh, pemerintah Republik Indonesia pada tahun 1986 menetapkan kawasan perairan Karimunjawa seluas 111.625 hektar sebagai Kawasan Cagar Alam Laut melalui Surat Keputusan Menteri Kehutanan No. 123/Kpts-II/1986.'
                ]
              },
              {
                id: 'ch-karimun-3',
                num: 'BAB 03',
                period: 'Abad XIII – Era Modern',
                title: 'Arkeologi Bawah Air: Bangkai Kapal Karam Abad XIII & Keramik Dinasti Song',
                paragraphs: [
                  'Di samping kekayaan ekologi laut dan sejarah syiar Islam Sunan Nyamplungan, perairan kepulauan Karimunjawa menyimpan misteri arkeologi maritim yang sangat menakjubkan. Penelitian Direktorat Peninggalan Bawah Air dan para arkeolog maritim menemukan sejumlah bangkai kapal karam (shipwreck) kuno yang tenggelam di kedalaman 20 hingga 45 meter di sekitar terumbu karang Pulau Genting dan Menjangan.',
                  'Dari lambung kapal-kapal kayu purba tersebut berhasil diangkat ribuan fragmen keramik porselen halus peninggalan Dinasti Song (abad ke-10 hingga ke-13) dan Dinasti Ming (abad ke-15) asal Tiongkok, guci tanah liat Khampa dari Asia Tenggara daratan, serta manik-manik kaca timur tengah.',
                  'Temuan arkeologis bawah air ini menjadi bukti otentik tak terbantahkan bahwa kepulauan Karimunjawa telah menjadi simpul navigasi penting di Jalur Sutra Maritim rempah dunia selama lebih dari delapan abad.'
                ],
                callout: {
                  title: 'Jalur Sutra Maritim Bawah Air Nusantara',
                  text: 'Bangkai kapal dagang abad ke-13 yang terbaring di dasar karang Karimunjawa kini dilindungi sebagai Benda Cagar Budaya Bawah Air, menjadi laboratorium riset arkeologi selam bagi para peneliti maritim internasional.'
                }
              },
              {
                id: 'ch-karimun-4',
                num: 'BAB 04',
                period: 'Tahun 2001 – Sekarang',
                title: 'Penetapan Taman Nasional, Suaka Penyu Sisik & Ekowisata Bahari 2026',
                paragraphs: [
                  'Pada 22 Februari 2001, status perlindungan kawasan resmi ditingkatkan menjadi Taman Nasional Karimunjawa (SK Menhut No. 78/Kpts-II/2001). Pengelolaan taman nasional ini menerapkan sistem zonasi modern berstandar internasional yang membagi kawasan ke dalam Zona Inti pelestarian terumbu karang langka, Zona Perlindungan Bahari habitat bertelur penyu sisik dan penyu hijau di Pulau Kumbang, Zona Pemanfaatan Wisata, dan Zona Perikanan Tradisional Berkelanjutan bagi nelayan lokal.',
                  'Karimunjawa kini berkembang menjadi magnet ekowisata bahari terdepan di Indonesia. Wisatawan dari seluruh penjuru dunia datang untuk menikmati pengalaman menyelam bersama hiu karang sirip hitam (blacktip reef shark) di penangkaran Menjangan Besar, snorkeling melintasi taman karang anemon bercahaya, serta menjelajahi jembatan titian kayu hutan bakau (mangrove trail) sepanjang dua kilometer.',
                  'Dengan keterlibatan aktif generasi muda setempat dalam komunitas penyelam konservasi, program adopsi terumbu karang (coral adoption), dan penangkaran pelepasan tukik penyu laut ke alam liar, Karimunjawa membuktikan bahwa pariwisata bahari modern dapat berjalan seiring sejalan dengan kelestarian ekosistem bumi Nusantara.'
                ]
              }
            ],
            timeline: [
              { year: '1450 M', title: 'Pelayaran Amir Hasan', desc: 'Putra Sunan Kudus berlayar ke pulau kramun-kramun dan mendirikan permukiman maritim.' },
              { year: '1500 M', title: 'Kedatangan Pelaut Bugis', desc: 'Saudagar perahu pinisi Bugis menetap dan memadukan tradisi pelayaran di Karimunjawa.' },
              { year: '1986 M', title: 'Kawasan Cagar Alam Laut', desc: 'Pemerintah menetapkan perairan Karimunjawa seluas 111.625 hektar sebagai Cagar Alam Laut.' },
              { year: '1999 M', title: 'Deklarasi Kawasan Konservasi Laut', desc: 'Inisiasi perlindungan ekosistem terumbu karang dan suaka penyu sisik bertelur.' },
              { year: '2001 M', title: 'Penetapan Taman Nasional', desc: 'Resmi ditetapkan sebagai Taman Nasional Karimunjawa melalui SK Menhut No. 78/Kpts-II/2001.' },
              { year: '2026 M', title: 'Ekowisata Bahari Ramah Lingkungan', desc: 'Integrasi transplantasi terumbu karang, konservasi tukik penyu, dan energi bersih kepulauan.' }
            ],
            figures: [
              {
                name: 'Amir Hasan (Sunan Nyamplungan)',
                role: 'Perintis & Pelindung Kepulauan Karimunjawa',
                avatar: 'assets/tokoh/sunan-nyamplungan.png',
                bio: 'Putra Sunan Kudus yang membuka peradaban Karimunjawa abad ke-15, mengajarkan kearifan bahari dan syiar kebajikan.'
              },
              {
                name: 'Sunan Kudus (Syekh Ja\'far Shodiq)',
                role: 'Walisongo & Ayahanda Amir Hasan',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Ulama besar penyebar Islam di Jawa Tengah yang mengutus Amir Hasan mengarungi Laut Jawa menuju pulau kramun-kramun.'
              }
            ],
            quote: {
              text: 'Laut bukanlah pemisah pulau-pulau kita; laut adalah halaman depan rumah peradaban leluhur tempat terumbu karang dan angin samudra menyatukan jiwa bahari bangsa Indonesia.',
              cite: 'Prinsip Konservasi Balai Taman Nasional Karimunjawa'
            },
            epilogue: 'Menatap jernihnya samudera toska Karimunjawa adalah merasakan keagungan alam ciptaan Sang Maha Kuasa. Di gugusan kepulauan ini, kita diingatkan bahwa menjaga terumbu karang dan pantai bersih adalah bagian tak terpisahkan dari merawat kehormatan tanah air.'
          }
        }
      ]
    },
    {
      id: 'museum',
      name: 'Museum (Khazanah Benda Cagar Budaya)',
      label: 'Museum',
      categoryType: 'Kategori 02 · Museum',
      period: 'Tahun 1904 – Sekarang',
      titleSmall: 'Historiografi & Asal-Usul',
      titleMain: 'Museum',
      eraBadge: 'Museum · Gedung Bersejarah 1904 hingga Khazanah 59.000 Benda Koleksi',
      narrative: 'Sejarah museum di Jawa Tengah berakar dari dua lintasan utama: penyelamatan gedung cagar budaya kolonial dan penghimpunan puluhan ribu artefak peradaban masa lampau. Pada 1904–1907, Nederlandsch-Indische Spoorweg Maatschappij (NIS) mendirikan kantor pusat monumental Lawang Sewu di Semarang dengan arsitektur tropis megah karya J.F. Klinkhamer dan panel kaca patri mewah Delft. Setelah sempat menjadi markas militer pasca-kemerdekaan, Lawang Sewu diselamatkan dan dipugar oleh PT KAI menjadi museum perkeretaapian terkemuka. Bersamaan dengan itu, pada 1975 dirintis museum induk kebudayaan daerah untuk memusatkan artefak purba Sangiran, arca emas, perunggu, dan naskah lontar. Diresmikan pada 1989 sebagai Museum Jawa Tengah Ranggawarsita, kini museum mengayomi 59.814 koleksi berharga serta bertransformasi menuju pameran visual digital modern.',
      image: 'assets/history/kolonial.jpg',
      plaque: 'Kaca Patri Delft & Preservasi Cagar Budaya · Tahun 1904 – Sekarang (Lawang Sewu & Ranggawarsita)',
      cards: [
        {
          num: '01',
          thumb: 'assets/lawang-sewu-photo.jpg',
          title: 'Lawang Sewu / NIS 1904 (Semarang)',
          desc: 'Het Hoofdkantoor karya Klinkhamer dengan ruang pendingin bawah tanah dan kaca patri mewah Delft.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · LAWANG SEWU',
            title: 'Het Hoofdkantoor van de NIS: Dari Kantor Pusat Kereta Api Kolonial Pertama 1904 Hingga Saksi Darah Pertempuran Lima Hari Semarang',
            subtitle: 'Monograf sejarah arsitektur tropis neoklasik karya Prof. Klinkhamer, rekayasa pendingin air bawah tanah tanpa listrik, kaca patri mewah Johannes Schouten Delft, markas Kempeitai Dai Nippon, hingga restorasi total KAI Heritage sebagai museum cagar budaya nasional.',
            readTime: '11 Menit Waktu Baca',
            curator: 'KAI Heritage & Balai Pelestarian Kebudayaan Jawa Tengah',
            heroImg: 'assets/lawang-sewu-photo.jpg',
            heroCaption: 'Lorong ganda marmer berderet pintu jalusi lengkung Lawang Sewu di sudut Bundaran Tugu Muda, Semarang.',
            lead: 'Berdiri megah dengan menara kubah perunggu kembar di sudut Bundaran Tugu Muda (dahulu Koningsplein) Kota Semarang, Lawang Sewu adalah salah satu adikarya arsitektur kolonial terpenting di Asia Tenggara. Dibangun antara tahun 1904 hingga 1907 sebagai Het Hoofdkantoor van de Nederlandsch-Indische Spoorweg Maatschappij (NIS)—perusahaan swasta yang membangun jalur kereta api pertama di Indonesia pada 1867—gedung ini memadukan keanggunan neoklasik Eropa dengan kearifan sains adaptasi iklim tropis Nusantara yang sangat visioner.',
            quickFacts: [
              { label: 'Tahun Pembangunan', val: '27 Februari 1904 – Juli 1907 Masehi' },
              { label: 'Arsitek Perancang', val: 'Prof. Jacob F. Klinkhamer & B.J. Ouëndag (Amsterdam)' },
              { label: 'Jumlah Bukaan Pintu', val: '429 Kusen Pintu Asli (>1.200 Daun Pintu & Jendela Jalusi)' },
              { label: 'Material Kaca Patri', val: 'Kaca Timah Enamel Johannes Lourens Schouten (Delft, Belanda)' },
              { label: 'Rekayasa Pendingin', val: 'Ruang Bawah Tanah Kedap Air Sedalam 2 Meter (Sirkulasi Uap Sejuk)' },
              { label: 'Peristiwa Bersejarah', val: 'Pertempuran Lima Hari di Semarang (14–19 Oktober 1945)' },
              { label: 'Status Cagar Budaya', val: 'Benda Cagar Budaya Peringkat Nasional (SK Mendikbud)' },
              { label: 'Pengelola Pelestarian', val: 'PT Kereta Api Indonesia (Persero) / KAI Heritage' }
            ],
            destLink: {
              label: 'Buka Lawang Sewu di Buku Sketsa Destinasi',
              href: 'destinasi.html#lawangsewu'
            },
            chapters: [
              {
                id: 'ch-lawangsewu-1',
                num: 'BAB 01',
                period: 'Tahun 1904 – 1907',
                title: 'Het Hoofdkantoor van de NIS & Sains Adaptasi Arsitektur Tropis Modern',
                paragraphs: [
                  'Sejarah Lawang Sewu berakar dari ekspansi industri perkeretaapian Hindia Belanda. Pasca pembukaan jalur kereta api komersial pertama Nusantara rute Stasiun Samarang–Tanggung pada 10 Agustus 1867, perusahaan swasta Nederlandsch-Indische Spoorweg Maatschappij (NIS) berkembang pesat menjadi tulang punggung pengangkutan komoditas gula, kopi, dan tembakau dari pedalaman Jawa ke pelabuhan Semarang.',
                  'Membutuhkan kantor pusat administrasi modern yang representatif, pimpinan NIS menunjuk duo arsitek terkemuka asal Amsterdam: Prof. Jacob F. Klinkhamer (guru besar Technische Hoogeschool Delft) dan B.J. Ouëndag. Peletakan batu pertama dimulai pada 27 Februari 1904 di atas lahan seluas 18.232 meter persegi.',
                  'Tantangan terbesar para arsitek Eropa saat itu adalah bagaimana menciptakan gedung perkantoran megah berlantai marmer yang tetap nyaman dan sejuk di tengah cuaca panas terik dan kelembapan pesisir laut Semarang, tanpa bergantung pada kipas angin listrik mekanis yang kala itu masih sangat langka.',
                  'Klinkhamer menjawab tantangan tersebut secara brilian dengan menciptakan sistem ventilasi silang bertingkat (cross-ventilation). Ia merancang koridor ganda beratap tinggi dengan deretan pintu jalusi lengkung bertingkat di kedua sisi dinding luar dan dalam. Struktur ini memiliki 429 buah kusen pintu asli dengan lebih dari 1.200 daun pintu dan jendela bukaan tinggi, yang membuat masyarakat Jawa menjulukinya "Lawang Sewu" (seribu pintu).',
                  'Kunci pendinginan alami tercanggih terletak pada ruang bawah tanah (sub-basement) sedalam dua meter di bawah lantai dasar. Ruangan bawah tanah ini sengaja dirancang kedap air untuk menampung air hujan dan resapan air tanah bersuhu sejuk. Melalui rongga-rongga lubang ventilasi di lantai marmer, uap sejuk dari air bawah tanah tersedot naik ke ruang kerja di atasnya, menciptakan efek pendingin alami sepanjang hari.'
                ],
                figure: {
                  img: 'assets/lawang-sewu-photo.jpg',
                  caption: 'Barisan pintu lengkung berulang di lorong utama Lawang Sewu yang memaksimalkan sirkulasi angin laut Semarang.'
                },
                callout: {
                  title: 'Rekayasa Pendingin Sub-Basement Tanpa Listrik',
                  text: 'Sistem penampungan air bawah tanah setinggi dua meter di bawah lantai marmer Lawang Sewu bertindak sebagai pendingin ruangan geotermal alami: uap sejuk naik melalui kisi-kisi lantai, menurunkan suhu ruangan kerja hingga 5 derajat Celsius lebih dingin daripada terik matahari luar.'
                }
              },
              {
                id: 'ch-lawangsewu-2',
                num: 'BAB 02',
                period: 'Tahun 1904 Masehi',
                title: 'Kaca Patri Johannes Schouten Delft: Simbol Kemakmuran Nusantara',
                paragraphs: [
                  'Di atas tangga utama menuju lantai dua terpasang mahakarya seni visual terindah Lawang Sewu: panel kaca patri timah monumental setinggi sembilan meter karya maestro kaca ternama Belanda, Johannes Lourens Schouten asal kota keramik Delft (dikerjakan tahun 1904).',
                  'Komposisi kaca patri warna-warni ini sarat dengan simbolisme historiografi tingkat tinggi. Di bagian tengah tampak Dewi Keberuntungan Fortuna memegang roda bersayap lambang kemajuan industri perkeretaapian, diapit oleh perlambang dewi kesuburan bumi Jawa yang memegang batang tebu manis dan daun tembakau emas.',
                  'Di bagian bawah terpampang lambang perisai kota-kota pelabuhan niaga utama: Batavia, Semarang, dan Amsterdam, dihiasi flora fauna tropis burung merak dan teratai air. Panel ini membuktikan bahwa NIS memandang tanah Jawa bukan sekadar wilayah koloni eksploitasi, melainkan poros kemakmuran perdagangan rempah dan komoditas global.'
                ],
                figure: {
                  img: 'assets/articles/lawang-sewu-kaca-patri.jpg',
                  caption: 'Mahakarya panel kaca patri timah monumental karya Johannes Lourens Schouten (1904) di ruang tangga utama Het Hoofdkantoor Lawang Sewu.'
                },
                callout: {
                  title: 'Kaca Timah Enamel Tahan Satu Abad',
                  text: 'Pewarnaan kaca Schouten menggunakan teknik enamel bakar timah yang pigmen mineralnya menyatu abadi ke dalam molekul kaca, sehingga warnanya tidak memudar sama sekali meski telah melewati cuaca tropis pesisir selama lebih dari 120 tahun.'
                }
              },
              {
                id: 'ch-lawangsewu-3',
                num: 'BAB 03',
                period: 'Tahun 1942 – 1945',
                title: 'Markas Rahasia Kempeitai Dai Nippon & Palagan Pertempuran Lima Hari Semarang',
                paragraphs: [
                  'Ketika tentara pendudukan Jepang menginvasi Hindia Belanda pada Maret 1942, gedung Lawang Sewu disita secara paksa dan dialihfungsikan menjadi kantor jawatan transportasi militer Ryukan Kanko serta markas polisi rahasia militer Dai Nippon yang ditakuti: Kempeitai.',
                  'Ruang pendingin air bawah tanah yang sebelumnya dirancang untuk sirkulasi sejuk disalahgunakan menjadi penjara tahanan bawah tanah dan ruang eksekusi tawanan perang sekutu dan pejuang kemerdekaan pribumi.',
                  'Puncak kepahlawanan terjadi pasca proklamasi kemerdekaan, tepatnya pada 14 hingga 19 Oktober 1945 dalam palagan bersejarah: Pertempuran Lima Hari di Semarang. Para pemuda Angkatan Muda Kereta Api (AMKA) bersama laskar pejuang rakyat bertempur mati-matian mempertahankan gedung Lawang Sewu dan kawasan Tugu Muda dari serbuan pasukan batalion tempur Jepang Kido Butai pimpinan Mayor Kido.',
                  'Pertempuran sengit terjadi di lorong-lorong dan pelataran gedung. Puluhan pemuda kereta api gugur demi mempertahankan kedaulatan merah putih. Di pelataran gedung didirikan monumen peringatan guna menghormati para pahlawan muda perkeretaapian yang mengorbankan jiwa raga mereka bagi kemerdekaan Indonesia.'
                ]
              },
              {
                id: 'ch-lawangsewu-4',
                num: 'BAB 04',
                period: 'Tahun 2009 – Sekarang',
                title: 'Restorasi Menyeluruh KAI Heritage & Museum Perkeretaapian Modern Edukatif 2026',
                paragraphs: [
                  'Pasca era kemerdekaan, gedung Lawang Sewu sempat difungsikan sebagai kantor Kodam IV/Diponegoro dan kantor wilayah Perusahaan Jawatan Kereta Api (PJKA). Namun, pada dekade 1990-an gedung ini sempat dikosongkan dan terbengkalai, memicu berkembangnya mitos mistis tak berdasar di tengah tayangan media hiburan.',
                  'Menyadari nilai historiografi arsitektur yang sangat luhur, PT Kereta Api Indonesia (Persero) melalui unit KAI Heritage mengambil langkah berani dengan meluncurkan proyek restorasi cagar budaya komprehensif pada tahun 2009 hingga 2011.',
                  'Lapisan cat kapur yang menutupi keaslian bata ekspos dibersihkan menggunakan teknik dry-ice blasting tanpa merusak permukaan bata tua. Kaca patri Delft yang retak direstorasi secara presisi oleh tenaga ahli kaca konservasi, lantai marmer dipoles, dan sistem tata cahaya arsitektural malam hari dipasang.',
                  'Kini, Lawang Sewu resmi berstatus Benda Cagar Budaya Peringkat Nasional dan hidup kembali sebagai museum sejarah perkeretaapian terfavorit di Indonesia, dikunjungi lebih dari 1,5 juta wisatawan setiap tahunnya. Ruang-ruang pamerannya menyajikan mesin karcis Edmondson kuno, miniatur lokomotif uap, kalkulator mekanis perkeretaapian, tur arsip virtual 360 derajat, hingga dokumentasi jalur rel bersejarah Nusantara.'
                ]
              }
            ],
            timeline: [
              { year: '1867 M', title: 'Rel Kereta Api Pertama', desc: 'NIS meresmikan jalur kereta api pertama di Indonesia rute Stasiun Samarang ke Tanggung sejauh 25 km.' },
              { year: '1904 M', title: 'Peletakan Batu Pertama NIS', desc: 'Prof. Jacob F. Klinkhamer memulai pembangunan gedung dengan sistem pendingin air bawah tanah.' },
              { year: '1907 M', title: 'Peresmian Kantor Pusat', desc: 'Pemasangan kaca patri Schouten Delft dan peresmian kantor pusat administrasi perkeretaapian NIS.' },
              { year: '1942 M', title: 'Penyitaan oleh Dai Nippon', desc: 'Gedung dialihfungsikan menjadi markas Ryukan Kanko dan kantor polisi militer rahasia Kempeitai.' },
              { year: '1945 M', title: 'Pertempuran Lima Hari', desc: 'Pemuda AMKA mempertahankan Lawang Sewu dari serbuan batalion Kido Butai; gugurnya para pejuang.' },
              { year: '2011 M', title: 'Restorasi Akbar KAI Heritage', desc: 'Penuntasan pemugaran cagar budaya komprehensif, menepis mitos mistis menjadi museum edukatif.' },
              { year: '2026 M', title: 'Museum Cagar Budaya Modern', desc: 'Integrasi arsip virtual 360 derajat, ruang pamer lokomotif bersejarah, dan wisata edukasi kebangsaan.' }
            ],
            figures: [
              {
                name: 'Prof. Jacob F. Klinkhamer',
                role: 'Arsitek Het Hoofdkantoor van de NIS',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Guru besar arsitektur Technische Hoogeschool Delft yang merancang sistem sirkulasi udara silang tropis dan ruang pendingin bawah tanah Lawang Sewu.'
              },
              {
                name: 'Johannes Lourens Schouten',
                role: 'Seniman Kaca Patri Delft 1904',
                avatar: 'assets/tokoh/oei-tiong-ham.png',
                bio: 'Maestro kaca patri ternama asal Delft, Belanda yang menciptakan lukisan kaca timah kemakmuran bumi Jawa di tangga utama Lawang Sewu.'
              },
              {
                name: 'dr. Kariadi',
                role: 'Pahlawan Pertempuran Lima Hari',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Kepala Laboratorium Malaria yang gugur ditembak tentara Jepang di dekat Tugu Muda saat memeriksa sumber air Reservoir Siranda bagi warga kota.'
              }
            ],
            quote: {
              text: 'Sebuah gedung bersejarah hanya akan bertahan jika ia terus dicintai, dikunjungi, dan dihidupkan kembali sebagai ruang belajar kebangsaan bagi generasi penerus bangsa.',
              cite: 'Prinsip Konservasi Pelestarian KAI Heritage'
            },
            epilogue: 'Menyusuri lorong ganda Lawang Sewu hari ini adalah menyusuri ketabahan bangsa menghadapi perang dan komitmen kita merawat memori indah perkeretaapian Indonesia.'
          }
        },
        {
          num: '02',
          thumb: 'assets/museum-ranggawarsita.jpg',
          title: 'Museum Ranggawarsita (Semarang)',
          desc: 'Museum provinsi terlengkap seluas 1,8 hektar yang mengayomi 59.814 pusaka purba dan naskah keraton.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · MUSEUM RANGGAWARSITA',
            title: 'Khazanah 59.814 Pusaka: Menjaga Memori Fosil Kubah Sangiran Hingga Naskah Pamungkas Sang Pujangga Keraton',
            subtitle: 'Kajian ensiklopedis pendirian museum induk kebudayaan daerah terlengkap Jawa Tengah seluas 1,8 hektar, dedikasi nama Raden Ngabehi Ranggawarsita, fosil gajah purba Stegodon, himpunan emas Wonoboyo 27 kilogram, laboratorium konservasi kimiawi, hingga transformasi kurasi digital 360 derajat.',
            readTime: '11 Menit Waktu Baca',
            curator: 'Dewan Kurator Museum Jawa Tengah Ranggawarsita & Asosiasi Museum Indonesia',
            heroImg: 'assets/museum-ranggawarsita.jpg',
            heroCaption: 'Kompleks gedung pameran permanen Museum Jawa Tengah Ranggawarsita seluas 1,8 hektar di Kalibanteng, Semarang.',
            lead: 'Menempati lahan seluas 1,8 hektar di Jalan Abdulrahman Saleh No. 1, Kalibanteng, Semarang, Museum Jawa Tengah Ranggawarsita adalah museum negeri provinsi terlengkap di Jawa Tengah. Mengayomi 59.814 koleksi berharga yang terbentang dari fosil vertebrata purba kubah Sangiran berusia 1,5 juta tahun, artefak emas Mataram Kuno temuan Wonoboyo, hingga keris pusaka dan manuskrip lontar keraton, museum ini adalah benteng pertahanan memori kolektif peradaban Nusantara.',
            quickFacts: [
              { label: 'Tahun Perintisan', val: '1975 (Gagasan Gubernur Soepardjo Roestam)' },
              { label: 'Peresmian Pembukaan', val: '5 Juli 1989 oleh Mendikbud Prof. Dr. Fuad Hassan' },
              { label: 'Luas Lahan Museum', val: '18.448 m² (1,8 Hektar) dengan 4 Gedung Bertingkat' },
              { label: 'Total Benda Koleksi', val: '59.814 Benda Cagar Budaya Terkatalogisasi' },
              { label: 'Nama Kehormatan', val: 'Raden Ngabehi Ranggawarsita (Pujangga Pamungkas Solo)' },
              { label: 'Klasifikasi Koleksi', val: '10 Disiplin: Geologika, Paleontologika, Arkeologika, Filologika, Numismatika, dll.' },
              { label: 'Koleksi Primadona', val: 'Fosil Gajah Purba Stegodon, Arca Emas, Naskah Serat Kalatidha' },
              { label: 'Fasilitas Terpadu', val: 'Laboratorium Konservasi Kimiawi, Audio-Visual, Tur Virtual 360°' }
            ],
            destLink: {
              label: 'Buka Museum Ranggawarsita di Buku Sketsa Destinasi',
              href: 'destinasi.html#ranggawarsita'
            },
            chapters: [
              {
                id: 'ch-rangga-1',
                num: 'BAB 01',
                period: 'Tahun 1975 – 1989',
                title: 'Inisiasi Gubernur Soepardjo Roestam & Nama Besar Sang Pujangga Keraton',
                paragraphs: [
                  'Pada pertengahan dekade 1970-an, para arkeolog, budayawan, dan sejarawan Jawa Tengah menyadari kenyataan pahit bahwa ribuan artefak peradaban purba tanah Jawa—mulai dari fosil manusia purba Sangiran, arca candi abad ke-8, keramik Dinasti Tang, keris pusaka, hingga naskah daun lontar—tersebar tanpa payung preservasi terpadu di kantor-kantor dinas dan sanggar masyarakat.',
                  'Melihat ancaman kerusakan dan pencurian cagar budaya tersebut, Gubernur Jawa Tengah saat itu, Mayor Jenderal TNI Soepardjo Roestam pada tahun 1975 memprakarsai proyek monumentil pembangunan Museum Negeri Provinsi Jawa Tengah di kawasan strategis Kalibanteng, Semarang Barat.',
                  'Pembangunan fisik empat gedung pameran permanen berarsitektur modern tropis diselesaikan secara bertahap. Pada tanggal 5 Juli 1989, Menteri Pendidikan dan Kebudayaan Republik Indonesia Prof. Dr. Fuad Hassan meresmikan pembukaan museum ini untuk umum.',
                  'Pemerintah menyematkan nama sang pujangga pamungkas Keraton Kasunanan Surakarta Hadiningrat: Raden Ngabehi Ranggawarsita (1802–1873). Beliau adalah intelektual sastrawan besar yang menggubah mahakarya Serat Kalatidha, Serat Sabdapratama, dan Serat Cemporet, yang mengajarkan falsafah hidup eling lawan waspada (senantiasa sadar dan waspada) dalam menghadapi perubahan zaman.'
                ],
                figure: {
                  img: 'assets/tokoh/ranggawarsita.png',
                  caption: 'Raden Ngabehi Ranggawarsita (1802–1873), sastrawan agung keraton yang namanya diabadikan sebagai nama museum induk kebudayaan Jawa Tengah.'
                }
              },
              {
                id: 'ch-rangga-2',
                num: 'BAB 02',
                period: 'Tahun 1989 – Sekarang',
                title: 'Anatomi 4 Gedung Kronologis: Dari Fosil Sangiran Hingga Kesenian Tradisi',
                paragraphs: [
                  'Koleksi Museum Ranggawarsita yang mencapai 59.814 unit ditata secara kronologis di empat gedung pameran permanen bertingkat dua yang luas dan nyaman:\n• Gedung A (Geologi & Paleontologi): Menampilkan sejarah terbentuknya pulau Jawa, sampel batuan meteorit, batu mulia akik, serta fosil tengkorak manusia purba Homo erectus dan kerangka gajah purba Stegodon trigonicephalus dari kubah purba Sangiran.\n• Gedung B (Prasejarah & Klasik Hindu-Buddha): Memamerkan kapak batu neolitikum, gerabah perunggu Dong Son, arca dewa-dewi Siwa dan Buddha berbahan batu andesit dan perunggu, lingga yoni, serta prasasti batu Kawi abad ke-8.\n• Gedung C (Era Islam, Kolonial & Perjuangan Bangsa): Memajang replika mimbar Masjid Agung Demak, persenjataan keris pusaka, meriam VOC, diorama Pertempuran Lima Hari Semarang, dan mata uang kuno (numismatika).\n• Gedung D (Etnografi & Kesenian Tradisi): Memamerkan ragam corak batik pesisiran dan pedalaman, gamelan perunggu Slendro-Pelog keraton, wayang kulit purwa, wayang golek, topeng tari tradisi, dan arsitektur rumah tradisional Jawa (Joglo dan Kudus).'
                ],
                figure: {
                  img: 'assets/museum-ranggawarsita.jpg',
                  caption: 'Diorama etnografi dan pameran arkeologi klasik di lantai utama Gedung Pameran Museum Ranggawarsita.'
                }
              },
              {
                id: 'ch-rangga-3',
                num: 'BAB 03',
                period: 'Tahun 1990 Masehi',
                title: 'Harta Karun Emas Wonoboyo: Puncak Kemewahan Logam Mulia Mataram Kuno',
                paragraphs: [
                  'Salah satu magnet terbesar kajian arkeologi di Museum Ranggawarsita adalah dokumentasi dan inventarisasi temuan emas Wonoboyo (ditemukan di Desa Wonoboyo, Jogonalan, Klaten pada 17 Oktober 1990 oleh enam orang petani yang sedang menggali tanah kas desa).',
                  'Temuan ini merupakan kumpulan artefak logam mulia terbesar dalam sejarah arkeologi Indonesia: empat guci perunggu kuno yang berisi 27 kilogram perhiasan emas murni berkadar 22 karat dari abad ke-9 Masehi (era Raja Balitung Mataram Kuno).',
                  'Koleksi tersebut mencakup mangkuk emas berukir epos Ramayana dengan pahatan figur super halus seukuran milimeter, piring bertatah permata, gelang naga emas, cincin meterai beraksara Kawi "Sri Baginda", serta ribuan koin emas kuno (uang masa). Keberadaan koleksi ini membuktikan bahwa peradaban Jawa Tengah seribu tahun silam telah menguasai teknologi metalurgi emas yang sejajar dengan peradaban Mesir Kuno dan Romawi.'
                ],
                callout: {
                  title: 'Harta Karun Emas Wonoboyo 27 Kilogram',
                  text: 'Temuan emas Wonoboyo 1990 merupakan temuan arkeologi logam mulia terbesar di Asia Tenggara: 27 kilogram perhiasan emas murni 22 karat era Mataram Kuno abad ke-9 yang disimpan dalam guci perunggu anti-korosi di kedalaman 3 meter tanah Klaten.'
                }
              },
              {
                id: 'ch-rangga-4',
                num: 'BAB 04',
                period: 'Tahun 2020 – 2026',
                title: 'Laboratorium Konservasi Kimiawi Naskah Kuno & Museum Digital 360 Derajat',
                paragraphs: [
                  'Memasuki era abad ke-21, tantangan terbesar Museum Ranggawarsita bukan lagi sekadar memamerkan benda cagar budaya, melainkan memastikan kelestarian fisik artefak rapuh seperti naskah daun lontar, kertas dluwang gedog buatan kulit pohon mulberry, dan kain batik antik abad ke-19.',
                  'Museum ini mengoperasikan laboratorium konservasi kimiawi modern berstandar arsip nasional. Tenaga ahli kimia konservator secara berkala melakukan proses deasidifikasi (penghilangan zat asam), fumigasi anti-rayap alami menggunakan minyak cengkeh dan sereh, serta pelapisan tisu Jepang (Japanese tissue repair) pada halaman-halaman naskah kuno yang getas.',
                  'Menjawab kebutuhan edukasi generasi Z dan masyarakat global pada tahun 2026, Museum Ranggawarsita meluncurkan integrasi katalog digital 360 derajat dan augmented reality (AR). Pengunjung dapat memindai barcode di depan fosil manusia purba Sangiran untuk melihat visual 3D pergerakan purba di layar sentuh, menjadikan museum provinsi ini mercusuar edukasi kebudayaan percontohan di Nusantara.'
                ]
              }
            ],
            timeline: [
              { year: '1802 M', title: 'Kelahiran R.Ng. Ranggawarsita', desc: 'Lahir di Surakarta; kelak menjadi sastrawan besar pengarang Serat Kalatidha.' },
              { year: '1975 M', title: 'Gagasan Gubernur Soepardjo Roestam', desc: 'Perintisan pembangunan museum induk kebudayaan daerah untuk memusatkan artefak purbakala.' },
              { year: '1983 M', title: 'Penyelesaian Konstruksi Gedung', desc: 'Penuntasan konstruksi 4 gedung pameran permanen berarsitektur modern tropis di Kalibanteng.' },
              { year: '1989 M', title: 'Peresmian oleh Mendikbud Fuad Hassan', desc: 'Peresmian operasional Museum Jawa Tengah Ranggawarsita dengan koleksi puluhan ribu artefak.' },
              { year: '1990 M', title: 'Penerimaan Koleksi Emas Wonoboyo', desc: 'Dokumentasi dan akuisisi koleksi emas Dinasti Mataram Kuno temuan petani di Klaten.' },
              { year: '2026 M', title: 'Transformasi Kurasi Digital 360°', desc: 'Peluncuran katalog digital artefak, laboratorium konservasi kimiawi, dan tur edukasi interaktif.' }
            ],
            figures: [
              {
                name: 'R.Ng. Ranggawarsita',
                role: 'Pujangga Pamungkas Keraton Surakarta',
                avatar: 'assets/tokoh/ranggawarsita.png',
                bio: 'Tokoh intelektual dan sastrawan besar Jawa pencipta Serat Kalatidha yang namanya diabadikan sebagai nama museum.'
              },
              {
                name: 'Soepardjo Roestam',
                role: 'Gubernur Jawa Tengah Perintis Museum',
                avatar: 'assets/tokoh/pakubuwana-x.png',
                bio: 'Pemimpin daerah yang memprakarsai pembangunan museum negeri terlengkap untuk menyelamatkan cagar budaya Jawa Tengah.'
              },
              {
                name: 'Prof. Dr. Fuad Hassan',
                role: 'Menteri Pendidikan dan Kebudayaan RI 1989',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Tokoh akademisi dan diplomat yang meresmikan pembukaan Museum Ranggawarsita bagi masyarakat Indonesia.'
              }
            ],
            quote: {
              text: 'Museum bukanlah sekadar etalase kaca penyimpan benda mati masa lampau; museum adalah mercusuar kebenaran sejarah tempat generasi hari ini belajar menatap masa depan dengan akar bangsa yang kokoh.',
              cite: 'Prinsip Kurasi Museum Jawa Tengah Ranggawarsita'
            },
            epilogue: 'Mengunjungi Museum Ranggawarsita adalah ziarah intelektual menyusuri 1,5 juta tahun perjalanan peradaban manusia di bumi Jawa Tengah. Dari fosil purba Sangiran hingga goresan pena sang pujangga keraton, kita diajak bangga pada luhurnya identitas Nusantara.'
          }
        },
        {
          num: '03',
          thumb: 'assets/kota-lama.jpg',
          title: 'Kawasan Kota Lama Semarang',
          desc: '"Little Netherland" seluas 31 hektar dengan Gereja Blenduk 1753 dan arsitektur maritim abad XVIII.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · KOTA LAMA SEMARANG',
            title: 'Little Netherland di Pesisir Jawa: Dari Benteng Vijfhoek VOC 1743 Menuju Living Heritage Cagar Budaya Tanpa Banjir Rob',
            subtitle: 'Monograf sejarah kawasan cagar budaya 31 hektar, pusat perdagangan maritim rempah Hindia Belanda, Gereja Blenduk kubah perunggu 1753, Gedung Marabunta dan Spiegel, ancaman penurunan tanah dan pasang rob laut, hingga proyek revitalisasi polder bebas banjir kelas dunia.',
            readTime: '10 Menit Waktu Baca',
            curator: 'Badan Pengelola Kawasan Kota Lama Semarang & Komunitas Pegiat Pusaka Oudstad',
            heroImg: 'assets/kota-lama.jpg',
            heroCaption: 'Kawasan Kota Lama Semarang dengan ikon Gereja Blenduk kubah perunggu bergaya Neoklasik Belanda.',
            lead: 'Melintasi Jembatan Berok di muara Kali Semarang, kita melangkah masuk ke Kawasan Kota Lama (Oudstad) seluas 31 hektar. Dijuluki "Little Netherland" atau "De Europeesche Buurt", kawasan ini memuat konsentrasi arsitektur kolonial abad ke-18 hingga awal abad ke-20 terbaik di kepulauan Indonesia. Lebih dari seratus bangunan cagar budaya berarsitektur bata ekspos, atap mansard tinggi, dan jendela lengkung neoklasik merekam masa kejayaan pelabuhan perniagaan rempah, kopi, dan gula Jawa di panggung pasar internasional.',
            quickFacts: [
              { label: 'Tahun Mulai Dibangun', val: '1743 Masehi (Pasca Perjanjian Keraton Mataram – VOC)' },
              { label: 'Benteng Pertahanan Asli', val: 'Benteng Vijfhoek (Benteng Bersegi Lima dengan Kanal Air)' },
              { label: 'Luas Kawasan Cagar Budaya', val: '31 Hektar (105 Bangunan Bersejarah Terdata)' },
              { label: 'Ikon Arsitektur Tertua', val: 'Gereja Blenduk / Koepelkerk (Diresmikan Tahun 1753)' },
              { label: 'Gedung Ikonik Lainnya', val: 'Gedung Spiegel (1895), Gedung Marabunta (1854), De Javasche Bank' },
              { label: 'Era Kejayaan Perdagangan', val: 'Abad XIX – XX (Perniagaan Gula Raja Oei Tiong Ham)' },
              { label: 'Revitalisasi Modern Bebas Rob', val: 'Tahun 2017 – 2019 (Pembangunan Sistem Polder Banger)' },
              { label: 'Status Pelestarian', val: 'Living Heritage Cagar Budaya Nasional & Tentative List UNESCO' }
            ],
            destLink: {
              label: 'Buka Kota Lama di Buku Sketsa Destinasi',
              href: 'destinasi.html#kotalama'
            },
            chapters: [
              {
                id: 'ch-kotalama-1',
                num: 'BAB 01',
                period: 'Tahun 1743 – 1753',
                title: 'Perjanjian 1743, Benteng Vijfhoek VOC & Berdirinya Gereja Blenduk 1753',
                paragraphs: [
                  'Kelahiran Kawasan Kota Lama Semarang bermula dari Perjanjian 1743 antara Susuhunan Pakubuwana II dari Keraton Mataram dan kongsi dagang Vereenigde Oostindische Compagnie (VOC). Sebagai imbalan atas bantuan militer menumpas peristiwa Geger Pacinan di Kartasura, VOC memperoleh hak penguasaan penuh atas seluruh jalur pesisir utara pulau Jawa, termasuk kota pelabuhan Semarang.',
                  'Untuk mengamankan kantor dagang dan pemukiman bangsa Eropa, VOC membangun benteng pertahanan bersegi lima bernama Benteng Vijfhoek di tepi barat Kali Semarang. Di sekeliling benteng digali kanal-kanal air peniru tata kota Amsterdam guna memudahkan tongkang perahu pengangkut komoditas berlayar langsung ke gudang penyimpanan rempah.',
                  'Di jantung pusat kawasan benteng, pada tahun 1753 didirikan gereja kristen tertua di Jawa Tengah: Koepelkerk (Gereja Protestan di Indonesia Bagian Barat / GPIB Immanuel). Bangunan asli beratap joglo kemudian dipugar secara monumental pada tahun 1894 oleh arsitek H.P.A. de Wilde dan W. Westmaas dengan memasang kubah perunggu raksasa berbentuk cembung setengah bola, yang oleh masyarakat Jawa dijuluki "Gereja Blenduk" (menggembung membulat).',
                  'Gereja Blenduk dilengkapi dua menara lonceng neoklasik di fasad depannya serta sebuah alat musik organ pipa kuno berpipa timah buatan pabrik P. van Oeckelen asal Haren, Belanda yang menjadi saksi bisu musik liturgi abad ke-19.'
                ],
                figure: {
                  img: 'assets/kota-lama.jpg',
                  caption: 'Gereja Blenduk dengan kubah perunggu setengah bola yang menjadi tengara visual utama Kota Lama Semarang.'
                },
                callout: {
                  title: 'Organ Pipa Antik P. van Oeckelen 1894',
                  text: 'Di dalam ruang ibadah Gereja Blenduk tersimpan salah satu organ pipa gereja tertua di Indonesia karya pembuat organ legendaris Belanda, Petrus van Oeckelen. Organ pipa ini masih terawat utuh di atas balkon kayu jati berukir.'
                }
              },
              {
                id: 'ch-kotalama-2',
                num: 'BAB 02',
                period: 'Tahun 1850 – 1940',
                title: 'Zaman Keemasan Raja Gula Oei Tiong Ham & Bangunan Neoklasik Maritim',
                paragraphs: [
                  'Memasuki pertengahan abad ke-19 seiring pembongkaran dinding benteng benteng kuno (1824) guna perluasan kota, Semarang tumbuh menjadi episentrum ekspor gula terbesar di belahan bumi timur. Di kawasan inilah konglomerat Asia Tenggara pertama asal Semarang, Oei Tiong Ham (Oei Tiong Ham Concern / OTHC), mendirikan markas imperium bisnis internasionalnya.',
                  'Jalan-jalan utama seperti Heerenstraat (kini Jalan Letjen Suprapto) dan Westerwalstraat dipadati kantor-kantor perbankan kolonial, firma asuransi laut, dan toko serba ada mewah. Berdiri Gedung Spiegel (1895) milik pengusaha N.V. Winkel-Maatschappij H. Spiegel yang menyediakan busana dan perlengkapan rumah tangga impor Eropa, serta Gedung Marabunta (1854) dengan ornamen patung semut raksasa di atas atapnya yang menjadi panggung gedung sandiwara (schouwburg).',
                  'Kawasan Kota Lama dihubungkan dengan kota pelabuhan Tanjung Emas melalui jalur rel trem dan stasiun kereta api NIS, menjadikannya kota pelabuhan paling kosmopolitan di pesisir utara Jawa.'
                ],
                figure: {
                  img: 'assets/articles/kota-lama-gedung-spiegel.jpg',
                  caption: 'Gedung Spiegel (1895) berarsitektur neoklasik Eropa di jantung kawasan cagar budaya Kota Lama Semarang (Oudstad).'
                }
              },
              {
                id: 'ch-kotalama-3',
                num: 'BAB 03',
                period: 'Tahun 1980 – 2015',
                title: 'Tiga Dekade Pengepungan Banjir Rob & Kerusakan Penurunan Tanah Pesisir',
                paragraphs: [
                  'Pada dekade 1980-an hingga awal 2000-an, kawasan Kota Lama Semarang mengalami krisis eksistensial yang nyaris memusnahkan warisan arsitektur kolonial tersebut. Kombinasi penurunan muka tanah pesisir (land subsidence) hingga 10 sentimeter per tahun akibat penyedotan air tanah berlebihan dan pasang air laut (rob) menenggelamkan jalanan dan lantai marmer gedung bersejarah.',
                  'Air laut asin yang merendam pondasi bata merah selama puluhan tahun memicu pelapukan dinding dan lumut liar. Banyak pemilik bangunan dan korporasi terpaksa meninggalkan gedung-gedung megah mereka, menjadikan Oudstad dijuluki sebagai "kota mati" yang sepi dan rentan kriminalitas.',
                  'Sejumlah bangunan berarsitektur langka sempat runtuh atapnya karena tidak berpenghuni. Namun, para budayawan, arsitek muda Semarang, dan komunitas pegiat pusaka Oudstad pantang menyerah dan terus menyuarakan pentingnya penyelamatan kawasan bersejarah 31 hektar ini kepada pemerintah pusat dan lembaga internasional.'
                ]
              },
              {
                id: 'ch-kotalama-4',
                num: 'BAB 04',
                period: 'Tahun 2017 – Sekarang',
                title: 'Restorasi Kolosal Polder Kali Banger, Bebas Kabel Udara & Warisan Dunia 2026',
                paragraphs: [
                  'Titik balik kebangkitan Kota Lama terjadi pada kurun waktu 2017 hingga 2019 ketika Pemerintah Kota Semarang bersama Kementerian PUPR menggelar mega-proyek revitalisasi terpadu dengan anggaran ratusan miliar rupiah.',
                  'Kunci keberhasilan penyelamatan ini terletak pada pembangunan sistem drainase polder Kali Banger dan rumah pompa otomatis berkapasitas raksasa yang menahan pasang air laut masuk ke kawasan heritage. Seluruh jaringan kabel listrik dan serat optik udara yang semrawut ditanam ke saluran utilitas bawah tanah (ductless underground cabling).',
                  'Jalanan ditata ulang menggunakan batu andesit ramah pejalan kaki bergaya eropa tempo doeloe, dilengkapi lampu jalan gas antik dan pohon peneduh. Gedung-gedung tua direstorasi menjadi galeri seni kontemporer (Semarang Contemporary Art Gallery), museum kreatif, sentra UMKM kriya batik, dan ruang publik hidup (Living Museum).',
                  'Kini, Kota Lama Semarang resmi masuk ke dalam Daftar Sementara (Tentative List) Situs Warisan Dunia UNESCO dan menjadi bukti nyata keberhasilan konservasi arsitektur maritim pesisir di Asia Tenggara.'
                ],
                callout: {
                  title: 'Sains Sistem Polder Penjinak Banjir Rob',
                  text: 'Sistem polder Kota Lama memadukan tanggul keliling, kolam retensi pengendap lumpur, dan rumah pompa otomatis berdaya hisap puluhan ribu liter per detik yang otomatis aktif saat air pasang laut naik, menjamin 31 hektar kawasan cagar budaya bebas banjir 24 jam.'
                }
              }
            ],
            timeline: [
              { year: '1743 M', title: 'Perjanjian Mataram–VOC', desc: 'Penyerahan kendali pelabuhan Semarang kepada VOC dan pembangunan Benteng Vijfhoek.' },
              { year: '1753 M', title: 'Pembangunan Gereja Blenduk', desc: 'Peresmian gereja protestan tertua di Jawa Tengah dengan struktur atap dan menara awal.' },
              { year: '1824 M', title: 'Pembongkaran Benteng', desc: 'Dinding benteng bersegi lima dibongkar untuk memperluas jalan niaga Heerenstraat.' },
              { year: '1894 M', title: 'Pemugaran Kubah Neoklasik', desc: 'Arsitek H.P.A. de Wilde memasang kubah perunggu setengah bola raksasa Gereja Blenduk.' },
              { year: '1895 M', title: 'Pembangunan Gedung Spiegel', desc: 'Toko serba ada mewah berarsitektur bata ekspos didirikan oleh pengusaha H. Spiegel.' },
              { year: '1985–2005 M', title: 'Masa Krisis Banjir Rob', desc: 'Penurunan muka tanah menenggelamkan jalanan Kota Lama di bawah genangan pasang air laut.' },
              { year: '2019 M', title: 'Revitalisasi Polder & Jalan Bebas Kabel', desc: 'Penuntasan restorasi sistem polder anti-banjir rob dan penataan jalur pejalan kaki andesit.' },
              { year: '2026 M', title: 'Living Heritage & Warisan Dunia', desc: 'Aktivasi kawasan museum arsitektur terbuka 31 hektar dan pengusulan resmi ke UNESCO.' }
            ],
            figures: [
              {
                name: 'H.P.A. de Wilde',
                role: 'Arsitek Kubah Gereja Blenduk 1894',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Perancang Belanda yang menggubah kubah perunggu neoklasik setengah bola yang menjadi simbol abadi Kota Lama Semarang.'
              },
              {
                name: 'Oei Tiong Ham',
                role: 'Raja Gula Multinasional Era Kolonial',
                avatar: 'assets/tokoh/oei-tiong-ham.png',
                bio: 'Konglomerat industri gula modern pertama Asia Tenggara yang bermarkas di kawasan pelabuhan maritim Kota Lama Semarang.'
              }
            ],
            quote: {
              text: 'Kota Lama bukanlah sekadar masa lalu bangsa lain; ia adalah gelanggang di mana bangsa ini belajar menghargai jejak arsitektur dunia dan merajutnya menjadi ruang publik yang hidup, indah, dan membanggakan warga kota.',
              cite: 'Wasiat Kuratorial Badan Pengelola Kawasan Kota Lama Semarang'
            },
            epilogue: 'Menikmati secangkir kopi di pelataran Gereja Blenduk saat senja berganti temaram lampu gas kuno adalah menikmati harmoni waktu. Kota Lama membuktikan bahwa masa lampau yang dirawat dengan cinta akan menjadi berkah kebanggaan bagi masa depan.'
          }
        },
        {
          num: '04',
          thumb: 'assets/museum-batik-danarhadi.jpg',
          title: 'Museum Batik Danar Hadi (Surakarta)',
          desc: 'Kompleks cagar budaya Ndalem Wuryaningratan dengan 10.000 helai kain batik kuno koleksi H. Santosa Doellah.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · MUSEUM BATIK DANAR HADI',
            title: 'Mahakarya 10.000 Helai Kain Batik Kuno: Merawat Benang Sejarah Peradaban Tekstil di Rumah Bangsawan Ndalem Wuryaningratan Solo 1890',
            subtitle: 'Kajian ensiklopedis kompleks cagar budaya kediaman pepatih dalem Kasunanan Surakarta, dedikasi setengah abad maestro H. Santosa Doellah, museum batik terlengkap rekor MURI, ragam kain batik Belanda Van Zuylen hingga Hokokai zaman Jepang, dan workshop pembatik tradisional live.',
            readTime: '11 Menit Waktu Baca',
            curator: 'Dewan Kurator Museum Batik Danar Hadi Surakarta & Yayasan Danar Hadi',
            heroImg: 'assets/museum-batik-danarhadi.jpg',
            heroCaption: 'Kompleks cagar budaya Ndalem Wuryaningratan (1890) yang menaungi Museum Batik Danar Hadi di Jalan Slamet Riyadi No. 261, Surakarta.',
            lead: 'Menempati kompleks cagar budaya Ndalem Wuryaningratan di Jalan Slamet Riyadi No. 261 Surakarta, Museum Batik Danar Hadi didirikan pada tahun 2002 oleh maestro batik dan budayawan tekstil nasional H. Santosa Doellah. Menyimpan koleksi lebih dari 10.000 helai kain batik kuno langka dari berbagai zaman dan sentra kebudayaan, museum ini diakui Museum Rekor-Dunia Indonesia (MURI) sebagai museum dengan koleksi batik kuno terlengkap di dunia.',
            quickFacts: [
              { label: 'Gedung Cagar Budaya', val: 'Ndalem Wuryaningratan (Dibangun Tahun 1890 Masehi)' },
              { label: 'Pendiri Museum', val: 'H. Santosa Doellah (Diresmikan 20 Oktober 2002)' },
              { label: 'Jumlah Koleksi Kain', val: 'Lebih dari 10.000 Helai Batik Kuno Lintas Abad' },
              { label: 'Pengakuan Rekor', val: 'Museum Tekstil Koleksi Batik Terlengkap Rekor MURI' },
              { label: 'Klasifikasi Pameran', val: '9 Ruang Tematik (Batik Keraton, Belanda, Cina, Hokokai, Sudagaran, dll.)' },
              { label: 'Fasilitas Terpadu', val: 'Living Workshop Canting & Celup Warna Tradisional, Galeri Batik Tulis' },
              { label: 'Arsitektur Gedung', val: 'Akulturasi Aristokrat Jawa Klasik (Joglo Pendopo) dan Kolonial Eropa' },
              { label: 'Lokasi Strategis', val: 'Kawasan Poros Budaya Jalan Slamet Riyadi, Kota Surakarta' }
            ],
            destLink: {
              label: 'Buka Danar Hadi di Buku Sketsa Destinasi',
              href: 'destinasi.html#danarhadi'
            },
            chapters: [
              {
                id: 'ch-danarhadi-1',
                num: 'BAB 01',
                period: 'Tahun 1890 – 1967',
                title: 'Sejarah Ndalem Wuryaningratan & Rumah Bangsawan Pepatih Dalem Solo',
                paragraphs: [
                  'Bangunan pusaka yang kini menjadi rumah bagi Museum Batik Danar Hadi memiliki sejarah panjang dalam silsilah aristokrasi Keraton Surakarta. Didirikan pada tahun 1890 oleh Kanjeng Raden Mas Haryo (KRMH) Wuryaningrat, cucu Raja Pakubuwana IX sekaligus pepatih dalem (perdana menteri) pada masa pemerintahan Sri Susuhunan Pakubuwana X.',
                  'Secara tata ruang aristokrat Jawa, Ndalem Wuryaningratan memadukan keagungan pendopo agung bertiang empat saka guru kayu jati pilihan tanpa paku, ruang dalem wingit tempat tinggal pangeran, serta serambi gandhok samping berfasad pilar-pilar Neoklasik kolonial.',
                  'Di ndalem bersejarah inilah pernah digelar kongres-kongres Boedi Oetomo dan pertemuan kebudayaan pemuda perintis kemerdekaan di awal abad ke-20. Pada tahun 1999, kompleks yang sempat terbengkalai ini diselamatkan dan direstorasi secara menyeluruh oleh pengusaha dan budayawan tekstil H. Santosa Doellah untuk dijadikan House of Danar Hadi.'
                ],
                figure: {
                  img: 'assets/museum-batik-danarhadi.jpg',
                  caption: 'Interior ruang pameran utama di dalam Ndalem Wuryaningratan dengan pendingin suhu dan pencahayaan khusus preservasi kain antik.'
                }
              },
              {
                id: 'ch-danarhadi-2',
                num: 'BAB 02',
                period: 'Tahun 1967 – 2002',
                title: 'Dedikasi Setengah Abad H. Santosa Doellah Menghimpun 10.000 Helai Batik',
                paragraphs: [
                  'Koleksi museum ini merupakan hasil dedikasi seumur hidup mendiang H. Santosa Doellah (1941–2021). Terlahir dari keluarga saudagar batik keraton dan cucu dari R.H. Wongsodinomo, Santosa muda telah terbiasa mencium aroma malam dan mengamati ketelitian para pembatik di Surakarta.',
                  'Melihat banyak kain batik kuno bernilai sejarah tinggi dijual murah ke kolektor luar negeri atau rusak termakan rayap di gudang-gudang tua, Santosa tergerak untuk menyelamatkannya. Selama lebih dari 50 tahun pengembaraannya melintasi sentra-sentra kriya Jawa, Sumatra, Bali, hingga Eropa, ia berhasil mengumpulkan lebih dari 10.000 helai kain batik yang mewakili seluruh zaman dan ragam gaya peradaban kain Nusantara.',
                  'Koleksi tersebut dirawat dalam ruangan pamer bersuhu 20–22°C dan kelembapan terkontrol, menggunakan pencahayaan serat optik tanpa sinar ultraviolet guna mencegah degradasi serat kapas mori alami.'
                ]
              },
              {
                id: 'ch-danarhadi-3',
                num: 'BAB 03',
                period: 'Era Perang Pasifik (1942–1945)',
                title: 'Eksplorasi 9 Ruang Tematik: Dari Batik Keraton Hingga Kelangkaan Jawa Hokokai',
                paragraphs: [
                  'Diresmikan pembukaannya oleh Presiden kelima RI Megawati Soekarnoputri pada 20 Oktober 2002, museum ini menata 10.000 koleksi kainnya ke dalam 9 ruang tematik terkurasi berstandar internasional:\n1. Ruang Batik Keraton: Memamerkan kain batik sogan klasik milik keluarga raja Keraton Kasunanan Surakarta dan Pura Mangkunegaran dengan motif-motif larangan sakral seperti Parang Rusak Barong, Semen Rante, dan Truntum.\n2. Ruang Batik Belanda (Batik Kompeni): Menampilkan kain batik karya perancang perempuan Indo-Eropa abad ke-19 seperti Carolina Josephina van Franquemont dan Catharina Carolina van Oosterom dengan motif dongeng Eropa (Hansel & Gretel, Putri Salju) dan bunga buketan.\n3. Ruang Batik Cina Peranakan: Menampilkan batik pesisir Pekalongan dan Lasem berornamen naga liong, burung phoenix lokcan, dan burung hong berwana merah cerah mengkudu.\n4. Ruang Batik Jawa Hokokai (1942–1945): Kain batik super langka zaman pendudukan Jepang dengan motif bunga sakura, krisan, dan kupukupu bernuansa padat pagi-sore yang dikerjakan dengan canting tulis super halus di tengah ketiadaan bahan mori akibat perang.\n5. Ruang Batik Sudagaran: Merekam kemandirian saudagar batik bumiputera Laweyan abad ke-19 dengan ragam hias modifikasi yang berani dan bebas.\n6. Ruang Batik Petani & Batik Indonesia Merdeka: Memajang batik rancangan Bung Karno yang memadukan warna sogan Mataram dan warna cerah pesisir sebagai simbol persatuan bangsa.'
                ],
                callout: {
                  title: 'Mengapa Batik Jawa Hokokai Dinilai Sangat Berharga?',
                  text: 'Dibuat pada masa pendudukan militer Jepang (1942–1945) saat kain katun mori sangat langka dijatah tentara, pembatik menyiasatinya dengan teknik pola "pagi-sore" (dua motif berbeda dalam satu helai kain) yang dipenuhi ornamen bunga sakura super rapat tanpa ada bidang kain kosong.'
                }
              },
              {
                id: 'ch-danarhadi-4',
                num: 'BAB 04',
                period: 'Tahun 2002 – Sekarang',
                title: 'Living Workshop Canting Tradisional Sayap Belakang & Preservasi Kriya 2026',
                paragraphs: [
                  'Di sayap belakang museum, pengunjung diajak melangkah masuk ke "Living Workshop": bengkel kerja hidup tempat puluhan pembatik wanita paruh baya tekun menorehkan lilin malam panas menggunakan canting tembaga serta para pengrajin canting cap tembaga.',
                  'Pengunjung dapat belajar mencanting secara langsung, merasakan hembusan napas di cucuk canting, dan memahami nilai kesabaran spiritual di balik sehelai kain batik. Proses pewarnaan alami memanfaatkan kulit kayu soga tingi, daun nila indigofera, dan tegeran kayu kuning tetap dipertahankan sesuai pakem leluhur.',
                  'Memasuki tahun 2026, Museum Batik Danar Hadi memperkuat perannya sebagai pusat riset tekstil dunia, bekerjasama dengan museum-museum seni internasional di Belanda, Jepang, dan Amerika Serikat untuk mendokumentasikan benang sejarah peradaban kain batik sebagai mahakarya kemanusiaan milik bangsa Indonesia.'
                ],
                figure: {
                  img: 'assets/articles/museum-danar-hadi-house.jpg',
                  caption: 'Kompleks cagar budaya House of Danar Hadi di Jalan Slamet Riyadi Solo yang menaungi museum dan living workshop batik.'
                }
              }
            ],
            timeline: [
              { year: '1890 M', title: 'Pembangunan Ndalem Wuryaningratan', desc: 'Didirikan oleh KRMH Wuryaningrat, pepatih dalem Sri Susuhunan Pakubuwana IX.' },
              { year: '1967 M', title: 'Pendirian Batik Danar Hadi', desc: 'H. Santosa Doellah bersama sang istri Hj. Danarsih mendirikan perusahaan kriya batik di Solo.' },
              { year: '1999 M', title: 'Akuisisi & Restorasi Cagar Budaya', desc: 'Penyelamatan kompleks Ndalem Wuryaningratan dan renovasi menjadi ruang pameran museum.' },
              { year: '2002 M', title: 'Peresmian oleh Presiden Megawati', desc: 'Presiden RI ke-5 Megawati Soekarnoputri meresmikan pembukaan Museum Batik Danar Hadi.' },
              { year: '2009 M', title: 'Batik Diakui Warisan Budaya UNESCO', desc: 'Museum Danar Hadi menjadi mitra riset utama penyusunan naskah nominasi UNESCO di Abu Dhabi.' },
              { year: '2026 M', title: 'Pusat Riset Kriya Tekstil Dunia', desc: 'Pengembangan workshop membatik interaktif, preservasi kain antik, dan edukasi bagi peneliti dunia.' }
            ],
            figures: [
              {
                name: 'H. Santosa Doellah',
                role: 'Pendiri Museum & Maestro Batik Nasional',
                avatar: 'assets/tokoh/oei-tiong-ham.png',
                bio: 'Maestro dan budayawan tekstil terkemuka yang mendedikasikan lebih dari 50 tahun hidupnya untuk mengumpulkan dan merawat 10.000 kain batik kuno Nusantara.'
              },
              {
                name: 'KRMH Wuryaningrat',
                role: 'Pepatih Dalem Kasunanan Surakarta',
                avatar: 'assets/tokoh/pakubuwana-x.png',
                bio: 'Bangsawan agung cucu Raja Pakubuwana IX pembangun rumah pusaka Ndalem Wuryaningratan pada tahun 1890.'
              }
            ],
            quote: {
              text: 'Mengumpulkan 10.000 lembar kain batik bukanlah urusan hobi menimbun kain tua; ini adalah ikhtiar seumur hidup menyelamatkan lembaran jiwa dan doa leluhur bangsa sebelum punah dimakan waktu.',
              cite: 'Wasiat Kebudayaan Alm. H. Santosa Doellah, Pendiri Museum Danar Hadi'
            },
            epilogue: 'Museum Batik Danar Hadi adalah persembahan cinta abadi bagi keagungan seni membatik Indonesia. Di setiap helai kain yang terawat di museum ini, kita merasakan denyut keheningan batin para pembatik yang menenun keabadian bagi peradaban dunia.'
          }
        }
      ]
    },
    {
      id: 'galeri-budaya',
      name: 'Galeri Budaya (Batik & Living Heritage)',
      label: 'Galeri Budaya',
      categoryType: 'Kategori 03 · Galeri Budaya',
      period: 'Abad XV M – Sekarang',
      titleSmall: 'Historiografi & Asal-Usul',
      titleMain: 'Galeri Budaya',
      eraBadge: 'Galeri Budaya · Tradisi Sakral Abad XV hingga Pengakuan Warisan UNESCO',
      narrative: 'Sejarah galeri budaya dan seni kriya Jawa Tengah berkembang dari dua kutub kebudayaan: tradisi wingit adiluhung keraton pedalaman dan akulturasi bahari pesisir utara. Pada abad ke-15 era Kesultanan Demak, kain batik mulai menyerap perjumpaan saudagar mancanegara dengan lahirnya motif cerah Tionghoa (Batik Encim/Liong) dan motif Arab di Pekalongan dan Lasem. Di pedalaman, Keraton Surakarta Hadiningrat (berdiri 1745) membakukan pakem busana batik klasik sogan sakral (Parang Rusak, Semen Rante, Truntum) serta seni tari Bedhaya Ketawang. Ditemukannya canting cap tembaga pada pertengahan abad ke-19 memicu revolusi industri kerakyatan, melahirkan ribuan galeri dan sanggar pembatik di Kampung Laweyan. Puncaknya pada 2 Oktober 2009, UNESCO mengukuhkan Batik Indonesia sebagai Warisan Budaya Takbenda Dunia, dan Pekalongan dinobatkan ke UNESCO Creative Cities Network. Kini galeri budaya hidup sebagai ruang edukasi interaktif, sanggar membatik mandiri, dan studio canting digital.',
      image: 'assets/history/batik.jpg',
      plaque: 'Canting Tembaga & Warisan Adiluhung Keraton · Abad XV M – Sekarang (UNESCO Intangible Heritage)',
      cards: [
        {
          num: '01',
          thumb: 'assets/batik-pekalongan-photo.jpg',
          title: 'Kawasan Batik Pekalongan',
          desc: 'Kota Kreatif Dunia UNESCO dengan tradisi canting malam pesisir, batik buketan cerah dan Pasar Setono.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · KAWASAN BATIK PEKALONGAN',
            title: 'Kota Batik Dunia di Jalur Sutra Pesisir: Dari Akulturasi Bahari Abad XV Menuju Jaringan Kota Kreatif Kriya UNESCO',
            subtitle: 'Monograf sejarah akulturasi maritim Tionghoa, Arab, dan Eropa di sehelai mori pesisir, teknik jarum halus cecek pitu maestro Oey Soe Tjoen 1925, penetapan UNESCO Creative City 2014, dan denyut ekonomi ribuan pengrajin Pasar Grosir Setono.',
            readTime: '10 Menit Waktu Baca',
            curator: 'Paguyuban Pecinta Batik Pekalongan & Tim Riset Kriya Tekstil Pesisir',
            heroImg: 'assets/batik-pekalongan-photo.jpg',
            heroCaption: 'Penorehan cairan lilin malam panas menggunakan canting tembaga pada kain mori sutra halus di sanggar pembatik Pekalongan.',
            lead: 'Terbentang di pesisir utara Jawa Tengah berbatasan langsung dengan ombak Laut Jawa, Kota Pekalongan bernapas melalui goresan canting dan aroma khas lilin malam panas yang mengepul dari wajan anglo. Berbeda dengan batik pedalaman Solo-Yogya yang bernuansa tenang cokelat sogan sakral keraton, batik Pekalongan adalah kanvas perjumpaan peradaban dunia: semarak warna-warni cerah hasil keterbukaan akulturasi para saudagar Tionghoa, Arab, Belanda, dan Melayu sejak era Kesultanan Demak abad ke-15 Masehi.',
            quickFacts: [
              { label: 'Tradisi Tertua', val: 'Abad XV Masehi (Pelabuhan Dagang Kesultanan Demak & Mataram)' },
              { label: 'Karakter Ragam Hias', val: 'Batik Buketan Belanda, Batik Encim Liong Tionghoa, Jlamprang Arab' },
              { label: 'Maestro Tulis Legendaris', val: 'Oey Soe Tjoen & Kwee Tjoen Jin (Kedungwuni, Sejak 1925)' },
              { label: 'Teknik Tertinggi', val: 'Teknik Canting Tulis "Cecek Pitu" (Pengerjaan Hingga 1 Tahun)' },
              { label: 'Penetapan Warisan Dunia', val: 'UNESCO Masterpiece of Intangible Heritage (2 Oktober 2009)' },
              { label: 'Kota Kreatif Dunia', val: 'UNESCO Creative Cities Network (Crafts and Folk Art 2014)' },
              { label: 'Sentra Pasar Terbesar', val: 'Pasar Grosir Setono, Kampung Pesindon, dan Kampung Kauman' },
              { label: 'Museum Resmi', val: 'Museum Batik Pekalongan di Kawasan Jetayu' }
            ],
            destLink: {
              label: 'Buka Kawasan Batik Pekalongan di Buku Sketsa Destinasi',
              href: 'destinasi.html#pekalongan'
            },
            chapters: [
              {
                id: 'ch-pekalongan-1',
                num: 'BAB 01',
                period: 'Abad XV – XVII Masehi',
                title: 'Jalur Sutra Maritim Kesultanan Demak & Fajar Akulturasi Sehelai Mori Pesisir',
                paragraphs: [
                  'Tradisi kriya tekstil di pesisir utara Pekalongan telah berakar kuat sejak era keemasan Kesultanan Demak pada permulaan abad ke-15 Masehi. Berbeda dengan peradaban pedalaman agraris yang tertutup di balik benteng keraton, Pekalongan tumbuh sebagai kota pelabuhan niaga samudra kosmopolit yang menghubungkan perairan Laut Jawa dengan jalur rempah Nusantara.',
                  'Kapal-kapal jung dari daratan Tiongkok Selatan, dhow saudagar Arab Hadramaut, kapal dagang Gujarat India, serta kapal niaga Portugis dan Belanda silih berganti membuang sauh di muara Sungai Pekalongan. Perjumpaan intensif antarbangsa ini membentuk karakter masyarakat pesisir yang egaliter, terbuka, dan tanggap terhadap perubahan estetika seni rupa dunia.',
                  'Para pembatik perempuan pesisir mulai menyerap teknik mori halus impor dan memadukannya dengan teknik celup rintang lilin malam lokal. Air tanah Pekalongan yang mengalir dari lereng Gunung Rogojembangan dan Gunung Prahu memiliki kandungan mineral kapur dan garam alami tertentu yang secara kimiawi bertindak sebagai mordan fiksatif alami luar biasa, mengunci pigmen warna pada serat selulosa kapas secara permanen.',
                  'Dari fajar sejarah maritim inilah lahir dialektika visual yang khas: sehelai kain mori Pekalongan tidak pernah membatasi diri pada pakem geometri kaku, melainkan menjadi kanvas dinamis yang bebas merespons gelombang kebudayaan yang berlabuh di dermaganya.'
                ],
                figure: {
                  img: 'assets/articles/batik-pekalongan-tulis.jpg',
                  caption: 'Mahakarya kain batik tulis pesisir Pekalongan langgam Jawa Hokokai dengan komposisi motif buketan bunga dan cecek halus rumit.'
                },
                callout: {
                  title: 'Mordan Mineral Air Tanah Pesisir',
                  text: 'Analisis kimiawi Balai Besar Kerajinan dan Batik menunjukkan bahwa kesadahan air tanah Pekalongan yang kaya kalsium dan magnesium menghasilkan ikatan ionik yang jauh lebih kuat antara pigmen tanaman alami (mengkudu dan nila) dengan serat selulosa katun, menghasilkan kilau warna cerah yang tidak ditemukan di daerah lain.'
                }
              },
              {
                id: 'ch-pekalongan-2',
                num: 'BAB 02',
                period: 'Abad XVIII – XIX Masehi',
                title: 'Ragam Hias Buketan Eropa, Batik Encim Liong Peranakan & Kaligrafi Jlamprang Arab',
                paragraphs: [
                  'Ketika komunitas peranakan Tionghoa mulai menetap beranak-pinak di Pekalongan pada abad ke-18, lahirlah salah satu mahakarya akulturasi seni rupa terindah di dunia: "Batik Encim" (sering disebut Batik Peranakan). Di tangan para nyonya Tionghoa, latar kain mori diwarnai merah mengkudu menyala (merah getih pitik) atau kuning kunyit cerah, dihiasi motif mitologis sakral burung phoenix (lokcan), naga langit (liong), kupu-kupu riang, serta bunga seruni (chrysanthemum) sebagai simbol doa kemakmuran, panjang umur, dan tolak bala.',
                  'Memasuki pertengahan abad ke-19, wanita-wanita perancang Indo-Eropa seperti Eliza van Zuylen, Carolina Josephina von Franquemont, dan Catharina Carolina van Oosterom mendirikan bengkel-bengkel batik komersial di Pekalongan. Mereka memperkenalkan estetika seni rupa Barat yang melahirkan langgam legendaris "Batik Buketan" (berasal dari kata bahasa Prancis bouquet: ikatan bunga). Bunga-bunga mawar mekar, lili air, tulip, anggrek, dan dedaunan anggun digoreskan bersama burung merak dan kupu-kupu dalam palet warna pastel lembut: merah muda rose, biru langit, dan hijau daun muda.',
                  'Sementara itu di kawasan perkampungan Arab Kauman dan Sugihwaras, para saudagar muslim mengembangkan ragam hias "Batik Jlamprang". Terinspirasi oleh kain tenun sutra ikat ganda patola dari Gujarat India yang dibawa para pedagang rempah, motif Jlamprang menyusun komposisi geometris mandala segi delapan (bintang delapan) dan bunga teratai abstrak yang suci tanpa menggambarkan makhluk bernyawa demi menjaga ketauhidan keyakinan.',
                  'Harmoni ketiga langgam raksasa ini—Eropa, Tionghoa, dan Timur Tengah—berbaur mesra di atas sehelai kain batik Pekalongan, menjadikannya ensiklopedia visual keragaman peradaban manusia yang tiada duanya di muka bumi.'
                ],
                figure: {
                  img: 'assets/batik-pekalongan-photo.jpg',
                  caption: 'Harmoni ragam hias buketan rangkaian bunga Eropa berpadu isen-isen cecek halus khas pembatik peranakan Pekalongan.'
                },
                callout: {
                  title: 'Legenda Bengkel Eliza van Zuylen (1863–1947)',
                  text: 'Kain batik buketan karya Eliza van Zuylen ditandai dengan tanda tangan bordir "M. van Zuylen" di sudut kain. Kehalusan garis kontur malam buatannya begitu presisi sehingga kain-kain aslinya kini tersimpan sebagai koleksi bernilai sangat tinggi di National Gallery of Australia dan Tropenmuseum Amsterdam.'
                }
              },
              {
                id: 'ch-pekalongan-3',
                num: 'BAB 03',
                period: 'Tahun 1925 – 1980 Masehi',
                title: 'Puncak Maestro Oey Soe Tjoen: Mahakarya Canting Halus Cecek Pitu & Pewarnaan Presisi',
                paragraphs: [
                  'Pada tahun 1925 di Kedungwuni, Pekalongan, pasangan suami-istri Oey Soe Tjoen dan Kwee Tjoen Jin merintis bengkel batik tulis peranakan yang kelak ditahbiskan para kurator seni tekstil dunia sebagai puncak tertinggi ketelitian tangan manusia dalam seni celup rintang lilin malam.',
                  'Oey Soe Tjoen menyempurnakan teknik yang dikenal sebagai "cecek pitu"—menorehkan titik-titik malam berdiameter sub-milimeter menggunakan jarum cucuk canting tertipis nomor nol. Ribuan titik mikro tersebut disusun bertingkat membentuk efek gradasi bayangan bulu burung phoenix, kelopak bunga seruni, dan kilau sisik naga yang tampak hidup seolah lukisan cat air tiga dimensi.',
                  'Proses pembuatan sehelai kain panjang Oey Soe Tjoen membutuhkan disiplin dan kesabaran luar biasa, memakan waktu antara delapan bulan hingga satu tahun penuh. Kain mori sutra halus harus melalui belasan kali proses pencantingan bolak-balik (nerusi), penembokan, pencelupan warna bertahap dingin, dan pelorodan lilin dalam air mendidih tanpa merusak serat kain.',
                  'Karya-karya bengkel Oey Soe Tjoen menjadi buruan prestisius para kolektor seni, kepala negara, dan museum tekstil internasional di Tokyo, New York, Den Haag, dan Singapura. Keberadaannya membuktikan bahwa batik bukan sekadar pakaian rakyat jelata, melainkan seni murni (fine art) berderajat adiluhung.'
                ],
                figure: {
                  img: 'assets/tokoh/oey-soe-tjoen.png',
                  caption: 'Potret arsip Maestro Oey Soe Tjoen, pelopor puncak kehalusan batik tulis peranakan teknik cecek pitu Kedungwuni sejak 1925.'
                },
                callout: {
                  title: 'Kekayaan 24 Kali Proses Celup Warna',
                  text: 'Setiap sehelai kain pesanan khusus maestro Oey Soe Tjoen dapat mengalami hingga 24 kali tahapan pencelupan warna berbeda. Bagian kain yang telah diwarnai harus ditutup kembali dengan lilin pelindung (nglorod dan nembok) sebelum dicelupkan ke rona warna berikutnya, menuntut ketelitian koordinasi mata dan tangan tanpa boleh ada kesalahan sebutir debu pun.'
                }
              },
              {
                id: 'ch-pekalongan-4',
                num: 'BAB 04',
                period: 'Tahun 2009 – Sekarang',
                title: 'Penobatan UNESCO Creative Cities Network 2014 & Denyut Hidup Pasar Setono 2026',
                paragraphs: [
                  'Pengakuan internasional atas warisan budaya Pekalongan mencapai puncaknya ketika UNESCO mengukuhkan Batik Indonesia ke dalam Representative List of the Intangible Cultural Heritage of Humanity pada 2 Oktober 2009. Menindaklanjuti momentum bersejarah tersebut, Pemerintah Kota Pekalongan bersama komunitas pembatik mendirikan Museum Batik Pekalongan di kawasan cagar budaya Jetayu, menempati bekas gedung kantor balai kota peninggalan kolonial Belanda tahun 1906.',
                  'Pada 1 Desember 2014, UNESCO secara resmi menobatkan Kota Pekalongan ke dalam UNESCO Creative Cities Network (UCCN) untuk kategori Crafts and Folk Art. Pekalongan menorehkan tinta emas sebagai kota pertama di Asia Tenggara yang bergabung dalam jaringan kota kreatif dunia bergengsi tersebut.',
                  'Memasuki era modern 2026, ekosistem batik Pekalongan berdenyut riuh sebagai urat nadi perekonomian daerah. Di Pasar Grosir Setono—sentra perdagangan tekstil batik terbesar di Jawa Tengah yang menampung ribuan kios—serta perkampungan pembatik Pesindon dan Kauman, lebih dari 65.000 jiwa menggantungkan hidupnya secara langsung pada roda industri kreatif ini.',
                  'Pekalongan membuktikan transformasi gemilang: menjaga teknik canting tulis manual tetap lestari di sanggar-sanggar perajin tua, sembari merangkul inovasi pewarnaan ramah lingkungan, digitalisasi rantai pasok global, dan edukasi cagar budaya bagi generasi penerus bangsa.'
                ]
              }
            ],
            timeline: [
              { year: '1450 M', title: 'Jalur Pelabuhan Demak', desc: 'Pelabuhan Pekalongan menjadi episentrum perjumpaan saudagar tekstil dunia.' },
              { year: '1850 M', title: 'Lahirnya Batik Buketan', desc: 'Eliza van Zuylen mengembangkan ragam hias rangkaian bunga Eropa di kain mori Pekalongan.' },
              { year: '1925 M', title: 'Bengkel Maestro Oey Soe Tjoen', desc: 'Perintisan bengkel batik tulis peranakan legendaris teknik cecek pitu di Kedungwuni.' },
              { year: '2006 M', title: 'Peresmian Museum Batik Pekalongan', desc: 'Presiden RI meresmikan museum tekstil nasional di gedung peninggalan balai kota kolonial Jetayu.' },
              { year: '2009 M', title: 'Warisan Kemanusiaan UNESCO', desc: 'Batik Indonesia dikukuhkan dalam Representative List of Intangible Cultural Heritage of Humanity.' },
              { year: '2014 M', title: 'Pekalongan Kota Kreatif UNESCO', desc: 'Resmi dinobatkan ke dalam UNESCO Creative Cities Network kategori Crafts & Folk Art.' },
              { year: '2026 M', title: 'Living Heritage & Pasar Setono', desc: 'Pemberdayaan ribuan UMKM pembatik pesisir dan digitalisasi pemasaran kriya internasional.' }
            ],
            figures: [
              {
                name: 'Oey Soe Tjoen',
                role: 'Maestro Batik Tulis Peranakan Pekalongan',
                avatar: 'assets/tokoh/oey-soe-tjoen.png',
                bio: 'Pencipta mahakarya batik tulis super halus teknik cecek pitu di Kedungwuni yang dikoleksi museum seni tekstil terkemuka dunia.'
              },
              {
                name: 'Eliza van Zuylen',
                role: 'Perintis Corak Batik Buketan Pesisir',
                avatar: 'assets/tokoh/klinkhamer.png',
                bio: 'Perancang Indo-Belanda paruh akhir abad ke-19 yang mempopulerkan ragam hias rangkaian bunga buketan cerah di Pekalongan.'
              }
            ],
            quote: {
              text: 'Sehelai kain batik pesisir Pekalongan adalah saksi bagaimana perbedaan ras, bangsa, dan bahasa dapat dilarutkan dalam wajan malam yang sama, lalu digoreskan menjadi simfoni warna yang memukau dunia.',
              cite: 'Wasiat Budaya Yayasan Batik Pekalongan'
            },
            epilogue: 'Mencium aroma malam yang mengepul di lorong-lorong Pekalongan adalah meresapi keteguhan rakyat pesisir. Di setiap goresan canting ibu-ibu pembatik, warisan dunia itu terus hidup dan memberi harapan bagi masa depan bangsa.'
          }
        },
        {
          num: '02',
          thumb: 'assets/keraton-surakarta-photo.jpg',
          title: 'Keraton Surakarta Hadiningrat',
          desc: 'Pusat kebudayaan Mataram Islam (1745) perawat pakem batik larangan sogan dan tari sakral Bedhaya.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · KERATON SURAKARTA',
            title: 'Baluwarti Kasunanan: Episentrum Pakem Batik Sogan Adiluhung dan Pelestarian Living Heritage Mataram 1745',
            subtitle: 'Kajian ensiklopedis perpindahan istana ke desa Sala tahun 1745 pasca Geger Pacinan, pembakuan batik larangan sogan Parang Rusak Barong dan Truntum Kanjeng Ratu Beruk, tarian sakral sembilan bidadari Bedhaya Ketawang, Menara Sanggabuwana, hingga kirab pusaka malam 1 Suro.',
            readTime: '11 Menit Waktu Baca',
            curator: 'Sasana Pustaka Keraton Surakarta Hadiningrat & Yayasan Kebudayaan Mataram',
            heroImg: 'assets/keraton-surakarta-photo.jpg',
            heroCaption: 'Kori Brojonolo dan pelataran pasir pantai Parangkusumo Sasana Sewaka di kompleks Keraton Surakarta Hadiningrat (berdiri 1745).',
            lead: 'Didirikan pada tanggal 17 Februari 1745 oleh Sri Susuhunan Pakubuwana II pasca peristiwa pemberontakan Geger Pacinan yang memporakporandakan istana Kartasura, Keraton Kasunanan Surakarta Hadiningrat adalah rahim dan episentrum puncak kebudayaan Jawa modern (Vorstenlanden). Di kawasan benteng Baluwarti seluas 54 hektar di tepi Bengawan Solo ini, tata busana batik sogan klasik adiluhung, tarian sakral Bedhaya Ketawang, dan pusaka naskah Sasana Pustaka tetap dirawat sebagai warisan hidup (living royal heritage) hingga hari ini.',
            quickFacts: [
              { label: 'Tahun Pendirian', val: '17 Februari 1745 Masehi (Rabu Pahing, 14 Muharram 1670 Jawa)' },
              { label: 'Pendiri Utama', val: 'Sri Susuhunan Pakubuwana II (Perpindahan Istana Kartasura ke Desa Sala)' },
              { label: 'Luas Kompleks Keraton', val: '54 Hektar (Kawasan Baluwarti, Alun-Alun Lor & Kidul)' },
              { label: 'Pakem Busana Sakral', val: 'Batik Sogan Klasik & Batik Awisan Dalem (Motif Larangan)' },
              { label: 'Tarian Sakral Tertinggi', val: 'Bedhaya Ketawang (Ditarikan 9 Perawan Suci Saat Tingalan Jumenengan)' },
              { label: 'Menara Astronomi Suci', val: 'Menara Sanggabuwana (Tinggi 30 Meter, Dibangun 1782 M)' },
              { label: 'Pusaka & Kereta Kencana', val: 'Kereta Kyai Garuda Kencana & Gamelan Kyai Guntursari' },
              { label: 'Tradisi Hidup Tahunan', val: 'Kirab Pusaka Malam 1 Suro Kerbau Bule Kyai Slamet & Grebeg Sekaten' }
            ],
            destLink: {
              label: 'Buka Keraton Surakarta di Buku Sketsa Destinasi',
              href: 'destinasi.html#keratonsolo'
            },
            chapters: [
              {
                id: 'ch-keraton-1',
                num: 'BAB 01',
                period: 'Tahun 1745 – 1755 Masehi',
                title: 'Boyongan Agung 1745: Runtuhnya Istana Kartasura & Wangsit Kosmis Desa Sala',
                paragraphs: [
                  'Kelahiran Keraton Kasunanan Surakarta Hadiningrat berawal dari malapetaka politik terbesar dalam sejarah Mataram Islam abad ke-18: peristiwa pemberontakan Geger Pacinan tahun 1740–1742. Istana kerajaan di Kartasura diserbu dan diduduki pasukan pemberontak gabungan Jawa-Tionghoa yang menentang kongsi VOC Belanda, merusak kesucian takhta keprabon hingga sang raja, Sri Susuhunan Pakubuwana II, terpaksa mengungsi ke Ponorogo.',
                  'Meskipun istana Kartasura berhasil direbut kembali dengan bantuan pasukan Cakraningrat IV dari Madura, menurut kepercayaan kosmologi Jawa (kejawen), keraton yang telah ternoda oleh tumpahnya darah pemberontakan dianggap telah kehilangan wahyu keprabon (cahaya kedaulatan ilahi) dan harus ditinggalkan.',
                  'Sri Susuhunan Pakubuwana II memerintahkan para empu spiritual, pujangga keraton, dan ahli nujum mencari lokasi baru. Melalui laku tapa brata dan tirakat mendalam, didapatkan wangsit bahwa tanah rawa di tepian barat Bengawan Solo—sebuah desa yang dinamai Desa Sala di bawah pimpinan tetua desa Ki Gedhe Sala—merupakan poros bumi yang menyimpan energi kesuburan abadi.',
                  'Pada hari Rabu Pahing, tanggal 17 Februari 1745 (bertepatan dengan 14 Muharram tahun Jawa 1670 Alip), prosesi akbar boyongan perpindahan kerajaan digelar dengan kemegahan luar biasa. Berjalan kaki sejauh 12 kilometer dari Kartasura menuju Desa Sala, rombongan kerajaan mengarak seluruh pusaka keprabon, gamelan kyai keramat, naskah suci, serta sepasang pohon beringin kurung kembar (Waringin Kurung Kyai Dewadaru dan Kyai Janadaru) yang langsung ditanam di tengah Alun-Alun Utara Surakarta.'
                ],
                figure: {
                  img: 'assets/keraton-surakarta-photo.jpg',
                  caption: 'Kori Brojonolo dan pelataran pasir pantai Parangkusumo Sasana Sewaka di kompleks Keraton Surakarta Hadiningrat (berdiri 1745).'
                },
                callout: {
                  title: 'Taburan Pasir Laut Selatan & Abu Puncak Merapi',
                  text: 'Pelataran Sasana Sewaka Keraton Surakarta sengaja tidak dipasangi lantai ubin melainkan ditaburi hamparan pasir halus hitam yang diambil langsung dari Pantai Parangkusumo (segara kidul) dan abu vulkanik Gunung Merapi. Hamparan pasir ini menyimbolkan poros imajiner kosmis segitiga antara Raja Mataram, Ratu Kidul penguasa laut selatan, dan penunggu puncak gunung api utara.'
                }
              },
              {
                id: 'ch-keraton-2',
                num: 'BAB 02',
                period: 'Tahun 1755 – 1790 Masehi',
                title: 'Pembakuan Filosofi Batik Awisan Dalem: Parang Rusak Barong, Semen Rante & Truntum',
                paragraphs: [
                  'Pasca Perjanjian Giyanti 1755 yang membagi wilayah Mataram menjadi Kasunanan Surakarta dan Kasultanan Yogyakarta, Keraton Surakarta di bawah Sri Susuhunan Pakubuwana III memusatkan energinya pada penyempurnaan kehalusan budi pekerti, sastra tembang, dan pembakuan tata busana adat keprabon (Vorstenlanden).',
                  'Di dalam keputren benteng Baluwarti, teknik pewarnaan batik sogan klasik disempurnakan menggunakan rebusan kulit kayu pohon soga Jawa (Peltophorum pterocarpum), kayu jambal, kayu tegeran, dan daun nila tarum. Kombinasi ramuan herbal alami ini melahirkan rona cokelat keemasan hangat (sogan kencana) yang anggun dan berwibawa, kontras dengan latar mori putih gading.',
                  'Keraton memberlakukan undang-undang adat ketat "Batik Awisan Dalem" (motif larangan) yang hanya boleh dikenakan oleh Susuhunan, Ratu, dan Putra Mahkota pada upacara-upacara kenegaraan suci:\n• Parang Rusak Barong: Motif jajaran diagonal bilah pedang dan ombak karang berukuran besar di atas 8 sentimeter, melambangkan ksatria agung yang memiliki keteguhan moral tanpa gentar dan mampu menaklukkan gelombang hawa nafsu liarnya sendiri.\n• Semen Rante: Motif sulur tetumbuhan bertunas diapit mata rantai keemasan, menyimbolkan ikatan cinta kasih suci yang terjalin abadi dan kokoh menghadapi cobaan zaman.\n• Udan Riris: Motif garis rintik-rintik hujan berkah kesuburan yang mendatangkan kemakmuran bagi seluruh rakyat bumi.',
                  'Puncak keharuan seni batik keraton lahir dari tangan permaisuri Kanjeng Ratu Beruk (G.K.R. Kencana, permaisuri Pakubuwana III). Ketika dilanda kesedihan mendalam dan merasa terabaikan oleh sang raja, sang Ratu duduk bersujud di pelataran keputren menatap langit malam bertabur ribuan bintang gemerlap. Seraya memanjatkan doa hening, beliau menorehkan canting membentuk motif bunga melati kecil serupa bintang malam. Melihat ketulusan karya tersebut, cinta kasih raja bersemi kembali—melahirkan nama motif abadi "Truntum" (dari kata Jawa tumaruntum: tumbuh dan bersemi kembali). Hingga kini, batik Truntum wajib dikenakan oleh orang tua kedua mempelai pengantin dalam upacara pernikahan adat Jawa.'
                ],
                figure: {
                  img: 'assets/articles/batik-parang-rusak-barong.jpg',
                  caption: 'Kain batik pola Parang Rusak Barong klasik Kasunanan Surakarta arsip sebelum 1891 (Koleksi Museum Nasional Kebudayaan Dunia).'
                },
                callout: {
                  title: 'Makna Wasiat Motif Awisan Dalem',
                  text: 'Larangan mengenakan motif Parang Rusak Barong bagi masyarakat umum di masa silam bukan bentuk keangkuhan feodal, melainkan pengingat moral bahwa orang yang mengenakan lambang kesempurnaan batin barong haruslah sosok pemimpin yang telah selesai dengan kepentingan pribadinya sendiri.'
                }
              },
              {
                id: 'ch-keraton-3',
                num: 'BAB 03',
                period: 'Tahun 1782 – 1880 Masehi',
                title: 'Arsitektur Sasana Sewaka, Menara Sanggabuwana 1782 & Tarian Sakral Bedhaya Ketawang',
                paragraphs: [
                  'Kompleks Keraton Surakarta dibangun membentang seluas 54 hektar yang dikelilingi benteng pertahanan bata kokoh Baluwarti dengan ketebalan mencapai dua meter. Jantung dari istana ini adalah Pendopo Ageng Sasana Sewaka—sebuah mahakarya arsitektur kayu jati bertiang joglo megah tanpa paku, dihiasi lampu-lampu gantung kristal Bohemia Eropa hadiah para penguasa benua Barat.',
                  'Pada tahun 1782, Sri Susuhunan Pakubuwana III mendirikan Menara Sanggabuwana (Panggung Sanggabuwana) setinggi 30 meter dengan konstruksi segi delapan empat tingkat bertutupkan atap tudung kerucut menyerupai topi bangsawan Belanda. Di puncak atap dipasang tiang penunjuk arah angin berbahan tembaga dengan pahatan sengkalan sosok ksatria menunggangi naga raksasa yang menyiratkan tarikh pembangunannya (Naga Muluk Tumpeng Konca / 1708 Saka).',
                  'Menara Sanggabuwana mengemban tiga dimensi fungsi strategis sekaligus: pertama, pos pengamatan astronomi (rukyatul hilal) untuk menentukan jatuhnya bulan suci Ramadhan dan penanggalan kalender Jawa Sultan Agungan; kedua, pos mata-mata militer untuk memantau pergerakan garnisun Belanda di Benteng Vastenburg yang berjarak hanya 1 kilometer ke arah utara; dan ketiga, bilik meditasi privat tempat sang Susuhunan bermunajat kepada Tuhan Yang Maha Esa dan menjalin ikatan mistis dengan Kanjeng Ratu Kidul.',
                  'Di bawah naungan Sasana Sewaka pula dirawat tarian sakral puncak peradaban istana Jawa: Bedhaya Ketawang. Ditarikan selama dua jam penuh tanpa henti oleh sembilan putri perawan yang harus menjalani puasa mutih dan ritual bersuci, tarian ini hanya dipergelarkan setahun sekali bertepatan dengan upacara Tingalan Dalem Jumenengan (hari ulang tahun naik takhta raja). Sembilan penari berbusana dodot bangun tulak bergerak dalam pola labirin geometri kosmis mengikuti irama gamelan laras pelog Kyai Guntursari yang wingit dan menghipnotis.'
                ],
                figure: {
                  img: 'assets/tokoh/pakubuwana-x.png',
                  caption: 'Sri Susuhunan Pakubuwana X dalam balutan busana ageng batik klasik keprabon keraton.'
                },
                callout: {
                  title: 'Misteri Penari Kesepuluh Bedhaya Ketawang',
                  text: 'Menurut kesaksian para abdi dalem penari keraton, saat tarian Bedhaya Ketawang berlangsung di Sasana Sewaka, sering kali tercium aroma harum bunga kantil dan melati semerbak yang menandai kehadiran gaib Kanjeng Ratu Kidul yang menari bersama sebagai penari kesepuluh membimbing langkah para putri perawan.'
                }
              },
              {
                id: 'ch-keraton-4',
                num: 'BAB 04',
                period: 'Tahun 1893 – Sekarang',
                title: 'Era Keemasan Pakubuwana X, Maklumat Kemerdekaan 1945 & Kirab 1 Suro 2026',
                paragraphs: [
                  'Di bawah kepemimpinan Sri Susuhunan Pakubuwana X (bertahta 1893–1939), Kasunanan Surakarta menikmati periode keemasan stabilitas ekonomi dan kemajuan budaya yang belum pernah ada tandingannya. Sang Susuhunan memugar bangunan keraton dengan perpaduan selera arsitektur Jawa klasik dan Neoklasik Eropa, mendirikan Pasar Gede Harjonagoro, Rumah Sakit Panti Kosala, stadion sepak bola pertama Sriwedari, serta memayungi saudagar-saudagar batik pribumi.',
                  'Keraton Surakarta memiliki khazanah pusaka tak ternilai yang kini tersimpan di Museum Sasana Pustaka: Kereta Kencana Kyai Garuda Kencana berlapis lempengan emas murni hadiah Ratu Wilhelmina Belanda, meriam kuno Kyai Sapujagad peninggalan Mataram, pedang pusaka bertatahkan intan permata, dan ribuan naskah lontar manuskrip kuno karya para pujangga agung seperti Raden Ngabehi Ranggawarsita dan Yasadipura I.',
                  'Ketika fajar Proklamasi Kemerdekaan Republik Indonesia berkumandang pada 17 Agustus 1945, Sri Susuhunan Pakubuwana XII dan K.G.P.A.A. Mangkunegara VIII langsung mengeluarkan Maklumat Bersejarah 1 September 1945 yang menyatakan bahwa Negeri Surakarta Hadiningrat berdiri teguh, setia, dan menjadi bagian mutlak dari Negara Kesatuan Republik Indonesia.',
                  'Hingga tahun 2026, denyut sakral Keraton Surakarta tetap bernapas abadi di tengah deru modernisasi kota. Upacara Kirab Pusaka Malam 1 Suro—di mana sekelompok kerbau bule keramat keturunan Kyai Slamet memimpin arak-arakan pusaka keraton diikuti ribuan warga dan abdi dalem yang berjalan bertelanjang kaki dalam keheningan mutlak (laku tapa bisu)—menjadi magnet spiritual dan cagar budaya yang mengingatkan bangsa Indonesia akan keluhuran asal-usul budi pekertinya.'
                ]
              }
            ],
            timeline: [
              { year: '1745 M', title: 'Boyongan ke Desa Sala', desc: 'Pakubuwana II memindahkan ibu kota Mataram dari Kartasura ke tepian Bengawan Solo.' },
              { year: '1755 M', title: 'Perjanjian Giyanti', desc: 'Pembagian wilayah Mataram menjadi Kasunanan Surakarta dan Kasultanan Yogyakarta.' },
              { year: '1782 M', title: 'Pembangunan Menara Sanggabuwana', desc: 'Pendirian menara astronomi dan meditasi setinggi 30 meter oleh Sri Susuhunan PB III.' },
              { year: '1893 M', title: 'Masa Keemasan Pakubuwana X', desc: 'Puncak kejayaan kebudayaan, seni busana batik keraton, dan diplomasi kebangsaan modern.' },
              { year: '1945 M', title: 'Maklumat Kerajaan RI', desc: 'Pakubuwana XII dan Mangkunegara VIII menyatakan Surakarta berdiri kokoh di belakang NKRI.' },
              { year: '2026 M', title: 'Living Royal Heritage', desc: 'Preservasi abadi upacara 1 Suro, tarian Bedhaya Ketawang, dan restorasi Sasana Pustaka.' }
            ],
            figures: [
              {
                name: 'Sri Susuhunan Pakubuwana II',
                role: 'Pendiri Keraton Surakarta Hadiningrat 1745',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Maharaja Mataram yang memilih desa Sala sebagai pusat peradaban baru pasca runtuhnya istana Kartasura.'
              },
              {
                name: 'Sri Susuhunan Pakubuwana X',
                role: 'Raja Era Keemasan Surakarta',
                avatar: 'assets/tokoh/pakubuwana-x.png',
                bio: 'Memimpin era puncak kejayaan seni budaya Jawa, mendirikan Menara Sanggabuwana, dan memayungi saudagar batik Solo.'
              },
              {
                name: 'Kanjeng Ratu Beruk',
                role: 'Permaisuri Pencipta Motif Truntum',
                avatar: 'assets/tokoh/gunadharma.png',
                bio: 'Permaisuri Pakubuwana III yang menciptakan motif batik bintang melati Truntum sebagai simbol cinta kasih yang bersemi kembali.'
              }
            ],
            quote: {
              text: 'Batik keraton bukanlah sekadar pakaian penutup raga; ia adalah doa hening yang dirajut di atas kain mori agar pemakainya senantiasa ingat akan sangkan paraning dumadi—asal dan tujuan hidup sejati.',
              cite: 'Serat Sasana Pustaka Kasunanan Surakarta Hadiningrat'
            },
            epilogue: 'Di tengah gemuruh modernitas zaman, benteng Baluwarti Keraton Surakarta tetap tegak berdiri dalam keheningan yang agung. Mengunjungi keraton ini adalah menziarahi kehalusan rasa budi pekerti yang menjadi akar jati diri bangsa Indonesia.'
          }
        },
        {
          num: '03',
          thumb: 'assets/studio-canting-bg.jpg',
          title: 'Studio Canting Interaktif',
          desc: 'Ruang kreatif digital memadukan goresan canting lilin malam panas dengan kanvas simulasi virtual.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · STUDIO CANTING INTERAKTIF',
            title: 'Menyentuh Jiwa Sehelai Mori: Revolusi Simulasi Canting Malam Tradisi dan Busana Adat di Era Kecerdasan Digital 2026',
            subtitle: 'Kajian inovasi kuratorial pelestarian seni kriya abad ke-21, permodelan fisika fluida lelehan lilin malam panas, pemaknaan filosofi ragam hias sakral, kanvas goresan presisi sentuhan, dan photo booth virtual busana adat Jawa Tengah.',
            readTime: '9 Menit Waktu Baca',
            curator: 'Tim Riset Kebudayaan Digital Lelana Jateng & Sanggar Canting Tradisional',
            heroImg: 'assets/studio-canting-bg.jpg',
            heroCaption: 'Ruang simulasi digital Studio Canting interaktif: Menghadirkan kehangatan wajan malam bagi generasi muda di era digital.',
            lead: 'Bagaimana sebuah bangsa menjaga agar warisan adiluhung berusia ratusan tahun tetap dicintai dan dipahami maknanya oleh generasi yang lahir di era layar sentuh dan kecerdasan buatan? Studio Canting Interaktif lahir pada tahun 2026 sebagai jembatan inovasi kebudayaan: sebuah laboratorium digital hidup tempat kehangatan wajan malam, aliran pipa cucuk canting tembaga, dan kedalaman filosofi motif sakral Nusantara dihadirkan secara memikat di ujung jemari generasi penerus bangsa.',
            quickFacts: [
              { label: 'Tahun Peluncuran', val: '2026 Masehi (Platform Resmi Lelana Jateng)' },
              { label: 'Konsep Kuratorial', val: 'Digital Living Studio & Simulasi Fisika Kriya Tradisi' },
              { label: 'Alat yang Dimodelkan', val: 'Canting Cecek, Canting Klowong, Canting Tembokan, Wajan Anglo' },
              { label: 'Karakter Fluida Lilin', val: 'Simulasi Viskositas Lelehan Lilin Malam Alami Meresap Serat Mori' },
              { label: 'Fitur Unggulan', val: 'Kanvas Canting Interaktif, Makna Filosofi Motif, Photo Booth Adat' },
              { label: 'Koleksi Busana Adat', val: 'Beskap Surakarta, Surjan Klasik, Kebaya Encim Pesisir, Jarik Sogan' },
              { label: 'Format Keluaran', val: 'Kartu Pos Digital Kuratorial Beresolusi Tinggi & Cetak Karya' },
              { label: 'Tujuan Pelestarian', val: 'Mendekatkan Generasi Muda Menuju Sanggar Canting Sesungguhnya' }
            ],
            destLink: {
              label: 'Buka Studio Canting Interaktif Sekarang',
              href: 'studio-canting.html'
            },
            chapters: [
              {
                id: 'ch-canting-1',
                num: 'BAB 01',
                period: 'Abad XII Masehi – Tradisi Klasik',
                title: 'Anatomi Canting Tembaga Tradisional: Nyamplungan, Gagang Kayu & Kehangatan Anglo',
                paragraphs: [
                  'Sebelum mengenal teknologi modern, peradaban Nusantara telah melahirkan salah satu instrumen kriya tangan paling presisi dan elegan di dunia: canting tulis tembaga. Kata "canting" berakar dari bahasa Jawa yang merujuk pada alat gayung kecil pengambil cairan. Pada abad ke-12 era Kerajaan Kediri dan Majapahit, alat ini telah berevolusi menjadi instrumen khusus penoreh lilin malam panas pada lembaran kain tenun.',
                  'Anatomi sebuah canting klasik terdiri atas tiga komponen utama yang dirancang dengan pertimbangan fisika termal sempurna:\n1. Nyamplungan: Mangkuk kecil berbahan tembaga murni berbentuk menyerupai tempurung kelapa atau buah nyamplung. Tembaga dipilih secara sadar oleh para empu kuno karena memiliki konduktivitas termal yang sangat tinggi, mampu menjaga lilin malam tetap cair dalam suhu optimal antara 60 hingga 75 derajat Celcius saat diangkat dari wajan.\n2. Cucuk (Caruk): Pipa saluran kecil melengkung di bagian dasar nyamplungan yang mengalirkan lelehan lilin cair ke permukaan kain. Diameter lubang cucuk dibuat dengan presisi sub-milimeter, mulai dari ukuran super halus (0,5 mm) hingga ukuran tebal (3 mm).\n3. Gagang (Pegang): Terbuat dari batang bambu kecil atau kayu ringan yang berfungsi sebagai isolator panas alami, melindungi jari-jemari pembatik dari sengatan suhu tembaga yang panas.',
                  'Dalam proses membatik manual, pembatik duduk di atas dingklik pendek di depan wajan waja kecil yang dipanaskan di atas anglo bara arang. Pembatik harus memiliki kepekaan indrawi yang luar biasa: meniup ujung cucuk canting untuk membersihkan sumbatan kerak malam, menguji tetesan pertama pada sehelai perca mori, lalu menggoreskan motif dengan kemiringan sudut 45 derajat tanpa gemetar sedikit pun.',
                  'Seni ini menuntut keselarasan mutlak antara tarikan napas, detak jantung, dan ketenangan batin. Setiap tetesan lilin malam yang membeku di serat mori adalah rekaman meditasi hening sang pembuatnya.'
                ],
                figure: {
                  img: 'assets/articles/canting-batik-tulis.jpg',
                  caption: 'Anatomi instrumen canting tulis tembaga tradisional: nyamplungan kuningan peredam panas dan gagang kayu alami.'
                },
                callout: {
                  title: 'Sains Fisika Lilin Malam (Batik Wax)',
                  text: 'Lilin malam tradisional merupakan formulasi kimiawi alami kompleks yang terdiri atas gondorukem (getah pohon pinus) sebagai perekat, getah damar untuk kelenturan, minyak kelapa atau lemak nabati/hewani untuk kelembutan lelehan, serta lilin lebah (beeswax) yang memungkinkan malam menembus pori-pori kain tanpa merapuh atau retak saat dicelup air dingin.'
                }
              },
              {
                id: 'ch-canting-2',
                num: 'BAB 02',
                period: 'Tahun 2020 – 2024',
                title: 'Tantangan Regenerasi Generasi Muda & Riset Pemodelan Komputasi Fluida Malam',
                paragraphs: [
                  'Memasuki dekade ketiga abad ke-21, seni membatik tradisional menghadapi krisis eksistensial yang sunyi: krisis regenerasi pembatik tulis. Di sentra-sentra kerajinan seperti Laweyan, Pekalongan, Lasem, dan Giriloyo, rata-rata usia pembatik canting tulis telah melampaui 55 tahun. Generasi muda perkotaan yang tumbuh di era gawai pintar, media sosial, dan kecerdasan buatan kerap mempersepsikan membatik sebagai kerajinan kuno yang lambat, panas, melelahkan, dan tidak relevan dengan masa depan mereka.',
                  'Menyadari jurang peradaban yang kian melebar ini, Tim Riset Kebudayaan Digital Lelana Jateng menginisiasi sebuah proyek inovasi kuratorial terobosan pada tahun 2024: mengembangkan sebuah platform simulasi digital interaktif yang mampu mereplikasi sensasi fisik dan kedalaman filosofis mencanting tradisional secara presisi di layar peramban web.',
                  'Tantangan rekayasa teknologi terbesar adalah memodelkan fisika dinamika fluida viskositas lelehan lilin malam panas (non-Newtonian fluid mechanics). Cairan lilin malam memiliki perilaku yang sangat unik: ia mengalir lancar saat bersuhu panas di dalam wadah tembaga, namun viskositasnya meningkat secara drastis saat bersentuhan dengan udara bebas, dan membeku seketika dalam kurun milidetik saat diserap kapilaritas serat benang mori.',
                  'Melalui riset komputasi matematika berbasis algoritma Navier-Stokes yang disederhanakan, tim pengembang berhasil merumuskan model responsif kanvas HTML5: kecepatan gerakan kursor atau usapan jari pada layar sentuh secara dinamis memengaruhi ketebalan garis lilin—gerakan perlahan menghasilkan resapan tebal yang kokoh, sedangkan goresan cepat melayang menghasilkan garis kontur tipis yang anggun.'
                ],
                figure: {
                  img: 'assets/studio-canting-bg.jpg',
                  caption: 'Antarmuka kanvas interaktif Studio Canting: Menjembatani kriya adiluhung menuju dunia layar sentuh generasi muda.'
                },
                callout: {
                  title: 'Sensitivitas Algoritma Sentuhan Sentripetal',
                  text: 'Sistem komputasi Studio Canting mengkalkulasi vektor kecepatan dan tekanan sentuhan secara real-time pada 60 frame per detik, menyimulasikan laju pendinginan gradien termal lilin malam sehingga pengguna merasakan resistensi realistis serupa mencanting di atas kain mori basah.'
                }
              },
              {
                id: 'ch-canting-3',
                num: 'BAB 03',
                period: 'Tahun 2024 – 2026',
                title: 'Tiga Ragam Canting Klasik (Cecek, Klowong, Tembokan) & Kanvas Resapan Mori',
                paragraphs: [
                  'Di dalam Studio Canting Interaktif, pengguna diperkenalkan secara langsung pada hierarki instrumen membatik tradisional yang sesungguhnya. Platform ini menyediakan tiga varian canting fungsional yang dapat diganti sewaktu-waktu sesuai tahapan karya seni:\n1. Canting Cecek: Memiliki cucuk mikro tunggal berdiameter 0,5 milimeter. Digunakan khusus untuk menorehkan titik-titik ornamen halus (cecek-cecek), isen-isen daun, dan detail bayangan mikro pada kelopak bunga layaknya mahakarya maestro pesisiran.\n2. Canting Klowong: Memiliki pipa cucuk sedang berdiameter 1,5 milimeter. Merupakan instrumen utama pembatik untuk menggambar garis kontur (nglowongi) batas-batas motif utama seperti lekukan lereng Parang Rusak atau lengkungan sulur Semen Rante.\n3. Canting Tembokan: Memiliki cucuk berdiameter lebar 2,5 milimeter dengan kapasitas nyamplungan lebih besar. Berfungsi untuk menutupi (nembok) bidang-bidang luas kain yang hendak dilindungi sepenuhnya dari penyerapan zat warna celup.',
                  'Kanvas kerja virtual didesain dengan tekstur visual kain mori primissima asli, lengkap dengan serat-serat tenun katun yang terlihat jelas saat diperbesar. Saat pengguna menorehkan cairan lilin malam virtual, sistem menampilkan efek visual lelehan lilin berwarna cokelat tua kekuningan yang meresap tembus ke sisi belakang kain (nerusi), menyerupai standar kualitas tertinggi batik tulis dua sisi.',
                  'Selain kanvas bebas, studio menyediakan templat sketsa geometris klasik (pola blitikan) yang dapat dijadikan panduan belajar bagi pemula, membantu generasi muda memahami proporsi simetri sakral yang selama ini menjadi rahasia keindahan batik keraton Jawa.'
                ]
              },
              {
                id: 'ch-canting-4',
                num: 'BAB 04',
                period: 'Tahun 2026 – Menatap Masa Depan',
                title: 'Photo Booth Busana Adat Virtual, Kartu Pos Digital Kuratorial & Misi Regenerasi',
                paragraphs: [
                  'Studio Canting Interaktif melangkah lebih jauh dari sekadar program gambar digital biasa; ia dirancang sebagai ruang edukasi komprehensif kebangsaan. Setiap kali pengguna memilih motif tertentu, modul kuratorial menampilkan jendela narasi sejarah, makna filosofis perlambang hidup, serta konteks sosial kapan busana tersebut pantas dikenakan menurut tradisi adiluhung Jawa.',
                  'Puncak keasyikan eksplorasi dihadirkan melalui fitur "Photo Booth Busana Adat Jawa Virtual 360°". Pengguna dapat mencoba berbagai setelan busana tradisional Jawa Tengah secara interaktif—mulai dari busana kebesaran keprabon Keraton Surakarta (Beskap Sikepan kancing emas dan Kebaya Beludru bordir keemasan) hingga busana adat Surjan lurik Kasultanan dan busana pesisiran Kebaya Encim berenda halus—lalu memadukannya dengan kain jarik bermotif hasil coretan canting digital kreasi mereka sendiri.',
                  'Setelah rancangan selesai, pengguna dapat menerbitkan karyanya menjadi Kartu Pos Digital Kuratorial beresolusi tinggi (resolusi 300 DPI siap cetak). Kartu pos ini dilengkapi stempel kurasi resmi Lelana Jateng 2026, ringkasan filosofi karya, nama pembuat, serta tautan kode QR interaktif yang dapat dibagikan ke jejaring media sosial atau disimpan dalam arsip pribadi.',
                  'Studio Canting membuktikan sebuah tesis kebudayaan penting: teknologi digital bukanlah musuh kelestarian tradisi, melainkan gerbang pembuka rasa ingin tahu. Dari keasyikan mencoretkan canting di atas layar sentuh, generasi muda terinspirasi melangkahkan kakinya mengunjungi sanggar-sanggar batik nyata di Laweyan, Kauman, dan Pekalongan, mencium aroma harum wajan malam, dan melanjutkan estafet warisan kemanusiaan dunia ini.'
                ]
              }
            ],
            timeline: [
              { year: '2009 M', title: 'UNESCO Warisan Dunia', desc: 'Batik Indonesia ditetapkan sebagai Masterpiece of Intangible Cultural Heritage of Humanity.' },
              { year: '2014 M', title: 'Pekalongan Kota Kreatif', desc: 'Pengakuan internasional terhadap sentra kriya batik rakyat di pesisir Jawa Tengah.' },
              { year: '2024 M', title: 'Riset Pemodelan Fisika Canting', desc: 'Pengembangan algoritma fluida lilin malam dan digitalisasi pola geometris batik klasik.' },
              { year: '2026 M', title: 'Peluncuran Resmi Studio Canting', desc: 'Rilis platform simulasi canting malam dan photo booth busana adat interaktif Lelana Jateng.' }
            ],
            figures: [
              {
                name: 'Pengrajin Canting Tembaga Tradisional',
                role: 'Narasumber Utama Fisika Canting',
                avatar: 'assets/tokoh/oey-soe-tjoen.png',
                bio: 'Para empu pembuat canting tembaga yang membagikan rahasia kemiringan sudut cucuk dan konduktivitas panas lilin malam.'
              },
              {
                name: 'Tim Riset Kebudayaan Digital Jateng',
                role: 'Arsitek Platform Interaktif 2026',
                avatar: 'assets/tokoh/gunadharma.png',
                bio: 'Mengembangkan integrasi kanvas digital responsif, komputasi visual mori, dan edukasi filosofi motif Nusantara.'
              }
            ],
            quote: {
              text: 'Teknologi tidak diciptakan untuk menggantikan canting tembaga tradisional para ibu di sanggar; teknologi hadir sebagai suluh lentera agar generasi baru jatuh cinta dan rindu menyentuh wajan malam sesungguhnya.',
              cite: 'Prinsip Kurasi Studio Canting Interaktif Lelana Jateng'
            },
            epilogue: 'Mencanting di atas layar sentuh adalah langkah awal menyapa jiwa seni bangsa kita. Dari ketukan layar digital ini, kita melangkah dengan bangga melestarikan mahakarya adiluhung Nusantara.'
          }
        },
        {
          num: '04',
          thumb: 'assets/museum-batik-danarhadi.jpg',
          title: 'Kampung Batik Laweyan & Kauman',
          desc: 'Sentra saudagar batik tertua sejak abad XV tempat lahirnya Sarekat Dagang Islam dan revolusi canting cap.',
          article: {
            kicker: 'JURNAL HISTORIOGRAFI PUSAKA · LAWEYAN & KAUMAN',
            title: 'Lorong Saudagar Wong Beteng: Benteng Ekonomi Pribumi, Revolusi Canting Cap 1850, dan Lahirnya Sarekat Dagang Islam 1911',
            subtitle: 'Monograf sejarah kampung saudagar batik tertua sejak zaman Kerajaan Pajang abad ke-16, perintisan benang lawe Kyai Ageng Henis, ledakan ekonomi canting cap tembaga abad ke-19, arsitektur benteng Indische lorong sempit bertembok tiga meter, heroisme H. Samanhudi mendirikan SDI 1911, hingga konservasi Kampung Wisata Budaya Mandiri.',
            readTime: '11 Menit Waktu Baca',
            curator: 'Forum Pengembangan Kampung Batik Laweyan & Paguyuban Pusaka Kauman Solo',
            heroImg: 'assets/museum-batik-danarhadi.jpg',
            heroCaption: 'Lorong bersejarah bertembok benteng tinggi dan rumah megah Indische milik saudagar batik Laweyan di Surakarta.',
            lead: 'Menyusuri gang-gang sempit beraspal yang diapit tembok benteng tebal setinggi tiga hingga empat meter di Kampung Laweyan dan Kauman Surakarta, kita melangkah masuk ke gelanggang kemandirian martabat bangsa. Sejak masa Kerajaan Pajang pada abad ke-16, Laweyan adalah sentra perdagangan benang lawe dan kain batik tertua di tanah Jawa. Di kampung inilah lahir kelas saudagar pribumi makmur yang berani melawan monopoli kolonial dan membidani lahirnya organisasi pergerakan nasional modern pertama di Indonesia.',
            quickFacts: [
              { label: 'Perintisan Awal', val: 'Abad XVI Masehi (±1546 M pada Masa Kerajaan Pajang)' },
              { label: 'Tokoh Perintis Pertama', val: 'Kyai Ageng Henis (Kakek Penembahan Senopati Mataram)' },
              { label: 'Revolusi Industri Kriya', val: 'Pertengahan Abad XIX (±1850 M Penemuan Canting Cap Tembaga)' },
              { label: 'Sebutan Saudagar Kaya', val: 'Wong Beteng (Kaum Saudagar Pemilik Rumah Benteng Indische)' },
              { label: 'Peristiwa Kebangsaan Akbar', val: '16 Oktober 1911 (Pendirian Sarekat Dagang Islam oleh H. Samanhudi)' },
              { label: 'Karakter Arsitektur Khas', val: 'Rumah Dalem Megah Perpaduan Jawa, Kolonial Belanda, dan Art Deco' },
              { label: 'Sentra Kauman', val: 'Sentra Batik Tulis Halus Abdi Dalem Santri Pamethakan Masjid Agung' },
              { label: 'Status Wisata Budaya', val: 'Kampung Wisata Batik Mandiri Berbasis Cagar Budaya' }
            ],
            destLink: {
              label: 'Buka Kampung Batik di Buku Sketsa Destinasi',
              href: 'destinasi.html#laweyan'
            },
            chapters: [
              {
                id: 'ch-laweyan-1',
                num: 'BAB 01',
                period: 'Abad XVI – 1750 Masehi',
                title: 'Fajar Sentra Tenun Lawe Abad XVI: Kyai Ageng Henis & Jalur Niaga Kali Kabanaran',
                paragraphs: [
                  'Jauh sebelum Kota Surakarta berdiri megah di tepian Bengawan Solo, kawasan Kampung Laweyan telah berdenyut sebagai sentra perniagaan kain tertua di pedalaman Jawa Tengah. Asal-usul toponimi "Laweyan" berasal dari kata bahasa Jawa "lawe", yang berarti benang kapas pintal mentah berwarna putih bersih yang menjadi bahan dasar tenun kain mori.',
                  'Pada masa transisi keruntuhan Kesultanan Demak menuju berdirinya Kerajaan Pajang sekitar tahun 1546 Masehi, seorang ulama terkemuka trah bangsawan Majapahit bernama Kyai Ageng Henis (putra Ki Ageng Sela dan kakek dari pendiri dinasti Mataram Islam, Danang Sutawijaya / Panembahan Senopati) memilih menetap di desa tepian Kali Kabanaran ini.',
                  'Kyai Ageng Henis mengajarkan penduduk setempat keterampilan bercocok tanam kapas, memintal serat kapas menjadi gulungan benang lawe, menenun kain mori halus, serta teknik mewarnai kain menggunakan getah tanaman alami mengkudu, kunyit, dan kulit kayu soga. Di bawah asuhannya, Laweyan berkembang menjadi desa perdikan (daerah otonom bebas pajak) yang makmur.',
                  'Kali Kabanaran yang membelah kampung Laweyan pada masa itu merupakan jalur transportasi sungai berkedalaman luas yang dapat dilayari perahu-perahu dagang besar. Dari bandar sungai Laweyan, perahu-perahu niaga berlayar menuju Sungai Bengawan Solo, melintasi Ngawi, Bojonegoro, hingga bermuara di pelabuhan samudra Tuban dan Gresik di Laut Jawa, menghubungkan kain tenun lawe pedalaman dengan saudagar mancanegara.'
                ],
                figure: {
                  img: 'assets/articles/kampung-batik-laweyan-lorong.jpg',
                  caption: 'Lorong bersejarah beraspal bertembok benteng tinggi milik saudagar batik Wong Beteng di Kampung Laweyan Surakarta.'
                },
                callout: {
                  title: 'Makam Keramat Astana Kyai Ageng Henis',
                  text: 'Di kompleks pemakaman kuno Laweyan tersimpan makam Kyai Ageng Henis yang dinaungi cungkup kayu jati klasik. Di samping makam terdapat Masjid Laweyan yang didirikan pada tahun 1546 M—masjid tertua di Solo yang memadukan arsitektur tajug pura Hindu dengan mihrab Islam masa peralihan Pajang.'
                }
              },
              {
                id: 'ch-laweyan-2',
                num: 'BAB 02',
                period: 'Tahun 1850 – 1900 Masehi',
                title: 'Revolusi Canting Cap Tembaga 1850 & Ledakan Kejayaan Kaum Wong Beteng',
                paragraphs: [
                  'Hingga pertengahan abad ke-19, sehelai kain batik tulis mori halus merupakan barang mewah eksklusif yang hanya sanggup dibeli oleh kaum bangsawan ningrat keraton karena proses pembuatannya yang manual membutuhkan waktu berbulan-bulan. Namun, sekitar tahun 1850 di Laweyan, terjadi sebuah lompatan teknologi kriya yang mengubah sejarah peradaban tekstil Nusantara: penemuan alat canting cap berbahan lempengan tembaga.',
                  'Dengan memanfaatkan bilah-bilah tembaga yang dipatri membentuk ragam hias motif geometris secara presisi, seorang pengrajin cap mampu membubuhkan lelehan lilin malam panas pada bentangan kain mori sepanjang belasan meter hanya dalam kurun waktu satu hari kerja. Penemuan revolusioner ini memangkas biaya produksi hingga lebih dari 80 persen tanpa mengurangi ketahanan rintangan lilin terhadap zat pewarna.',
                  'Demokratisasi produksi kain batik melanda seluruh kepulauan Nusantara. Permintaan kain batik melesat jutaan helai dari Sumatera, Kalimantan, Sulawesi, hingga Semenanjung Melayu. Kampung Laweyan mengalami ledakan kemakmuran ekonomi yang luar biasa, melahirkan kelas sosial baru saudagar kaya bumiputera yang disegani.',
                  'Para saudagar kaya Laweyan ini mendapat julukan terhormat "Wong Beteng". Mereka membangun rumah-rumah tinggal (dalem) berukuran megah di lahan seluas ribuan meter persegi, memadukan langgam arsitektur tradisional Jawa Joglo dengan kemewahan pilar-pilar Neoklasik Belanda dan ornamen Art Deco Eropa. Demi menjaga privasi keluarga dan melindungi kekayaan emas serta persediaan kain mori yang berlimpah, kompleks rumah dikelilingi tembok benteng bata tebal setinggi tiga hingga empat meter, menciptakan jaringan lorong gang sempit berliku yang menjadi ciri khas lanskap tata ruang Laweyan hingga hari ini.'
                ],
                figure: {
                  img: 'assets/articles/canting-cap-tembaga.jpg',
                  caption: 'Alat canting cap tembaga presisi yang memicu revolusi industri kerakyatan batik di Kampung Laweyan sejak 1850.'
                },
                callout: {
                  title: 'Bunker Rahasia Koin Emas Wong Beteng',
                  text: 'Karena tidak mempercayai bank-bank milik pemerintah kolonial Belanda, para saudagar Wong Beteng Laweyan merancang ruang-ruang bawah tanah rahasia (bunker) dan brankas tersembunyi di balik dinding ganda rumah joglo mereka untuk menyimpan koin-koin emas gulden dan persediaan malam lebah murni bernilai miliaran rupiah zaman itu.'
                }
              },
              {
                id: 'ch-laweyan-3',
                num: 'BAB 03',
                period: 'Tahun 1911 – 1945 Masehi',
                title: 'Haji Samanhudi, Lahirnya Sarekat Dagang Islam 1911 & Benteng Martabat Bangsa',
                paragraphs: [
                  'Kemandirian dan kemakmuran finansial para saudagar batik Laweyan dipandang sebagai ancaman serius oleh pemerintah kolonial Hindia Belanda. Memasuki permulaan abad ke-20, kongsi dagang perantara asing yang didukung regulasi kolonial mulai memonopoli impor bahan baku vital kain mori putih dan lilin malam lebah, menetapkan harga beli yang mencekik para pembatik pribumi serta menerapkan aturan diskriminasi sosial yang merendahkan martabat bangsa bumiputera.',
                  'Menghadapi penindasan ekonomi yang kian sewenang-wenang, seorang saudagar batik Laweyan yang berjiwa ksatria dan religius bernama Haji Samanhudi (nama lahir Sudarno Nadi, 1868–1956) mengambil langkah berani yang kelak mengubah peta sejarah pergerakan nasional Indonesia.',
                  'Pada tanggal 16 Oktober 1911, di kediaman dalem pribadinya di Kampung Laweyan, H. Samanhudi bersama para saudagar batik lainnya mendeklarasikan berdirinya perkumpulan "Sarekat Dagang Islam" (SDI). Berasaskan persaudaraan Islam dan tolong-menolong ekonomi kerakyatan, SDI bertujuan membela hak-hak pedagang pribumi, mematahkan kartel monopoli impor mori, serta menyediakan dana modal bergulir bagi pengrajin kecil.',
                  'Antusiasme rakyat menyambut SDI meledak melampaui segala ekspektasi. Dalam waktu singkat, ribuan buruh dan saudagar berbondong-bondong mendaftarkan diri. Menyadari potensi kebangkitan massa yang masif, H. Samanhudi mengundang tokoh intelektual muda H.O.S. Tjokroaminoto ke Surakarta pada tahun 1912. Nama organisasi kemudian disempurnakan menjadi "Sarekat Islam" (SI)—bertransformasi menjadi organisasi pergerakan massa kemerdekaan modern pertama dan terbesar di tanah air yang menghimpun lebih dari dua juta anggota lintas nusantara, menjadi kawah candradimuka bagi para bapak pendiri bangsa Indonesia.'
                ],
                figure: {
                  img: 'assets/tokoh/oei-tiong-ham.png',
                  caption: 'Potret perjuangan era saudagar pribumi perintis Sarekat Dagang Islam 1911 di Surakarta.'
                },
                callout: {
                  title: 'Ikrar Kedaulatan Ekonomi Pribumi 1911',
                  text: 'Haji Samanhudi menyerukan: "Kain batik yang kita buat dengan tetesan keringat dan doa adalah lambang kedaulatan kita. Tidak boleh ada satu pun bangsa asing yang memperlakukan anak negeri sebagai orang rendahan di tanah airnya sendiri."'
                }
              },
              {
                id: 'ch-laweyan-4',
                num: 'BAB 04',
                period: 'Tahun 1945 – Sekarang',
                title: 'Kampung Santri Kauman, Pelestarian Cagar Budaya & Ekowisata Pusaka 2026',
                paragraphs: [
                  'Sementara Kampung Laweyan berdiri sebagai benteng industri batik cap saudagar pejuang, di pusat kota Surakarta tepat di sisi barat Alun-Alun Lor berkembang kawasan kembarannya: Kampung Kauman. Dihuni oleh para abdi dalem santri pamethakan Masjid Agung Surakarta yang bertugas merawat tradisi keagamaan keraton, Kauman mengembangkan tradisi batik tulis halus berkarakter santri dengan motif-motif klasik pakem keraton yang sangat wingit dan tenang.',
                  'Rumah-rumah di Kauman menampilkan arsitektur khas Jawa-Islami dengan teras langgar terbuka tempat santri mengaji dan bilik-bilik mencanting yang sunyi, menciptakan perpaduan harmonis antara kesalehan spiritual dan ketelitian karya seni rupa.',
                  'Memasuki milenium baru, masyarakat Laweyan dan Kauman menolak membiarkan warisan agung leluhur mereka tergerus oleh ekspansi ruko modern dan beton pencakar langit. Melalui pembentukan Forum Pengembangan Kampung Batik Laweyan (FPKBL) dan paguyuban warga Kauman, kawasan ini mendeklarasikan diri sebagai Kampung Wisata Budaya Mandiri berbasis cagar budaya komprehensif.',
                  'Kini di tahun 2026, menyusuri gang-gang berpaving Laweyan dan Kauman adalah pengalaman perjalanan waktu yang memesona. Wisatawan dari berbagai belahan dunia dapat bersepeda ontel di sela tembok benteng kuno, mengagumi rumah-rumah dalem berornamen Art Deco yang terpelihara apik, mengikuti workshop membatik canting tulis bersama para maestro sepuh, serta mencicipi kuliner legendaris apem Laweyan. Kampung ini berdiri megah sebagai monumen hidup bahwa kemandirian ekonomi, martabat kebangsaan, dan kehalusan seni rupa mampu hidup berdampingan selaras menatap masa depan peradaban.'
                ]
              }
            ],
            timeline: [
              { year: '1546 M', title: 'Kyai Ageng Henis Membuka Laweyan', desc: 'Perintisan sentra pengolahan benang lawe dan tenun kain di era Kerajaan Pajang.' },
              { year: '1850 M', title: 'Revolusi Canting Cap Tembaga', desc: 'Penemuan canting cap tembaga melahirkan ledakan produksi dan kelas saudagar Wong Beteng.' },
              { year: '1911 M', title: 'Kelahiran Sarekat Dagang Islam', desc: 'H. Samanhudi mendirikan SDI di Laweyan sebagai tonggak pergerakan ekonomi dan politik nasional.' },
              { year: '1912 M', title: 'Transformasi Menjadi Sarekat Islam', desc: 'SDI bertransformasi menjadi organisasi pergerakan massa kemerdekaan terbesar di bawah Tjokroaminoto.' },
              { year: '2004 M', title: 'Deklarasi Kampung Batik Mandiri', desc: 'Inisiasi pelestarian cagar budaya lorong benteng dan sanggar workshop edukasi membatik.' },
              { year: '2026 M', title: 'Living Heritage & Wisata Pusaka', desc: 'Konservasi arsitektur rumah saudagar kuno, tur sejarah gang pusaka, dan ruang ekonomi kreatif.' }
            ],
            figures: [
              {
                name: 'Haji Samanhudi',
                role: 'Pendiri Sarekat Dagang Islam (1911)',
                avatar: 'assets/tokoh/oei-tiong-ham.png',
                bio: 'Pahlawan Nasional dan saudagar batik Laweyan yang menggerakkan perlawanan ekonomi pribumi dan memelopori lahirnya organisasi pergerakan nasional.'
              },
              {
                name: 'Kyai Ageng Henis',
                role: 'Perintis Awal Sentra Laweyan Abad XVI',
                avatar: 'assets/tokoh/rakai-pikatan.png',
                bio: 'Ulama bangsawan leluhur dinasti Mataram yang pertama kali mengajarkan keterampilan memintal benang lawe dan menenun di desa Laweyan.'
              }
            ],
            quote: {
              text: 'Laweyan adalah bukti nyata bahwa sehelai kain batik bukanlah sekadar urusan keindahan seni, melainkan bendera kehormatan, lambang ketabahan kerja keras, dan benteng kemandirian ekonomi bangsa.',
              cite: 'Wasiat Sejarah Paguyuban Kampung Batik Laweyan Surakarta'
            },
            epilogue: 'Menyusuri lorong berbenteng tinggi Kampung Laweyan saat matahari sore condong ke barat adalah meresapi jejak keberanian saudagar pejuang. Dari wajan malam dan bilik canting Laweyan, bangsa ini belajar bahwa kedaulatan sejati dimulai dari kemandirian karya tangan sendiri.'
          }
        }
      ]
    }
  ];

  let currentCategoryIndex = 0;

  function initHistory() {
    const section = document.getElementById('history');
    if (!section) return;

    const eraButtons = section.querySelectorAll('.history-era-item');
    const narrativeDesc = section.querySelector('#historyDesc');
    const titleSmall = section.querySelector('#historyTitleSmall');
    const titleMain = section.querySelector('#historyTitleMain');
    const eraBadge = section.querySelector('#historyEraBadge');
    const sculptureImg = section.querySelector('#historySculptureImg');
    const sculpturePlaque = section.querySelector('#historySculpturePlaque');
    const cardsGrid = section.querySelector('#historyCardsGrid');
    const browseBtn = section.querySelector('#historyBrowseBtn');

    // Modal elements
    const modalBackdrop = document.getElementById('historyModalBackdrop');
    const modalContent = document.getElementById('historyModalContent');

    function renderCategory(index) {
      if (index < 0 || index >= HISTORY_CATEGORIES.length) return;
      currentCategoryIndex = index;
      const cat = HISTORY_CATEGORIES[index];

      // Update active button state on sidebar selector (Gambar 1: hanya 3 pilihan)
      eraButtons.forEach((btn, i) => {
        const isActive = i === index;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      // Subtle animation out
      if (narrativeDesc) narrativeDesc.style.opacity = '0';
      if (sculptureImg) {
        sculptureImg.style.opacity = '0';
        sculptureImg.style.transform = 'scale(0.96)';
      }
      if (sculpturePlaque) sculpturePlaque.style.opacity = '0';
      if (cardsGrid) cardsGrid.style.opacity = '0';

      setTimeout(() => {
        // Apply text updates
        if (titleSmall) titleSmall.textContent = cat.titleSmall;
        if (titleMain) titleMain.textContent = cat.titleMain;
        if (eraBadge) eraBadge.textContent = cat.eraBadge;
        if (narrativeDesc) narrativeDesc.textContent = cat.narrative;
        if (sculpturePlaque) sculpturePlaque.textContent = cat.plaque;

        // Apply sculpture image
        if (sculptureImg) {
          sculptureImg.src = cat.image;
          sculptureImg.alt = cat.plaque;
        }

        // Render 4 bottom deck cards (Gambar 2: Destinasi Nyata Sebagai Sumber Artikel Super Lengkap)
        if (cardsGrid && cat.cards) {
          cardsGrid.innerHTML = cat.cards.map((card, cIdx) => `
            <div class="history-card" role="button" tabindex="0" data-card-idx="${cIdx}" aria-label="Buka artikel sejarah super lengkap ${card.num} ${card.title}">
              <span class="history-card-num">${card.num}</span>
              <div class="history-card-thumb-wrap">
                <img src="${card.thumb}" alt="${card.title}" class="history-card-thumb" loading="lazy" />
              </div>
              <div class="history-card-body">
                <h4 class="history-card-title">${card.title}</h4>
                <p class="history-card-desc">${card.desc}</p>
              </div>
            </div>
          `).join('');

          // Attach click listeners to cards -> Opens FULL SCROLLABLE SUPER LENGKAP ARTICLE for that destination!
          cardsGrid.querySelectorAll('.history-card').forEach(cardEl => {
            const cardIdx = parseInt(cardEl.getAttribute('data-card-idx'), 10);
            const cardData = cat.cards[cardIdx];
            const handleCardClick = () => {
              openDestinationArticle(cat, cardData);
            };
            cardEl.addEventListener('click', handleCardClick);
            cardEl.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
              }
            });
          });
        }

        // Fade in
        if (narrativeDesc) narrativeDesc.style.opacity = '1';
        if (sculptureImg) {
          sculptureImg.style.opacity = '1';
          sculptureImg.style.transform = 'scale(1)';
        }
        if (sculpturePlaque) sculpturePlaque.style.opacity = '1';
        if (cardsGrid) cardsGrid.style.opacity = '1';
      }, 160);
    }

    // Attach click & keyboard navigation to category buttons (Hanya 3 Pilihan)
    eraButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        renderCategory(index);
        playSubtleClick();
      });

      btn.addEventListener('keydown', (e) => {
        let targetIndex = index;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (index + 1) % HISTORY_CATEGORIES.length;
          eraButtons[targetIndex].focus();
          renderCategory(targetIndex);
          playSubtleClick();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (index - 1 + HISTORY_CATEGORIES.length) % HISTORY_CATEGORIES.length;
          eraButtons[targetIndex].focus();
          renderCategory(targetIndex);
          playSubtleClick();
        }
      });
    });

    // Browse All CTA Click -> Opens All 3 Destinations Timeline Modal
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        openAllCategoriesModal();
        playSubtleClick();
      });
    }

    // Modal helpers
    function openModalWithHTML(html, isArticle = true) {
      if (!modalBackdrop || !modalContent) return;

      if (isArticle) {
        modalContent.classList.add('is-article-mode');
        modalContent.innerHTML = html;
      } else {
        modalContent.classList.remove('is-article-mode');
        modalContent.innerHTML = `
          <button class="history-modal-close" id="historyModalCloseBtn" aria-label="Tutup Jendela Informasi">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          ${html}
        `;
        const closeBtn = document.getElementById('historyModalCloseBtn');
        if (closeBtn) {
          closeBtn.addEventListener('click', closeModal);
          closeBtn.focus();
        }
      }

      modalBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('is-open');
      if (modalContent) modalContent.classList.remove('is-article-mode');
      document.body.style.overflow = '';
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
        closeModal();
      }
    });

    /**
     * Render Destination Super Lengkap Article Reader Modal
     * Equipped with Table of Contents (TOC), full chapters, quick facts, callout boxes,
     * chronological timeline, key figures, curatorial reflections, and smooth scrolling.
     */
    function openDestinationArticle(cat, card) {
      const art = card.article;
      if (!art) return;

      const html = `
        <!-- Sticky Header with Reading Progress Bar and Reader Controls -->
        <header class="history-reader-header">
          <div class="history-reading-progress" id="historyReadingProgress"></div>
          
          <div class="history-reader-badge">
            <span class="badge-tag">
              <span class="badge-dot" aria-hidden="true"></span>
              <span>${art.kicker}</span>
            </span>
            <span class="hidden sm:inline text-white/30">|</span>
            <span class="hidden sm:inline">${art.readTime}</span>
          </div>

          <div class="history-reader-tools">
            <!-- Font Size Adjuster -->
            <div class="history-fs-group" title="Ubah Ukuran Huruf Teks">
              <button type="button" class="history-fs-btn" data-size="sm" title="Teks Lebih Kecil">A-</button>
              <button type="button" class="history-fs-btn is-active" data-size="md" title="Teks Standar">A</button>
              <button type="button" class="history-fs-btn" data-size="lg" title="Teks Lebih Besar">A+</button>
            </div>

            <!-- Print / PDF Button -->
            <button type="button" class="history-tool-btn" id="historyPrintBtn" title="Cetak Jurnal atau Simpan PDF">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>Cetak / PDF</span>
            </button>

            <!-- Close Reader Button -->
            <button type="button" class="history-reader-close history-tool-close" id="historyReaderCloseBtn" aria-label="Tutup Artikel Jurnal">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <!-- Main Scrollable Article Body -->
        <div class="history-article-scroll history-article-scroll-body" id="historyArticleScrollBody">
          <article class="history-article">

            <!-- Cover Header -->
            <header class="history-article-cover" id="art-cover">
              <div class="history-article-kicker-row">
                <span class="history-article-meta-badge">${cat.categoryType}</span>
                <span class="history-article-meta-badge">Kartu ${card.num} · ${card.title}</span>
                <span class="history-article-meta-badge" style="color: #fca5a5;">Dokumen Monograf Super Lengkap 2026</span>
              </div>

              <h1 class="history-article-title">${art.title}</h1>
              <p class="history-article-subtitle">${art.subtitle}</p>

              <div class="history-article-byline">
                <div class="history-article-avatar" aria-hidden="true">${card.num}</div>
                <div class="history-article-author-info">
                  <div class="history-article-curator">${art.curator}</div>
                  <div class="history-article-date">Lelana Jateng Historiographical Monograph · Arsip Cagar Budaya Jawa Tengah</div>
                </div>
              </div>

              <!-- Cover Image & Caption -->
              <div class="history-article-hero-wrap">
                <img src="${art.heroImg}" alt="${art.title}" class="history-article-hero-img" loading="eager" />
                <p class="history-article-hero-caption">${art.heroCaption}</p>
              </div>
            </header>

            <!-- Two-Column Layout: Left Sticky Sidebar (TOC & Quick Facts) + Right Main Article Chapters -->
            <div class="history-article-layout" style="margin-top: 36px;">

              <!-- Left Sidebar: Table of Contents & Quick Facts -->
              <aside class="history-article-sidebar">
                
                <!-- Table of Contents Card -->
                <div class="history-sidebar-card">
                  <div class="history-sidebar-title">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <span>DAFTAR ISI BAB</span>
                  </div>
                  <ul class="history-toc-list">
                    <li>
                      <a href="#art-lead-sec" class="history-toc-link">
                        <span class="history-toc-num">00</span>
                        <span>Pengantar Kuratorial</span>
                      </a>
                    </li>
                    ${art.chapters.map((ch, idx) => `
                      <li>
                        <a href="#${ch.id || 'sec-ch-' + idx}" class="history-toc-link">
                          <span class="history-toc-num">${ch.num.replace('BAB ', '')}</span>
                          <span>${ch.title}</span>
                        </a>
                      </li>
                    `).join('')}
                    <li>
                      <a href="#art-timeline-sec" class="history-toc-link">
                        <span class="history-toc-num">KL</span>
                        <span>Kronologi Garis Waktu</span>
                      </a>
                    </li>
                    ${art.figures && art.figures.length ? `
                      <li>
                        <a href="#art-figures-sec" class="history-toc-link">
                          <span class="history-toc-num">TK</span>
                          <span>Tokoh &amp; Arsitek Sejarah</span>
                        </a>
                      </li>
                    ` : ''}
                    <li>
                      <a href="#art-epilogue-sec" class="history-toc-link">
                        <span class="history-toc-num">EP</span>
                        <span>Refleksi &amp; Wasiat Budaya</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Quick Facts Box -->
                <div class="history-sidebar-card">
                  <div class="history-sidebar-title">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>FAKTA CAGAR BUDAYA</span>
                  </div>
                  <div class="history-quickfacts-grid">
                    ${art.quickFacts.map(fact => `
                      <div class="history-qf-item">
                        <span class="history-qf-label">${fact.label}</span>
                        <span class="history-qf-val">${fact.val}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Deep Link to Destination -->
                <a href="${art.destLink.href}" class="history-article-btn history-article-btn-primary" style="justify-content: center; text-align: center; padding: 10px 14px; font-size: 11.5px;">
                  <span>${art.destLink.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>

              </aside>

              <!-- Right Column: Main Reading Narrative -->
              <main class="history-article-main-content">
                
                <!-- Lead Section -->
                <section id="art-lead-sec" class="history-article-chapter" style="padding-top: 0;">
                  <p class="history-article-lead">
                    ${art.lead}
                  </p>
                </section>

                <!-- In-Depth Chapters -->
                ${art.chapters.map((ch, idx) => `
                  <section id="${ch.id || 'sec-ch-' + idx}" class="history-article-chapter">
                    <div class="history-chapter-kicker">${ch.num} · ${ch.period}</div>
                    <h2 class="history-chapter-title">${ch.title}</h2>
                    
                    ${ch.paragraphs.map(p => `
                      <p class="history-article-p">${p.replace(/\n/g, '<br/><br/>')}</p>
                    `).join('')}

                    ${ch.figure ? `
                      <figure class="history-article-fig">
                        <img src="${ch.figure.img}" alt="${ch.figure.caption}" class="history-fig-img" loading="lazy" />
                        <figcaption class="history-fig-caption">${ch.figure.caption}</figcaption>
                      </figure>
                    ` : ''}

                    ${ch.callout ? `
                      <div class="history-article-callout">
                        <h4 class="history-callout-title">${ch.callout.title}</h4>
                        <p class="history-callout-p">${ch.callout.text}</p>
                      </div>
                    ` : ''}
                  </section>
                `).join('')}

                <!-- Chronological Timeline Section -->
                <section id="art-timeline-sec" class="history-article-chapter">
                  <div class="history-chapter-kicker">REKAM JEJAK WAKTU</div>
                  <h2 class="history-chapter-title">Garis Waktu Perjalanan Sejarah Lengkap</h2>
                  <p class="history-article-p">
                    Rangkaian kronologis peristiwa kunci yang membentuk destinasi ini dari fajar pembangunan purbakala hingga era pelestarian cagar budaya modern 2026:
                  </p>

                  <div class="history-article-timeline">
                    ${art.timeline.map(item => `
                      <div class="history-art-timeline-node">
                        <div class="history-art-timeline-year">${item.year}</div>
                        <h4 class="history-art-timeline-title">${item.title}</h4>
                        <p class="history-art-timeline-desc">${item.desc}</p>
                      </div>
                    `).join('')}
                  </div>
                </section>

                <!-- Prominent Historical Figures Section -->
                ${art.figures && art.figures.length ? `
                  <section id="art-figures-sec" class="history-article-chapter">
                    <div class="history-chapter-kicker">TOKOH SEJARAH &amp; ARSITEK</div>
                    <h2 class="history-chapter-title">Sosok Kunci di Balik Kelahiran &amp; Pelestarian</h2>
                    
                    <div class="history-figures-grid">
                      ${art.figures.map(fig => `
                        <div class="history-figure-card">
                          <img src="${fig.avatar}" alt="${fig.name}" class="history-figure-avatar" loading="lazy" />
                          <h4 class="history-figure-name">${fig.name}</h4>
                          <div class="history-figure-role">${fig.role}</div>
                          <p class="history-figure-bio">${fig.bio}</p>
                        </div>
                      `).join('')}
                    </div>
                  </section>
                ` : ''}

                <!-- Curatorial Pullquote -->
                <blockquote class="history-article-quote">
                  <p class="history-quote-text">“${art.quote.text}”</p>
                  <cite class="history-quote-cite">— ${art.quote.cite}</cite>
                </blockquote>

                <!-- Epilogue Reflection -->
                <section id="art-epilogue-sec" style="margin-top: 36px; padding: 22px 26px; background: rgba(255,255,255,0.02); border-left: 3px solid #fca5a5; border-radius: 0 4px 4px 0;">
                  <div style="font-family: var(--hist-font-sans); font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #fca5a5; margin-bottom: 8px;">
                    REFLEKSI &amp; WASIAT KEBUDAYAAN
                  </div>
                  <p class="history-article-p" style="font-style: italic; color: #ece6da; margin: 0; line-height: 1.8;">
                    ${art.epilogue}
                  </p>
                </section>

                <!-- Article Footer Actions -->
                <footer class="history-article-epilogue" style="margin-top: 44px;">
                  <div class="text-xs text-white/50">
                    Lelana Jateng Historiographical Monograph · Arsip Cagar Budaya Terverifikasi 2026
                  </div>
                  <div class="history-article-footer-actions">
                    <button type="button" class="history-article-btn history-article-btn-secondary" onclick="window.print()">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                      </svg>
                      <span>Cetak / PDF</span>
                    </button>
                    <a href="${art.destLink.href}" class="history-article-btn history-article-btn-secondary">
                      <span>${art.destLink.label} ↗</span>
                    </a>
                    <button type="button" class="history-article-btn history-article-btn-primary" id="articleCloseBtn">
                      <span>Selesai Membaca</span>
                    </button>
                  </div>
                </footer>

              </main>

            </div>

          </article>
        </div>
      `;

      openModalWithHTML(html, true);

      // Setup Article Interactivity & Smooth Scrolling
      const scrollBody = document.getElementById('historyArticleScrollBody');
      const progressBar = document.getElementById('historyReadingProgress');
      const readerClose = document.getElementById('historyReaderCloseBtn');
      const artClose = document.getElementById('articleCloseBtn');
      const printBtn = document.getElementById('historyPrintBtn');

      // Reset scroll position to top when article opens
      if (modalBackdrop) {
        modalBackdrop.scrollTop = 0;
      }

      // 1. Reading Progress Tracking & Active TOC Highlight on Scroll
      const updateReadingProgress = () => {
        const scroller = (modalBackdrop && modalBackdrop.scrollHeight > modalBackdrop.clientHeight + 10) ? modalBackdrop : scrollBody;
        if (!scroller) return;
        const top = scroller.scrollTop;
        const height = scroller.scrollHeight - scroller.clientHeight;
        const pct = height > 0 ? (top / height) * 100 : 0;
        if (progressBar) {
          progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }

        // Active Table of Contents (TOC) Tracker
        const sections = document.querySelectorAll('.history-article-chapter, #art-cover, #art-timeline-sec, #art-figures-sec, #art-epilogue-sec');
        let currentId = '';
        sections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 140) {
            currentId = sec.id;
          }
        });
        if (currentId) {
          document.querySelectorAll('.history-toc-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      };

      if (modalBackdrop) {
        modalBackdrop.addEventListener('scroll', updateReadingProgress, { passive: true });
      }
      if (scrollBody) {
        scrollBody.addEventListener('scroll', updateReadingProgress, { passive: true });
      }

      // 2. Smooth Interactive Table of Contents (TOC) Scrolling
      document.querySelectorAll('.history-toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').slice(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

            document.querySelectorAll('.history-toc-link').forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      });

      // 3. Dynamic Font Size Adjuster (A-, A, A+)
      document.querySelectorAll('.history-fs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const size = btn.getAttribute('data-size');
          const artEl = document.querySelector('.history-article');
          if (!artEl) return;
          document.querySelectorAll('.history-fs-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          if (size === 'sm') artEl.style.setProperty('--article-fs', '14.5px');
          else if (size === 'lg') artEl.style.setProperty('--article-fs', '19px');
          else artEl.style.setProperty('--article-fs', '16.5px');
        });
      });

      // 4. Print / PDF Button
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }

      // 5. Close Buttons
      if (readerClose) readerClose.addEventListener('click', closeModal);
      if (artClose) artClose.addEventListener('click', closeModal);
    }

    /**
     * Browse All Timeline Modal across all 3 Categories & 12 Destinations
     */
    function openAllCategoriesModal() {
      const html = `
        <p class="history-modal-kicker">Ikhtisar Garis Waktu Lengkap</p>
        <h3 class="history-modal-title">Sejarah 3 Pilar Destinasi Jawa Tengah (Dari Pembuatan Awal Mula Hingga Sekarang)</h3>
        <div class="history-modal-meta">
          <span class="history-modal-tag">1. Tempat Wisata</span>
          <span class="history-modal-tag">2. Museum</span>
          <span class="history-modal-tag">3. Galeri Budaya</span>
        </div>
        <div class="history-timeline-track" style="margin-top: 24px;">
          ${HISTORY_CATEGORIES.map((cat, idx) => `
            <div class="history-timeline-node">
              <div class="history-timeline-node-time">${cat.categoryType} (${cat.period})</div>
              <h5 class="history-timeline-node-title">${cat.name}</h5>
              <p class="history-timeline-node-desc">${cat.narrative}</p>
              
              <!-- 4 Destinations Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin: 12px 0 8px;">
                ${cat.cards.map((c, cIdx) => `
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: background 0.2s ease;" onclick="window.LelanaOpenCard(${idx}, ${cIdx})">
                    <span style="color: #fca5a5; font-weight: bold; margin-right: 4px;">${c.num}</span>
                    <span style="color: #f7f4ee;">${c.title}</span>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button type="button" style="background: rgba(201,42,42,0.18); border: 1px solid rgba(201,42,42,0.4); color: #fca5a5; font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 3px; cursor: pointer;" onclick="window.LelanaCategorySelect(${idx})">
                  Jelajahi Kategori ${cat.label} →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      openModalWithHTML(html, false);
    }

    window.LelanaCategorySelect = function (index) {
      closeModal();
      renderCategory(index);
      const histSec = document.getElementById('history');
      if (histSec) {
        histSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.LelanaOpenCard = function (catIdx, cardIdx) {
      closeModal();
      renderCategory(catIdx);
      setTimeout(() => {
        const cat = HISTORY_CATEGORIES[catIdx];
        if (cat && cat.cards && cat.cards[cardIdx]) {
          openDestinationArticle(cat, cat.cards[cardIdx]);
        }
      }, 180);
    };

    function playSubtleClick() {
      try {
        if (window.AudioContext || window.webkitAudioContext) {
          const actx = new (window.AudioContext || window.webkitAudioContext)();
          if (actx.state === 'suspended') actx.resume();
          const osc = actx.createOscillator();
          const g = actx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, actx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(350, actx.currentTime + 0.04);
          g.gain.setValueAtTime(0.04, actx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.04);
          osc.connect(g);
          g.connect(actx.destination);
          osc.start();
          osc.stop(actx.currentTime + 0.045);
        }
      } catch (err) { }
    }

    // Initial render: default to Kategori 01 (Tempat Wisata)
    renderCategory(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHistory);
  } else {
    initHistory();
  }
})();
