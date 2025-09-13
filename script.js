//Dati del quiz
//Array di oggetti: ogni oggetto rappresenta una domanda
const quizData = [
  {
    //Testo della domanda
    question: "Qual è il risultato di 2 + '2' in JavaScript?",
    //Possibili risposte in ordine
    answers: ["4", "'22'", "NaN", "Errore"],
    //Indice della risposta corretta nell'array answers
    correct: 1,
  },
  {
    //Testo della domanda
    question: "Quale keyword si usa per dichiarare una costante?",
    //Possibili risposte in ordine
    answers: ["var", "let", "const", "static"],
    //Indice della risposta corretta nell'array answers
    correct: 2,
  },
  {
    //Testo della domanda
    question: "Quale metodo serve per aggiungere un elemento ad un array?",
    //Possibili risposte in ordine
    answers: ["push()", "pop()", "shift()", "concat()"],
    //Indice della risposta corretta nell'array answers
    correct: 0,
  },
  {
    //Testo della domanda
    question: "Quale confronto è 'stretto' (tipo + valore)?",
    //Possibili risposte in ordine
    answers: ["==", "===", "!=", "!=="],
    //Indice della risposta corretta nell'array answers
    correct: 1,
  },
  {
    //Testo della domanda
    question: "Quale parola chiave definisce una funzione freccia?",
    //Possibili risposte in ordine
    answers: ["arrow function", "=>", "function=>", "() arrow"],
    //Indice della risposta corretta nell'array answers
    correct: 1,
  },
];

//Stato del quiz a runtime

//Indice della domanda attuale (parte da 0)
let currentQuestion = 0;

//Punteggio accumulato dall'utente
let score = 0;

//Streak consecutivo corrette per il bonus
let streak = 0;

//Riferimento al setInterval
let timer;

//Secondi per domanda
let timeLeft = 10;

//Collegamenti al DOM

//<div> dove mostreremo il testo della domanda
const questionEl = document.getElementById("question-container");
//<ul> che conterrà i pulsanti delle risposte
const answersEl = document.getElementById("answers");
//<p> dove mostreremo feedback (corretto/sbagliato) e punteggio finale
const scoreEl = document.getElementById("score");

//Pulsante Prossima (inizialmente nascosto in HTML)
const nextBtn = document.getElementById("next-btn");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

const resultsBox = document.getElementById("results");
const finalScoreEl = document.getElementById("final-score");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");
const clearStorageBtn = document.getElementById("clear-storage-btn");

//Si prende dal documento HTML l’elemento che ha id="timer"
const timerEl = document.getElementById("timer");

//Funzioni di utilità

//Aggiorna la UI dell'avanzamento (Domanda X/Y + barra grafica)
function updateProgress() {
  const total = quizData.length;
  const humanIndex = currentQuestion + 1;
  progressText.textContent = `Domanda ${humanIndex}/${total}`;

  //Calcolo percentuale
  const pct = (currentQuestion / total) * 100;
  progressBar.style.width = `${pct}%`;
}

