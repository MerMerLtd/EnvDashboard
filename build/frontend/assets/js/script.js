const els = {
  conatainer: document.querySelector(".container"),
  tab: document.querySelector(".tab"),
  video: document.querySelector(".video"),
  dropdownBtns: document.querySelectorAll(".dropdown--btn"),
  backgroundBtn: document.querySelector(".background__btn"),
  backgroundCheckbox: document.querySelector(".background__checkbox"),
  tablinks: document.querySelectorAll(".tab__links"),
  btnCems: document.querySelector(".btn-cems"),
  videoDropdownLinks: document.querySelectorAll(".video .dropdown--content > a")
};

const handleDropdown = evt => {
  if (evt.target.matches(".dropdown--btn")) {
    evt.target.classList.toggle("show");
    return;
  }
  Array.from(els.dropdownBtns).forEach(dropdownBtn => {
    dropdownBtn.classList.remove("show");
  });
  if (evt.target.matches(".dropdown--content > a")) {
    console.log(evt.target.innerHTML);
    console.log(
      evt.target.parentElement.parentElement.children[0].firstElementChild
        .innerHTML
    );
    evt.target.parentElement.parentElement.children[0].firstElementChild.innerHTML =
      evt.target.innerHTML;
  }
};

els.conatainer.addEventListener("click", handleDropdown, false);

const openTabContent = evt => {
  const className = evt.target.dataset.type;
  els.tab.classList = [`tab ${className}`];
};

const closeBackgroundSub = _ => {
  console.log("click");
  els.backgroundCheckbox.checked = false;
};

const switchVideo = evt => {
  const className = evt.target.dataset.type;
  els.video.classList = [`video ${className}`];
};

els.backgroundBtn.addEventListener("click", closeBackgroundSub, false);

Array.from(els.tablinks).forEach(tablink =>
  tablink.addEventListener("click", openTabContent, false)
);

Array.from(els.videoDropdownLinks).forEach(videoDropdownLink =>
  videoDropdownLink.addEventListener("click", switchVideo, false)
);

// 1. use shp2json COUNTY_MOI_1060525.shp -o county.json --encoding big5 to convert from .shp to .json with big5 encoding
// 2. d3.json read the json file
// 3. create d3 group with data.features
// 4. var projection = d3.geoMercator() to setup geo projection type
// 5. var path = d3.geoPath().projection(projection) to create path base on projection

// d3.json("./assets/topojson/town.json").then(topodata => {
//   let features = topodata.features;
//   for(i=features.length - 1; i >= 0; i-- ) {
//     features[i].properties.number = i;
//   }
//   let color = d3.scaleLinear().domain([0,10000]).range(["#090","#f00"]);
//   let projection = d3
//     .geoMercator()
//     .scale(60000)
// .center([121.72, 25]);
//   let path = d3.geoPath().projection(projection);
//   d3.select("svg")
//     .selectAll("path")
//     .data(features)
//     .enter()
//     .append("path")
//     .attr("d", path);

//   d3.select("svg").style("background-color", "pink");
// });

d3.json("./assets/topojson/town_1999.json").then(topodata => {
  let features = topodata.features.filter(
    data => data.properties.COUNTY === "新北市"
  );
  for (i = features.length - 1; i >= 0; i--) {
    features[i].properties.number = i;
  }
  console.log(features);
  let color = d3
    .scaleLinear()
    .domain([0, 10000])
    .range(["#069eaf", "#efefef"]);

  let projection = d3
    .geoMercator()
    .scale(60000)
    .center([121.72, 25.1]);
  let path = d3.geoPath().projection(projection);
  d3.select("svg")
    .selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => color(d.properties.number * 300))
    .attr("stroke", "#fff")
    .attr("stroke-width", "2px")
    .on("click", function(d) {
      d3.select(this).attr("fill", "#00FFF9");
      console.log(d.properties.number);
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill", color(d.properties.number * 300));
    });

  // d3.select("svg").style("background-color", "pink");
});

//===================
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
}
