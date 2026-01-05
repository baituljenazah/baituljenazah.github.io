// Quiz Data - 3 Stages dengan soalan bahasa santai (10 soalan setiap stage)
const quizData = {
    stage1: [
        {
            question: "Eh, kalau ada orang meninggal, benda pertama yang kita kena buat apa?",
            options: [
                "Terus bawa ke hospital",
                "Tutup mata dan mulut si mati, hadapkan ke kiblat",
                "Call bomba dulu",
                "Panggil semua saudara mara"
            ],
            correct: 1,
            explanation: "Betul tu! Pertama sekali kita kena tutup mata dan mulut si mati, pastu hadapkan badan ke arah kiblat. Ini penting untuk hormat pada si mati.",
            hadith: "Hadis Riwayat Muslim: Rasulullah SAW bersabda: \"Apabila kamu menutup mata si mati, maka ucapkanlah kebaikan, kerana malaikat mengamini apa yang kamu ucapkan.\""
        },
        {
            question: "Siapa yang paling utama untuk mandikan jenazah lelaki?",
            options: [
                "Sesiapa je boleh",
                "Isteri dia",
                "Waris lelaki yang terdekat macam anak atau bapa",
                "Imam masjid"
            ],
            correct: 2,
            explanation: "Tepat sekali! Yang paling utama adalah waris lelaki yang terdekat seperti anak lelaki, bapa, datuk atau adik beradik. Mereka lebih berhak dan faham situasi keluarga.",
            hadith: "Hadis Riwayat Abu Daud: Nabi SAW bersabda: \"Orang yang paling berhak memandikan mayat ialah walinya (waris terdekat).\""
        },
        {
            question: "Berapa kali kita kena mandikan jenazah mengikut syarak?",
            options: [
                "Sekali je cukup",
                "2 kali",
                "Minimum 3 kali, bilangan ganjil",
                "Ikut suka hati"
            ],
            correct: 2,
            explanation: "Tepat! Kena mandikan minimum 3 kali (atau 5, 7 kali - bilangan ganjil). Ini wajib mengikut hukum syarak untuk bersihkan jenazah dengan sempurna.",
            hadith: "Hadis Riwayat Bukhari & Muslim: Umm 'Atiyyah meriwayatkan Nabi SAW bersabda ketika memandikan puterinya: \"Mandikanlah dia tiga kali, atau lima kali, atau lebih dari itu jika kamu anggap perlu, dengan air dan daun bidara.\""
        },
        {
            question: "Air apa yang kena guna untuk mandikan jenazah?",
            options: [
                "Air biasa je",
                "Air mutlak yang suci dan menyucikan (air paip, air hujan, air telaga)",
                "Air mawar je",
                "Air mineral dalam botol"
            ],
            correct: 1,
            explanation: "Betul! Kena guna air mutlak - air yang suci dan boleh menyucikan macam air paip, air hujan atau air telaga. Air ni takde campuran benda lain yang ubah sifat dia.",
            hadith: "Hadis Riwayat Tirmizi: Nabi SAW bersabda: \"Air itu suci, tidak dinajiskan oleh sesuatu (selagi sifat asalnya tidak berubah).\""
        },
        {
            question: "Mandikan jenazah tu, mana bahagian yang kena basuh dulu?",
            options: [
                "Kaki dulu sebab paling kotor",
                "Kepala dulu",
                "Bahagian yang ada najis dulu, lepas tu bahagian kanan badan",
                "Ikut suka hati je"
            ],
            correct: 2,
            explanation: "Correct! Mula-mula bersihkan bahagian yang ada najis, lepas tu cuci bahagian kanan badan dulu ikut sunnah. Sama macam kita berwuduk - utamakan sebelah kanan.",
            hadith: "Hadis Riwayat Bukhari & Muslim: Aisyah r.a berkata: \"Rasulullah SAW suka mendahulukan sebelah kanan dalam segala urusannya, ketika memakai kasut, bersikat, dan bersuci.\""
        },
        {
            question: "Boleh ke isteri mandikan suami yang dah meninggal?",
            options: [
                "Tak boleh langsung",
                "Boleh, sebab ikatan perkahwinan masih sah",
                "Boleh tapi kena tutup aurat",
                "Kena tunggu cerai dulu baru boleh"
            ],
            correct: 1,
            explanation: "Betul tu! Isteri boleh mandikan suami yang meninggal sebab ikatan perkahwinan masih sah. Tapi suami tak boleh mandikan isteri yang meninggal kecuali tak ada perempuan lain langsung.",
            hadith: "Hadis Riwayat Ibn Majah: Aisyah r.a berkata: \"Sekiranya aku mengetahui apa yang aku ketahui sekarang, tidak ada yang memandikan Rasulullah melainkan isteri-isterinya.\" (Ini menunjukkan isteri boleh mandikan suami)"
        },
        {
            question: "Apa benda yang sesuai campurkan dengan air semasa mandikan jenazah?",
            options: [
                "Sabun wangi yang mahal",
                "Daun bidara, kapur barus, air mawar",
                "Minyak wangi je",
                "Syampu hotel"
            ],
            correct: 1,
            explanation: "Spot on! Sunnah campurkan daun bidara (untuk bersih), kapur barus (wangi dan sejukkan) dan air mawar. Ini semua ikut sunnah Nabi untuk harumkan dan sucikan jenazah.",
            hadith: "Hadis Riwayat Bukhari & Muslim: Nabi SAW bersabda kepada perempuan yang memandikan puterinya: \"Mandikanlah dia dengan air dan daun bidara, dan pada basuhan terakhir bubuhkan kapur barus (kafur).\""
        },
        {
            question: "Kalau jenazah tu pregnant, macam mana nak mandikan?",
            options: [
                "Mandikan macam biasa je",
                "Kena extra careful, mandikan dengan lembut dari atas kain penutup",
                "Tak payah mandikan langsung",
                "Tunggu baby keluar dulu"
            ],
            correct: 1,
            explanation: "Betul! Jenazah pregnant kena mandikan extra berhati-hati. Biasanya mandikan dari atas kain penutup dengan lembut untuk jaga maruah dan keselamatan janin dalam kandungan.",
            hadith: "Prinsip Fiqh: \"Menjaga maruah dan kehormatan jenazah adalah wajib.\" Ini berdasarkan sabda Nabi SAW (Riwayat Abu Daud): \"Memecahkan tulang mayat adalah seperti memecahkannya ketika hidup (dari segi dosanya).\""
        },
        {
            question: "Bila mandikan jenazah, siapa yang patut ada dalam bilik mandi tu?",
            options: [
                "Ramai orang lagi bagus",
                "Hanya yang terlibat dalam proses memandikan - elakkan ramai orang",
                "Semua family members kena ada",
                "Kena ada videographer"
            ],
            correct: 1,
            explanation: "Tepat! Yang patut ada hanya orang yang terlibat dalam proses mandikan je. Ini untuk jaga maruah si mati dan bagi ruang berkhidmat dengan tenang. Bukan majlis tontonan.",
            hadith: "Hadis Riwayat Ibn Majah: Nabi SAW bersabda: \"Barangsiapa memandikan mayat lalu dia menutup (rahsia)nya, Allah akan mengampuninya 40 kali.\" (Maksudnya jaga aib dan maruah si mati)"
        },
        {
            question: "Kalau jenazah tu mati syahid (mati dalam kemalangan atau bencana dengan darah mengalir), kena mandikan ke?",
            options: [
                "Kena mandikan jugak macam biasa",
                "Tak payah mandikan, terus kafan dan sembahyang",
                "Basuh sikit je",
                "Lap dengan kain je"
            ],
            correct: 1,
            explanation: "Betul tu! Syuhada' (yang mati dengan darah mengalir dalam kejadian mengejut) tak perlu dimandikan. Terus kafankan dengan pakaian yang dipakai dan sembahyangkan. Darah mereka tu adalah syahadah.",
            hadith: "Hadis Riwayat Bukhari: Jabir r.a berkata tentang syuhada Uhud: \"Nabi SAW menyuruh supaya mereka dikebumikan dengan darah mereka, dan tidak dimandikan.\""
        }
    ],
    stage2: [
        {
            question: "Kafan untuk lelaki berapa helai kain?",
            options: [
                "Sehelai je",
                "2 helai",
                "3 helai",
                "Banyak mana pun boleh"
            ],
            correct: 2,
            explanation: "Correct! Lelaki pakai 3 helai kain kafan - kain untuk lilit seluruh badan. Perempuan pulak 5 helai. Ini ikut sunnah Nabi Muhammad SAW."
        },
        {
            question: "Kain kafan tu kena warna apa yang paling sesuai?",
            options: [
                "Hitam sebab majlis sedih",
                "Putih sebab melambangkan kesucian",
                "Hijau sebab warna syurga",
                "Warna apa pun boleh asalkan cantik"
            ],
            correct: 1,
            explanation: "Betul! Kain kafan yang paling baik adalah warna putih. Nabi SAW bersabda pakaian yang paling baik untuk orang hidup dan mati adalah yang berwarna putih. Putih melambangkan kesucian."
        },
        {
            question: "Kafan perempuan ada berapa helai dan apa nama setiap helai tu?",
            options: [
                "3 helai je sama macam lelaki",
                "5 helai - Qamis (baju), Izar (sarung), Khimar (tudung kepala), Rida (penutup dada), Lifafah (lilit luar)",
                "Sehelai je tapi besar",
                "2 helai je - dalam dan luar"
            ],
            correct: 1,
            explanation: "Tepat sekali! Perempuan pakai 5 helai kafan dengan nama khas - Qamis (baju), Izar (sarung), Khimar (tudung), Rida (penutuh dada) dan Lifafah (lilit luar). Ini untuk tutup aurat dengan sempurna."
        },
        {
            question: "Boleh ke pakai kain kafan yang ada tulisan ayat Quran atau hiasan?",
            options: [
                "Boleh, lagi cantik",
                "Tidak sesuai - kafan patut simple je tanpa tulisan atau hiasan",
                "Wajib ada ayat Quran",
                "Kena ada nama si mati"
            ],
            correct: 1,
            explanation: "Betul! Kafan sepatutnya plain dan simple je tanpa tulisan atau hiasan. Tak perlu ayat Quran atau design fancy. Islam ajar kesederhanaan, fokus pada nilai bukan penampilan luaran."
        },
        {
            question: "Sebelum kafankan jenazah, apa yang sesuai buat pada kain kafan?",
            options: [
                "Terus pakai je",
                "Wangikan dengan minyak wangi atau kapur barus (pewangi syar'i)",
                "Basahkan dengan air sejuk",
                "Iron sampai licin"
            ],
            correct: 1,
            explanation: "Spot on! Sunnah wangikan kain kafan dengan minyak wangi atau kapur barus sebelum pakaikan. Ini ikut sunnah untuk harumkan jenazah dan tanda penghormatan terakhir."
        },
        {
            question: "Macam mana cara ikat kain kafan yang betul?",
            options: [
                "Ikat ketat supaya tak tanggal",
                "Ikat longgar dengan simpulan sementara di kepala dan kaki, nanti buka masa nak tanam",
                "Tak payah ikat, lipat je",
                "Guna getah"
            ],
            correct: 1,
            explanation: "Betul! Kain kafan diikat longgar dengan simpulan sementara di bahagian kepala dan kaki. Nanti masa nak tanam dalam liang lahad, simpulan ni akan dibuka supaya kain terbuka sikit."
        },
        {
            question: "Kalau jenazah budak kecil atau bayi, macam mana cara kafan dia?",
            options: [
                "Sama je macam orang dewasa",
                "Boleh guna sehelai kain je untuk lilit, tak perlu 3 atau 5 helai",
                "Pakaikan baju biasa je",
                "Tak payah kafan"
            ],
            correct: 1,
            explanation: "Tepat! Untuk budak kecil atau bayi, boleh guna sehelai kain kafan je untuk lilit. Tak semestinya perlu 3 atau 5 helai. Yang penting aurat tertutup dan jenazah terbalut dengan baik."
        },
        {
            question: "Boleh ke guna kain sutera untuk kafan?",
            options: [
                "Boleh, lagi mewah",
                "Tidak boleh untuk lelaki (haram), tapi boleh untuk perempuan",
                "Wajib guna sutera",
                "Sutera je yang sah"
            ],
            correct: 1,
            explanation: "Correct! Kain sutera tidak boleh untuk kafan lelaki sebab haram untuk lelaki dalam Islam. Tapi boleh untuk perempuan. Lebih baik guna kain cotton atau kain putih biasa yang halal dan bersih."
        },
        {
            question: "Selepas kafan siap, apa lagi yang sesuai buat sebelum bawa ke masjid?",
            options: [
                "Terus bawa ke masjid",
                "Letakkan wangi-wangian (minyak kasturi atau atar) pada jenazah terutama di dahi, hidung, tangan dan lutut",
                "Snap gambar dulu",
                "Tunggu sejam dulu"
            ],
            correct: 1,
            explanation: "Betul! Selepas kafan, sunnah sapukan wangi-wangian seperti minyak kasturi atau atar pada bahagian sujud jenazah (dahi, hidung, tangan, lutut, kaki). Ini muliakan si mati dan sunnah Nabi."
        },
        {
            question: "Kalau tak mampu beli kain kafan yang baru, boleh ke guna kain lain?",
            options: [
                "Tak boleh, kena beli baru jugak",
                "Boleh guna kain yang ada asalkan suci, bersih dan menutup aurat - Islam tak membebankan",
                "Kena pinjam je",
                "Mesti branded"
            ],
            correct: 1,
            explanation: "Tepat sekali! Islam tak membebankan. Kalau tak mampu, boleh guna kain yang ada asalkan suci dan bersih. Bahkan kain pakaian si mati pun boleh jadi kafan kalau perlu. Yang penting jenazah terbalut dengan menutup aurat."
        }
    ],
    stage3: [
        {
            question: "Solat jenazah ada berapa takbir?",
            options: [
                "3 takbir",
                "4 takbir",
                "5 takbir",
                "7 takbir"
            ],
            correct: 1,
            explanation: "Spot on! Solat jenazah ada 4 takbir. Tak ada rukuk dan sujud, tapi kena baca doa-doa yang khusus untuk si mati.",
            hadith: "Hadis Riwayat Muslim: Dari Abu Hurairah r.a bahawa Nabi SAW mengkhabarkan tentang kematian An-Najasyi pada hari beliau meninggal, dan baginda keluar ke tempat solat (musolla), lalu bertakbir empat kali."
        },
        {
            question: "Apa yang dibaca selepas takbir pertama dalam solat jenazah?",
            options: [
                "Al-Fatihah je",
                "Al-Fatihah dan surah pendek",
                "Ayat Kursi",
                "Doa je"
            ],
            correct: 0,
            explanation: "Betul! Selepas takbir pertama, kita baca surah Al-Fatihah. Ini rukun dalam solat jenazah yang wajib dibaca.",
            hadith: "Hadis Riwayat Syafie: Dalam solat jenazah, selepas takbir pertama dibaca Al-Fatihah, takbir kedua selawat ke atas Nabi, takbir ketiga doa untuk si mati, takbir keempat salam."
        },
        {
            question: "Bila tanam jenazah, kepala kena menghadap ke mana?",
            options: [
                "Menghadap matahari terbit",
                "Menghadap kiblat (sebelah kanan)",
                "Menghadap utara",
                "Tak kisah arah mana"
            ],
            correct: 1,
            explanation: "Betul sangat! Masa tanam jenazah, kepala kena hadap kiblat (sebelah kanan) supaya muka jenazah menghadap ke Kaabah. Ini sunnah yang penting.",
            hadith: "Hadis Riwayat Tirmizi & Abu Daud: Nabi SAW bersabda: \"Kiblat bagi orang hidup untuk solat dan bagi orang mati adalah untuk dikebumikan (menghadapnya).\""
        },
        {
            question: "Berapa dalam liang lahad yang sesuai untuk jenazah?",
            options: [
                "Setakat lutut je (lebih kurang 1.5 kaki)",
                "Sedalam dada orang yang menggali (lebih kurang 4-5 kaki)",
                "Separas tanah je",
                "Dalam mana pun boleh"
            ],
            correct: 1,
            explanation: "Tepat! Liang lahad yang baik adalah sedalam dada orang yang menggali, lebih kurang 4-5 kaki. Ni untuk elak bau dan binatang kacau, dan jaga kehormatan jenazah.",
            hadith: "Hadis Riwayat Tirmizi: Hisyam bin Amir berkata: \"Kami mengadu kepada Rasulullah SAW tentang beratnya menggali (kubur) di Uhud, lalu baginda bersabda: Galilah, dalamkan dan perbaikilah.\""
        },
        {
            question: "Berapa lama tempoh untuk selesaikan pengurusan jenazah?",
            options: [
                "Tak ada had masa",
                "Dalam masa 1 minggu",
                "Secepat mungkin, elakkan tangguh - kalau boleh dalam 24 jam",
                "Tunggu semua saudara mara sampai dulu"
            ],
            correct: 2,
            explanation: "Memang betul! Pengurusan jenazah kena dibuat secepat mungkin. Nabi SAW bersabda cepat uruskan jenazah, jangan tangguh-tangguh. Kalau boleh dalam masa 24 jam kecuali ada uzur syar'i.",
            hadith: "Hadis Riwayat Bukhari: Nabi SAW bersabda: \"Segerakanlah jenazah (untuk dikebumikan). Jika ia orang baik, maka kamu mendekatkannya kepada kebaikan. Jika ia selain itu, maka ia adalah keburukan yang kamu jauhkan dari tengkuk kamu.\""
        },
        {
            question: "Macam mana cara letak jenazah dalam liang lahad yang betul?",
            options: [
                "Kepala dulu masuk",
                "Kaki dulu masuk",
                "Dari arah kepala, jenazah dimasukkan dengan dimiringkan ke kanan menghadap kiblat",
                "Terus campak je"
            ],
            correct: 2,
            explanation: "Correct! Jenazah dimasukkan dari arah kepala, dimiringkan sebelah kanan menghadap kiblat. Buat dengan lembut dan penuh hormat. Ini cara yang paling mudah dan terhormat.",
            hadith: "Dari praktik sahabat: Jenazah dimasukkan ke lahad dari arah kepala sambil dibaca doa: \"Bismillahi wa 'ala millati Rasulillah\" (Dengan nama Allah dan di atas agama Rasulullah)."
        },
        {
            question: "Apa yang sesuai dibaca masa turunkan jenazah ke dalam kubur?",
            options: [
                "Takbir je",
                "Bismillahi wa 'ala millati Rasulillah (Dengan nama Allah dan di atas agama Rasulullah)",
                "Al-Fatihah",
                "Tahlil"
            ],
            correct: 1,
            explanation: "Betul! Masa turunkan jenazah, baca 'Bismillahi wa 'ala millati Rasulillah'. Ni doa sunnah yang bermaksud kita serahkan jenazah dengan nama Allah dan atas agama Rasulullah.",
            hadith: "Hadis Riwayat Tirmizi & Ibn Majah: Ibnu Umar r.a berkata: \"Apabila mayat diletakkan di dalam liang lahadnya, maka hendaklah diucapkan: Bismillahi wa 'ala millati Rasulillah.\""
        },
        {
            question: "Boleh ke tanam jenazah dalam keranda atau peti sebelum masuk tanah?",
            options: [
                "Wajib guna keranda",
                "Tak perlu dan tak digalakkan - jenazah patut sentuh tanah terus",
                "Keranda lagi cantik",
                "Mesti ada peti"
            ],
            correct: 1,
            explanation: "Tepat! Dalam Islam, jenazah sepatutnya sentuh tanah terus tanpa keranda atau peti. Kita dari tanah, kembali ke tanah. Guna keranda hanya bila perlu (tanah keras, tanah lembik) atau undang-undang tempatan.",
            hadith: "Prinsip dari Al-Quran (Taha: 55): \"Darinya (tanah) Kami menciptakan kamu, dan kepadanya Kami akan mengembalikan kamu.\" Ini menunjukkan jenazah sepatutnya kembali ke tanah secara langsung."
        },
        {
            question: "Bila dah tanam jenazah, apa yang sesuai buat lepas tu?",
            options: [
                "Terus balik",
                "Ratakan tanah, tinggikan sedikit, baca doa untuk si mati, talqin kalau ikut mazhab yang amalkan",
                "Buat jamuan",
                "Tanam pokok terus"
            ],
            correct: 1,
            explanation: "Betul! Selepas tanam, ratakan tanah kubur dan tinggikan sedikit (lebih kurang sejengkal). Pastu baca doa untuk si mati. Ada mazhab yang amalkan talqin (mengajar jenazah), ada yang tak - kedua-duanya okay.",
            hadith: "Hadis Riwayat Abu Daud: Nabi SAW apabila selesai mengebumikan mayat, baginda berdiri di sisinya dan bersabda: \"Mohonkanlah ampun untuk saudara kamu dan mohonkanlah keteguhan untuknya, kerana sekarang dia sedang ditanya.\""
        },
        {
            question: "Boleh ke letak batu nisan atau hiasan mewah atas kubur?",
            options: [
                "Boleh, lagi cantik kubur tu",
                "Boleh letak tanda simple je (batu kecil/kayu) untuk kenal pasti, tapi elak hiasan mewah",
                "Wajib letak batu besar",
                "Kena hiasan mewah tanda sayang"
            ],
            correct: 1,
            explanation: "Tepat sekali! Islam galakkan kesederhanaan. Boleh letak tanda simple macam batu kecil atau kayu untuk kenal pasti kubur je. Elakkan buat bangunan megah, hiasan mewah atau berlebihan sebab ia salahi sunnah Nabi.",
            hadith: "Hadis Riwayat Muslim: Jabir r.a berkata: \"Nabi SAW melarang mengecat kubur (dengan warna-warna), duduk di atasnya dan membina bangunan di atasnya.\" Ini menunjukkan Islam mengajar kesederhanaan dalam hal kubur."
        }
    ]
};

