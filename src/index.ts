addEventListener("DOMContentLoaded", () => {
    initTimer();
});

document.addEventListener("input", (e) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
        pauseTimer();
        getTimerInputs();
    }
})

/* ---------------------------------------------------
   Variablen
--------------------------------------------------- */
let timerRunning = false;
let timerElement = document.getElementById("timer_element") as HTMLElement | null;
let autoStartBreakTimer = document.getElementById("autoplay") as HTMLInputElement | null;
let timerMode = "work";

let hours = 0;
let minutes = 0;
let seconds = 0;

let timerInterval: number | null = null;

/* ---------------------------------------------------
   Initialisierung
--------------------------------------------------- */
function initTimer() {
    if (!timerElement) {
        console.error("timer_element not found!");
        return;
    }
    getTimerInputs();
}

/* ---------------------------------------------------
   Eingaben einlesen
--------------------------------------------------- */
function getTimerInputs() {
    const timer_input_element = document.getElementById("timer_input") as HTMLInputElement | null;
    const break_input_element = document.getElementById("break_input") as HTMLInputElement | null;

    if (!timer_input_element || !break_input_element) {
        console.error("Input elements not found!");
        return;
    }

    let timer_input = parseInt(timer_input_element.value);
    let break_input = parseInt(break_input_element.value);

    if (isNaN(timer_input) || timer_input <= 0) timer_input = 25;
    if (isNaN(break_input) || break_input <= 0) break_input = 5;

    if (timerMode === "work") {
        hours = Math.floor(timer_input / 60);
        minutes = timer_input % 60;
        seconds = 0;

    } else if (timerMode === "break") {
        hours = Math.floor(break_input / 60);
        minutes = break_input % 60;
        seconds = 0;
    }

    updateDisplay();
}

/* ---------------------------------------------------
   Timer starten
--------------------------------------------------- */
function startTimer() {
    if (timerRunning) return;

    timerRunning = true;

    timerInterval = setInterval(() => {
        updateTimer();
        checkTimerFinish();
    }, 1000);

    //console.log("Timer started!");
}

/* ---------------------------------------------------
   Timer stoppen
--------------------------------------------------- */
function pauseTimer() {
    if (!timerRunning) return;

    timerRunning = false;

    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    //console.log("Timer stopped!");
}

/* ---------------------------------------------------
   Timer zurücksetzen
--------------------------------------------------- */
function resetTimer() {
    pauseTimer();
    getTimerInputs();
}

/* ---------------------------------------------------
   Timer-Logik
--------------------------------------------------- */
function updateTimer() {
    if (!timerRunning) return;

    if (seconds === 0) {
        seconds = 59;
        minutes--;

        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
    } else {
        seconds--;
    }

    updateDisplay();
}

/* ---------------------------------------------------
   Anzeige formatieren
--------------------------------------------------- */
function updateDisplay() {
    if (!timerElement) return;

    timerElement.innerText =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/* Hilfsfunktion für führende Nullen */
function pad(n: number): string {
    return n < 10 ? "0" + n : n.toString();
}

/* ---------------------------------------------------
   Check: Fertig?
--------------------------------------------------- */
function checkTimerFinish() {
    if (hours === 0 && minutes === 0 && seconds === 0) {
        pauseTimer();
        switchTimer()
        //console.log("Time's up!");
    }
}

/* ---------------------------------------------------
   Timer wechseln
--------------------------------------------------- */
function switchTimer() {
    timerMode = timerMode === "work" ? "break" : "work";
    document.getElementById("current_mode")!.innerText = timerMode === "work" ? "Work" : "Break";
    //console.log(`Switched to ${timerMode} mode!`);
    resetTimer();
    if (autoStartBreakTimer?.checked) startTimer();
}