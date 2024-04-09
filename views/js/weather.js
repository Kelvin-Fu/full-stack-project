(() => {
  const API_KEY_WEATHER = "782d104ba73d6272f1a5945ee14fbdb6";
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------
  const getJSONData = async (url) => {
    try {
      const response = await window.fetch(url);
      const data = response.json();
      return data;
    } catch (error) {
      console.log("\t|Something went wrong while fetching JSON data!");
    }
  };

  //get user current location
  const getGeoLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude.toFixed(2);
          const lon = position.coords.longitude.toFixed(2);
          const xy = {
            latitude: lat,
            longitude: lon,
          };
          resolve(xy); // Resolve the promise with the location data
        });
      } else {
        console.log(`Geolocation is not supported by this browser!`);
        reject(new Error("Geolocation is not supported"));
      }
    });
  };
  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------

  const displayWeatherData = async () => {
    const xy = await getGeoLocation();

    //use cooridnate to get weather infos
    //const urlWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${xy.latitude}&lon=${xy.longitude}&units=metric&appid=${API_KEY_WEATHER}`;
    const urlWeather = "./js/city.json";
    const data = await getJSONData(urlWeather);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");

    //populat weekday name
    document.querySelector("#todayDate").innerHTML = months[today.getMonth()] + " " + day;
    document.querySelector(".todayDay").innerHTML = weekday[today.getDay()];
    const days = document.querySelectorAll(".fw-bold.weekdays");
    for (let i = 0; i < 7; i++) {
      days[i].innerHTML = weekday[today.getDay()];
      today.setDate(today.getDate() + 1);
    }

    //populate high temp and low temp for each day
    document.querySelector(".currentTemp").innerHTML = data.list[0].main.temp + "°C";
    const highTemp = document.querySelectorAll(".HighTemp");
    const lowTemp = document.querySelectorAll(".lowTemp");
    let i = 0;
    let prevDate;
    data.list.forEach((element) => {
      let currDate = element.dt_txt.split(" ")[0];
      if (currDate != prevDate) {
        highTemp[i].innerHTML = element.main.temp_max + "°C";
        lowTemp[i].innerHTML = element.main.temp_min + "°C";
        i++;
      }

      prevDate = currDate;
    });
    //display weather infos
    document.querySelector("#city").innerHTML = data.city.name;
  };

  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.querySelector(".clock").textContent = "Digital Clock " + timeString;

    setInterval(updateClock, 1000);
  };

  const getEvent = async () => {
    fetch("/calendar")
      .then((response) => response.json())
      .then((events) => displayEvents(events))
      .catch((err) => console.error(err));
  };

  //populate the event div in each date
  const displayEvents = (events) => {
    if (events.length > 0) {
      //remove exisint events
      let table = document.querySelector(".table.agenda.today tbody");
      let tabletmr = document.querySelector(".table.agenda.tomorrow tbody");

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;
      let tmr = today;
      tmr.setDate(tmr.getDate() + 1);
      tmr = tmr.toISOString().split("T")[0];

      for (let i = 0; i < events.length; i++) {
        let tr = document.createElement("tr");

        if (events[i].Category == "calendarEvent" && events[i].Date == todayDate) {
          let td = document.createElement("td");
          td.innerHTML = events[i].Topic;
          td.style.textIndent = "20px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.innerHTML = events[i].Date;
          td.style.textAlign = "right";
          tr.appendChild(td);
          table.appendChild(tr);
        }

        tr = document.createElement("tr");
        if (events[i].Category == "calendarEvent" && events[i].Date == tmr) {
          td = document.createElement("td");
          td.innerHTML = events[i].Topic;
          td.style.textIndent = "20px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.innerHTML = events[i].Date;
          td.style.textAlign = "right";
          tr.appendChild(td);
          tabletmr.appendChild(tr);
        }
      }
    } else {
      console.info("Events collection is empty");
    }
  };

  window.onload = () => {
    displayWeatherData();
    getEvent();
    //updateClock();
  };
})();
