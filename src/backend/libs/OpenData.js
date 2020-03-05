const url = require('url');
const path = require('path');
const ecrequest = require('ecrequest');
const Bot = require(path.resolve(__dirname, 'Bot.js'));
const Utils = require(path.resolve(__dirname, 'Utils'));

class OpenData extends Bot {
  constructor() {
    super();
    this.name = 'OpenData';
  }

  init({ database, logger, i18n }) {
    return super.init({ database, logger, i18n });
  }

  start() {
    this.crawlAll();
    return super.start();
  }

  ready() {
    return super.ready();
  }

  request({ targetURL, dataType ='JSON' }) {
    const opt = url.parse(targetURL);
    return ecrequest.request(opt).then(({ headers, data }) => {
      let result = Utils.parseData({ data, format: 'JSON' });
      return result;
    });
  }

  crawlAll() {
    clearInterval(this.timer);
    const run = async () => {
      await this.crawlAQI();
      console.log(1);
      await this.crawlWeather();
      console.log(2);
      await this.saveAirHistory();
      console.log(3);
    };
    this.timer = setInterval(run, 3600000);
    run();
  }

  async crawlAQI() {
    const timestamp = new Date().getTime();
    let result;
    const targetURL = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=County&$skip=0&$top=1000&format=json&token=OfsHxaW3FEmG23qxZlqQmA';
    result = await this.request({ targetURL });
    result = result.filter((v) => {
      return v.County == '新北市';
    });
    this.aqi = result;
  }

  async crawlWeather() {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const weatherType = ['sunny', 'cloudy', 'rain', 'thundershower'];
    let list;

    const targetURL = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-DA6F23D8-AF4A-4497-8C11-1E07120A9B0D';
    list = await this.request({ targetURL });
    list = list.records.locations[0].location.map((v) => {
      const temperatureArray = v.weatherElement[3].time.map((v) => {
        const value = v.elementValue[0].value;
        return value;
      }).sort();
      const lowTemp = temperatureArray[0];
      const highTemp = temperatureArray[temperatureArray.length - 1];
      
      const record = {
        date: `民國 ${(currentDate.getFullYear() - 1911)}年 ${(currentDate.getMonth() + 1)}月 ${currentDate.getDate()}日`,
        quote: `今日${v.locationName}空氣品質良好，是個適合出遊的好日子`,
        location: v.locationName,
        weather: weatherType[Math.floor(Math.random() * weatherType.length)], //v.weatherElement[1].time[0].elementValue[0].value,
        chanceOfRain: v.weatherElement[0].time[0].elementValue[0].value / 100,
        temperature: v.weatherElement[3].time[0].elementValue[0].value,
        apparentTemp: v.weatherElement[2].time[0].elementValue[0].value,
        highTemp,
        lowTemp,
        windDirection: v.weatherElement[9].time[0].elementValue[0].value
      };
      return record;
    });
    this.weather = list;
  }

  findWeather(location) {
    if(!this.weather) {
      return {};
    }

    const weather = this.weather.find((v) => {
      return v.location == location;
    }) ||
    this.weather.find((v) => {
      return v.location == '板橋區';
    });
    return weather;
  }

  findAQI(location) {
    if(!this.aqi) {
      return {};
    }

    let searchKey;
    if(location && location.indexOf('區') == location.length - 1) {
      searchKey = location.substr(0, location.legnth - 1);
    }

    const aqi = this.aqi.find((v) => {
      return v.SiteName == searchKey;
    }) ||
    this.aqi.find((v) => {
      return v.SiteName == '板橋';
    });
    return aqi;
  }

  async saveAirHistory() {
    const dataset = {
      weather: this.weather,
      aqi: this.aqi
    };
    
    if(!dataset.weather || !dataset.aqi) {
      return;
    } else {
      const jobs = dataset.weather.map((v, k) => {
        const data = this.makeSummary({ weather: v, aqi: dataset.aqi[k] });
        return this.saveAirHistoryLocation({ data });
      });
      return Promise.all(jobs);
    }
  }

  async saveAirHistoryLocation({ data }) {
    let timestamp = new Date(data.PublishTime).getTime();
    let key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });
/*
    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });

    timestamp = timestamp - 3600000;
    key = `AIR.${timestamp}`;
    console.log(`write: ${key}`);
    await this.write({ key, value: data });
*/
  }

  async pollution({ pollution = 'PM2.5' }) {
    const timestamp = new String(new Date().getTime() - 86400000).substr(0, 4);
    const key = `AIR.`;
    const data = await this.find({ key });
    return data;
  }

  makeSummary({ aqi, weather }) {
    const result = {};
    Object.keys(aqi).map((v) => {
      result[v] = aqi[v];
    });
    Object.keys(weather).map((v) => {
      result[v] = weather[v];
    });
    return result;
  }

  summary({ query }) {
    const location = query.location;
    const aqi = this.findAQI(location);
    const weather = this.findWeather(location);
    const result = this.makeSummary({ aqi, weather });
    
    return Promise.resolve(result);
  }
}

module.exports = OpenData;