import flagCard from "./flagCard";
import getData from "../utils/getData";

const cardsContainer = async () => {
  const flagsInfo = await getData('all');

  const view = `
    <div class="cards-container">
      ${flagsInfo.map(flag => {
    return flagCard(
      flag.flags.png,
      flag.name.official,
      flag.population,
      flag.region,
      flag.capital
    );
  }).join(' ')
    }
    </div>
  `;

  return view;
};

export default cardsContainer;