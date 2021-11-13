import MODE from "./constants.js";
export default function bindListeners(state) {
  const { HOME_PAGE, FILTERED_PAGE, ITEM_PAGE } = MODE;
  // window
  function isInvalidQuery() {
    const onloadSearchParams = new URLSearchParams(location.search);
    return (
      !onloadSearchParams.has("city") &&
      !onloadSearchParams.has("categories") &&
      !onloadSearchParams.has("keyword")
    );
  }

  window.addEventListener("load", () => {
    if (isInvalidQuery()) {
      state.setState({ mode: HOME_PAGE, queryString: location.search });
      return;
    }
    state.setState({ mode: FILTERED_PAGE, queryString: location.search });
  });

  window.addEventListener("popstate", () => {
    console.log("history");
    // going from itempage to homepage/filtered
    if (state.getState("mode") === ITEM_PAGE) {
      if (location.search === "" || isInvalidQuery()) {
        history.pushState({}, "", "/");
        state.setState({ mode: HOME_PAGE, queryString: "" });
        // location = "/";
        return;
      }
      state.setState({ mode: FILTERED_PAGE });
    }

    // is going through pagination
    const lastPage = /.*&page=(\d*).*/g.exec(location.search);
    if (lastPage) {
      console.log(`back to page: `, +lastPage[1]);
      state.setState({ currentPage: lastPage[1] });
    }

    //is going from filtered to item
    const lastId = /.*id=(.*)$/g.exec(location.search);
    if (lastId) {
      state.setState({ mode: ITEM_PAGE, queryString: location.search });
    }
  });

  // main
  const main = document.querySelector("main");

  main.addEventListener("click", (e) => {
    // card to item page
    const resultCard = e.target.closest(".result_card");
    if (resultCard) {
      history.pushState(
        { fromItemPage: true },
        "",
        `?id=${resultCard.dataset.id}`
      );
      state.setState({ mode: ITEM_PAGE, queryString: location.search });
      return;
    }
    // homepage more a
    if (e.target.closest(".category a.more")) {
      const categoryMatch = /^更多(.*)$/g.exec(
        e.target.closest(".category a.more").textContent
      );
      let categoryQuery = `?categories=${categoryMatch[1]}&page=1`;
      history.pushState({}, "", categoryQuery);
      state.setState({ mode: FILTERED_PAGE, queryString: categoryQuery });
      return;
    }
    // pagination
    if (e.target.closest(".pagination a:not(.disabled)")) {
      const currentPagePattern = /&page=\d*/g;
      history.pushState(
        {},
        "",
        `${location.search.replace(currentPagePattern, "")}&page=${
          e.target.dataset.page
        }`
      );
      state.setState({ currentPage: +e.target.dataset.page });
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
  const filterForm = document.querySelector(".filter_dropdown");
  const cityList = filterForm.querySelector(".city_list");
  const selectedCity = filterForm.querySelector(".selected_city");

  filterForm.addEventListener("click", (e) => {
    if (e.target.closest(".choose_city") && !e.target.closest(".city_list")) {
      cityList.classList.toggle("hide");
      return;
    }

    if (e.target.closest(".city_list label")) {
      selectedCity.classList.remove("placeholder");
      selectedCity.textContent = e.target.textContent;
      cityList.classList.remove("hide");
      return;
    }

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
      let query = "?";
      if (filterCity) query += `&city=${filterCity}`;
      if (filterKeyword) query += `&keyword=${filterKeyword}`;
      if (filterCategories) query += `&categories=${filterCategories}`;
      if (query === "?") return;

      let searchQuery = query.replace("&", "");
      searchQuery += "&page=1";
      history.pushState({}, "", searchQuery);
      state.setState({ mode: FILTERED_PAGE, queryString: searchQuery });
      filterForm.classList.remove("hide");
      return;
    }
  });

  const navFilter = document.querySelector(".top_nav .filter");
  navFilter.addEventListener("click", () => {
    filterForm.classList.toggle("hide");
  });
}
