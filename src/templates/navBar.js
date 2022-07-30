const navBar = () => {
  const view = `
  <header class="header-container">
    <h1 class="header__title">Where in the world?</h1>

    <button type="button" class="theme__toggle-btn">
      <span class="theme__icon theme__icon--dark"></span>
      <span class="theme__text theme__text--dark">Dark Mode</span>
    </button>
  </header>
  `;

  return view;
}

export default navBar;