// Quiz State
let currentStage = 1;
let currentQuestion = 0;
let selectedAnswer = null;
let stagesCompleted = 0;

// Elements
const questionContainer = document.getElementById('questionContainer');
const feedback = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const completionSection = document.getElementById('completionSection');
const restartBtn = document.getElementById('restartBtn');

// Initialize Quiz
function initQuiz() {
    loadQuestion();
    updateStageIndicator();
}

// Load Question
function loadQuestion() {
    const stageKey = `stage${currentStage}`;
    const question = quizData[stageKey][currentQuestion];
    
    questionContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <div class="option" data-index="${index}">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span>${option}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click listeners to options
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => selectAnswer(option));
    });
    
    // Reset state
    selectedAnswer = null;
    feedback.classList.remove('show', 'success', 'error');
    nextBtn.classList.remove('show');
}

// Select Answer
function selectAnswer(optionElement) {
    // If already answered, don't allow reselection
    if (selectedAnswer !== null) return;
    
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    optionElement.classList.add('selected');
    selectedAnswer = parseInt(optionElement.dataset.index);
    
    // Check answer after a short delay
    setTimeout(() => checkAnswer(), 500);
}

// Check Answer
function checkAnswer() {
    const stageKey = `stage${currentStage}`;
    const question = quizData[stageKey][currentQuestion];
    const options = questionContainer.querySelectorAll('.option');
    
    if (selectedAnswer === question.correct) {
        // Correct answer
        options[selectedAnswer].classList.remove('selected');
        options[selectedAnswer].classList.add('correct');
        
        feedback.innerHTML = `
            <strong><i class="fas fa-check-circle"></i> Wahh, betul!</strong><br>
            ${question.explanation}<br><br>
            <div style="background: rgba(136, 231, 136, 0.2); padding: 15px; border-radius: 8px; border-left: 4px solid var(--primary-color); margin-top: 15px;">
                <strong><i class="fas fa-book"></i> Dalil:</strong><br>
                <em style="line-height: 1.8;">${question.hadith}</em>
            </div>
        `;
        feedback.classList.add('show', 'success');
        
        // Show next button
        nextBtn.classList.add('show');
        
        // Celebration effect
        createConfetti();
        
    } else {
        // Wrong answer
        options[selectedAnswer].classList.remove('selected');
        options[selectedAnswer].classList.add('wrong');
        options[question.correct].classList.add('correct');
        
        feedback.innerHTML = `
            <strong><i class="fas fa-times-circle"></i> Alamak, salah tu!</strong><br>
            Jawapan yang betul: <strong>${question.options[question.correct]}</strong><br>
            ${question.explanation}<br><br>
            <div style="background: rgba(244, 67, 54, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid var(--error-color); margin-top: 15px;">
                <strong><i class="fas fa-book"></i> Dalil:</strong><br>
                <em style="line-height: 1.8;">${question.hadith}</em>
            </div>
        `;
        feedback.classList.add('show', 'error');
        
        // Allow retry - reload same question after delay
        setTimeout(() => {
            alert('Tak pe, cuba lagi! Kena betul baru boleh proceed.');
            loadQuestion();
        }, 4000); // Increased delay to 4 seconds to allow reading hadith
    }
}

