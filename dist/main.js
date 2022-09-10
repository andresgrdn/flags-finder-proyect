const flagsContainer = document.getElementById('flagsContainer');
const searchIcon = document.querySelector('.search-bar__icon');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const themeButton = document.getElementById('themeButton');
const themeButtonIcon = document.querySelector('.theme-button__icon');
const themeButtonText = document.querySelector('.theme-button__text');
const searchContainer = document.getElementById('searchContainer');
const cardDetailsContainer = document.getElementById('cardDetailsContainer');
const backButton = document.getElementById('backButton');

let flagsData;

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

getData()
  .then(data => {
    flagsData = data;

    const cardsHtmlElements = buildCards(flagsData);
    flagsContainer.append(...cardsHtmlElements);
  })
  .catch(error => console.error(error));


searchInput.addEventListener('input', () => {
  const searchResults = searchByName(flagsData, searchInput.value);

  if (searchResults.length === 0) {
    flagsContainer.innerHTML = `No results found...`;

    return;
  }

  const searchedCards = buildCards(searchResults);
  flagsContainer.replaceChildren(...searchedCards);
});

regionSelect.addEventListener('change', () => {
  // return the value of the selected option
  const region = regionSelect.options[regionSelect.selectedIndex].value;

  const searchResults = filterByRegion(flagsData, region);

  if (searchResults.length === 0) {
    flagsContainer.innerHTML = `No results found...`;

    return;
  }

  const filteredCards = buildCards(searchResults);
  flagsContainer.replaceChildren(...filteredCards);
})

themeButton.addEventListener('click', changeTheme);
backButton.addEventListener('click', showHome);

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
  toggle(flagsContainer, 'hide');
}

function showHome() {
  toggle(cardDetailsContainer, 'hide');
  toggle(searchContainer, 'hide');
  toggle(flagsContainer, 'hide');
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
    return searchByCCA3(flagsData, country)
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

  const countryInfo = flagsData.find(country => {
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

function searchByName(data, query) {
  const lowerCaseQuery = query.toLowerCase();

  const result = data.filter(country => {
    return country.name.official.toLowerCase()
      .includes(lowerCaseQuery);
  });

  return result;
}

function filterByRegion(data, query) {
  const lowerCaseQuery = query.toLowerCase();

  const result = data.filter(country => {
    return country.region.toLowerCase()
      .includes(lowerCaseQuery);
  });

  return result;
}

function searchByCCA3(data, query) {
  const lowerCaseQuery = query.toLowerCase();

  const result = data.filter(country => {
    return country.cca3.toLowerCase()
      .includes(lowerCaseQuery);
  });

  return result;
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

function changeTheme() {
  const isDarkMode = themeButtonIcon.classList.contains('theme-button__icon--light');

  if (isDarkMode) {
    themeButtonIcon.classList.replace('theme-button__icon--light', 'theme-button__icon--dark');
    themeButtonText.textContent = 'Light Mode';

    searchIcon.classList.replace('search-bar__icon--light', 'search-bar__icon--dark');
  } else {
    themeButtonIcon.classList.replace('theme-button__icon--dark', 'theme-button__icon--light');
    themeButtonText.textContent = 'Dark Mode';

    searchIcon.classList.replace('search-bar__icon--dark', 'search-bar__icon--light');
  }

  document.body.classList.toggle('light-mode');
}