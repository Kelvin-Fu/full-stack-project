(() => {
  const popupOverlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const prevNextIcon = document.querySelectorAll(".icons span");

  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------
  const monthMap = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
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

  //convert yyyy-mm-dd to mmm-dd format
  const convertDate = (date) => {
    let [year, month, day] = date.split("-");
    const formattedMonth = Object.keys(monthMap).find((key) => monthMap[key] === month);
    if (day.charAt(0) === "0") {
      day = day.slice(1); // Remove the first character
    }
    return `${formattedMonth}-${day}`;
  };
  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) : str;
  };
  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------

  //populate the add button in each date
  const populateAdd = () => {
    liBox = document.querySelectorAll(".days li");

    liBox.forEach((li) => {
      li.innerHTML = '<button><i class="fa-solid fa-plus" style="color: #8a8a8a;"></i></button>' + li.innerHTML;
      li.querySelector("i").onclick = addEvent;
    });
  };

  //open the pop up form and set the date according to which box
  const addEvent = (event) => {
    const clickedElement = event.target;
    const liBoxDate = clickedElement.parentNode.parentNode.className.split(" ");
    const date = liBoxDate[1];
    const whole = date.split("-");
    const monthString = whole[0];

    let dayString = whole[1];
    if (dayString.length == 1) {
      dayString = 0 + dayString;
    }
    const currentYear = new Date().getFullYear();
    const monthNumber = monthMap[monthString];
    const dateStr = currentYear + "-" + monthNumber + "-" + dayString;

    popupOverlay.style.display = "block";
    const liDate = document.querySelector("#eventDate");
    liDate.value = dateStr;
  };

  //close the pop up form
  const closePopupFunc = () => (popupOverlay.style.display = "none");

  //post the event to the db
  const submitForm = async (event) => {
    event.preventDefault();

    const eventTitle = document.querySelector("#eventTitle");
    const eventDate = document.querySelector("#eventDate").value;
    //post data to db
    const reply = await postData("/createEvent", { eventTitle: eventTitle.value, eventDate });

    if (reply.error) {
      //loginWarning.innerHTML = `${reply.error.message}`;
      //show(loginWarning);
    } else if (reply.success) {
      eventTitle.value = "";
      closePopupFunc();
      getEvent();
    }
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
      let liDiv = document.querySelectorAll(".days li div");
      if (liDiv) {
        liDiv.forEach((div) => {
          div.remove();
        });
      }

      for (let i = 0; i < events.length; i++) {
        const classDate = convertDate(events[i].Date);
        const msg = truncateString(events[i].Topic, 14);
        let liBox = document.querySelector(`li.${classDate}`);
        if (liBox) {
          liBox.innerHTML += `<div>${msg}</div>`;
        }
      }
      let li = document.querySelectorAll(".days li");

      li.forEach((li) => {
        li.querySelector("i").onclick = addEvent;
      });
    } else {
      console.info("Events collection is empty");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    populateAdd();
    getEvent();
    closePopup.addEventListener("click", closePopupFunc);

    popupOverlay.addEventListener("click", (event) => {
      if (event.target === popupOverlay) {
        closePopupFunc();
      }
    });

    document.querySelector("#submitForm").onclick = submitForm;

    //When switching months
    prevNextIcon.forEach((icon) => {
      icon.onclick = () => {
        populateAdd();
        getEvent();
      };
    });
  });
})();
