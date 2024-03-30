// using IIFE
(() => {
  //----------------------------------------------------
  const navigation = {
    home: { title: "Home Page", url: "Home", section: "Home" },
    //calendar: { title: "Calendar Page", url: "Calendar", section: "Calendar" },
    // posts: { title: "Member Page", url: "Member/Posts", section: "Posts" },
    // search: { title: "Member Page", url: "Member/Search", section: "Search Posts" },
    // users: { title: "Admin Page", url: "Admin/Users", section: "Manage Users" },
    // content: { title: "Admin Page", url: "Admin/Content", section: "Manage Content" },
    // register: { title: "Register Page", url: "Account/Register", section: "Register" },
    // login: { title: "Login Page", url: "Account/Login", section: "Login" },
  };
  const registerWarning = document.querySelector('#Register div[name="error"]');
  const loginWarning = document.querySelector('#Login div[name="error"]');
  let email = undefined;
  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------
  const getJSONData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
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
  const setCopyrightYear = () => {
    document.querySelector("#footer kbd span").innerHTML = new Date().getFullYear();
  };
  //----------------------------------------------------
  /**
   * Client-side RESTful APIs
   *
   */
  //----------------------------------------------------
  const signout = async (event) => {
    event.preventDefault();
    console.log(email);
    const reply = await postData("/signout", { email });
    if (reply.success) {
      console.log("inside signout");
      console.log(reply.success);
      console.log(reply, reply);
      window.history.pushState(navigation.home, "", `/${navigation.home.url}`);
      displaySection(navigation.home);
      authorize(false);
    } else {
      console.log(reply);
    }
  };
  const authorize = (isAuthenticated) => {
    const authenticated = document.querySelectorAll("[data-authenticated]");
    const nonAuthenticated = document.querySelector("[data-nonAuthenticated]");
    if (isAuthenticated) {
      authenticated.forEach((element) => show(element));
      hide(nonAuthenticated);
    } else {
      authenticated.forEach((element) => hide(element));
      show(nonAuthenticated);
    }
  };
  // Handle forward/back buttons
  window.onpopstate = (event) => {
    // If a state has been provided, we have a "simulated" page
    // and we update the current page.
    console.log(event.state);
    if (event.state) {
      // Simulate the loading of the previous page
      displaySection(event.state);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    // const noticeDialog = document.querySelector("#noticeDialog");
    // const errors = document.querySelectorAll('section div[name="error"]');
    // errors.forEach((error) => hide(error));
    // noticeDialog.showModal();
    // document.querySelector("#noticeButton").onclick = (event) => {
    //   event.preventDefault();
    //   if (document.querySelector("#agree").checked) noticeDialog.close();
    // };
  });
  //----------------------------------------------------
})();