function disableAnswerButtons() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((b) => (b.disabled = true));
}
//Funzione per impostare il countdown
function startTimer() {
  //Ferma eventuali timer già attivi per evitare che più setInterval siano in esecuzione
  clearInterval(timer);

  //Imposta il tempo iniziale per la domanda (10 secondi)
  timeLeft = 10;

  //Aggiorna il DOM per mostrare all'utente il tempo iniziale rimanente
  timerEl.textContent = `Tempo rimasto: ${timeLeft}s`;

  //Rimuove eventuali classi CSS precedenti applicate al timer
  //(colore o effetto pulse degli ultimi secondi)
  timerEl.classList.remove(
    "timer-green",
    "timer-orange",
    "timer-red",
    "timer-pulse"
  );

  //Avvia il countdown: la funzione dentro setInterval viene eseguita ogni 1000ms (1 secondo)
  timer = setInterval(() => {
    //Decrementa il tempo rimanente di 1 secondo
    timeLeft--;

    //Aggiorna il DOM con il nuovo valore del timer
    timerEl.textContent = `Tempo rimasto: ${timeLeft}s`;

    //Cambia il colore del testo in base al tempo rimasto ed aggiunge la classe colore associata
    if (timeLeft > 6) {
      // Tempo iniziale: colore verde
      timerEl.classList.add("timer-green");
    } else if (timeLeft > 3) {
      // Tempo medio: colore arancione
      timerEl.classList.add("timer-orange");
    } else {
      // Tempo critico: colore rosso
      timerEl.classList.add("timer-red");
    }

    //Rimuove l'effetto pulse precedente
    timerEl.classList.remove("timer-pulse");

    //Aggiunge un effetto "pulse" (ingrandimento) negli ultimi 3 secondi
    if (timeLeft <= 3) {
      //Ingrandisce leggermente
      timerEl.classList.add("timer-pulse");
      setTimeout(() => {
        //Riporta alla dimensione normale dopo 300ms
        timerEl.classList.remove("timer-pulse");
      }, 300);
    }

    //Se il tempo scade (0 secondi o meno)
    if (timeLeft <= 0) {
      //Ferma il timer
      clearInterval(timer);

      //Azzera la streak poiché l'utente non ha risposto in tempo
      streak = 0;

      scoreEl.textContent = "Tempo scaduto! Non è più possibile rispondere";
      //Applica classe CSS per colorare il messaggio in rosso
      scoreEl.className = "wrong";

      //Disabilita tutti i pulsanti delle risposte
      disableAnswerButtons();

      //Mostra il pulsante "Prossima" per continuare
      nextBtn.style.display = "block";

      //Ripristina colore e trasformazione del timer al valore di default rimuovendo. le classi
      timerEl.classList.remove(
        "timer-green",
        "timer-orange",
        "timer-red",
        "timer-pulse"
      );
    }
  }, 1000); //La funzione viene eseguita ogni 1000[ms] = 1[s]
}

//Salva i risultati in localstorage
function saveResultsToLocalStorage(finalScore) {
  const last = { score: finalScore, date: new Date().toLocaleString() }; //toISOString no vedi Note_Timer.md
  localStorage.setItem("quiz:lastScore", JSON.stringify(last));

  //Gestione record
  const prevHigh = Number(localStorage.getItem("quiz:highScore") || 0);
  if (finalScore > prevHigh) {
    localStorage.setItem("quiz:highScore", String(finalScore));
  }
}

//Legge high score da local storage
function getHighScore() {
  return Number(localStorage.getItem("quiz:highScore") || 0);
}

function saveQuizHistory(finalScore) {
  //Crea un oggetto che rappresenta un singolo quiz completato
  const entry = {
    //Punteggio ottenuto in questo quiz
    score: finalScore,
    //Data e ora locali in cui il quiz è stato completato
    date: new Date().toLocaleString(),
    //Numero totale di domande del quiz
    totalQuestions: quizData.length,
  };

  //Legge la cronologia esistente dal localStorage
  //Se non esiste nulla, inizializza come array vuoto
  const history = JSON.parse(localStorage.getItem("quiz:history") || "[]");

  //Aggiunge il nuovo quiz alla fine dell'array della cronologia
  history.push(entry);

  //Mantiene solo gli ultimi 10 quiz
  //Se ci sono più di 10 elementi, rimuove il primo (il più vecchio)
  while (history.length > 10) {
    //Rimuove il quiz più vecchio dall'inizio dell'array
    history.shift();
  }

  //Salva la cronologia aggiornata nel localStorage
  //Si converte l'array in stringa JSON per poterlo salvare
  localStorage.setItem("quiz:history", JSON.stringify(history));
}

//Funzione per leggere la cronologia dei quiz completati
function getQuizHistory() {
  //Restituisce l'array dei quiz completati dal localStorage
  //Se non è popolato, restituisce un array vuoto
  return JSON.parse(localStorage.getItem("quiz:history") || "[]");
}

