const els = {
  tab: document.querySelector(".tab"),
  dropdownbtns: document.querySelectorAll(".dropdown--btn"),
  tablinks: document.querySelectorAll(".tab__links"),
  btnCems: document.querySelector('.btn-cems'),
};

const openDropdown = evt => {
  console.log("clicked", evt.target);
  evt.target.classList.toggle("show");
};

const openTabContent = evt => {
  const className = evt.target.dataset.type;
  els.tab.classList = [`tab ${className}`];
}

Array.from(els.dropdownbtns).forEach(dropdownbtn =>
  dropdownbtn.addEventListener("click", openDropdown, false)
);

Array.from(els.tablinks).forEach(tablink =>
  tablink.addEventListener("click", openTabContent, false)
);
