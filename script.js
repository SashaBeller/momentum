"use strict";

// Selecting elements
let time = document.querySelector(".time");
let date = document.querySelector(".date");
let greeting = document.querySelector(".greeting");
let name = document.querySelector(".name");
let body = document.querySelector("body");
let slideNext = document.querySelector(".slide-next");
let slidePrev = document.querySelector(".slide-prev");
let weatherIcon = document.querySelector(".weather-icon");
let temperature = document.querySelector(".temperature");
let weatherDescription = document.querySelector(".weather-description");
let city = document.querySelector(".city");
let weatherError = document.querySelector(".weather-error");

// Time: hours, mins and secs
function showTime() {
  let date = new Date();
  let currentTime = date.toLocaleString();
  time.textContent = currentTime.substring(12);
  showDate();
  setTimeout(showTime, 1000);
}
showTime();

// TIme: date
function showDate() {
  const data = new Date();
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekdays[data.getDay()];
  let options = {
    month: "long",
    day: "numeric",
  };
  const currentDate = data.toLocaleDateString("en-En", options);
  date.textContent = day + ", " + currentDate;
  setTimeout(showDate, 1000);
}
// showDate();

// Greeting
let curDate = new Date();
let hours = curDate.getHours();

function getTimeOfDay() {
  if (hours >= 6 && hours < 12) {
    return `morning`;
  } else if (hours >= 12 && hours < 18) {
    return `afternoon`;
  } else if (hours >= 18 && hours <= 23) {
    return `evening`;
  } else {
    return `night`;
  }
}

function showGreeting() {
  let greetingText = `Good ${getTimeOfDay()}`;
  greeting.textContent = greetingText;
}
showGreeting();

// Save greeting into local storage

function setLocalStorage() {
  let name = document.querySelector(".name");
  localStorage.setItem("name", name.value);
}
window.addEventListener("beforeunload", setLocalStorage);
function getLocalStorage() {
  let name = document.querySelector(".name");
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
}
window.addEventListener("load", getLocalStorage);

// Setting the background pic
let randomNum;
function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
randomNum = getRandomNum(1, 21).toString();
randomNum = randomNum.length == 1 ? 0 + randomNum : randomNum;

function setBG() {
  const img = new Image();
  let timeOfDay = getTimeOfDay();
  let url = `https://raw.githubusercontent.com/SashaBeller/stage1-tasks/assets/images/${timeOfDay}/${randomNum}.jpg`;
  img.src = url;
  img.onload = () => {
    body.style.backgroundImage = `url(${url})`;
  };
}
setBG();

// right amd left buttons
function getSlideNext() {
  console.log(randomNum);
  if (randomNum >= 1 && randomNum < 9) {
    randomNum = "0" + (Number(randomNum) + 1);
    return setBG();
  } else if (randomNum >= 9 && randomNum < 20) {
    randomNum = Number(randomNum) + 1;
    return setBG();
  } else {
    randomNum = "01";
    return setBG();
  }
}

function getSlidePrev() {
  if (randomNum >= 2 && randomNum <= 10) {
    randomNum = "0" + (Number(randomNum) - 1);
    return setBG();
  } else if (randomNum >= 11 && randomNum <= 20) {
    randomNum = Number(randomNum) - 1;
    return setBG();
  } else {
    randomNum = 20;
    return setBG();
  }
}
slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);

// Weather widget

function setLocalStorageCity() {
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorageCity);

function getLocalStorageCity() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
    getWeather();
  } else {
    city.value = "Minsk";
    getWeather();
  }
}
window.addEventListener("load", getLocalStorageCity);

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=2a6b8dde53d04ed7e56e86a1c7a9cc78&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (res.status == 404 || res.status == 400) {
    weatherIcon.style.display = "none";
    weatherDescription.style.display = "none";
    temperature.style.display = "none";
    weatherError.style.display = "block";
    weatherError.textContent =
      "Error: " + data.message + " for " + `'${city.value}'`;
  } else {
    weatherIcon.style.display = "block";
    weatherDescription.style.display = "block";
    temperature.style.display = "block";
    weatherIcon.className = "weather-icon owf";
    weatherError.style.display = "none";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C ${
      data.weather[0].description
    }`;
    weatherDescription.textContent = `Wind speed: ${Math.floor(
      data.wind.speed
    )} m/s Humidity: ${data.main.humidity}%`;
  }
}
// getWeather();

city.addEventListener("change", function () {
  getWeather();
});
