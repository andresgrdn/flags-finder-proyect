import navBar from './templates/navBar';
import searchContainer from './templates/searchContainer';
import flagsContainer from './templates/cardsContainer';

(async () => {
  const App = document.getElementById('App');
  App.innerHTML += navBar();
  App.innerHTML += searchContainer();
  App.innerHTML += await flagsContainer();
})()