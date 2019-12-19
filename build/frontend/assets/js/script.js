const els = {
  tab: document.querySelector(".tab"),
  video: document.querySelector(".video"),
  dropdownBtns: document.querySelectorAll(".dropdown--btn"),
  backgroundBtn: document.querySelector(".background__btn"),
  backgroundCheckbox: document.querySelector(".background__checkbox"),
  tablinks: document.querySelectorAll(".tab__links"),
  btnCems: document.querySelector(".btn-cems"),
  videoDropdownLinks: document.querySelectorAll('.video .dropdown--content > a'),
};

const openDropdown = evt => {
  console.log("clicked", evt.target);
  evt.target.classList.toggle("show");
};

const openTabContent = evt => {
  const className = evt.target.dataset.type;
  els.tab.classList = [`tab ${className}`];
};

const closeBackgroundSub = _ => {
  console.log("click")
  els.backgroundCheckbox.checked = false;
};

const switchVideo = evt => {
  const className = evt.target.dataset.type;
  els.video.classList = [`video ${className}`];
}

els.backgroundBtn.addEventListener("click", closeBackgroundSub, false);

Array.from(els.dropdownBtns).forEach(dropdownBtn =>
  dropdownBtn.addEventListener("click", openDropdown, false)
);

Array.from(els.tablinks).forEach(tablink =>
  tablink.addEventListener("click", openTabContent, false)
);

Array.from(els.videoDropdownLinks).forEach(videoDropdownLink =>
  videoDropdownLink.addEventListener("click", switchVideo, false)
);


//===================
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}