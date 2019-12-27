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
  // console.log(features);
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

//!!! d3 timeformat https://www.oxxostudio.tw/articles/201412/svg-d3-11-time.html
//
//===============================================
//============  lineChart svg  ============
d3.csv("./assets/csv/pm25.csv").then(data => {
  // console.log(data);
  const svg = d3.select(".svg--lineChart");
  const width = 410;
  const height = 190;
  const margin = { top: 20, right: 10, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  // const innerHeight = height - margin.top - margin.bottom;
  const xValue = d => +d.hour;
  const yValue = d => +d.value;
  const circleRadius = 3.5;
  svg.attr("width", width);
  svg.attr("height", height);
  // const xScale = d3
  // .scaleTime()
  // .domain([Date.now(), Date.now() + 21 * 60 * 60 * 1000])
  // .range([margin.left, width - margin.right])
  // .nice();
  const g = svg.append("g");
  // .attr("transform", `translate(${margin.left}, ${margin.bottom})`);
  const xScale = d3
    .scalePoint()
    .domain(data.map(xValue))
    .range([margin.left, width - margin.right]);
  // .range([0, innerWidth]);

  const xAxis = d3.axisBottom(xScale);
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${height - margin.bottom})`);
  xAxisG.selectAll(".domain, .tick line").remove();

  const yScale = d3
    .scaleLinear()
    // .domain(d3.extent(data, yValue))
    .domain([0, d3.max(data, yValue)])
    .range([height - margin.bottom, margin.top])
    .nice();

  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  // .ticks(5);
  const yAxisG = g
    .append("g")
    .call(yAxis)
    .attr("transform", `translate(${margin.left},0)`);
  yAxisG.select(".domain").remove();
  yAxisG
    .append("text")
    .attr("y", -25)
    .attr("x", -(height - margin.bottom) / 2)
    .attr("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text(`PM2.5 (µg/m3)`);

  const lineGenerator = d3
    .line()
    .x(d => xScale(d.hour))
    .y(d => {
      // console.log(d)
      return yScale(+d.value);
    });

  g.append("path")
    // .datum(data)
    // .attr("d", lineGenerator());
    .attr("d", lineGenerator(data));

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.hour))
    .attr("cy", d => yScale(d.value))
    .attr("r", circleRadius);
});

//===============================================
//===============  barChart svg  ================
d3.csv("./assets/csv/barchart.csv").then(data => {
  const width = 130;
  const height = 110;
  const svg = d3.select(".svg--barChart");
  const render = data => {
    const xValue = d => d.year;
    const yValue = d => +d.emissions;
    const margin = { top: 20, left: 35, right: 10, bottom: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = d3
      .scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.35);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0])
      .nice(); //https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

    const xAxis = d3.axisBottom(xScale); //.tickSize(-innerHeight); //.tickFormat(xAxisTickFormat);
    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(-innerWidth)
      .ticks(5);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

    const xAxisG = g
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(0, ${innerHeight})`);
    xAxisG.selectAll(".domain, .tick line").remove();

    // xAxisG
    //   .append("text")
    //   .attr("class", "axis-label--x")
    //   .attr("y", 30)
    //   .attr("x", innerWidth / 2)
    //   .attr("fill", "white")
    //   .text(`近年度${"某污染物"}總排放量`);

    const yAxisG = g.append("g").call(yAxis);
    yAxisG.select(".domain").remove();
    yAxisG
      .append("text")
      .attr("y", -25)
      .attr("x", -innerHeight / 2)
      .attr("fill", "white")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text(`µg/m3`);

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(xValue(d)))
      .attr("y", d => yScale(yValue(d)))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(yValue(d)));
  };
  render(data);
});

//===============================================
//===============  pieChart svg  ================
const pieChartsvg = d3.select(".svg--pieChart");

//===============================================
//============  multiLinesChart svg  ============
d3.csv("./assets/csv/pm25.csv").then(rawData => {
  // console.log(rawData);
  const data = [
    {
      location: `${rawData[0].location}`,
      pollute: "PM2.5",
      value: rawData.map(d => ({
        hour: +d.hour,
        value: +d.value
      })),
      isRef: false
    },
    {
      location: `${rawData[0].location}`,
      pollute: "PM2.5",
      value: rawData.map(d => ({
        hour: +d.hour,
        value: 8
      })),
      isRef: true
    }
  ];
  // console.log(data);
  const svg = d3.select(".svg--multiLinesChart");
  const width = 553;
  const height = 190;
  const margin = { top: 20, right: 10, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  // const innerHeight = height - margin.top - margin.bottom;
  const xValue = d => +d.hour;
  const yValue = d => +d.value;
  const circleRadius = 3.5;
  svg.attr("width", width);
  svg.attr("height", height);

  const g = svg.append("g");
  // .attr("transform", `translate(${margin.left}, ${margin.bottom})`);
  const xScale = d3
    .scalePoint()
    .domain(data[0].value.map(xValue))
    .range([margin.left, width - margin.right]);
  const xAxis = d3.axisBottom(xScale);
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${height - margin.bottom})`);
  xAxisG.selectAll(".domain, .tick line").remove();

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d3.max(d.value.map(d => d.value)))])
    .range([height - margin.bottom, margin.top])
    .nice();
  const yAxis = d3.axisLeft(yScale).tickSize(-innerWidth);
  // .ticks(5);
  const yAxisG = g
    .append("g")
    .call(yAxis)
    .attr("transform", `translate(${margin.left},0)`);
  yAxisG.select(".domain").remove();
  yAxisG
    .append("text")
    .attr("y", -25)
    .attr("x", -(height - margin.bottom) / 2)
    .attr("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text(`PM2.5 (µg/m3)`);

  const lineGenerator = d3
    .line()
    .x(d => xScale(d.hour))
    .y(d => {
      // console.log(d)
      return yScale(d.value);
    });

  const path = g
    .selectAll("path")
    .data(data)
    .join("path")
    .attr("class", d => (d.isRef ? "ref" : "values"))
    .attr("d", d => lineGenerator(d.value));

  g.selectAll("circle")
    .data(data[0].value)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.hour))
    .attr("cy", d => yScale(d.value))
    .attr("r", circleRadius);

  // console.log(data.filter(d => d.isRef))
  const refTagY = data.filter(d => d.isRef)[0].value[0].value;
  g.append("text")
    .text("對健康會有疑慮的濃度")
    .attr("text-anchor", "end")
    .attr(
      "transform",
      `translate(${width - margin.right}, ${yScale(refTagY) - 10})`
    )
    .attr("fill", "#fff");
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
