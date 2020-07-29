# EnvDashboard

Project for Air Quality Improvement Project

## API

基本回傳格式：

```javascript
{
	success,
	message,
	data,
	code,
}
```

### Weather Summary
GET Weather summary with specific location like 淡水, 鶯歌, 三峽, 永和, 金山, 新莊, 貢寮, 新店, 烏來, 樹林, 萬里, 八里, 板橋, 石門, 三重, 雙溪, 中和, 平溪, 三芝, 坪林, 石碇, 五股, 泰山, 林口, 深坑, 汐止, 瑞芳, 土城, 蘆洲

GET `/weather?location=${location}`

response:

```
{
    "success": true,
    "message": "get weather summary in 板橋", 
    "data": {
        "SiteName": "板橋",
	"County": "新北市",
	"AQI": "31",
	"Pollutant": "",
	"Status": "良好",
	"SO2": "1.8",
	"CO": "0.34",
	"CO_8hr": "0.4",
	"O3": "42",
	"O3_8hr": "34",
	"PM10": "17",
	"PM2.5": "8",
	"NO2": "13",
	"NOx": "16",
	"NO": "2.7",
	"WindSpeed": "2.7",
	"WindDirec": "75",
	"PublishTime": "2020-03-06 13:00",
	"PM2.5_AVG": "9",
	"PM10_AVG": "17",
	"SO2_AVG": "2",
	"Longitude": "121.458667",
	"Latitude": "25.012972",
	"SiteId": "6",
	"date": "民國 109年 3月 6日",
	"quote": "今日板橋區空氣品質良好，是個適合出遊的好日子",
	"location": "板橋區",
	"weather": "thundershower",
	"chanceOfRain": 0,
	"temperature": "25",
	"apparentTemp": "24",
	"highTemp": "25",
	"lowTemp": "18",
	"windDirection": "偏東風"
    },
    "code": "00000"
}
```

### Pollution Types [BACKEND UPDATE REQUEST](https://docs.google.com/spreadsheets/d/136Bn58PBzvePEXeR-xiAtOnUtgNd8E3W/edit#gid=1901567639)
GET Polltion Types for cems

GET `/pollutionTypes`

response:

```
{
    "success": true,
    "message": "get pollution types",
    "data":[UPDATE] {"AQI":"","SO2":"ppb","SO2":"ppb","CO":"ppm","O3":"ppb","PM10":"µg/m3","PM2.5":"µg/m3","NO2":"ppb"}, // "NOX", "NO" removed 
    "code": "00000"
}
```

### CEMS Locations
GET location list of CEMS

GET `/aqiStations`

response:
```
{
    "success": true,
    "message": "get AQI cems location",
    "data": ["富貴角", "樹林", "汐止", "萬里", "新店", "土城", "板橋", "新莊", "菜寮", "林口", "淡水", "永和", "三重"],
    "code": "00000"
}
```

### District Pollute Chart [BACKEND UPDATE REQUEST](https://docs.google.com/spreadsheets/d/136Bn58PBzvePEXeR-xiAtOnUtgNd8E3W/edit#gid=1901567639)

GET 當日不同測站(共有九個測站， ex:`環保署板橋站`)或是不同區域連續 24 小時(0 時-23 時，共 24 個數據)，不同污染物濃度資料 `(包括PM2.5、SO2、NO2、O3)`，繪製時序變化圖，並根據所選取的污染物給出對應的對健康不利的參考濃度。

GET `/pollution/24h?location=${location}&pollution=${pollution}`

response:

```
{
  "success": true,
  "message": "success",
  "data": {
    "pollution": "PM2.5",
    "location": "板橋",
    "safeRange": [UPDATE] {"level1": 35.5, "level2": 54.5},
    "dataset": [
      { "hour": 20, "value": 15 },
      { "hour": 21, "value": 17 },
      { "hour": 22, "value": 13 },
      { "hour": 23, "value": 11 },
      { "hour": 0, "value": 12 },
      { "hour": 1, "value": 9 },
      { "hour": 2, "value": 10 },
      { "hour": 3, "value": 11 },
      { "hour": 4, "value": 8 },
      { "hour": 5, "value": 8 },
      { "hour": 6, "value": 8 },
      { "hour": 7, "value": 7 },
      { "hour": 8, "value": 10 },
      { "hour": 9, "value": 10 },
      { "hour": 10, "value": 10 },
      { "hour": 11, "value": 8 },
      { "hour": 12, "value": 10 }
    ]
  },
  "code": "00000"
}
```

### Factory Pollutes
GET Factory Pollutes options

GET `/factory-pollutes/`

response:

```
{
  "success": true,
  "message": "success",
  "data": ["PM2.5", "NOx", "O2"],
  "code": "00000"
}
```

### Factory Pollute Chart

`林口電廠`(各工程的)各染物排放監測濃度及其標準濃度時序變化圖。

GET `/factory-cems/?location=\${location}

response:

```
{
  "success": true,
  "message": "success",
  "data": {
    "SO2": {
      "values": [6, 8, 9, 6, 6, 10, 9, 9, 8, 7, 5, 5, 6, 6, 10, 8, 9, 5, 7, 5, 6, 6, 4, 6],
      "refValues": 12
    },
    "NOx": {
      "values": [6, 8, 9, 6, 6, 10, 9, 9, 8, 7, 5, 5, 6, 6, 10, 8, 9, 5, 7, 5, 6, 6, 4, 6],
      "refValues": 12
    },
    "O2": {
      "values": [6, 8, 9, 6, 6, 10, 9, 9, 8, 7, 5, 5, 6, 6, 10, 8, 9, 5, 7, 5, 6, 6, 4, 6],
      "refValues": 12
    }
  },
  "code": "00000"
}


```

### Analysis Pollutes
GET Analysis Pollutes options & year options

GET `/analysis-pollutes/`

response:

```
{
  "success": true,
  "message": "success",
  "data": {
    "pollutes": ["PM2.5", "SO2", "NO2", "O3"],
    "year": [100, 101, 102, 103, 104, 105, 106, 107, 108]
  },
  "code": "00000"
}
```

### Pollution Analysis Chart

根據所選的`年度`及`污染物`，得到該污染物在該年度污染來源的比例（pieChart），及(所選擇的年度)與前兩年，不同污染物的總排放量比較（barChart）。

GET `/analysis-of-pollution/?year=${year}&pollute=${pollute}`,

response:

```
{
  "success": true,
  "message": "success",
  "data": {
    "pieChart": [
      {
        "name": "公路運輸",
        "value": 38
      },
      {
        "name": "餐飲業",
        "value": 19
      },
      {
        "name": "車輛行駛揚塵(鋪)",
        "value": 12
      },
      {
        "name": "建築/施工",
        "value": 9
      },
      {
        "name": "農業操作",
        "value": 5
      },
      {
        "name": "其他",
        "value": 17
      }
    ],
    "barChart": [
      {
        "name": "106年度",
        "value": 1990
      },
      {
        "name": "107年度",
        "value": 3000
      },
      {
        "name": "108年度",
        "value": 2600
      }
    ],
    "code": "00000"
  }
}
```

