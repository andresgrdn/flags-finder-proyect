const flagCard = (flagImage, flagName, population, region, capital) => {
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

export default flagCard;