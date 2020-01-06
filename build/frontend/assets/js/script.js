const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err, null]);
};
const makeRequest = opts => {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      // only run if the request is complete
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        // If successful
        opts.responseType === "arraybuffer"
          ? resolve(new Uint8Array(xhr.response))
          : resolve(JSON.parse(xhr.responseText));
      } else {
        // If false
        reject(xhr.response);
      }
    };
    // Setup HTTP request
    xhr.open(opts.method || "GET", opts.url, true);
    if (opts.headers) {
      Object.keys(opts.headers).forEach(key =>
        xhr.setRequestHeader(key, opts.headers[key])
      );
    }
    // Send the request
    if (opts.contentType === "application/json") {
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(JSON.stringify(opts.payload));
    } else {
      xhr.send(opts.payload);
    }
  });
};
let els = {
  container: document.querySelector(".container"),
  tab: document.querySelector(".tab"),
  video: document.querySelector(".video"),
  dropdownBtns: document.querySelectorAll(".dropdown--btn"),
  backgroundBtn: document.querySelector(".background__btn"),
  backgroundCheckbox: document.querySelector(".background__checkbox"),
  tablinks: document.querySelectorAll(".tab__links"),
  btnCems: document.querySelector(".btn-cems"),
  videoDropdownLinks: document.querySelectorAll(
    ".video .dropdown--content > a"
  ),
  navChartTitle: document.querySelector(".navigation__chart-title")
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
    if (evt.target.dataset.chart === "pie") {
      renderPieChart();
      renderBarChart();
    } else if (evt.target.dataset.chart === "mulitlines") {
      renderMultiLinesChart();
    } else if (evt.target.dataset.chart === "line") {
      renderLineChart();
    }
    evt.target.parentElement.parentElement.children[0].firstElementChild.innerHTML =
      evt.target.innerHTML;
  }
};

els.container.addEventListener("click", handleDropdown, false);

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
const navWidth = +window
  .getComputedStyle(document.querySelector(".navigation__chart"))
  .width.replace("px", "");
const navHeight = +window
  .getComputedStyle(document.querySelector(".navigation__chart"))
  .height.replace("px", "");
