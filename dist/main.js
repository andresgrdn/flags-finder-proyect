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
  searchContainer.classList.add('hide');
  cardsContainer.classList.add('hide');

  cardDetailsContainer.classList.remove('hide');
}

function showHome() {
  toggle(cardDetailsContainer, 'hide');
  toggle(searchContainer, 'hide');
  toggle(cardsContainer, 'hide');
}

function renderDescription(event) {
  const card = event.currentTarget;

  const country = countriesData.find(country => {
    return country.name.official === card.name;
  });

  const description = document.createElement('div');
  const flagImage = document.createElement('img');
  const infoContainer = document.createElement('div');
  const name = document.createElement('h2');
  const leftSection = document.createElement('div');
  const nativeName = document.createElement('p');
  const population = document.createElement('p');
  const region = document.createElement('p');
  const subRegion = document.createElement('p');
  const capital = document.createElement('p');
  const rightSection = document.createElement('div');
  const topLevelDomain = document.createElement('p');
  const currencies = document.createElement('p');
  const languages = document.createElement('p');
  const bottomSection = document.createElement('div');
  const borderCountriesLabel = document.createElement('p');
  const borderCountriesLinks = document.createElement('ul');

  description.classList.add('details-container');
  flagImage.classList.add('card__img');
  flagImage.setAttribute('src', country.flags.png);
  flagImage.setAttribute('alt', `${country.name.official} flag`);

  infoContainer.classList.add('card__details');
  name.classList.add('card__title');
  name.textContent = country.name.official;

  leftSection.classList.add('left-section');
  nativeName.innerHTML = `Native Name: <span>${country.name.common}</span>`;
  population.innerHTML = `Population: <span>${country.population.toLocaleString()}</span>`;
  region.innerHTML = `Region: <span>${country.region}</span>`;
  subRegion.innerHTML = `Sub Region: <span>${country.subregion}</span>`;
  capital.innerHTML = `Capital: <span>${country.capital}</span>`;

  rightSection.classList.add('right-section');
  topLevelDomain.innerHTML = `Top Level Domain: <span>${country.tld}</span>`;

  const currNames = Object.entries(country.currencies);
  const currArray = [];
  currNames.forEach(currName => {
    currArray.push(`<span>${currName[1].symbol} ${currName[0]} ${currName[1].name}</span>`);
  })
  currencies.innerHTML = `Currencies: ${currArray.join(', ')}`;

  const langNames = Object.entries(country.languages);
  const langArray = [];
  langNames.forEach(langName => {
    langArray.push(`<span>${langName[0]} ${langName[1]}</span>`);
  })
  languages.innerHTML = `Languages: ${langArray.join(', ')}`;

  bottomSection.classList.add('bottom-section');
  borderCountriesLabel.textContent = country.borders ? 'Border Countries:' : '';
  borderCountriesLinks.classList.add('countries-links');

  /* Border links */

  const borders = searchByCCA3(countriesData, country.borders);

  borders.forEach(border => {
    const borderContainer = document.createElement('li');
    const borderButton = document.createElement('button');

    borderButton.name = border.name.official;
    borderButton.setAttribute('type', 'button');
    borderButton.textContent = border.name.common;
    borderButton.addEventListener('click', renderDescription);

    borderContainer.appendChild(borderButton);
    borderCountriesLinks.appendChild(borderContainer);
  })

  /* Border links */

  description.append(flagImage, infoContainer);

  infoContainer.append(name, leftSection, rightSection, bottomSection);

  leftSection.append(nativeName, population, region, subRegion, capital);
  rightSection.append(topLevelDomain, currencies, languages);
  bottomSection.append(borderCountriesLabel, borderCountriesLinks);

  if (cardDetailsContainer.childElementCount > 1) {
    cardDetailsContainer.lastElementChild.replaceWith(description);
  } else {
    cardDetailsContainer.appendChild(description);
  }

  openCountryDescription();
}

function searchByCCA3(data = [], cca3Array = []) {
  const result = cca3Array.map(cca3 => {
    const cca3Found = data.find(country => {
      return country.cca3.toLowerCase() === cca3.toLowerCase();
    })
    return cca3Found;
  })

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
      return country.name.official.toLowerCase().includes(query.toLowerCase())
    });
  }

  return result;
}

function getCards(countries = []) {
  const cards = [];

  for (const country of countries) {
    const card = document.createElement('div');
    const imageContainer = document.createElement('picture');
    const image = document.createElement('img');
    const info = document.createElement('div');
    const name = document.createElement('h2');
    const population = document.createElement('p');
    const region = document.createElement('p');
    const capital = document.createElement('p');

    card.classList.add('card');
    card.name = country.name.official;
    card.addEventListener('click', renderDescription);

    image.classList.add('card__img');
    image.setAttribute('src', country.flags.png);
    image.setAttribute('alt', `${country.name.official} flag`);
    image.setAttribute('loading', 'lazy');

    info.classList.add('card__info');

    name.textContent = country.name.official;
    population.innerHTML = `<span>Population:</span> ${country.population.toLocaleString()}`;
    region.innerHTML = `<span>Region:</span> ${country.region}`;
    capital.innerHTML = `<span>Capital:</span> ${country.capital}`;

    imageContainer.appendChild(image);
    info.append(name, population, region, capital);
    card.append(imageContainer, info);

    cards.push(card);
  }

  return cards;
}