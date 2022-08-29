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

// Main

const flagsContainer = document.getElementById('flagsContainer');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');

let flagsData;

function card(flagImage, flagName, population, region, capital) {
  const view = `
  <div class="card-container">
    <div class="card">
      <picture>
        <img src="${flagImage}"
          alt="Flag image">
      </picture>
      <div class="card__info">
        <h2>${flagName}</h2>
        <p><span>Population:</span> ${population}</p>
        <p><span>Region:</span> ${region}</p>
        <p><span>Capital:</span> ${capital}</p>
      </div>
    </div>
  </div>
  `;

  return view;
};

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
  }).join(' ');;

  return cardsHTML;
}

getData()
  .then(data => {
    flagsData = data;

    flagsContainer.innerHTML = buildCards(flagsData);
  })
  .catch(error => console.error(error));


searchInput.addEventListener('input', () => {
  const searchResults = searchByName(flagsData, searchInput.value);

  if (searchResults.length === 0) {
    flagsContainer.innerHTML = `No results found...`;

    return;
  }

  flagsContainer.innerHTML = buildCards(searchResults);
});

regionSelect.addEventListener('change', () => {
  // return the value of the selected option
  const region = regionSelect.options[regionSelect.selectedIndex].value;

  const searchResults = filterByRegion(flagsData, region);

  if (searchResults.length === 0) {
    flagsContainer.innerHTML = `No results found...`;

    return;
  }

  flagsContainer.innerHTML = buildCards(searchResults);
})