import searchContainer from './templates/searchContainer';
import flagsContainer from './templates/cardsContainer';

(async () => {
  const App = document.getElementById('App');
  App.innerHTML += searchContainer();
  App.innerHTML += await flagsContainer();
})()