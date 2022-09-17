/* Helpers */

const API = 'https://restcountries.com/v3.1/';

async function getData() {
  try {
    const response = await fetch(`${API}/all`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

function toggle(element, style) {
  element.classList.toggle(style);
}

/* Main logic */

const cardsContainer = document.querySelector('.cards-container');
const searchIcon = document.querySelector('.search-bar__icon');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const themeButton = document.getElementById('themeButton');
const themeButtonIcon = document.querySelector('.theme-button__icon');
const themeButtonText = document.querySelector('.theme-button__text');
const searchContainer = document.getElementById('searchContainer');
const cardDetailsContainer = document.getElementById('cardDetailsContainer');
const backButton = document.getElementById('backButton');
const backButtonIcon = document.querySelector('.back-button__icon');

let countriesData;

themeButton.addEventListener('click', changeTheme);
searchInput.addEventListener('input', renderSearchResult);
regionSelect.addEventListener('change', renderFilterResult);
backButton.addEventListener('click', showHome);

firstCardsRender();

async function firstCardsRender() {
  countriesData = await getData();
  const cards = buildCards(countriesData);

  cardsContainer.append(...cards);
}

function card(flagImage, flagName, population, region, capital) {
  const classes = ['card'];
  const container = document.createElement('div');
  const view = `
    <picture>
      <img class="card__img" src="${flagImage}" alt="${flagName} flag">
    </picture>
    
    <div class="card__info">
      <h2>${flagName}</h2>
      <p><span>Population:</span> ${population}</p>
      <p><span>Region:</span> ${region}</p>
      <p><span>Capital:</span> ${capital}</p>
    </div>
  `;

  container.countryName = flagName;
  container.classList.add(...classes);
  container.innerHTML = view;

  container.addEventListener('click', renderCardDescription);

  return container;
};

function openCountryDescription() {
  toggle(cardDetailsContainer, 'hide');
  toggle(searchContainer, 'hide');
  toggle(cardsContainer, 'hide');
}

function showHome() {
  toggle(cardDetailsContainer, 'hide');
  toggle(searchContainer, 'hide');
  toggle(cardsContainer, 'hide');
}

function buildCards(countriesData) {
  const cardsHTML = countriesData.map(country => {
    return card(
      country.flags.png,
      country.name.official,
      country.population,
      country.region,
      country.capital
    );
  });

  return cardsHTML;
}

function cardDescription(
  flagImage,
  countryName,
  countyNativeName,
  population,
  region,
  subRegion,
  capital,
  topDomain,
  currencies,
  languages,
  borderCountries = []) {
  const container = document.createElement('div');
  container.classList.add('details-container');

  const view = `
    <img class="card__img" src="${flagImage}" alt="${countryName}">

    <div class="card__details">
      <h2 class="card__title">${countryName}</h2>

      <div class="left-section">
        <p>Native Name: <span>${countyNativeName}</span></p>
        <p>Population: <span>${population}</span></p>
        <p>Region: <span>${region}</span></p>
        <p>Sub Region: <span>${subRegion}</span></p>
        <p>Capital: <span>${capital}</span></p>
      </div>

      <div class="right-section">
        <p>Top Level Domain: <span>${topDomain}</span></p>
        <p>Currencies: <span>${currencies}</span></p>
        <p>Languages: <span>${languages}</span></p>
      </div>

      <div class="bottom-section">
        <p>Border Countries:</p>
        <ul class="countries-links">
          ${(borderCountries.map(country => {
    return searchByCCA3(countriesData, country)
  })).join(' ')}
          <li><button type="button">France</button></li>
        </ul>
      </div>
    </div>
  `;

  container.innerHTML = view;

  return container;
}

function renderCardDescription(event) {
  const container = event.currentTarget;

  const countryInfo = countriesData.find(country => {
    return country.name.official === container.countryName;
  });

  const newCardDescription = cardDescription(
    countryInfo.flags.png,
    countryInfo.name.official,
    countryInfo.name.common,
    countryInfo.population,
    countryInfo.region,
    countryInfo.subregion,
    countryInfo.capital,
    countryInfo.tld,
    countryInfo.currencies,
    countryInfo.languages,
    countryInfo.borders
  );

  if (cardDetailsContainer.childElementCount > 1) {
    cardDetailsContainer.lastElementChild.replaceWith(newCardDescription);
  } else {
    cardDetailsContainer.appendChild(newCardDescription);
  }

  openCountryDescription();
}

function searchByCCA3(data, query) {
  const lowerCaseQuery = query.toLowerCase();

  const result = data.filter(country => {
    return country.cca3.toLowerCase()
      .includes(lowerCaseQuery);
  });

  return result;
}

function renderSearchResult() {
  const countriesFound = search(countriesData, searchInput.value, regionSelect.value);
  const isNoResult = countriesFound.length === 0;

  if (isNoResult) {
    cardsContainer.innerHTML = `No results found...`;
    return;
  }

  const cards = buildCards(countriesFound);
  cardsContainer.replaceChildren(...cards);
}

function renderFilterResult() {
  const filteredCountries = search(
    countriesData,
    searchInput.value,
    regionSelect.value
  );
  const isNoResult = filteredCountries.length === 0;

  if (isNoResult) {
    cardsContainer.innerHTML = `No results found...`;
    return;
  }

  const cards = buildCards(filteredCountries);
  cardsContainer.replaceChildren(...cards);
}

function changeTheme() {
  document.body.classList.toggle('light-mode');
}

function search(data = [], query = '', filter = '') {
  let result = data;

  if (filter) {
    result = data.filter(country => country.region.toLowerCase() === filter);
  }

  if (query) {
    result = result.filter(country => {
      return country.name.official.toLowerCase().includes(query)
    });
  }

  return result;
}