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

  init({ database, logger, i18n, config }) {
    return super.init({ database, logger, i18n, config });
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
      await this.crawlWeather();
      await this.saveAirHistory();
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
      return;
    }

    const weather = this.weather.find((v) => {
      return new RegExp(location).test(v.location);
    }) ||
    this.weather.find((v) => {
      return v.location == '板橋區';
    });
    return weather;
  }

  findAQI(location) {
    if(!this.aqi) {
      return;
    }

    const aqi = this.aqi.find((v) => {
      return new RegExp(location).test(v.SiteName);
    }) ||
    this.aqi.find((v) => {
      return v.SiteName == '板橋';
    });
    return aqi;
  }

  findSearchKey(location) {
    if(!location || !(location.length > 0)) {
      return '板橋';
    }
    let weather = this.findWeather(location);
    const result = !!weather ? '板橋' : weather.location.substr(0, 2);
    return result;
  }

  findPollutionKey(pollution) {
    const list = this.config.env.pollutions;
    const result = list.find((v) => {
      return new RegExp(v, 'i').test(pollution);
    }) || 'PM2.5';
    return result;
  }

  async saveAirHistory() {
    const dataset = {
      weather: this.weather,
      aqi: this.aqi
    };
    
    if(!dataset.weather || !dataset.aqi) {
      return;
    } else {
      let PublishTime = 0;
      const jobs = dataset.weather.map((v, k) => {
        const SiteName = v.location.substr(0, 2);
        const weather = v;
        const aqi = dataset.aqi.find((v) => {
          return new RegExp(SiteName).test(v.SiteName);
        }) || {};
        if(!aqi.PublishTime) {
          aqi.PublishTime = PublishTime;
        } else {
          PublishTime = aqi.PublishTime;
        }
        const data = this.makeSummary({ weather, aqi });
        return this.saveAirHistoryLocation({ data });
      });
      return Promise.all(jobs);
    }
  }

  async saveAirHistoryLocation({ data }) {
    let timestamp = new Date(data.PublishTime).getTime();
    let SiteName = data.location.substr(0, 2);
    let key = `AIR.${SiteName}.${timestamp}`;
    await this.write({ key, value: data });
  }

  parsePollution({ data, pollution }) {
    const result = data.map((v) => {
      const hour = new Date(v.value.PublishTime).getHours() || 0;
      const value = parseInt(v.value[pollution]) || 0;
      return { hour, value };
    });
    return result;
  }

  pollutionTypes() {
    const data = this.config.env.pollutions;
    return {
      success: true,
      message: `get pollution types`,
      data,
      code: '00000'
    };
  }

  aqiStations() {
    if(!this.aqi) {
      return Promise.resolve({
        success: false,
        message: `no AQI cems data`,
        code: '00001'
      });
    }
    const stations = this.aqi.map((v) => {
      return v.SiteName;
    });
    return Promise.resolve({
      success: true,
      message: `get AQI cems location`,
      data: stations,
      code: '00000'
    });
  }

  async pollution24h({ query: { pollution = 'PM2.5', location = '板橋' }}) {
    const timestamp = new String(new Date().getTime() - 86400000).substr(0, 3);
    const searchLocation = this.findSearchKey(location);
    const searchPollution = this.findPollutionKey(pollution);
    const key = `AIR.${searchLocation}.${timestamp}`;
    const data = await this.find({ key });
    const dataset = this.parsePollution({ data, pollution: searchPollution });
    if(dataset.length > 24) {
      dataset.splice(0, dataset.length - 24);
    }
    const result = {
      pollution: searchPollution,
      location: searchLocation,
      safeRange: 12,
      dataset
    };
    return {
      success: true,
      message: `get pollution ${searchPollution} in ${searchLocation}`,
      data: result,
      code: '00000'
    };
  }

  makeSummary({ aqi, weather }) {
    const result = {};
    Object.keys(aqi || {}).map((v) => {
      result[v] = aqi[v];
    });
    Object.keys(weather || {}).map((v) => {
      result[v] = weather[v];
    });
    return result;
  }

  summary({ query }) {
    const location = query.location;
    const searchKey = this.findSearchKey(location);
    const aqi = this.findAQI(searchKey);
    const weather = this.findWeather(searchKey);
    const data = this.makeSummary({ aqi, weather });
    const result = {
      success: true,
      message: `get weather summary in ${searchKey}`,
      data,
      code: '00000'
    };
   
    return Promise.resolve(result);
  }
}

module.exports = OpenData;