# MerMer-framework

MerMer Framework for Front End and Back End

## Install

```shell
npm i -g mermer
```

## Initial New Project

```shell
mermer init /path/to/your/new/project
```

### edit package

```shell
vi /path/to/your/new/project/package.json
```

### edit config

```shell
cp /path/to/your/new/project/default.config.toml /path/to/your/new/project/private/config.toml
vi /path/to/your/new/project/private/config.toml
```

```toml
[api]
pathname = [
  "get | /,/version | Static.Utils.readPackageInfo"
]

# [method] | [path] | [execute function]
```

## Run Project

```
cd /path/to/your/new/project/
npm install
npm start
```

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

### District Pollutes
GET District Pollutes options

GET `/district-pollutes/`

response:

```
{
    "success": true,
    "message": "success",
    "data": ["PM2.5", "SO2", "NO2", "O3"],
    "code": "00000"
}
```

### District Pollute Chart

GET 當日不同測站(共有九個測站， ex:`環保署板橋站`)或是不同區域連續 24 小時(0 時-23 時，共 24 個數據)，不同污染物濃度資料 `(包括PM2.5、SO2、NO2、O3)`，繪製時序變化圖，並根據所選取的污染物給出對應的對健康不利的參考濃度。

GET `/district-cems/?location=${location}&pollute=${pollute}`

response:

```
{
  "success": true,
  "message": "success",
  "data": {
    "values": [6, 8, 9, 6, 6, 10, 9, 9, 8, 7, 5, 5, 6, 6, 10, 8, 9, 5, 7, 5, 6, 6, 4, 6],
    "refValue": 8
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

