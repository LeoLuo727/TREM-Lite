const constant = {
	WEBSOCKET_URL : ["wss://ws.exptech.com.tw/websocket"],
	WS_CONFIG     : {
		type    : "start",
		key     : "K0Q9Z4BJ23YVGNM7Q0G6D10V5QLFX4",
		service : ["trem.rts"],
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
	BOX_GEOJSON : {},
	REGION      : {},

	LANG                    : {},
	CONFIG_AUTO_SAVE_TIME   : 10000,
	STATION_INFO_FETCH_TIME : 30000,
	API_HTTP_TIMEOUT        : 2500,
	API_HTTP_RETRY          : 1500,
	API_WEBSOCKET_RETRY     : 5000,
	API_WEBSOCKET_VERIFY    : 3000,
};

const variable = {
	map              : null,
	subscripted_list : [],
	station_info     : {},
	station_icon     : {},
	time_offset      : 0,
	config           : {},
	_config          : "",
};