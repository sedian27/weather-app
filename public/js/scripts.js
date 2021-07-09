document.addEventListener("DOMContentLoaded", () => {
  const mainWeatherImg = document.getElementById("main-weather-img"),
    regionWeather = document.getElementById("region-weather"),
    weatherOfOthersDays = document.getElementById("weather-of-others-days"),
    windStatus = document.getElementById("wind-status"),
    humidity = document.getElementById("humidity"),
    percentage = document.getElementById("percentage"),
    visibility = document.getElementById("visibility"),
    airpressure = document.getElementById("air-pressure"),
    mainWeather = document.getElementById("main-weather"),
    btnSearch = document.getElementById("btn-search"),
    currentLocation = document.getElementById("current-location"),
    searchDiv = document.getElementById("search-div"),
    searchForm = document.getElementById("search"),
    inputText = document.getElementById("location"),
    buttonsSearch = document.getElementById("buttons-search"),
    closeSearch = document.getElementById("close-search");

  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    showAndHidden();
  });

  currentLocation.addEventListener("click", (e) => {
    e.preventDefault();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        getCurrentPosition(position.coords.latitude, position.coords.longitude);
      });
    }
  });

  closeSearch.addEventListener("click", (e) => {
    e.preventDefault();
    showAndHidden();
  });

  function showAndHidden() {
    if (searchDiv.classList.contains("hidden")) {
      searchDiv.classList.remove("hidden");
    } else {
      searchDiv.classList.add("hidden");
    }

    if (mainWeather.classList.contains("hidden")) {
      mainWeather.classList.remove("hidden");
    } else {
      mainWeather.classList.add("hidden");
    }
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    location(inputText.value);
  });

  buttonsSearch.addEventListener("click", (e) => {
    e.preventDefault();
    location(e.target.value);
  });

  let defaultLocation = "638242";

  async function getCurrentPosition(latitude, longitude) {
    await fetch(
      `https://api.allorigins.win/raw?url=https://www.metaweather.com/api/location/search/?lattlong=${latitude},${longitude}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          weather(data[0].woeid);
        }
      });
  }

  const location = async (search) => {
    await fetch(
      `https://api.allorigins.win/raw?url=https://www.metaweather.com/api/location/search/?query=${search}`
    )
      .then((res) => res.json())
      .then((locationData) => {
        if (locationData.length > 0) {
          weather(locationData[0].woeid);
          showAndHidden();
          inputText.value = "";
        } else {
        }
      });
  };

  const weather = async (location) => {
    fetch(
      `https://api.allorigins.win/raw?url=https://www.metaweather.com/api/location/${location}/`
    )
      .then((response) => response.json())
      .then((weatherData) => {
        nowWeather(weatherData.consolidated_weather[0], weatherData.title);
        othersDays(weatherData.consolidated_weather);
      });
  };

  weather(defaultLocation);

  function nowWeather(now, capital) {
    let date = new Date(now.applicable_date.split("-").join(","));
    mainWeatherImg.innerHTML = `
          <img
              src="public/weather-img/${now.weather_state_name.replace(
                / /g,
                ""
              )}.png"
              alt="${now.weather_state_name}"
              class="w-36 md:w-52"
            />
          `;
    regionWeather.innerHTML = `
        <p class="text-9xl text-right text-primary-font font-medium">
          ${Math.round(
            now.the_temp
          )}<span class="text-5xl text-secondary-font">°C</span>
        </p>
        <p class="py-6 text-4xl font-semibold">${now.weather_state_name}</p>
        <p>Today<span class="px-4"> • </span>${
          date.toLocaleString("en-US", { weekday: "short" }) +
          ". " +
          date.getDate() +
          " " +
          date.toLocaleDateString("en-US", { month: "short" })
        }</p>
        <div class="pt-8 items-center flex">
        <span class="material-icons"> place </span>
        <span>${capital}</span>
        </div>
        `;
    windStatus.innerHTML = `
        <p class="">Wind status</p>
          <p class="font-bold text-6xl pb-8">
            ${Math.round(
              now.wind_speed
            )}<span class="text-4xl font-medium">mph</span>
          </p>
    `;
    humidity.innerHTML = `
          <p class="">Humidity</p>
          <p class="font-bold text-6xl pb-8">
            ${now.humidity}<span class="text-4xl font-normal">%</span>
          </p>
    `;

    percentage.style.width = now.humidity + "%";

    visibility.innerHTML = `
          <p class="">Visibility</p>
          <p class="font-bold text-6xl">
            ${now.visibility.toFixed(1)}
            <span class="text-4xl font-medium"> miles</span>
          </p>
    `;

    airpressure.innerHTML = `
          <p class="">Air Pressure</p>
          <p class="font-bold text-6xl">
            ${now.air_pressure}<span class="text-4xl font-medium">mb</span>
          </p>
    `;
  }

  function othersDays(others) {
    let html = "";
    let date = "";
    for (let day in others) {
      ++day;
      date = new Date(others[day].applicable_date.split("-").join(","));
      if (day === 1) {
        html += `
        <div
        class="bg-primary w-30 h-44 flex flex-col justify-center items-center"
        >
        <p>Tomorrow</p>
        <img
        class="w-14 pt-3 pb-7"
        src="public/weather-img/${others[day].weather_state_name.replace(
          / /g,
          ""
        )}.png"
        alt="${others[day].weather_state_name}"
        />
        <span>${Math.round(
          others[day].max_temp
        )}°C<span class="text-secondary-font pl-4">${Math.round(
          others[day].min_temp
        )}°C</span></span>
        </div>
        `;
      } else {
        html += `
        <div
        class="bg-primary w-30 h-44 flex flex-col justify-center items-center"
        >
        <p>${date.toLocaleString("en-US", { weekday: "long" })}</p>
        <img
        class="w-14 pt-3 pb-7"
        src="public/weather-img/${others[day].weather_state_name.replace(
          / /g,
          ""
        )}.png"
        alt="${others[day].weather_state_name}"
        />
        <span>${Math.round(
          others[day].max_temp
        )}°C<span class="text-secondary-font pl-4">${Math.round(
          others[day].min_temp
        )}°C</span></span>
        </div>
        `;
      }
      if (day === 5) {
        weatherOfOthersDays.innerHTML = html;
        break;
      }
    }
  }
});
