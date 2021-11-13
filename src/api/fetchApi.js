import API_KEY from "./apiKey.js";
import getRequestHeader from "./requestHeader.js";

async function fetchTdxApi(urlName, url) {
  try {
    const response = await fetch(url, {
      headers: getRequestHeader(API_KEY),
    });
    const data = await response.json();
    return { urlName: urlName, data: data };
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
      const fetchAll = await Promise.allSettled(
        Object.entries(urls).map(([urlName, url]) => fetchTdxApi(urlName, url))
      );
      return fetchAll.map((resolved) => resolved.value);
    }

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

    // city:must
    // keyword:must
    // category: must append
    // theme(must or)

    let baseUrl = "https://ptx.transportdata.tw/MOTC/v2/Tourism/";
    let apis;

    if (!apiFilter.mainUrls.length) {
      apis = mainCategories.reduce((apiObj, urlName) => {
        apiObj[urlName] = baseUrl + mainCategoryToEnglish[urlName];
        return apiObj;
      }, {});
    } else {
      apis = apiFilter.mainUrls.reduce((apiObj, urlName) => {
        apiObj[urlName] = baseUrl + mainCategoryToEnglish[urlName];
        return apiObj;
      }, {});
    }

    if (apiFilter.city) {
      for (const [key, value] of Object.entries(apis)) {
        apis[key] = value + `/${apiFilter.city}`;
      }
    }

    let filter = "";
    if (apiFilter.themes.length || keyword) {
      const maxResults = 90;
      if (!apiFilter.themes.length) {
        filter += `?$filter=contains(Description,'${keyword}') or contains(Name,'${keyword}')`;
      } else if (!keyword) {
        filter +=
          "?$filter=" +
          apiFilter.themes
            .map((theme) => {
              return `contains(Description,'${theme}') or contains(Name,'${theme}')`;
            })
            .join(" or ");
      } else {
        filter +=
          "?$filter=" +
          apiFilter.themes
            .map((theme) => {
              return `contains(Description,'${theme}') or contains(Name,'${theme}')`;
            })
            .join(" or ");
        filter += ` and contains(Description,'${keyword}')`;
      }
      filter += `&$orderby=UpdateTime&$top=${maxResults}&$format=JSON`;
    }

    for (const [key, value] of Object.entries(apis)) {
      apis[key] = value + filter;
    }
    console.log(apis);

    const fetchAll = await Promise.allSettled(
      Object.entries(apis).map(([urlName, url]) => fetchTdxApi(urlName, url))
    );
    return fetchAll.map((resolved) => resolved.value);
  } catch (error) {
    throw error;
  }
}