// Next Question or Stage
nextBtn.addEventListener('click', () => {
    const stageKey = `stage${currentStage}`;
    
    // Check if there are more questions in current stage
    if (currentQuestion < quizData[stageKey].length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        // Stage completed
        completeStage();
    }
});

// Complete Stage
function completeStage() {
    stagesCompleted++;
    
    // Mark stage as completed
    const stageDots = document.querySelectorAll('.stage-dot');
    stageDots[currentStage - 1].classList.remove('active');
    stageDots[currentStage - 1].classList.add('completed');
    
    if (currentStage < 3) {
        // Move to next stage
        currentStage++;
        currentQuestion = 0;
        
        // Show stage transition
        showStageTransition();
        
        setTimeout(() => {
            updateStageIndicator();
            loadQuestion();
        }, 2000);
    } else {
        // Quiz completed!
        showCompletion();
    }
}

// Show Stage Transition
function showStageTransition() {
    questionContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 0;">
            <div style="font-size: 4rem; color: var(--success-color); margin-bottom: 20px;">
                <i class="fas fa-star"></i>
            </div>
            <h2 style="color: var(--primary-color); margin-bottom: 15px;">
                Peringkat ${currentStage - 1} Selesai!
            </h2>
            <p style="font-size: 1.2rem;">
                Bestnya! Jom ke Peringkat ${currentStage}...
            </p>
        </div>
    `;
    feedback.classList.remove('show');
    nextBtn.classList.remove('show');
    
    createCelebrationBurst();
}

// Update Stage Indicator
function updateStageIndicator() {
    const stageDots = document.querySelectorAll('.stage-dot');
    stageDots.forEach((dot, index) => {
        if (index + 1 === currentStage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Show Completion
function showCompletion() {
    questionContainer.style.display = 'none';
    feedback.style.display = 'none';
    nextBtn.style.display = 'none';
    completionSection.classList.add('show');
    
    // Epic celebration
    createMassiveConfetti();
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
    currentStage = 1;
    currentQuestion = 0;
    selectedAnswer = null;
    stagesCompleted = 0;
    
    // Reset UI
    questionContainer.style.display = 'block';
    feedback.style.display = 'block';
    nextBtn.style.display = 'block';
    completionSection.classList.remove('show');
    
    // Reset stage dots
    const stageDots = document.querySelectorAll('.stage-dot');
    stageDots.forEach(dot => {
        dot.classList.remove('active', 'completed');
    });
    
    // Restart quiz
    initQuiz();
});

// Confetti Effect
function createConfetti() {
    const colors = ['#88E788', '#4CAF50', '#FFD700', '#FF6B6B'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Celebration Burst
function createCelebrationBurst() {
    const colors = ['#88E788', '#4CAF50', '#FFD700', '#FF6B6B', '#9C27B0'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Massive Confetti for Completion
function createMassiveConfetti() {
    const colors = ['#88E788', '#4CAF50', '#FFD700', '#FF6B6B', '#9C27B0', '#00BCD4'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 15 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    
    // Smooth scroll for video
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('loadeddata', () => {
            video.play().catch(e => console.log('Autoplay prevented:', e));
        });
    }
});

