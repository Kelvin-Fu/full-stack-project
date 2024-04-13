(() => {
  const popupOverlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------

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

  //close the pop up form
  const openPopup = () => (popupOverlay.style.display = "block");
  const closePopupFunc = () => (popupOverlay.style.display = "none");

  //post the event to the db
  const submitForm = async (event) => {
    event.preventDefault();
    const description = document.querySelector("#Description").value;
    const transType = document.querySelector("#transactionType").value;
    const date = document.querySelector("#Date").value;
    const amount = document.querySelector("#amount").value;
    //post data to db
    const reply = await postData("/createBudget", { description, transType, date, amount });

    if (reply.error) {
      //loginWarning.innerHTML = `${reply.error.message}`;
      //show(loginWarning);
    } else if (reply.success) {
      closePopupFunc();
      getItem();
    }
  };

  const getItem = async () => {
    fetch("/budget")
      .then((response) => response.json())
      .then((item) => displayItems(item))
      .catch((err) => console.error(err));
  };

  //populate the event div in each date
  const displayItems = (item) => {
    if (item.length > 0) {
      //remove exisint events
      let tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      let startFrom = document.querySelector("#fromDate").value;
      let toDate = document.querySelector("#toDate").value;
      let expenseSum = 0;
      let incomeSum = 0;
      if (startFrom != "" && toDate != "") {
        let startDate = new Date(startFrom);
        let endDate = new Date(toDate);
        item.forEach((element) => {
          let checkDate = new Date(element.date);
          if (checkDate >= startDate && checkDate <= endDate) {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${element.date}</td><td>${element.description}</td>`;
            if (element.transType == "expense") {
              tr.innerHTML += `<td>$${element.amount}</td><td></td>`;
              expenseSum += parseInt(element.amount);
            } else if (element.transType == "income") {
              tr.innerHTML += `<td></td><td>$${element.amount}</td>`;
              incomeSum += parseInt(element.amount);
            }
            tbody.appendChild(tr);
          }
        });
        document.querySelector("#expenseTotal").innerHTML = "$" + expenseSum;
        document.querySelector("#incomeTotal").innerHTML = "$" + incomeSum;
      }
    } else {
      console.info("Events collection is empty");
    }
  };

  const defaultMonth = () => {
    const today = new Date(); // Get the current date
    const firstDateOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDateOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstDateOfMonthFormatted = firstDateOfMonth.toISOString().split("T")[0];
    const lastDateOfMonthFormatted = lastDateOfMonth.toISOString().split("T")[0];
    document.querySelector("#fromDate").value = firstDateOfMonthFormatted;
    document.querySelector("#toDate").value = lastDateOfMonthFormatted;
  };

  document.addEventListener("DOMContentLoaded", () => {
    getItem();
    defaultMonth();
    popup.addEventListener("click", openPopup);
    closePopup.addEventListener("click", closePopupFunc);

    popupOverlay.addEventListener("click", (event) => {
      if (event.target === popupOverlay) {
        closePopupFunc();
      }
    });
    document.querySelector("#fromDate").onchange = getItem;
    document.querySelector("#toDate").onchange = getItem;
    document.querySelector("#submitForm").onclick = submitForm;
  });
})();
