const API = 'https://restcountries.com/v3.1/';

async function getData(resource) {
  try {
    const response = await fetch(`${API}/${resource}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

export default getData;