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

// Example of Event Loop

// console.log("Task : Start");
// setTimeout(() => console.log("timer 0 seconds"), 0);
// Promise.resolve("Resolved promise").then((res) => {
//   for (let i = 0; i < 10000000000000000000; i++) {}
//   console.log(res);
// });
// console.log("Task : End");

// Create a simple Promise
/*
const lotteryPromise = new Promise((resolve, reject) => {
  console.log("Lotter draw is happening");
  setTimeout(() => {
    Math.random() >= 0.5
      ? resolve("You WIN 🤑")
      : reject(new Error("You lost your money 😫"));
  }, 2000);
});

// Consume the promise created

lotteryPromise
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
*/
// Promisifying setTimeout

const wait = (sec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};

// wait(2)
//   .catch(() => {
//     console.log("I waited for 2 seconds");
//     return wait(1);
//   })
//   .catch(() => console.log("I waited for 1 seconds"));

/*
wait(1)
  .then(() => {
    console.log("1 second passed");
    return wait(1);
  })
  .then(() => {
    console.log("2 seconds passed");
    return wait(1);
  })
  .then(() => {
    console.log("3 seconds passed");
    return wait(1);
  })
  .then(() => {
    console.log("4 seconds passed");
  });

setTimeout(() => {
  console.log("1 second passed");
  setTimeout(() => {
    console.log("2 seconds passed");
    setTimeout(() => {
      console.log("3 seconds passed");
      setTimeout(() => {
        console.log("4 seconds passed");
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

*/

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

// const whereAmI = function () {
//   getPosition()
//     .then((position) => {
//       console.log(position.coords);
//       let { latitude: lat, longitude: lng } = position.coords;
//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//       );
//     })

//     .then((response) => {
//       console.log(response);
//       if (!response.ok)
//         throw new Error(`Problem with geocoding (${response.status})`);
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       console.log(`You are in ${data.city} ,${data.countryName}`);
//       return fetch(`https://restcountries.com/v3.1/name/${data.countryName}`);
//     })
//     .then((response) => {
//       if (!response.ok)
//         throw new Error(`Country Not Found (${response.status})`);
//       return response.json();
//     })
//     .then((data) => {
//       renderCountry(data[0]);
//     })
//     .catch((err) => {
//       console.error(`${err.message} 💥💥💥`);
//       renderError(`Something went wrong 💥💥💥 ${err.message}. Try Again!`);
//     });
// };

// btn.addEventListener("click", whereAmI());

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

*/

const createImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.src = imagePath;

    image.addEventListener("load", () => {
      imagesContainer.append(image);
      resolve(image);
    });

    image.addEventListener("error", () => {
      reject(new Error("Image not found"));
    });
  });
};

let currImage;

createImage("img/img-1.jpg")
  .then((img) => {
    currImage = img;
    console.log("Image 1 loaded");
    return wait(2);
  })
  .then(() => {
    currImage.style.display = "none";
    return createImage("img/img-2.jpg");
  })
  .then((img) => {
    currImage = img;
    console.log("Image 2 loaded");
    return wait(2);
  })
  .then(() => {
    currImage.style.display = "none";
  })
  .catch((err) => console.error(err));
