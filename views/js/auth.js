// using IIFE
(() => {
  //----------------------------------------------------
  const navigation = {
    signIn: { title: "signin Page", url: "login", section: "loginSession" },
    signUp: { title: "signout Page", url: "register", section: "signupSession" },
  };
  const registerWarning = document.querySelector('#Register div[name="error"]');
  const loginWarning = document.querySelector('#Login div[name="error"]');
  let email = undefined;
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
  const hide = (element) => (element.style.display = "none");
  const show = (element) => (element.style.display = "block");
  //----------------------------------------------------
  /**
   * Client-side RESTful APIs
   *
   */
  //----------------------------------------------------
  const setActivePage = (section) => {
    let menuItems = document.querySelectorAll("a[data-page]");
    menuItems.forEach((menuItem) => {
      if (section === menuItem.textContent) {
        //section id == textcontent
        console.log("id == a tag textContent, therefore set active");
        menuItem.classList.add("active");
      } else menuItem.classList.remove("active");
    });
  };
  const displaySection = (state) => {
    console.log(state); //state = nav object
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      let name = section.getAttribute("id");
      if (name === state.section) {
        //section id = object section field
        document.title = state.title;
        show(section);
        setActivePage(name);
      } else hide(section);
    });
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

  //Make API Call to server
  //reply = success/error (message)
  //if success, redirect to index.html
  const signup = async (event) => {
    // prevent refreshing the page
    event.preventDefault();
    email = document.querySelector('#Register input[name="email"]').value;
    let password = document.querySelector('#Register input[name="password"]').value;

    const reply = await postData("/signup", { email, password });
    if (reply.error) {
      registerWarning.innerHTML = `${reply.error.message}`;
      show(registerWarning);
    } else if (reply.success) {
      console.log(reply, reply);
      window.location.href = "/index.html";
    }
  };

  //Make API Call to server
  //reply = success/error (message)
  //if success, redirect to index.html
  const signin = async (event) => {
    event.preventDefault();
    email = document.querySelector('#Login input[name="email"]').value; //OK
    let password = document.querySelector('#Login input[name="password"]').value; //OK

    const reply = await postData("/signin", { email, password });
    if (reply.error) {
      loginWarning.innerHTML = `${reply.error.message}`;
      show(loginWarning);
    } else if (reply.success) {
      //console.log(reply, reply);
      window.location.href = "/index.html"; //redirect
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    //When first load in page
    displaySection(navigation.signIn);
    window.history.replaceState(navigation.signIn, "", document.location.href);

    document.onclick = (event) => {
      const page = event.target.getAttribute("data-page"); //page = value inside data-page

      if (page) {
        event.preventDefault();
        window.history.pushState(navigation[page], "", `/${navigation[page].url}`);
        displaySection(navigation[page]);
      }
    };

    const errors = document.querySelectorAll('section div[name="error"]');
    errors.forEach((error) => hide(error));

    document.querySelector("#signup").onclick = signup;
    document.querySelector("#signin").onclick = signin;
  });
  //----------------------------------------------------
})();