//Funzione: carica/mostra una domanda

function loadQuestion() {
  //Svuota la lista delle risposte da ventuali domande precedenti
  answersEl.innerHTML = "";
  //Svuola il feedback sotto
  scoreEl.textContent = "";
  scoreEl.className = ""; // rimuove classi correct e wrong
  nextBtn.style.display = "none";

  //Aggiorna avanzamento (testo + barra)
  updateProgress();

  //Ricava l'oggetto domanda corrente partendo dall'indice
  const q = quizData[currentQuestion];

  //Mostra il testo della domanda nel relativo contenitore
  questionEl.textContent = q.question;

  //Per ogni rispsota disponibile...
  q.answers.forEach((answer, index) => {
    //Crea un <li> per mantenere pulita la lista
    const li = document.createElement("li");
    //Crea un pulsante per la rispsota
    const btn = document.createElement("button");
    //Testo del pulsante = testo della rispsota
    btn.textContent = answer;

    btn.onclick = () => checkAnswer(index);

    //Insercisce il pulsante nel <li>
    li.appendChild(btn);
    answersEl.appendChild(li);
  });

  //Avvia il timer ad ogni nuova domanda
  startTimer();
}

//Funzione: verifica la risposta

function checkAnswer(index) {
  //Ferma il timer quando l'utente risponde
  clearInterval(timer);

  //Recupera la domanda corrente
  const q = quizData[currentQuestion];

  //Se l'indice coincide con quello corretto allora incrementa il punteggio
  if (index === q.correct) {
    //Aggiorna streak e calcola bonus
    streak += 1;
    const bonus = Math.max(0, streak - 1);
    const gained = 1 + bonus;

    //Aggiorna punteggio
    score += gained;

    //Mostra messaggio di risposta corretta
    scoreEl.textContent =
      bonus > 0
        ? `OK Risposta corretta! +${gained} ( 1 base + ${bonus} bonus streak)`
        : `Risposta corretta! + 1`;
    scoreEl.className = "correct";
  } else {
    streak = 0; // risposta sbagliata
    scoreEl.textContent = "X Risposta sbagliata";
    scoreEl.className = "wrong";
  }

  //Disabilita i bottoni per evitare doppio click
  disableAnswerButtons();

  //Rendi visibile il pulsante Prossima
  nextBtn.style.display = "block";
}

//Avanzamento / fine quiz

// Gestione del pulsante prossima
nextBtn.addEventListener("click", () => {
  currentQuestion++;

  //Aggiorna barar di avanzamento
  updateProgress();

  //Se ci sono ancora domande...
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    //Se non ci sono più domande mostra la schermata finale
    const total = quizData.length;
    finalScoreEl.textContent = `Punteggio finale: ${score} su ${total} (con bonus)`;

    const high = getHighScore();
    saveResultsToLocalStorage(score);
    const newHigh = getHighScore();
    //Salva nella cronologia degli ultimi 10 quiz
    saveQuizHistory(score);

    highScoreEl.textContent =
      newHigh > high
        ? `Nuovo record! High score: ${newHigh}`
        : `Record personale: ${newHigh}`;

    //Nascondi elementi del quiz e mostra sezione risultati
    questionEl.textContent = "Quiz completato!";
    answersEl.innerHTML = "";
    scoreEl.textContent = "";
    nextBtn.style.display = "none";
    resultsBox.style.display = "block";

    progressBar.style.width = "100%";
    progressText.textContent = `Domanda ${total}/${total}`;
  }
});

//Ricomincia il quiz da zero
restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  resultsBox.style.display = "none";
  loadQuestion();
});

//Cancella record e ultimo punteggio dal localStorage //
clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("quiz:highScore");
  localStorage.removeItem("quiz:lastScore");
  highScoreEl.textContent = "Record azzerato.";
});

//Avvio dell'app: carica la prima domanda

loadQuestion();
