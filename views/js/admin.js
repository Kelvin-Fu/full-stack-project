(() => {
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopup = document.getElementById("closePopup");

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

  //close the pop up form
  const openPopup = (event) => {
    popupOverlay.style.display = "block";

    const email = event.target.parentNode.parentNode.parentNode.children[1].innerHTML;

    document.querySelector("#useremail").innerHTML = " " + email;
  };

  const closePopupFunc = () => {
    popupOverlay.style.display = "none";
  };

  //post the event to the db
  const submitForm = async (event) => {
    event.preventDefault();
    const email = document.querySelector("#useremail").textContent.trim();

    //post data to db
    const reply = await postData("/deleteUser", { email });

    if (reply.error) {
      //loginWarning.innerHTML = `${reply.error.message}`;
      //show(loginWarning);
    } else if (reply.success) {
      closePopupFunc();
      getItem();
    }
  };

  const getItem = async () => {
    fetch("/admin")
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

      item.forEach((element) => {
        let date = new Date(element.since);
        let email = element.email;
        let user = element._id;

        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${user}</td><td>${email}</td><td>${date}</td><td><button class="btn delete"><i class="fa-solid fa-trash"></i></button></td>`;

        tbody.appendChild(tr);
      });
      const deleteBtn = document.querySelectorAll(".fa-trash");

      deleteBtn.forEach((element) => {
        element.onclick = openPopup;
      });
    } else {
      console.info("Events collection is empty");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    getItem();

    closePopup.addEventListener("click", closePopupFunc);

    popupOverlay.addEventListener("click", (event) => {
      if (event.target === popupOverlay) {
        closePopupFunc();
      }
    });
    document.querySelector("#yesOpt").onclick = submitForm;
    document.querySelector("#noOpt").onclick = closePopupFunc;
  });
})();
