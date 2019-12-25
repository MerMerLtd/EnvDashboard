let els = {
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

//===============================================
//==============  新北市行政區 svg  ===============

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
  d3.select(".svg--nav")
    .selectAll("path")
    .data(features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", d => color(d.properties.number * 300))
    .attr("stroke", "#fff")
    .attr("stroke-width", "2px")
    .on("mouseover", function(d) {
      d3.select(this).attr("fill", "#00FFF9");
      console.log(d.properties.number, d.properties.TOWN);
    })
    .on("mouseout", function(d) {
      d3.select(this).attr("fill", color(d.properties.number * 300));
    })
    .append("text")
    .text(d => d.properties.TOWN);

  // d3.select("svg").style("background-color", "pink");
});

//===============================================
//============  lineChart svg  ============
const lineChartsvg = d3.select(".svg--lineChart");

//===============================================
//===============  barChart svg  ================
const barChartsvg = d3.select(".svg--barChart");
// els = { ...els, barChartsvg: document.querySelector(".svg--barChart") };
// const width = els.barChartsvg.style.width;
// const height = els.barChartsvg.style.height;
// const width = barChartsvg.attr("width");
// const height = barChartsvg.attr("height");
const width = 130;
const height = 110;

console.log(width, height);
const render = data => {
  const xValue = d => d.year;
  const yValue = d => d.emissions;
  const margin = { top: 20, left: 35, right: 10, bottom: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .padding(0.2);
  // console.log(xScale.domain())
  // console.log(xScale.range())
  console.log(xScale.bandwidth());
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([innerHeight, 0]); //https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
  // console.log(yScale.domain())
  // console.log(yScale.range())
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(3);
  const g = barChartsvg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

  // short for g.append("g").call(xAxis);
  xAxis(g.append("g").attr("transform", `translate(0, ${innerHeight})`));
  yAxis(g.append("g"));

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => {
      console.log("x", xScale(xValue(d)));
      return xScale(xValue(d));
    })
    .attr("y", d => yScale(yValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", d => {
      console.log("height", yScale(yValue(d)));
      return innerHeight - yScale(yValue(d));
    });
};
d3.csv("./assets/csv/barchart.csv").then(data => {
  console.log(data);
  render(data);
});

barChartsvg.attr("width", width);

//===============================================
//===============  pieChart svg  ================
const pieChartsvg = d3.select(".svg--pieChart");

//===============================================
//============  multiLinesChart svg  ============
const multiLinesChartsvg = d3.select(".svg--multiLinesChart");

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
