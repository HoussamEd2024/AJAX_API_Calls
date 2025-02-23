"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const imagesContainer = document.querySelector(".images");

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
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
  countriesContainer.style.opacity = 1;
};

const wait = (sec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};

const getPosition = () => {
  return new Promise((resolve, reject) => {
    // navigator.geolocation.getCurrentPosition(
    //     (pos) => resolve(pos),
    //     (err) => reject(err)
    //   )
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then((position) => console.log(position));

//  btn.addEventListener("click", whereAmI());

// Use Async/Await (ES6) replace then
/*
const getCountryData = async function (country) {
  //  fetch(`https://restcountries.com/v3.1/name/${country}`)
  // .then(res=>console.log(res))
  const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};

getCountryData("morocco");
*/

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse Geolocation
    const resGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!resGeo.ok) throw new Error("Problem getting location data");

    const dataGeo = await resGeo.json();
    console.log(dataGeo);
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
    );
    if (!res.ok) throw new Error("Problem getting country");

    const data = await res.json();
    console.log(data);

    renderCountry(data[0]);
  } catch (err) {
    console.error(`${err} 💥`);
    renderCountry(`💥 ${err.message}`);
  }
  // Handle errors with catch block
};

btn.addEventListener("click", whereAmI());

const getJSON = async (url, errorMsg = "Something went wrong") => {
  const response = await fetch(url);
  // Throwing errors manually
  if (!response.ok) throw new Error(`${errorMsg} ${response.status})`);
  return await response.json();
};

// Running Promises In sequence
// const get3Countries = async function (c1, c2, c3) {
//   try {
//     const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
//     const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
//     const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

//     console.log([data1.capital, data2.capital, data3.capital]);
//   } catch (error) {
//     console.error(error);
//   }
// };

// Running Promises In parallel (If one of promises is rejected , the result are rejected)
// Promise.all
const get3Countries = async function (c1, c2, c3) {
  try {
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    //console.log(data);
    console.log(data.map((d) => d[0].capital));
  } catch (error) {
    console.error(error);
  }
};

get3Countries("usa", "morocco", "egypt");

// Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/portugal`),
    getJSON(`https://restcountries.com/v3.1/name/algeria`),
    getJSON(`https://restcountries.com/v3.1/name/germany`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(new Error("Request took too long"));
    }, sec);
  });
};

/*
Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/morocco`),
  timeout(2000),
])
  .then((res) => console.log(res[0]))
  .catch((err) => console.error(err));

// Promise.allSettled (not short circuits return the result of all promises (no matter fulfilled or rejected ))

Promise.allSettled([
  Promise.resolve("Succes"),
  Promise.reject("ERROR"),
  Promise.resolve("Another succes"),
]).then((res) => console.log(res));

Promise.all([
  Promise.resolve("Succes"),
  Promise.reject("ERROR"),
  Promise.resolve("Another succes"),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
*/

// Promise.any [ES2021] (return the first fulfilled promise)

Promise.any([
  Promise.resolve("Succes"),
  Promise.reject("ERROR"),
  Promise.resolve("Another succes"),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
