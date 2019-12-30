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
### Mulit-lines Chart

GET `/district-cems/?pollute=${pollute}&location=${location}`

response:
```
{
    "success": true,
    "message": "success",
    "data":[
      {
        value:[
                 {
                   hour:0,
                   value: 6
                 },
                  {
                   hour:1,
                   value: 10
                 },
                  {
                   hour:2,
                   value: 8
                 }
                 ...
        ],
        isRef: false
      },
      {
        value: [
                 {
                   hour:0,
                   value: 8
                 },
                  {
                   hour:1,
                   value: 8
                 },
                  {
                   hour:2,
                   value: 8
                 }
                 ...
        ],
        isRef: true
      },
    ]},
    "code": "00000"
}
```

### Line Chart

GET  `/factory-cems/?location=${location}

response:
```
{
    "success": true,
    "message": "success",
    "data":  [
                 {
                   hour:0,
                   value: 8
                 },
                  {
                   hour:1,
                   value: 12
                 },
                  {
                   hour:2,
                   value: 9
                 }
                 ...
        ],
    "code": "00000"

```

### Pie Chart

GET `/analysis-of-pollution-source/?year=${year}&pollute=${pollute}`,

response:
```
{
    "success": true,
    "message": "success",
    "data": [
            {
                "name": "公路運輸",
                "value": 38,
            },
             {
                "name": "餐飲業",
                "value": 19,
            },
             {
                "name": "車輛行駛揚塵(鋪)",
                "value": 12,
            },
             {
                "name": "建築/施工",
                "value": 9,
            },
             {
                "name": "農業操作",
                "value": 5,
            },
             {
                "name": "其他",
                "value": 17,
            },
            ...
        ],
    "code": "00000"
}
```
### Bar Chart

GET  `/total-emision/?pollute=${pollute}`,

response:
```
{
    "success": true,
    "message": "success",
    "data":[
            {
                "name": "106年度",
                "value": 1990,
            },
             {
                "name": "107年度",
                "value": 3000,
            },
             {
                "name": "108年度",
                "value": 2600,
            },
        ]
    "code": "00000"
}
```
