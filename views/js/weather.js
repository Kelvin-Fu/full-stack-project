(() => {
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

  const postData = async (url = "", data = {}) => {
    console.log("url", url);
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  };

  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------

  //Server side api call--------------------
  const displayWeatherData = async () => {
    const xy = await getGeoLocation();
    fetch(`/weatherInfo?lat=${xy.latitude}&long=${xy.longitude}`)
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");

        //populat weekday name
        document.querySelector("#todayDate").innerHTML = months[today.getMonth()] + " " + day;
        document.querySelector(".todayDay").innerHTML = weekday[today.getDay()];
        const days = document.querySelectorAll(".fw-bold.weekdays");

        //populate high temp and low temp for each day
        document.querySelector(".currentTemp").innerHTML = data.list[0].main.temp + "°C";
        const highTemp = document.querySelectorAll(".HighTemp");
        const lowTemp = document.querySelectorAll(".lowTemp");
        let i = 0;
        let prevDate = data.list[0].dt_txt.split(" ")[0];
        let prevElement = data.list[0];
        let max = 0,
          min = 100;
        data.list.forEach((element) => {
          let currDate = element.dt_txt.split(" ")[0];
          if (currDate == prevDate) {
            if (element.main.temp_max > max) {
              max = element.main.temp_max;
            }
            if (element.main.temp_min < min) {
              min = element.main.temp_min;
            }
          }
          if (currDate != prevDate) {
            highTemp[i].innerHTML = max + "°C"; //element.main.temp_max + "°C";
            lowTemp[i].innerHTML = min + "°C"; // prevElement.main.temp_min + "°C";
            days[i].innerHTML = weekday[today.getDay()];
            today.setDate(today.getDate() + 1);
            i++;
            max = 0;
            min = 100;
          }

          prevDate = currDate;
          prevElement = element;
        });
        //display weather infos
        document.querySelector("#city").innerHTML = data.city.name;
      })
      .catch((err) => console.error(err));
  };
  //Server side api call--------------------

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

      let tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      const yeartmr = tmr.getFullYear();
      const monthtmr = String(tmr.getMonth() + 1).padStart(2, "0");
      const daytmr = String(tmr.getDate()).padStart(2, "0");
      const tmrDate = `${yeartmr}-${monthtmr}-${daytmr}`;

      console.log(tmrDate);
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
        if (events[i].Category == "calendarEvent" && events[i].Date == tmrDate) {
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

  //Quick Check List
  let listTimer, noteTimer;
  const doneTypingInterval = 1000;

  const handleTyping = () => {
    clearTimeout(listTimer);
    listTimer = setTimeout(finishedTyping, doneTypingInterval);
  };
  const handleNoteTyping = () => {
    clearTimeout(noteTimer);
    noteTimer = setTimeout(noteTyping, doneTypingInterval);
  };

  const finishedTyping = async () => {
    const checkItems = document.querySelectorAll(".checkItems");
    const checkBoxes = document.querySelectorAll(".checkBoxes");
    let checkListItems = [];
    let checkBoxesStatus = [];
    checkItems.forEach((box) => {
      const item = box.value;
      checkListItems.push(item);
    });

    checkBoxes.forEach((box) => {
      checkBoxesStatus.push(box.checked);
    });

    const reply = await postData("createCheckList", { checkListItems, checkBoxesStatus });
    if (reply.error) {
      console.log("Post check List failed ");
    }
  };

  const noteTyping = async () => {
    const note = document.querySelector("#notes").value;

    const reply = await postData("createNotes", { note });
    if (reply.error) {
      console.log("Post check List failed ");
    }
  };

  const getCheckList = async () => {
    fetch("/checkList")
      .then((response) => response.json())
      .then((list) => displayCheckList(list))
      .catch((err) => console.error(err));
  };

  const displayCheckList = (list) => {
    if (list.length > 0) {
      const checkListItems = list[0].checkListItems;
      const checkBoxesStatus = list[0].checkBoxesStatus;
      const checkItems = document.querySelectorAll(".checkItems");
      const checkBoxes = document.querySelectorAll(".checkBoxes");

      for (let i = 0; i < checkListItems.length; i++) {
        checkItems[i].value = checkListItems[i];
        checkBoxes[i].checked = checkBoxesStatus[i];
      }
    } else {
      console.info("Events collection is empty");
    }
  };

  const getNote = async () => {
    fetch("/notes")
      .then((response) => response.json())
      .then((note) => displayNote(note))
      .catch((err) => console.error(err));
  };

  const displayNote = (list) => {
    if (list.length > 0) {
      const note = list[0].note;
      const checkItems = document.querySelector("#notes");
      checkItems.value = note;
    } else {
      console.info("Events collection is empty");
    }
  };

  window.onload = () => {
    //displayWeatherData();
    getEvent();
    getCheckList();
    getNote();

    const checklists = document.querySelectorAll(".checkItems");
    checklists.forEach((list) => {
      list.addEventListener("input", handleTyping);
    });
    document.querySelector("#notes").addEventListener("input", handleNoteTyping);
    //updateClock();
  };
})();
