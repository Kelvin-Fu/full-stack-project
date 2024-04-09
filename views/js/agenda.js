(() => {
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
      let table = document.querySelector(".table.agenda");
      if (table) {
        table.innerHTML = "";
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayDate = `${year}-${month}-${day}`;

      for (let i = 0; i < events.length; i++) {
        let tr = document.createElement("tr");
        if ((events[i].Date = todayDate)) {
          let td = document.createElement("td");
          td.innerHTML = events[i].Topic;
          tr.appendChild(td);
          table.appendChild(tr);
        }
      }
    } else {
      console.info("Events collection is empty");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    getEvent();
  });
})();
