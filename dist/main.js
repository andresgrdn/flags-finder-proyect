// Utils

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

// Main

const flagsContainer = document.getElementById('flagsContainer');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');
const themeButton = document.getElementById('themeButton');
const searchContainer = document.getElementById('searchContainer');
const cardDetailsContainer = document.getElementById('cardDetailsContainer');

let flagsData;

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

  container.addEventListener('click', openCardDescription);

  container.countryName = flagName;
  container.classList.add(...classes);
  container.innerHTML = view;

  return container;
};

function showDescription() {
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
  borderCountries) {
  const view = `
    <div class="details-container">
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
            <li><a href="">France</a></li>
            <li><a href="">Germany</a></li>
            <li><a href="">Netherlands</a></li>
            <li><a href="">France</a></li>
            <li><a href="">Germany</a></li>
            <li><a href="">Netherlands</a></li>
            <li><a href="">France</a></li>
            <li><a href="">Germany</a></li>
            <li><a href="">Netherlands</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;

  return view;
}

function openCardDescription(event) {
  const container = event.currentTarget;

  console.log(`Current card clicking => ${container.countryName}`);

  const countryInfo = flagsData.find(country => {
    return country.name.official === container.countryName;
  });

  cardDetailsContainer.innerHTML = cardDescription(
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

  showDescription();
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

themeButton.addEventListener('click', () => {
  console.log('theme button clicked!');
})