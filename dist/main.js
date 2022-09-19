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
searchInput.addEventListener('input', renderResult);
regionSelect.addEventListener('change', renderResult);
backButton.addEventListener('click', showHome);

firstCardsRender();

async function firstCardsRender() {
  countriesData = await getData();
  const cards = getCards(countriesData);

  cardsContainer.append(...cards);
}

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
        <p>Population: <span>${population.toLocaleString()}</span></p>
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

function renderResult() {
  const countriesFound = search(countriesData, searchInput.value, regionSelect.value);
  const isNoResult = countriesFound.length === 0;

  if (isNoResult) {
    cardsContainer.innerHTML = `No results found...`;
    return;
  }

  const cards = getCards(countriesFound);
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

function getCards(countries = []) {
  const cards = [];

  for (const country of countries) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.countryName = country.name.official;
    card.addEventListener('click', renderCardDescription);

    const imageContainer = document.createElement('picture');

    const image = document.createElement('img');
    image.classList.add('card__img');
    image.setAttribute('src', country.flags.png);
    image.setAttribute('alt', `${country.name.official} flag`);

    imageContainer.appendChild(image);

    const info = document.createElement('div');
    info.classList.add('card__info');

    const name = document.createElement('h2');
    const population = document.createElement('p');
    const region = document.createElement('p');
    const capital = document.createElement('p');

    name.textContent = country.name.official;
    population.innerHTML = `<span>Population:</span> ${country.population.toLocaleString()}`;
    region.innerHTML = `<span>Region:</span> ${country.region}`;
    capital.innerHTML = `<span>Capital:</span> ${country.capital}`;

    info.append(name, population, region, capital);

    card.append(imageContainer, info);

    cards.push(card);
  }

  return cards;
}