import {
  SERVER,
  getCityName,
  addToList,
  favoriteCities,
  deleteCity,
  convertTime,
  convertDate
} from "./main.js";

import {
  storeFavoriteCities
} from "./storage.js";

export const UI_ELEMENTS = {
  FORM: document.querySelector('.header-form'),
  INPUT: document.querySelector('.header-input'),
  CURRENT_WEATHER: {
    TEMPERATURE: document.querySelector('.main__block-info-now-temper'),
    WEATHER_ICON: document.querySelector('.main__block-info-now-weather-img'),
    CITY: document.querySelector('.city'),
    LIKE_BUTTON: document.querySelector('.like-city'),
  },
  FAVOURITES: {
    CITIES_LIST: document.querySelector('.main__block-locations-list-items'),
  },
  DETAILS: {
    CITY: document.querySelector('.main__block-details-city'),
    TEMPERATURE: document.querySelector('.weather-temperature'),
    FEELS_LIKE: document.querySelector('.weather-feels'),
    WEATHER: document.querySelector('.weather-weather'),
    SUNRISE: document.querySelector('.weather-sunrise'),
    SUNSET: document.querySelector('.weather-sunset'),
  },
  FORECAST: {
    CITY: document.querySelector('.city--dop-px'),
    CONTENT: document.querySelector('.forecast__content'),
    ITEM_TEMPLATE: document.querySelector('.template'),
  }
}

UI_ELEMENTS.FORM.addEventListener('submit', event => {
  event.preventDefault();
  getCityName();
  clearInput();
});

UI_ELEMENTS.CURRENT_WEATHER.LIKE_BUTTON.addEventListener('click', event => {
  addToFavorites(UI_ELEMENTS.CURRENT_WEATHER.CITY.textContent);
});

function clearInput() {
  UI_ELEMENTS.INPUT.value = '';
}

export function showCityData(cityData) {
  const units = '°';
  const cityName = cityData.name;
  const currentTemperature = `${Math.floor(cityData.main.temp)}${units}`
  const feelsLike = `Feels like: ${Math.floor(cityData.main.feels_like)}${units}`;
  const weatherIcon = cityData.weather[0].icon;
  const weatherIconURL = `${SERVER.IMAGE_URL}${weatherIcon}@2x.png`;
  const weather = `Weather: ${cityData.weather[0].main}`;
  const sunrise = `Sunrise: ${convertTime(cityData.sys.sunrise)}`;
  const sunset = `Sunset: ${convertTime(cityData.sys.sunset)}`;

  UI_ELEMENTS.CURRENT_WEATHER.CITY.textContent = cityName;
  UI_ELEMENTS.CURRENT_WEATHER.TEMPERATURE.textContent = currentTemperature;
  UI_ELEMENTS.CURRENT_WEATHER.WEATHER_ICON.src = weatherIconURL;
  UI_ELEMENTS.CURRENT_WEATHER.WEATHER_ICON.classList.add('img');

  UI_ELEMENTS.DETAILS.CITY.textContent = cityName;
  UI_ELEMENTS.DETAILS.TEMPERATURE.textContent = `Temperature: ${currentTemperature}`;
  UI_ELEMENTS.DETAILS.FEELS_LIKE.textContent = feelsLike;
  UI_ELEMENTS.DETAILS.WEATHER.textContent = weather;
  UI_ELEMENTS.DETAILS.SUNRISE.textContent = sunrise;
  UI_ELEMENTS.DETAILS.SUNSET.textContent = sunset;
}

export function showForecast(cityData) {
  clearForecastTab();
  const cityName = cityData.city.name;
  const forecastList = cityData.list;
  UI_ELEMENTS.FORECAST.CITY.textContent = cityName;
  forecastList.forEach(forecastData => {
    console.log(forecastData);
    createForecastItem(forecastData);
  });
}

function clearForecastTab() {
  UI_ELEMENTS.FORECAST.CONTENT.innerHTML = '';
}

function createForecastItem(forecastData) {
  const forecastItem = UI_ELEMENTS.FORECAST.ITEM_TEMPLATE.content.cloneNode(true);
  showItemData(forecastData, forecastItem);
  addForecastItem(forecastItem);
}

function addForecastItem(forecastItem) {
  UI_ELEMENTS.FORECAST.CONTENT.append(forecastItem);
}

function showItemData(forecastData, forecastItem) {
  const date = convertDate(forecastData.dt);
  const time = convertTime(forecastData.dt);
  const units = '°';
  const temperature = `Temperature: ${Math.floor(forecastData.main.temp)}${units}`;
  const feelsLike = `Feels like: ${Math.floor(forecastData.main.feels_like)}${units}`;
  const condition = forecastData.weather[0].main;
  const conditionIcon = forecastData.weather[0].icon;
  const conditionIconURL = `${SERVER.IMAGE_URL}${conditionIcon}@2x.png`;

  const FORECAST_ITEM = {
    DATE: forecastItem.querySelector('.main__block-forecast-date'),
    TIME: forecastItem.querySelector('.main__block-forecast-hour'),
    TEMPERATURE: forecastItem.querySelector('.temp'),
    FEELS_LIKE: forecastItem.querySelector('.feels-like'),
    CONDITION: forecastItem.querySelector('.forecast__condition-pain'),
    CONDITION_ICON: forecastItem.querySelector('.forecast__condition-pain-img')
  }

  FORECAST_ITEM.DATE.textContent = date;
  FORECAST_ITEM.TIME.textContent = time;
  FORECAST_ITEM.TEMPERATURE.textContent = temperature;
  FORECAST_ITEM.FEELS_LIKE.textContent = feelsLike;
  FORECAST_ITEM.CONDITION.textContent = condition;
  FORECAST_ITEM.CONDITION_ICON.src = conditionIconURL;
  FORECAST_ITEM.CONDITION_ICON.classList.add('condition-icon');
}

export function addToFavorites(cityName) {
  const isInList = favoriteCities.has(cityName);

  if (!isInList) {
    addToList(cityName);
    storeFavoriteCities(favoriteCities);

    const cityBox = document.createElement('div');
    const cityLink = document.createElement('a');
    const deleteButton = document.createElement('span');

    showInList(cityName, cityBox, cityLink, deleteButton);
    addListeners(cityName, cityLink, deleteButton, cityBox)
  }
}

function showInList(cityName, cityBox, cityLink, deleteButton) {
  cityBox.classList.add('main__block-locations-item');
  cityLink.classList.add('main__block-locations-item-link');
  deleteButton.classList.add('delete-button');

  cityLink.textContent = cityName;

  UI_ELEMENTS.FAVOURITES.CITIES_LIST.append(cityBox);
  cityBox.append(cityLink);
  cityBox.append(deleteButton);
}

function deleteCityFromUI(cityBox) {
  cityBox.remove();
}

function addListeners(cityName, cityLink, deleteButton, cityBox) {
  cityLink.addEventListener('click', event => {
    clearInput();
    getCityName(event);
  });

  deleteButton.addEventListener('click', () => {
    deleteCity(cityName);
    deleteCityFromUI(cityBox);
  });
}