export function storeCurrentCity(cityName) {
  localStorage.setItem('currentCity', cityName);
}

export function getCurrentCity() {
  const currentCity = localStorage.getItem('currentCity');
  return currentCity;
}

export function storeFavoriteCities(citiesList) {
  localStorage.setItem('favoriteCities', JSON.stringify([...citiesList]));
}

export function getFavoriteCities() {
  const citiesList = JSON.parse(localStorage.getItem('favoriteCities'));
  return citiesList;
}
