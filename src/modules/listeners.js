import { MODES, STATES } from "./constants.js";
import { isInvalidQuery } from "./utils.js";
export default function bindListeners(state) {
  const { HOME_PAGE, FILTERED_PAGE, ITEM_PAGE } = MODES;
  const { MODE, QUERY_STRING, CURRENT_PAGE } = STATES;
  // window
  window.addEventListener("load", () => {
    isInvalidQuery()
      ? state.setState({ [MODE]: HOME_PAGE, [QUERY_STRING]: "" })
      : state.setState({
          [MODE]: FILTERED_PAGE,
          [QUERY_STRING]: location.search,
        });
  });

  window.addEventListener("popstate", () => {
    const lastId = /.*id=(.*)$/g.exec(location.search);

    if (isInvalidQuery() && !lastId) {
      //回首頁
      state.setState({ [MODE]: HOME_PAGE, [QUERY_STRING]: "" });
      return;
    }

    if (lastId) {
      //ITEM_PAGE
      state.setState({ [MODE]: ITEM_PAGE, [QUERY_STRING]: location.search });
      return;
    }

    const lastPage = /.*&page=(\d*).*/g.exec(location.search);
    if (+lastPage?.[1]) {
      // going through pagination
      state.setState({ [CURRENT_PAGE]: +lastPage[1] });
      return;
    }
  });

  // main
  const main = document.querySelector("main");

  main.addEventListener("click", (e) => {
    // card to item page
    const resultCard = e.target.closest(".result_card");
    if (resultCard) {
      history.pushState({}, "", `?id=${resultCard.dataset.id}`);
      state.setState({ [MODE]: ITEM_PAGE, [QUERY_STRING]: location.search });
      return;
    }
    // homepage more (更多熱門景點,更多美食品嘗...)
    const categoryMore = e.target.closest(".category a.more");
    if (categoryMore) {
      const categoryMatch = /^更多(.*)$/g.exec(categoryMore.textContent);
      let categoryQuery = `?categories=${categoryMatch[1]}&page=1`;
      history.pushState({}, "", categoryQuery);
      state.setState({ [MODE]: FILTERED_PAGE, [QUERY_STRING]: categoryQuery });
      return;
    }
    // pagination
    const pageLink = e.target.closest(".pagination a:not(.disabled)");
    if (pageLink) {
      const currentPagePattern = /&page=\d*/g;
      const toPage = pageLink.dataset.page;
      history.pushState(
        {},
        "",
        `${location.search.replace(currentPagePattern, "")}&page=${toPage}`
      );
      state.setState({ [CURRENT_PAGE]: +toPage });
      return;
    }
    // item last page icon
    if (e.target.closest(".last_page")) {
      history.go(-1);
      return;
    }
    // print
    if (e.target.closest(".print")) {
      window.print();
      return;
    }
    // share
    if (e.target.closest(".share")) {
      const shareData = {
        title: "TAIWAN TRAVEL",
        text: "2021 F2E TAIWAN TRAVEL",
        url: location.origin,
      };
      window.navigator?.share(shareData);
      return;
    }
  });

  // nav
  // NOTE: 原先css沒有抓好，目前加回class="hide"的話都是讓它出現..XD
  const filterForm = document.querySelector(".filter_dropdown");
  const cityList = filterForm.querySelector(".city_list");
  const selectedCity = filterForm.querySelector(".selected_city");

  filterForm.addEventListener("click", (e) => {
    // toggle縣市清單
    const isClickingToggleCities =
      e.target.closest(".choose_city") && !e.target.closest(".city_list");
    if (isClickingToggleCities) {
      cityList.classList.toggle("hide");
      return;
    }

    // 選擇篩選縣市
    const cityLabel = e.target.closest(".city_list label");
    if (cityLabel) {
      selectedCity.classList.remove("placeholder");
      selectedCity.textContent = cityLabel.textContent;
      cityList.classList.remove("hide");
      return;
    }

    // submit篩選
    if (e.target.closest(".filter_submit")) {
      const filterCity = filterForm.querySelector(
        "input[name='city']:checked"
      )?.id;
      const filterKeyword = filterForm.querySelector(
        "input#filter_keyword"
      ).value;
      const filterCategories = [
        ...filterForm.querySelectorAll("input.theme:checked"),
      ]
        .map((input) => input.id)
        .join(",");

      // 決定query string
      let query = "?";
      if (filterCity) query += `&city=${filterCity}`;
      if (filterKeyword) query += `&keyword=${filterKeyword}`;
      if (filterCategories) query += `&categories=${filterCategories}`;
      if (query === "?") {
        filterForm.classList.remove("hide");
        return;
      }

      let searchQuery = query.replace("&", "");
      searchQuery += "&page=1";
      history.pushState({}, "", searchQuery);
      state.setState({ [MODE]: FILTERED_PAGE, [QUERY_STRING]: searchQuery });
      filterForm.classList.remove("hide");
      return;
    }
  });

  //   桌機以下toggle篩選清單
  const navFilter = document.querySelector(".top_nav .filter");
  navFilter.addEventListener("click", () => {
    filterForm.classList.toggle("hide");
  });
}
