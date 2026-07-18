import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputPicker = document.querySelector("#datetime-picker");
const startBtn = document.querySelector("button[data-start]");
const displayDays = document.querySelector("[data-days]");
const displayHours = document.querySelector("[data-hours]");
const displayMinutes = document.querySelector("[data-minutes]");
const displaySeconds = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(inputPicker, options);

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  inputPicker.disabled = true;

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);
      inputPicker.disabled = false;
      return;
    }

    const timeComponents = convertMs(diff);
    updateTimerDisplay(
      timeComponents.days,
      timeComponents.hours,
      timeComponents.minutes,
      timeComponents.seconds
    );
  }, 1000);
});

function updateTimerDisplay(days, hours, minutes, seconds) {
  displayDays.textContent = addLeadingZero(days);
  displayHours.textContent = addLeadingZero(hours);
  displayMinutes.textContent = addLeadingZero(minutes);
  displaySeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}