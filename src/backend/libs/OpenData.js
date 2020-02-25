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
    };
    this.timer = setInterval(run, 3600000);
    run();
  }

  async crawlAQI() {
    const now = new Date().getTime();
    let result;
    if(aqi.timestamp + 3600000 < now) {
      const targetURL = 'http://opendata.epa.gov.tw/webapi/Data/REWIQA/?$orderby=County&$skip=0&$top=1000&format=json&token=OfsHxaW3FEmG23qxZlqQmA';
      result = await this.request({ targetURL })
      result = result.filter((v) => {
        return v.County == '新北市';
      });
      this.aqi = { data: result, timestamp: now };
    } else {
        result = aqi.data;
    }
    return Promise.resolve(result);
  }

  topData() {
    
  }
}

module.exports = OpenData;