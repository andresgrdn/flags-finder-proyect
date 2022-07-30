const searchContainer = () => {
  const view = `
  <div class="search-container">
    <div class="search-bar">
      <i class="search-bar__icon"></i>
      <input class="search-bar__input" type="search" name="searchQuery" id="searchQuery"
        placeholder="Search for a country...">
    </div>

    <select class="filter" name="region" id="region-select">
      <option value="">Filter by Region</option>
      <option value="africa">Africa</option>
      <option value="america">America</option>
      <option value="asia">Asia</option>
      <option value="europe">Europe</option>
      <option value="oceania">Oceania</option>
    </select>
  </div>
  `;

  return view;
}

export default searchContainer;