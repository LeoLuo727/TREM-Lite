/* eslint-disable no-undef */
const constant = {
  WS_CONFIG: {
    type    : "start",
    key     : "K0Q9Z4BJ23YVGNM7Q0G6D10V5QLFX4",
    service : ["trem.rts", "websocket.eew", "websocket.report", "websocket.tsunami", "trem.intensity", "cwa.intensity"],
    // config  : {
    // 	"eew.cwa": {
    // 		"loc-to-int": false,
    // 	},
    // },
  },

  MAP_LIST       : ["TW", "JP", "CN", "KR", "KP"],
  COLOR_PRIORITY : { "#28FF28": 2, "#F9F900": 1, "#FF0000": 0 },

  REGION_CODE: {
    1001 : "臺灣東北部海域",
    1002 : "臺灣東部海域",
    1003 : "臺灣東南部海域",
    1004 : "臺灣西北部海域",
    1005 : "臺灣西部海域",
    1006 : "臺灣西南部海域",
    1007 : "臺灣北部海域",
    1008 : "臺灣南部海域",

    1101 : "石垣島附近海域",
    1102 : "宮古島附近海域",
    1111 : "東沙群島附近海域",
    1121 : "呂宋島北部海域",

    2001 : "宜蘭縣近海",
    2002 : "花蓮縣近海",
    2003 : "臺東縣近海",
    2004 : "新北市近海",
    2005 : "基隆市近海",
    2006 : "桃園市近海",
    2007 : "新竹縣近海",
    2008 : "新竹市近海",
    2009 : "苗栗縣近海",
    2010 : "臺中市近海",
    2011 : "彰化縣近海",
    2012 : "雲林縣近海",
    2013 : "嘉義縣近海",
    2014 : "臺南市近海",
    2015 : "高雄市近海",
    2016 : "屏東縣近海",
    2017 : "連江縣近海",
    2018 : "金門縣近海",
    2019 : "澎湖縣近海",

    9999: "未知區域",
  },
  BOX_GEOJSON       : {},
  REGION            : {},
  TIME_TABLE        : {},
  TIME_TABLE_OBJECT : [],

  LANG                    : {},
  CONFIG_AUTO_SAVE_TIME   : 10_000,
  STATION_INFO_FETCH_TIME : 300_000,
  API_HTTP_TIMEOUT        : 2_500,
  API_HTTP_RETRY          : 5_000,
  API_WEBSOCKET_RETRY     : 5_000,
  API_WEBSOCKET_VERIFY    : 3_000,
  TAIWAN_BOUNDS           : [
    [25.33, 119.31],
    [21.88, 122.18],
  ],
  AUDIO: {
    ALERT     : new Audio("../audio/ALERT.wav"),
    EEW       : new Audio("../audio/EEW.wav"),
    INTENSITY : new Audio("../audio/INTENSITY.wav"),
    PGA1      : new Audio("../audio/PGA1.wav"),
    PGA2      : new Audio("../audio/PGA2.wav"),
    REPORT    : new Audio("../audio/REPORT.wav"),
    SHINDO0   : new Audio("../audio/SHINDO0.wav"),
    SHINDO1   : new Audio("../audio/SHINDO1.wav"),
    SHINDO2   : new Audio("../audio/SHINDO2.wav"),
    TSUNAMI   : new Audio("../audio/TSUNAMI.wav"),
    UPDATE    : new Audio("../audio/UPDATE.wav"),
  },
};

const variable = {
  map       : null,
  map_layer : {
    eew: {},
  },
  subscripted_list   : [],
  station_info       : null,
  station_icon       : {},
  time_offset        : 0,
  config             : {},
  _config            : "",
  replay             : 0,
  replay_timestamp   : 0,
  replay_list        : [],
  ws_connected       : false,
  ws_reconnect       : true,
  last_get_data_time : 0,
  eew_list           : {},
  icon_size          : 0,
  intensity_list     : {},
  intensity_geojson  : null,
  tsunami_geojson    : null,
  intensity_time     : 0,
  audio              : {
    shindo : -1,
    pga    : -1,
    status : {
      shindo : 0,
      pga    : 0,
    },
    count: {
      pga_1    : 0,
      pga_2    : 0,
      shindo_1 : 0,
      shindo_2 : 0,
    },
  },
  focus: {
    bounds: {
      report    : null,
      intensity : null,
      tsunami   : null,
      eew       : null,
      rts       : null,
    },
    status: {
      report    : 0,
      intensity : 0,
      tsunami   : 0,
      eew       : 0,
      rts       : 0,
    },
  },
  speech_status : 0,
  last_map_hash : "",
};

const domMethods = {
  querySelector    : document.querySelector.bind(document),
  querySelectorAll : document.querySelectorAll.bind(document),
  createElement    : document.createElement.bind(document),
};

const { querySelector, querySelectorAll, createElement } = domMethods;

function UserCheckBox() {
  const userCheckbox = JSON.parse(localStorage.getItem("user-checkbox"));
  return userCheckbox;
}

function display_element(elements, type) {
  elements.forEach(element => {
    if (type)
      element.style.display = type;
    else
      element.style.display = "none";
  });
}

function opacity(elements, type) {
  elements.forEach(element => {
    element.style.opacity = type;
  });
}