addEventListener("DOMContentLoaded", function () {
    initTimer();
});
document.addEventListener("input", function (e) {
    if (e.target instanceof HTMLInputElement && e.target.type === "number") {
        pauseTimer();
        getTimerInputs();
    }
});
/* ---------------------------------------------------
   Variablen
--------------------------------------------------- */
var timerRunning = false;
var timerElement = document.getElementById("timer_element");
var autoStartBreakTimer = document.getElementById("autoplay");
var timerMode = "work";
var hours = 0;
var minutes = 0;
var seconds = 0;
var timerInterval = null;
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
    var timer_input_element = document.getElementById("timer_input");
    var break_input_element = document.getElementById("break_input");
    if (!timer_input_element || !break_input_element) {
        console.error("Input elements not found!");
        return;
    }
    var timer_input = parseInt(timer_input_element.value);
    var break_input = parseInt(break_input_element.value);
    if (isNaN(timer_input) || timer_input <= 0)
        timer_input = 25;
    if (isNaN(break_input) || break_input <= 0)
        break_input = 5;
    if (timerMode === "work") {
        hours = Math.floor(timer_input / 60);
        minutes = timer_input % 60;
        seconds = 0;
    }
    else if (timerMode === "break") {
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
    if (timerRunning)
        return;
    timerRunning = true;
    timerInterval = setInterval(function () {
        updateTimer();
        checkTimerFinish();
    }, 1000);
    //console.log("Timer started!");
}
/* ---------------------------------------------------
   Timer stoppen
--------------------------------------------------- */
function pauseTimer() {
    if (!timerRunning)
        return;
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
    if (!timerRunning)
        return;
    if (seconds === 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
    }
    else {
        seconds--;
    }
    updateDisplay();
}
/* ---------------------------------------------------
   Anzeige formatieren
--------------------------------------------------- */
function updateDisplay() {
    if (!timerElement)
        return;
    timerElement.innerText =
        "".concat(pad(hours), ":").concat(pad(minutes), ":").concat(pad(seconds));
}
/* Hilfsfunktion für führende Nullen */
function pad(n) {
    return n < 10 ? "0" + n : n.toString();
}
/* ---------------------------------------------------
   Check: Fertig?
--------------------------------------------------- */
function checkTimerFinish() {
    if (hours === 0 && minutes === 0 && seconds === 0) {
        pauseTimer();
        switchTimer();
        //console.log("Time's up!");
    }
}
/* ---------------------------------------------------
   Timer wechseln
--------------------------------------------------- */
function switchTimer() {
    timerMode = timerMode === "work" ? "break" : "work";
    document.getElementById("current_mode").innerText = timerMode === "work" ? "Work" : "Break";
    //console.log(`Switched to ${timerMode} mode!`);
    resetTimer();
    if (autoStartBreakTimer === null || autoStartBreakTimer === void 0 ? void 0 : autoStartBreakTimer.checked)
        startTimer();
}
