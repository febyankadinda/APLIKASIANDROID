// script.js
const sessionNumberSpan = document.getElementById('sessionNumber');
const questionTextElement = document.getElementById('questionText');
const choicesContainer = document.getElementById('choicesContainer');
const nextButton = document.getElementById('nextButton');
const scoreTextElement = document.getElementById('scoreText');

let sesiAktif = 0;
let soalAktif = 0;
let skor = 0;

const soal = [
    [
        {"pertanyaan": "1 + 1 = ?", "pilihan": ["2", "3", "4", "5"], "jawaban": "2"},
        {"pertanyaan": "2 + 2 = ?", "pilihan": ["4", "5", "6", "7"], "jawaban": "4"},
        {"pertanyaan": "3 + 3 = ?", "pilihan": ["6", "7", "8", "9"], "jawaban": "6"},
        {"pertanyaan": "4 + 4 = ?", "pilihan": ["8", "9", "10", "11"], "jawaban": "8"},
        {"pertanyaan": "5 + 5 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "6 + 6 = ?", "pilihan": ["12", "13", "14", "15"], "jawaban": "12"},
        {"pertanyaan": "7 + 7 = ?", "pilihan": ["14", "15", "16", "17"], "jawaban": "14"},
        {"pertanyaan": "8 + 8 = ?", "pilihan": ["16", "17", "18", "19"], "jawaban": "16"},
        {"pertanyaan": "9 + 9 = ?", "pilihan": ["18", "19", "20", "21"], "jawaban": "18"},
        {"pertanyaan": "10 + 10 = ?", "pilihan": ["20", "21", "22", "23"], "jawaban": "20"},
    ],
    [
        {"pertanyaan": "1 * 1 = ?", "pilihan": ["1", "2", "3", "4"], "jawaban": "1"},
        {"pertanyaan": "2 * 2 = ?", "pilihan": ["4", "5", "6", "7"], "jawaban": "4"},
        {"pertanyaan": "3 * 3 = ?", "pilihan": ["9", "10", "11", "12"], "jawaban": "9"},
        {"pertanyaan": "4 * 4 = ?", "pilihan": ["16", "17", "18", "19"], "jawaban": "16"},
        {"pertanyaan": "5 * 5 = ?", "pilihan": ["25", "26", "27", "28"], "jawaban": "25"},
        {"pertanyaan": "6 * 6 = ?", "pilihan": ["36", "37", "38", "39"], "jawaban": "36"},
        {"pertanyaan": "7 * 7 = ?", "pilihan": ["49", "50", "51", "52"], "jawaban": "49"},
        {"pertanyaan": "8 * 8 = ?", "pilihan": ["64", "65", "66", "67"], "jawaban": "64"},
        {"pertanyaan": "9 * 9 = ?", "pilihan": ["81", "82", "83", "84"], "jawaban": "81"},
        {"pertanyaan": "10 * 10 = ?", "pilihan": ["100", "101", "102", "103"], "jawaban": "100"},
    ],
    [
        {"pertanyaan": "10 / 1 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "20 / 2 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "30 / 3 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "40 / 4 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "50 / 5 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "60 / 6 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "70 / 7 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "80 / 8 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "90 / 9 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
        {"pertanyaan": "100 / 10 = ?", "pilihan": ["10", "11", "12", "13"], "jawaban": "10"},
    ],
    [
        {"pertanyaan": "1 - 1 = ?", "pilihan": ["0", "1", "2", "3"], "jawaban": "0"},
        {"pertanyaan": "2 - 1 = ?", "pilihan": ["1", "2", "3", "4"], "jawaban": "1"},
        {"pertanyaan": "3 - 1 = ?", "pilihan": ["2", "3", "4", "5"], "jawaban": "2"},
        {"pertanyaan": "4 - 1 = ?", "pilihan": ["3", "4", "5", "6"], "jawaban": "3"},
        {"pertanyaan": "5 - 1 = ?", "pilihan": ["4", "5", "6", "7"], "jawaban": "4"},
        {"pertanyaan": "6 - 1 = ?", "pilihan": ["5", "6", "7", "8"], "jawaban": "5"},
        {"pertanyaan": "7 - 1 = ?", "pilihan": ["6", "7", "8", "9"], "jawaban": "6"},
        {"pertanyaan": "8 - 1 = ?", "pilihan": ["7", "8", "9", "10"], "jawaban": "7"},
        {"pertanyaan": "9 - 1 = ?", "pilihan": ["8", "9", "10", "11"], "jawaban": "8"},
        {"pertanyaan": "10 - 1 = ?", "pilihan": ["9", "10", "11", "12"], "jawaban": "9"},
    ],
    [
        {"pertanyaan": "Luas persegi panjang dengan panjang 5 dan lebar 10 adalah?", "pilihan": ["50", "55", "60", "65"], "jawaban": "50"},
        {"pertanyaan": "Luas segitiga dengan alas 4 dan tinggi 6 adalah?", "pilihan": ["12", "14", "16", "18"], "jawaban": "12"},
        {"pertanyaan": "Volume kubus dengan sisi 3 adalah?", "pilihan": ["27", "29", "31", "33"], "jawaban": "27"},
        {"pertanyaan": "Hasil dari 2^3 adalah?", "pilihan": ["8", "9", "10", "11"], "jawaban": "8"},
        {"pertanyaan": "Nilai dari akar kuadrat 25 adalah?", "pilihan": ["5", "6", "7", "8"], "jawaban": "5"},
        {"pertanyaan": "Hasil dari 3! (3 faktorial) adalah?", "pilihan": ["6", "7", "8", "9"], "jawaban": "6"},
        {"pertanyaan": "Berapakah nilai pi (π)?", "pilihan": ["3.14", "3.15", "3.16", "3.17"], "jawaban": "3.14"},
        {"pertanyaan": "Berapa jumlah sudut dalam segitiga?", "pilihan": ["180", "190", "200", "210"], "jawaban": "180"},
        {"pertanyaan": "Jika x + 5 = 10, maka x adalah?", "pilihan": ["5", "6", "7", "8"], "jawaban": "5"},
        {"pertanyaan": "Berapakah hasil dari sin(90°)?", "pilihan": ["1", "0", "-1", "0.5"], "jawaban": "1"},
    ]
];

function loadSoal() {
    const soalData = soal[sesiAktif][soalAktif];
    sessionNumberSpan.textContent = sesiAktif + 1;
    questionTextElement.textContent = soalData.pertanyaan;

    const pilihan = soalData.pilihan;
    const choiceButtons = document.querySelectorAll('.choice-button');
    choiceButtons.forEach((button, index) => {
        button.textContent = pilihan[index];
        button.disabled = false;
        button.classList.remove('correct', 'incorrect'); // Menghapus kelas styling sebelumnya
    });

    nextButton.disabled = true;
}

function cekJawaban(pilihanIndex) {
    const soalData = soal[sesiAktif][soalAktif];
    const jawabanBenar = soalData.jawaban;
    const jawabanUser = soalData.pilihan[pilihanIndex];
    const choiceButtons = document.querySelectorAll('.choice-button');

    choiceButtons.forEach((button, index) => {
        button.disabled = true;
        if (soalData.pilihan[index] === jawabanBenar) {
            button.classList.add('correct'); // Menambahkan kelas 'correct'
        }
        if (soalData.pilihan[index] === jawabanUser && jawabanUser !== jawabanBenar) {
            button.classList.add('incorrect'); // Menambahkan kelas 'incorrect'
        }
    });

    if (jawabanUser === jawabanBenar) {
        skor += 10;
    }

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
    questionTextElement.textContent = "Kuis Selesai!";
    choicesContainer.innerHTML = "";
    nextButton.style.display = "none";
    updateScoreColor();
    scoreTextElement.textContent = `Total Skor: ${skor}`;
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

// Event Listeners
choicesContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('choice-button')) {
        const pilihanIndex = event.target.dataset.index;
        cekJawaban(parseInt(pilihanIndex));
    }
});

nextButton.addEventListener('click', nextSoal);

// Inisialisasi
loadSoal();