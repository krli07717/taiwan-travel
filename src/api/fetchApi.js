import API_KEY from "./apiKey.js";
import getRequestHeader from "./requestHeader.js";

const mainCategories = ["熱門景點", "美食品嘗", "住宿推薦", "觀光活動"];
const mainCategoryToEnglish = {
  熱門景點: "ScenicSpot",
  美食品嘗: "Restaurant",
  住宿推薦: "Hotel",
  觀光活動: "Activity",
};
const themeSets = ["歷史", "文化", "戶外", "踏青", "宗教", "巡禮", "親子"];
const cityToEnglish = {
  台北: "Taipei",
  新北: "NewTaipei",
  桃園: "Taoyuan",
  台中: "Taichung",
  台南: "Tainan",
  高雄: "Kaohsiung",
  基隆: "Keelung",
  新竹: "Hsinchu",
  苗栗: "MiaoliCounty",
  彰化: "ChanghuaCounty",
  南投: "NantouCounty",
  雲林: "YunlinCounty",
  嘉義: "Chiayi",
  屏東: "PingtungCounty",
  宜蘭: "YilanCounty",
  花蓮: "HualienCounty",
  台東: "TaitungCounty",
  金門: "KinmenCounty",
  澎湖: "PenghuCounty",
  連江: "LienchiangCounty",
};

async function fetchOne(urlName, url) {
  try {
    const response = await fetch(url, { headers: getRequestHeader(API_KEY) });
    const data = await response.json();
    return { urlName: urlName, data: data };
  } catch (error) {
    throw error;
  }
}

async function fetchTdxApi(urls) {
  try {
    const fetchAll = await Promise.allSettled(
      Object.entries(urls).map(([urlName, url]) => {
        return fetchOne(urlName, url);
      })
    );
    return fetchAll.map((resolved) => resolved.value);
  } catch (error) {
    throw error;
  }
}

export default async function fetchBy(searchParamsObj) {
  try {
    const noValidQueries =
      !searchParamsObj.hasOwnProperty("city") &&
      !searchParamsObj.hasOwnProperty("categories") &&
      !searchParamsObj.hasOwnProperty("keyword");

    if (noValidQueries) {
      //首頁
      console.log("首頁，fetch 4種url");
      const previewCount = 30;
      const urls = {
        熱門景點: `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$orderby:UpdateTime&$top=${previewCount}&$format=JSON`,
        美食品嘗: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$orderby=UpdateTime&$top=${previewCount}&$format=JSON`,
        住宿推薦: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel?$orderby=UpdateTime&$top=${previewCount}&$format=JSON`,
        觀光活動: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$orderby=UpdateTime&$top=${previewCount}&$format=JSON`,
      };
      const data = await fetchTdxApi(urls);
      return data;
    }

    // 判斷篩選
    const { city, keyword, categories } = searchParamsObj;
    const apiFilter = {
      keyword: keyword,
      city: cityToEnglish[city],
      mainUrls: mainCategories
        .map((category) => {
          if (categories?.includes(category)) return category;
        })
        .filter((category) => category),
      themes: themeSets
        .map((theme) => {
          if (categories?.join("").includes(theme)) return theme;
        })
        .filter((theme) => theme),
    };

    console.log(`apiFilter\n`, apiFilter);

    let baseUrl = "https://ptx.transportdata.tw/MOTC/v2/Tourism/";
    let apis;

    // 決定請求幾筆url
    function apiReducer(apiObj, urlName) {
      apiObj[urlName] = baseUrl + mainCategoryToEnglish[urlName];
      return apiObj;
    }
    apiFilter.mainUrls.length
      ? (apis = apiFilter.mainUrls.reduce(apiReducer, {}))
      : (apis = mainCategories.reduce(apiReducer, {}));

    // 增加篩選城市
    if (apiFilter.city) {
      for (const [key, value] of Object.entries(apis)) {
        apis[key] = value + `/${apiFilter.city}`;
      }
    }

    // 增加篩選主題關鍵字/自訂關鍵字
    let filter = "";

    const themeFilterString = apiFilter.themes
      .map((theme) => {
        return `contains(Description,'${theme}') or contains(Name,'${theme}')`;
      })
      .join(" or ");

    const keywordFilterString = `contains(Description,'${keyword}') or contains(Name,'${keyword}')`;

    if (apiFilter.themes.length && keyword) {
      filter = `?$filter=${themeFilterString} and ${keywordFilterString}`;
    }

    if (!apiFilter.themes.length && keyword) {
      filter = `?$filter=${keywordFilterString}`;
    }

    if (!keyword && apiFilter.themes.length) {
      filter = `?$filter=${themeFilterString}`;
    }

    // 增加篩選排序筆數
    const maxResults = 90;
    if (filter)
      filter += `&$orderby=UpdateTime&$top=${maxResults}&$format=JSON`;

    for (const [key, value] of Object.entries(apis)) {
      apis[key] = value + filter;
    }

    console.log(apis);

    const data = await fetchTdxApi(apis);
    return data;
  } catch (error) {
    throw error;
  }
}
