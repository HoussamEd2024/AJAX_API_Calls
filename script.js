"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// COUNTRIES API URL
// https://restcountries.com/v3.1/name/morocco

//console.log(request.responseText);

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  //countriesContainer.style.opacity = 1;
};
const renderCountry = function (countryData, className = "") {
  const language = Object.values(countryData.languages || {})[0] || "N/A";
  const currency = Object.values(countryData.currencies || {})[0]?.name;
  const html = `
            <article class="country ${className}">
                    <img class="country__img" src="${countryData.flags.png}" alt="Flag of ${countryData.name.common}"/>
                    <div class="country__data">
                      <h3 class="country__name">${countryData.name.common}</h3>
                      <h4 class="country__region">${countryData.region}</h4>
                      <p class="country__row"><span>👫</span>${countryData.population}</p>
                      <p class="country__row"><span>🗣️</span>${language}</p>
                      <p class="country__row"><span>💰</span>${currency}</p>
                    </div>
                  </article>
          `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
  //   countriesContainer.style.opacity = 1;
};

// Using promises and fetch API

// Promise

// const getCountryData = function (countryName) {
//   fetch(`https://restcountries.com/v3.1/name/${countryName}`)
//     // To consume promises
//     .then((response) => {
//       console.log(response);
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

// const getCountryAndNeighbour = function (countryName) {
//   fetch(`https://restcountries.com/v3.1/name/${countryName}`)
//     .then((response) => {
//       // Throwing errors manually
//       if (!response.ok)
//         throw new Error(`Country Not found (${response.status})`);
//       return response.json();
//     })
//     .then((data) => {
//       renderCountry(data[0]);
//       const [neighbour] = data[0]?.borders;
//       //const neighbour = "kkjkk";
//       console.log(neighbour);
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then((response) => {
//       if (!response.ok)
//         throw new Error(`Country Not found (${response.status})`);
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       renderCountry(data[0], "neighbour");
//     })
//     .catch((err) => {
//       // handling rejected promises
//       console.error(`${err} 💥💥💥`);
//       renderError(`Something went wrong 💥💥💥 ${err.message}. Try Again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

// Refactoring the code :

const getJSON = (url, errorMsg = "Something went wrong") => {
  return fetch(url).then((response) => {
    // Throwing errors manually
    if (!response.ok) throw new Error(`${errorMsg} ${response.status})`);
    return response.json();
  });
};

const getCountryAndNeighbour = function (countryName) {
  getJSON(
    `https://restcountries.com/v3.1/name/${countryName}`,
    "Country Not Found"
  )
    .then((data) => {
      renderCountry(data[0]);
      const [neighbour] = data[0]?.borders;
      //console.log(neighbour);
      //const neighbour = "kkjkk";
      if (neighbour === undefined) throw new Error("No neighbour found!");
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        "Country Not Found"
      );
    })
    .then((data) => {
      renderCountry(data[0], "neighbour");
    })
    .catch((err) => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

//getCountryData("morocco");

getCountryAndNeighbour("australia");

btn.addEventListener("click", () => getCountryAndNeighbour("morocco"));
