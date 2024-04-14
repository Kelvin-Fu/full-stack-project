(() => {
  const setStyle = (style) => {
    let head = document.querySelector("head");
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", style);
    head.appendChild(link);
  };
  const setFavoriteIcon = () => {
    let head = document.querySelector("head");
    let link = document.createElement("link");
    link.setAttribute("rel", "shortcut icon");
    link.setAttribute("href", "img/favicon.png");
    link.setAttribute("type", "imgae/x-icon");
    head.appendChild(link);
  };

  const getData = async (url = "") => {
    console.log("url", url);
    const response = await fetch(url, {
      method: "GET", // Change method to GET
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response.json();
  };
  const setHeader = () => {
    let header = document.querySelector("header");
    header.innerHTML = '<nav class="navbar navbar-expand-lg fixed-top " style="background-color: #f5ebe0;">' + '<div class="container-fluid">' + '<button class=" navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><span class="navbar-toggler-icon" data-bs-target="#offcanvasExample"></span></button>' + '<a class="navbar-brand me-auto" href="login.html">' + '<code class="h3 fw-bold  px-3">Planner</code></a>' + "</div></div></nav>";
  };

  const setLinkActive = () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("ul>li>a");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  };

  const logOut = async (event) => {
    event.preventDefault();

    const reply = await getData("/logOut", {});
    if (reply.error) {
      console.log(reply.error.message);
    } else if (reply.success) {
      window.location.href = "/login.html"; //redirect
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Load shared navigation, and footer
    setStyle("css/spacelab.min.css");
    setFavoriteIcon();
    setHeader();
    setLinkActive();

    document.querySelector("#logOut").onclick = logOut;
  });
})();
