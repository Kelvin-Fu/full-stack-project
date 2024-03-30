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

  const setHeader = () => {
    let header = document.querySelector("header");
    header.innerHTML =
      '<nav class="navbar navbar-expand-lg fixed-top " style="background-color: #f5ebe0;">' +
      '<div class="container-fluid">' +
      '<button class=" navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><span class="navbar-toggler-icon" data-bs-target="#offcanvasExample"></span></button>' +
      '<a class="navbar-brand me-auto" href="login.html">' +
      '<code class="h3 fw-bold  px-3">Planner</code></a>' +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse"data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"aria-label="Toggle navigation">' +
      '<span class="navbar-toggler-icon"></span></button>' +
      '<div class="collapse navbar-collapse" id="navbarSupportedContent">' +
      '<form class="d-flex ms-auto"><input class="form-control" type="search" placeholder="Search" aria-label="Search">' +
      '<button class="btn btn-outline-dark" type="submit"><i class="fa-brands fa-searchengin"></i></button>' +
      "</form>" +
      '<ul class="navbar-nav align-middle mb-2 mb-lg-0">' +
      '<li class="nav-item dropdown me-3">' +
      '<a class="nav-link dropdown-toggle h3 " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-user"></i></a>' +
      '<ul class="dropdown-menu dropdown-menu-end">' +
      '<li><a class="dropdown-item" href="flags.html">Flags of Countries</a></li>' +
      '<li><a class="dropdown-item" href="area.html">Area of Countries</a></li></ul></li>' +
      "</ul>" +
      "</div></div></nav>";
  };

  const setFooter = () => {
    let footer = document.createElement("footer");
    footer.innerHTML = "<kbd> &copy; <span></span> Kelvin Fu. All Rights Reserved.";
    document.querySelector('div[class="h4 text-center"]').appendChild(footer);
  };

  const setCopyrightYear = () => {
    let year = new Date().getFullYear();
    document.querySelector("footer>kbd>span").textContent = year;
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

  document.addEventListener("DOMContentLoaded", () => {
    // Load shared navigation, and footer
    setStyle("css/spacelab.min.css");
    setFavoriteIcon();
    setHeader();
    //setFooter();
    // setCopyrightYear();
    setLinkActive();
  });
})();