// 1. use shp2json COUNTY_MOI_1060525.shp -o county.json --encoding big5 to convert from .shp to .json with big5 encoding
// 2. d3.json read the json file
// 3. create d3 group with data.features
// 4. var projection = d3.geoMercator() to setup geo projection type
// 5. var path = d3.geoPath().projection(projection) to create path base on projection

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
    .center([121.72, 25.158]);
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
    .attr("height", navHeight)
    .on("click", function(d) {
      d3.select(this).attr("fill", "#00FFF9");
      const location = prop => {
        switch (prop) {
          case `板橋區`:
            return `環保署板橋站`;
          default:
            return prop;
        }
      };
      console.log(d.properties.number, d.properties.TOWN);
      els.navChartTitle.innerText = `${location(d.properties.TOWN)}`;
      renderMultiLinesChart();
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
const renderLineChart = _ => {
  // const location = document.querySelector(".line-chart--location").innerText;
  // console.log(year, pollute);
  // const opts = {
  //   contentType: "application/json",
  //   method: "GET",
  //   url: `factory-cems/?pollute=${pollute}&location=${location}`,
  // };
  // let err, data;
  // [err, data] = await to(makeRequest(opts));
  // if (err) {
  //   console.log(err);
  //   // throw new Error(err)
  // }
  // if (data) {
  //   console.log(data);
  //   return;
  // }
  d3.csv("./assets/csv/pm25.csv").then(data => {
    // console.log(data);
    d3.select(".background--sub__lineChart > svg").remove();
    const svg = d3
      .select(".background--sub__lineChart")
      .append("svg")
      .attr("class", "svg svg--lineChart");
    const width = +window
      .getComputedStyle(document.querySelector(".preventive"))
      .width.replace("px", "");
    // const height = +window
    //   .getComputedStyle(document.querySelector(".background--main"))
    //   .height.replace("px", "");
    const height = navHeight;
    const margin = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 40
    };
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
};

//===============================================
//===============  barChart svg  ================
const renderBarChart = _ => {
  // const pollute = document.querySelector(".pie-chart--pollute").innerText;
  // console.log(year, pollute);
  // const opts = {
  //   contentType: "application/json",
  //   method: "GET",
  //   url: `total-emision/?pollute=${pollute}`,
  // };
  // let err, data;
  // [err, data] = await to(makeRequest(opts));
  // if (err) {
  //   console.log(err);
  //   // throw new Error(err)
  // }
  // if (data) {
  //   console.log(data);
  //   return;
  // }
  console.log("run mulit chart");
  d3.csv("./assets/csv/barchart.csv").then(data => {
    const width =
      +window
        .getComputedStyle(document.querySelector(".pollution-ratio"))
        .width.replace("px", "") / 3.5;
    const height =
      +window
        .getComputedStyle(document.querySelector(".pollution-ratio"))
        .height.replace("px", "") / 4;

    d3.select(".pollution-ratio__chart--barChart > svg").remove();
    const svg = d3
      .select(".pollution-ratio__chart--barChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "svg svg--barChart");
    const render = data => {
      const xValue = d => d.name;
      const yValue = d => +d.value;
      const margin = {
        top: 20,
        left: 35,
        right: 10,
        bottom: 20
      };
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
};

//===============================================
//===============  pieChart svg  ================
const renderPieChart = _ => {
  const year = document.querySelector(".pie-chart--year").innerText;
  const pollute = document.querySelector(".pie-chart--pollute").innerText;
  // console.log(year, pollute);
  // const opts = {
  //   contentType: "application/json",
  //   method: "GET",
  //   url: `/?year=${year}&pollute=${pollute}`,
  // };
  // let err, data;
  // [err, data] = await to(makeRequest(opts));
  // if (err) {
  //   console.log(err);
  //   // throw new Error(err)
  // }
  // if (data) {
  //   console.log(data);
  //   return;
  // }
  d3.csv("./assets/csv/pollute_ratio.csv").then(rawData => {
    const dataset = {
      "PM2.5": rawData
        .filter(d => d.pollute === "PM2.5")
        .map(d => ({
          name: d.source,
          value: +d.ratio.replace("%", "")
        })),
      SOx: rawData
        .filter(d => d.pollute === "SOx")
        .map(d => ({
          name: d.source,
          value: +d.ratio.replace("%", "")
        })),
      NOx: rawData
        .filter(d => d.pollute === "NOx")
        .map(d => ({
          name: d.source,
          value: +d.ratio.replace("%", "")
        })),
      NMHC: rawData
        .filter(d => d.pollute === "NMHC")
        .map(d => ({
          name: d.source,
          value: +d.ratio.replace("%", "")
        }))
    };
    // console.log(dataset);
    // console.log(pollute);
    const data = dataset[`${pollute}`];
    // const color = d3
    //   .scaleLinear()
    //   .domain([0, data.length])
    //   .range(["#49BDCA", "#fff"]);
    const color = d3
      .scaleOrdinal()
      .range([
        "#00FFF9",
        "#49BDCA",
        "#50848E",
        "#179bbf",
        "#00627d",
        "#fff",
        "#BED1D5"
      ]);
    const width = +window
      .getComputedStyle(document.querySelector(".preventive"))
      .width.replace("px", "");
    const height = +window
      .getComputedStyle(document.querySelector(".preventive"))
      .height.replace("px", "");
    // svg.attr("width", width);
    // svg.attr("height", height);
    const outerRadius = Math.min(width, height) / 4;
    const innerRadius = Math.min(width, height) / 5.5;
    // var donutWidth = 35; //This is the size of the hole in the middle
    // const svg = d3.select(".svg--pieChart");

    d3.select("#donut > svg").remove();
    const svg = d3
      .select("#donut")
      .append("svg")
      .attr("width", width)
      .attr("height", height * 0.8)
      .append("g")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + (height * 0.8) / 2 + ")"
      );
    // const arc = function(d) {
    //   return d3
    //     .arc()
    //     .outerRadius(outerRadius)
    //     .innerRadius(innerRadius)(d);
    // };
    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
    const pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });
    console.log(data);
    const g = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");
    g.transition()
      .delay(function(d, i) {
        return i * 500;
      })
      .duration(500)
      .attrTween("d", angleTween);

    const path = g
      .append("path")
      .attr("d", d => arc(d))
      .style("fill", function(d, i) {
        return color(i);
      });

    const text = g
      .append("text") //add a label to each slice
      .attr("transform", function(d) {
        //set the label's origin to the center of the arc
        d.innerRadius = 0;
        d.outerRadius = outerRadius;
        return (
          "translate(" +
          d3
            .arc()
            .outerRadius(outerRadius * 3)
            .centroid(d)[0] +
          "," +
          d3
            .arc()
            .outerRadius(outerRadius * 3)
            .centroid(d)[1] +
          ")"
        );
      })
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        return data[i].name + data[i].value + "%";
      })
      .attr("fill", "white");

    // text
    //   .transition()
    //   .delay(function(d, i) {
    //     return i * 500 + 500;
    //   })
    //   .duration(500)
    //   // .ease("cubic-in-out")
    //   .attrTween("fill", fillTween);

    const line = g
      .append("line")
      .attr("stroke", "#fff")
      .attr("stroke-width", "2px")
      .attr("x1", function(d) {
        return d3
          .arc()
          .outerRadius(outerRadius * 3)
          .centroid(d)[0];
      })
      .attr("y1", function(d) {
        return d3
          .arc()
          .outerRadius(outerRadius * 2.8)
          .centroid(d)[1];
      })
      .attr("x2", function(d) {
        return d3
          .arc()
          .outerRadius(outerRadius * 1.5)
          .centroid(d)[0];
      })
      .attr("y2", function(d) {
        return d3
          .arc()
          .outerRadius(outerRadius * 2)
          .centroid(d)[1];
      });
    // line
    //   .transition()
    //   .delay(function(d, i) {
    //     return i * 500 + 500;
    //   })
    //   .duration(500)
    //   .attrTween("x2", xTween)
    //   .attrTween("y2", yTween)
    //   .attr("class", "line");

    // 弧形角度的動畫
    var angleTween = function(d) {
      var i = d3.interpolate(d.startAngle, d.endAngle);
      return function(t) {
        d.endAngle = i(t);
        d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius);
        return arc;
      };
    };

    // 文字顏色的動畫
    var fillTween = function(d) {
      var i = d3.interpolate("#FFF", "#C70");
      return function(t) {
        return i(t);
      };
    };

    // 線條的動畫 (x座標)
    var xTween = function(d) {
      var i = d3.interpolate(
        arc.outerRadius(outerRadius * 1.3).centroid(d)[0],
        arc.outerRadius(outerRadius * 2.2).centroid(d)[0]
      );
      return function(t) {
        return i(t);
      };
    };

    // 線條的動畫 (y座標)
    var yTween = function(d) {
      var i = d3.interpolate(
        arc.outerRadius(outerRadius * 1.3).centroid(d)[1],
        arc.outerRadius(outerRadius * 2.2).centroid(d)[1]
      );
      return function(t) {
        return i(t);
      };
    };
  });
};

//===============================================
//============  multiLinesChart svg  ============
const renderMultiLinesChart = _ => {
  // const location = els.navChartTitle.innerText;
  // const pollute = document.querySelector(".mulit-chart--pollute").innerText;
  // console.log(year, pollute);
  // const opts = {
  //   contentType: "application/json",
  //   method: "GET",
  //   url: `district-cems/?pollute=${pollute}&location=${location}`,
  // };
  // let err, data;
  // [err, data] = await to(makeRequest(opts));
  // if (err) {
  //   console.log(err);
  //   // throw new Error(err)
  // }
  // if (data) {
  //   console.log(data);
  //   return;
  // }
  d3.csv("./assets/csv/pm25.csv").then(rawData => {
    // console.log(rawData);
    const data = [
      {
        // location: `${rawData[0].location}`,
        // pollute: "PM2.5",
        value: rawData.map(d => ({
          hour: +d.hour,
          value: +d.value
        })),
        isRef: false
      },
      {
        // location: `${rawData[0].location}`,
        // pollute: "PM2.5",
        value: rawData.map(d => ({
          hour: +d.hour,
          value: 8
        })),
        isRef: true
      }
    ];
    // console.log(data);
    d3.select(".navigation__chart > svg").remove();
    const svg = d3
    .select(".navigation__chart")
    .append("svg")
    .attr("class", "svg svg--multiLinesChart");
    const width = navWidth;
    const height = navHeight;
    svg.attr("width", width);
    svg.attr("height", height); //?
    console.log(width, height);
    // const height = 200;
    const margin = {
      top: 20,
      right: 10,
      bottom: 20,
      left: 35
    };
    const innerWidth = width - margin.left - margin.right;
    // const innerHeight = height - margin.top - margin.bottom;
    const xValue = d => +d.hour;
    const yValue = d => +d.value;
    const circleRadius = 3.5;

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
};

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

window.onload = () => {
  renderPieChart();
  renderBarChart();
  renderMultiLinesChart();
  renderLineChart();
};

// document.querySelector(".show").innerText = `Height:${window.innerHeight}, Width:${window.innerWidth}, ${Math.random()*10}`
