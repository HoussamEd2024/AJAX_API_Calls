"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// COUNTRIES API URL
// https://restcountries.com/v3.1/name/morocco

//console.log(request.responseText);
/*
const getCountryData = function (countryName) {
  // Ond school to make AJAX Call
  const url = `https://restcountries.com/v3.1/name/${countryName}`;
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();
  request.addEventListener("load", function () {
    console.log(this.responseText);
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    const languageKey = Object.keys(data.languages)[0];
    const currencyKey = Object.keys(data.currencies)[0];
    const html = `
          <article class="country">
                  <img class="country__img" src="${data.flags.png}" />
                  <div class="country__data">
                    <h3 class="country__name">${data.name.common}</h3>
                    <h4 class="country__region">${data.region}</h4>
                    <p class="country__row"><span>👫</span>${data.population}</p>
                    <p class="country__row"><span>🗣️</span>${data.languages[languageKey]}</p>
                    <p class="country__row"><span>💰</span>${data.currencies[currencyKey].name}</p>
                  </div>
                </article>
        `;
    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1;
  });
};
*/
// getCountryData("morocco");
// getCountryData("usa");
// getCountryData("algeria");

// Multiple ajax call (second ajax call depends on first ajax call)

const renderCountry = function (data, className = "") {
  const languageKey = Object.keys(data.languages)[0];
  const currencyKey = Object.keys(data.currencies)[0];
  const html = `
            <article class="country ${className}">
                    <img class="country__img" src="${data.flags.png}" alt="Flag of ${data.name.common}"/>
                    <div class="country__data">
                      <h3 class="country__name">${data.name.common}</h3>
                      <h4 class="country__region">${data.region}</h4>
                      <p class="country__row"><span>👫</span>${data.population}</p>
                      <p class="country__row"><span>🗣️</span>${data.languages[languageKey]}</p>
                      <p class="country__row"><span>💰</span>${data.currencies[currencyKey].name}</p>
                    </div>
                  </article>
          `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

// Callback Hell
const getCountryAndNeighbour = function (countryName) {
  //  AJAX Call country 1
  const url = `https://restcountries.com/v3.1/name/${countryName}`;
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();
  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    // Render country 1
    renderCountry(data);

    // Get neighbour country (2)

    const [neighbour] = data?.borders;
    //console.log(neighbour);

    const url2 = `https://restcountries.com/v3.1/alpha/${neighbour}`;
    const request2 = new XMLHttpRequest();
    request2.open("GET", url2);
    request2.send();
    request2.addEventListener("load", function () {
      const [data2] = JSON.parse(this.responseText);
      renderCountry(data2, "neighbour");
    });
  });
};

getCountryAndNeighbour("usa");

// Callback Hell example (code hard to understand and to maintain ===> Bad code (buggs))

setTimeout(() => {
  console.log("1 second passed");
  setTimeout(() => {
    console.log("2 seconds passed");
    setTimeout(() => {
      console.log("3 seconds passed");
      setTimeout(() => {
        console.log("4 seconds passed");
      }, 4000);
    }, 3000);
  }, 2000);
}, 1000);
