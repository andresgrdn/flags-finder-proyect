# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- See all countries from the API on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode *(optional)*

### Screenshot

![](./design/screenshots/flags-finder-500x253-optimized.gif)

### Links

- Solution URL: [https://github.com/andresgrdn/rest-countries-api-with-color-theme-switcher](https://github.com/andresgrdn/rest-countries-api-with-color-theme-switcher#overview)
- Live Site URL: [https://flags-finder.netlify.app/](https://flags-finder.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- Mobile-first workflow
- For the styles I used pure CSS

### What I learned

By making the seek bar I learned how to iterate over objects and arrays. It's something really cool, first we must understand very well the object that we get from the api; that's the tricky part, but when I knew what the country array looked like inside, I used array and object methods to separate the data for each country and create a unique card.

```js
function getCards(countries = []) {
  const cards = [];
  for (const country of countries) {
    const { name, flags, population, region, capital } = country;
    const cardElement = document.createElement('div');
    <!--clipped code--> // card dom creation from api data
    cards.push(cardElement);
  }
  return cards;
}
```
This was a tricky part.
```js
 const langNames = Object.entries(languages);
  const langArray = [];
  langNames.forEach(langName => {
    langArray.push(`<span>${langName[0]} ${langName[1]}</span>`);
  })
  languagesElement.innerHTML = `Languages: ${langArray.join(', ')}`;
```
Finally, the key part in this project was to separate the code into different parts. It makes code easier to read and much easier to think of new answers to new problems.

### Useful resources
- [Select element | WhatWC website](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element)
- [Select element | MDN website](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
- [Other option to the select element | MDN website](https://developer.mozilla.org/en-US/docs/Learn/Forms/Other_form_controls#drop-down_controls)

## Author

- Website - [andresgrdn.github.io](https://andresgrdn.github.io)
- Frontend Mentor - [@andresgrdn](https://www.frontendmentor.io/profile/andresgrdn)
- Twitter - [@andresgrdn](https://www.twitter.com/andresgrdn)
