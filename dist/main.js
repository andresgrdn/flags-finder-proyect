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
  cardDetailsContainer.classList.add('hide');

  searchContainer.classList.remove('hide');
  cardsContainer.classList.remove('hide');

}

function renderDescription(event) {
  const card = event.currentTarget;
  const country = countriesData.find(country => country.name.official === card.name);
  const { flags, name, population, region, subregion,
    capital, tld, currencies, languages, borders } = country;

  const description = document.createElement('div');
  const flagImage = document.createElement('img');
  const infoContainer = document.createElement('div');
  const nameElement = document.createElement('h2');
  const leftSection = document.createElement('div');
  const nativeName = document.createElement('p');
  const populationElement = document.createElement('p');
  const regionElement = document.createElement('p');
  const subRegionElement = document.createElement('p');
  const capitalElement = document.createElement('p');
  const rightSection = document.createElement('div');
  const topLevelDomain = document.createElement('p');
  const currenciesElement = document.createElement('p');
  const languagesElement = document.createElement('p');
  const bottomSection = document.createElement('div');
  const borderCountriesLabel = document.createElement('p');
  const borderCountriesLinks = document.createElement('ul');

  description.classList.add('details-container');
  flagImage.classList.add('card__img');
  flagImage.setAttribute('src', flags.png);
  flagImage.setAttribute('alt', `${name.official} flag`);

  infoContainer.classList.add('card__details');
  nameElement.classList.add('card__title');
  nameElement.textContent = name.official;

  leftSection.classList.add('left-section');
  nativeName.innerHTML = `Native Name: <span>${name.common}</span>`;
  populationElement.innerHTML = `Population: <span>${population.toLocaleString()}</span>`;
  regionElement.innerHTML = `Region: <span>${region}</span>`;
  subRegionElement.innerHTML = `Sub Region: <span>${subregion}</span>`;
  capitalElement.innerHTML = `Capital: <span>${capital}</span>`;

  rightSection.classList.add('right-section');
  topLevelDomain.innerHTML = `Top Level Domain: <span>${tld}</span>`;

  const currNames = Object.entries(currencies);
  const currArray = [];
  currNames.forEach(currName => {
    currArray.push(`<span>${currName[1].symbol} ${currName[0]} ${currName[1].name}</span>`);
  })
  currenciesElement.innerHTML = `Currencies: ${currArray.join(', ')}`;

  const langNames = Object.entries(languages);
  const langArray = [];
  langNames.forEach(langName => {
    langArray.push(`<span>${langName[0]} ${langName[1]}</span>`);
  })
  languagesElement.innerHTML = `Languages: ${langArray.join(', ')}`;

  bottomSection.classList.add('bottom-section');
  borderCountriesLabel.textContent = borders ? 'Border Countries:' : '';
  borderCountriesLinks.classList.add('countries-links');

  /* Border links */

  const bordersData = searchByCCA3(countriesData, borders);

  bordersData.forEach(border => {
    const { name } = border;

    const borderContainer = document.createElement('li');
    const borderButton = document.createElement('button');

    borderButton.name = name.official;
    borderButton.setAttribute('type', 'button');
    borderButton.textContent = name.common;
    borderButton.addEventListener('click', renderDescription);

    borderContainer.appendChild(borderButton);
    borderCountriesLinks.appendChild(borderContainer);
  })

  /* Border links */

  description.append(flagImage, infoContainer);

  infoContainer.append(nameElement, leftSection, rightSection, bottomSection);

  leftSection.append(nativeName, populationElement, regionElement, subRegionElement, capitalElement);
  rightSection.append(topLevelDomain, currenciesElement, languagesElement);
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
    const { name, flags, population, region, capital } = country;

    const cardElement = document.createElement('div');
    const imageContainerElement = document.createElement('picture');
    const imageElement = document.createElement('img');
    const infoElement = document.createElement('div');
    const nameElement = document.createElement('h2');
    const populationElement = document.createElement('p');
    const regionElement = document.createElement('p');
    const capitalElement = document.createElement('p');

    cardElement.classList.add('card');
    cardElement.name = name.official;
    cardElement.addEventListener('click', renderDescription);

    imageElement.classList.add('card__img');
    imageElement.setAttribute('src', flags.png);
    imageElement.setAttribute('alt', `${name.official} flag`);
    imageElement.setAttribute('loading', 'lazy');

    infoElement.classList.add('card__info');

    nameElement.textContent = name.official;
    populationElement.innerHTML = `<span>Population:</span> ${population.toLocaleString()}`;
    regionElement.innerHTML = `<span>Region:</span> ${region}`;
    capitalElement.innerHTML = `<span>Capital:</span> ${capital}`;

    imageContainerElement.appendChild(imageElement);
    infoElement.append(nameElement, populationElement, regionElement, capitalElement);
    cardElement.append(imageContainerElement, infoElement);

    cards.push(cardElement);
  }

  return cards;
}