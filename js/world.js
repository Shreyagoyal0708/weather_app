let apiKey = "a2e98ad0a8946479550d1937532d06f3";
let searchinput = document.querySelector(".searchinput");
let box = document.querySelector(".box");
let normalMessage = document.querySelector(".normal-message");
let errorMessage = document.querySelector(".error-message");
let addedMessage = document.querySelector(".added-message");

// Set current date
let date = new Date().getDate();
let months_name = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let months = new Date().getMonth();
let year = new Date().getFullYear();

let FullDate = document.querySelector(".date");
FullDate.innerHTML = `${months_name[months]} ${date}, ${year}`;

// Get weather for a city
async function city(cityName) {
  let url = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
  );

  if (url.ok) {
    let data = await url.json();
    console.log(data);

    let cityBox = document.querySelector(".city-box");

    if (!box) {
      box = document.createElement("div");
      box.className = "box";
      cityBox.appendChild(box);
    }

    let weatherBox = document.createElement("div");
    weatherBox.className = "weather-box";
    weatherBox.style.position = "relative"; // Needed for delete button

    let nameDiv = document.createElement("div");
    nameDiv.className = "name";

    let cityElement = document.createElement("div");
    cityElement.className = "city-name city";
    cityElement.innerHTML = data.name;

    let tempElement = document.createElement("div");
    tempElement.className = "weather-temp temp";
    tempElement.innerHTML = Math.floor(data.main.temp) + "°";

    let weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "weather-icon";

    let weatherImg = document.createElement("img");
    weatherImg.className = "weather";

    switch (data.weather[0].main) {
      case "Rain":
        weatherImg.src = "img/rain.png"; break;
      case "Clear":
      case "Clear Sky":
        weatherImg.src = "img/sun.png"; break;
      case "Snow":
        weatherImg.src = "img/snow.png"; break;
      case "Clouds":
      case "Smoke":
        weatherImg.src = "img/cloud.png"; break;
      case "Mist":
      case "Fog":
        weatherImg.src = "img/mist.png"; break;
      case "Haze":
        weatherImg.src = "img/haze.png"; break;
      case "Thunderstorm":
        weatherImg.src = "img/thunderstorm.png"; break;
      default:
        weatherImg.src = "img/sun.png";
    }

    weatherIconDiv.appendChild(weatherImg);
    nameDiv.appendChild(cityElement);
    nameDiv.appendChild(tempElement);
    weatherBox.appendChild(nameDiv);
    weatherBox.appendChild(weatherIconDiv);

    // ❌ Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "❌";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "10px";
    deleteBtn.style.right = "10px";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "transparent";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.fontSize = "16px";
    deleteBtn.style.color = "red";

    deleteBtn.addEventListener("click", () => {
      weatherBox.remove();
      let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
      let updatedCities = savedCities.filter(c => c.toLowerCase() !== data.name.toLowerCase());
      localStorage.setItem("cities", JSON.stringify(updatedCities));
    });

    weatherBox.appendChild(deleteBtn);
    box.appendChild(weatherBox);

    return weatherBox;

  } else {
    return "";
  }
}

// Toggle add section
let section = document.querySelector(".add-section");
let navBtn = document.querySelector(".button");
let navIcon = document.querySelector(".btn-icon");

navBtn.addEventListener("click", () => {
  if (section.style.top === "-60rem") {
    section.style.top = "100px";
    navIcon.className = "fa-solid fa-circle-xmark";
  } else {
    section.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus";
  }
});

// Handle search input
searchinput.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    const cityName = searchinput.value.trim();
    if (!cityName) return;

    // Check localStorage
    let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!savedCities.includes(cityName)) {
      savedCities.push(cityName);
      localStorage.setItem("cities", JSON.stringify(savedCities));
    }

    // Check for duplicate in UI
    const existingCities = document.querySelectorAll(".city-name");
    let alreadyExists = Array.from(existingCities).some(el => el.innerText.toLowerCase() === cityName.toLowerCase());

    if (alreadyExists) {
      addedMessage.style.display = "none";
      errorMessage.style.display = "block";
      errorMessage.innerText = "City already added!";
      return;
    }

    const weatherInfo = await city(cityName);
    if (weatherInfo) {
      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";
      box.prepend(weatherInfo);
    } else {
      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";
    }

    searchinput.value = "";
  }
});

// 🔁 Load saved cities on page load
window.addEventListener("DOMContentLoaded", () => {
  let savedCities = JSON.parse(localStorage.getItem("cities")) || [];
  savedCities.forEach(async (cityName) => {
    const weatherInfo = await city(cityName);
    if (weatherInfo) {
      box.prepend(weatherInfo);
    }
  });
});
