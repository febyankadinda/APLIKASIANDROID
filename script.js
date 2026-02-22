const startPage = document.getElementById('startPage');
const quizPage = document.getElementById('quizPage');
const scorePage = document.getElementById('scorePage');
const startButton = document.getElementById('startButton');
const sessionNumberSpan = document.getElementById('sessionNumber');
const questionTextElement = document.getElementById('questionText');
const choicesContainer = document.getElementById('choicesContainer');
const nextButton = document.getElementById('nextButton');
const scoreTextElement = document.getElementById('scoreText');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const currentQuestionElement = document.getElementById('currentQuestion');
const totalQuestionsElement = document.getElementById('totalQuestions');
const progressBarFill = document.getElementById('progressBarFill');

let sesiAktif = 0;
let soalAktif = 0;
let skor = 0;
let answeredQuestions = 0;

const soal = [
    [
        {"pertanyaan": "16 + 3 = ?", "pilihan": ["10", "18", "19", "17"], "jawaban": "19"},
        {"pertanyaan": "20 + 23 = ?", "pilihan": ["43", "46", "42", "44"], "jawaban": "43"},
        {"pertanyaan": "13 + 23 = ?", "pilihan": ["36", "34", "28", "35"], "jawaban": "36"},
        {"pertanyaan": "34 + 17 = ?", "pilihan": ["48", "51", "50", "61"], "jawaban": "51"},
        {"pertanyaan": "51 + 15 = ?", "pilihan": ["67", "68", "66", "65"], "jawaban": "66"},
        {"pertanyaan": "26 + 46 = ?", "pilihan": ["32", "45", "43", "42"], "jawaban": "42"},
        {"pertanyaan": "37 + 17 = ?", "pilihan": ["54", "55", "61", "27"], "jawaban": "54"},
        {"pertanyaan": "18 + 34 = ?", "pilihan": ["83", "27", "58", "52"], "jawaban": "52"},
        {"pertanyaan": "19 + 19 = ?", "pilihan": ["38", "28", "26", "21"], "jawaban": "38"},
        {"pertanyaan": "10 + 71 = ?", "pilihan": ["81", "71", "72", "53"], "jawaban": "20"},
    ],
    [
        {"pertanyaan": "8 * 12 = ?", "pilihan": ["82", "96", "93", "67"], "jawaban": "96"},
        {"pertanyaan": "14 * 7 = ?", "pilihan": ["24", "35", "28", "27"], "jawaban": "28"},
        {"pertanyaan": "30 * 3 = ?", "pilihan": ["90", "60", "71", "42"], "jawaban": "90"},
        {"pertanyaan": "41 * 2 = ?", "pilihan": ["34", "57", "28", "82"], "jawaban": "82"},
        {"pertanyaan": "15 * 5 = ?", "pilihan": ["75", "45", "25", "35"], "jawaban": "75"},
        {"pertanyaan": "26 * 3 = ?", "pilihan": ["66", "77", "78", "39"], "jawaban": "78"},
        {"pertanyaan": "37 * 2 = ?", "pilihan": ["37", "74", "50", "52"], "jawaban": "74"},
        {"pertanyaan": "18 * 5 = ?", "pilihan": ["90", "71", "88", "67"], "jawaban": "90"},
        {"pertanyaan": "9 * 9 = ?", "pilihan": ["81", "82", "83", "84"], "jawaban": "81"},
        {"pertanyaan": "10 * 10 = ?", "pilihan": ["100", "101", "102", "103"], "jawaban": "100"},
    ],
    [
        {"pertanyaan": "10 / 5 = ?", "pilihan": ["6", "4", "2", "1"], "jawaban": "2"},
        {"pertanyaan": "20 / 5 = ?", "pilihan": ["6", "5", "4", "7"], "jawaban": "4"},
        {"pertanyaan": "30 / 3 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "40 / 8 = ?", "pilihan": ["4", "7", "5", "8"], "jawaban": "5"},
        {"pertanyaan": "50 / 5 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "60 / 3 = ?", "pilihan": ["10", "21", "15", "20"], "jawaban": "20"},
        {"pertanyaan": "70 / 5 = ?", "pilihan": ["10", "31", "14", "20"], "jawaban": "14"},
        {"pertanyaan": "80 / 4 = ?", "pilihan": ["20", "21", "32", "13"], "jawaban": "20"},
        {"pertanyaan": "90 / 2 = ?", "pilihan": ["12", "45", "32", "18"], "jawaban": "40"},
        {"pertanyaan": "100 / 10 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
    ],
    [
        {"pertanyaan": "81 - 1 = ?", "pilihan": ["80", "11", "29", "63"], "jawaban": "80"},
        {"pertanyaan": "32 - 21 = ?", "pilihan": ["1", "2", "3", "4"], "jawaban": "1"},
        {"pertanyaan": "30 - 6 = ?", "pilihan": ["22", "23", "24", "15"], "jawaban": "24"},
        {"pertanyaan": "45 - 13 = ?", "pilihan": ["32", "24", "15", "46"], "jawaban": "32"},
        {"pertanyaan": "50 - 11 = ?", "pilihan": ["34", "45", "16", "39"], "jawaban": "39"},
        {"pertanyaan": "60 - 34 = ?", "pilihan": ["25", "26", "27", "28"], "jawaban": "26"},
        {"pertanyaan": "70 - 11 = ?", "pilihan": ["36", "46", "58", "59"], "jawaban": "59"},
        {"pertanyaan": "28 - 12 = ?", "pilihan": ["12", "16", "19", "10"], "jawaban": "16"},
        {"pertanyaan": "95 - 67 = ?", "pilihan": ["28", "29", "10", "21"], "jawaban": "28"},
        {"pertanyaan": "18 - 6 = ?", "pilihan": ["9", "10", "11", "12"], "jawaban": "12"},
    ],
    [
        {"pertanyaan": "Luas persegi panjang dengan panjang 5 dan lebar 10 adalah?", "pilihan": ["50", "55", "60", "65"], "jawaban": "50"},
        {"pertanyaan": "Luas segitiga dengan alas 4 dan tinggi 6 adalah?", "pilihan": ["14", "12", "16", "18"], "jawaban": "12"},
        {"pertanyaan": "Volume kubus dengan sisi 3 adalah?", "pilihan": ["31", "29", "27", "33"], "jawaban": "27"},
        {"pertanyaan": "Hasil dari 2^3 adalah?", "pilihan": ["11", "9", "10", "8"], "jawaban": "8"},
        {"pertanyaan": "Nilai dari akar kuadrat 25 adalah?", "pilihan": ["5", "6", "7", "8"], "jawaban": "5"},
        {"pertanyaan": "Hasil dari 3! (3 faktorial) adalah?", "pilihan": ["7", "6", "8", "9"], "jawaban": "6"},
        {"pertanyaan": "Berapakah nilai pi (π)?", "pilihan": ["3.14", "3.15", "3.16", "3.17"], "jawaban": "3.14"},
        {"pertanyaan": "Berapa jumlah sudut dalam segitiga?", "pilihan": ["180", "190", "200", "210"], "jawaban": "180"},
        {"pertanyaan": "Jika x + 5 = 10, maka x adalah?", "pilihan": ["5", "6", "7", "8"], "jawaban": "5"},
        {"pertanyaan": "Berapakah hasil dari sin(90°)?", "pilihan": ["1", "0", "-1", "0.5"], "jawaban": "1"},
    ]
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadSoal() {
    const soalData = soal[sesiAktif][soalAktif];
    sessionNumberSpan.textContent = sesiAktif + 1;
    questionTextElement.textContent = soalData.pertanyaan;

    const pilihan = [...soalData.pilihan];
    shuffleArray(pilihan);

    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach((button, index) => {
        button.textContent = pilihan[index];
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
        button.dataset.choice = pilihan[index];
    });

    nextButton.disabled = true;
    updateProgressBar();
}

function cekJawaban(event) {
    const button = event.target;
    const pilihan = button.dataset.choice;
    const soalData = soal[sesiAktif][soalAktif];
    const jawabanBenar = soalData.jawaban;

    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.choice === jawabanBenar) {
            btn.classList.add('correct');
        }
        if (btn === button && pilihan !== jawabanBenar) {
            btn.classList.add('incorrect');
        }
    });

    if (pilihan === jawabanBenar) {
        skor += 10;
    }
    answeredQuestions++;

    updateScoreColor();
    scoreTextElement.textContent = `Skor: ${skor}`;
    nextButton.disabled = false;
}

function nextSoal() {
    soalAktif++;

    if (soalAktif < soal[sesiAktif].length) {
        loadSoal();
    } else {
        selesaikanSesi();
    }
}

function selesaikanSesi() {
    sesiAktif++;
    soalAktif = 0;

    if (sesiAktif < soal.length) {
        sessionNumberSpan.textContent = sesiAktif + 1;
        loadSoal();
    } else {
        selesaikanKuis();
    }
}

function selesaikanKuis() {
    quizPage.style.display = 'none';
    scorePage.style.display = 'block';
    finalScoreElement.textContent = skor;
}

function updateScoreColor() {
    if (skor > 50) {
        scoreTextElement.classList.remove('red', 'orange');
        scoreTextElement.classList.add('green');
    } else if (skor < 50) {
        scoreTextElement.classList.remove('green', 'orange');
        scoreTextElement.classList.add('red');
    } else {
        scoreTextElement.classList.remove('green', 'red');
        scoreTextElement.classList.add('orange');
    }
}

function updateProgressBar() {
    const progress = ((soalAktif + 1) / soal[sesiAktif].length) * 100;
    progressBarFill.style.width = `${progress}%`;
}

// Event Listeners
choicesContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('choice-button')) {
        cekJawaban(event);
    }
});

nextButton.addEventListener('click', nextSoal);

startButton.addEventListener('click', function() {
    startPage.style.display = 'none';
    quizPage.style.display = 'block';
    loadSoal();
});

restartButton.addEventListener('click', function() {
    sesiAktif = 0;
    soalAktif = 0;
    skor = 0;
    answeredQuestions = 0;

    quizPage.style.display = 'none';
    scorePage.style.display = 'none';
    startPage.style.display = 'block';

    scoreTextElement.classList.remove('green', 'red', 'orange');
    scoreTextElement.classList.add('orange');
    scoreTextElement.textContent = `Skor: 0`;

    loadSoal(); // Memuat ulang soal dari awal
});

// Inisialisasi
window.onload = function() {
    loadSoal();
};
