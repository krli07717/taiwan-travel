import renewSwiper from "./vendor/swiper.js";
import fetchBy from "./api/fetchApi.js";
import makeState from "./modules/state.js";
import render from "./views/render.js";
import bindListeners from "./modules/listeners.js";
import { scrollTop, parseRouter } from "./modules/utils.js";
import MODE from "./modules/constants.js";

function main() {
  const { HOME_PAGE, FILTERED_PAGE, ITEM_PAGE } = MODE;

  const initialState = {
    mode: HOME_PAGE, // HOME_PAGE | FILTERED_PAGE | ITEM_PAGE
    queryString: "", // city{1} , keyword{1} , category{8} , page{1} | id{1}
    filteredData: [],
    currentPage: 1,
  };

  const onChange = {
    mode: () => {
      console.log("mode changed to", state.getState("mode"));
      scrollTop();
    },
    queryString: async () => {
      render.updateLoading();
      console.log("queryString changed to\n", state.getState("queryString"));
      if (state.getState("mode") === ITEM_PAGE) {
        const { id } = parseRouter(state.getState("queryString"));
        const allData = state
          .getState("filteredData")
          .map(({ data }) => data)
          .flat();
        const matchItem = allData.find((item) => item.ID === id);
        render.updateItempage(matchItem);
        return;
      }
      const searchParams = parseRouter(state.getState("queryString"));
      render.updateFilterDropdown(searchParams);
      const data = await fetchBy(searchParams);
      state.setState({
        filteredData: data,
      });
    },
    filteredData: () => {
      console.log(
        "filteredData changed, rendering",
        state.getState("filteredData")
      );
      if (state.getState("mode") === HOME_PAGE) {
        render.updateHomepage(state.getState("filteredData"));
        renewSwiper();
        return;
      }
      if (state.getState("mode") === FILTERED_PAGE) {
        const queryPageMatch = /.*&page=(\d*).*/g.exec(
          state.getState("queryString")
        );
        if (queryPageMatch) {
          state.setState({ currentPage: Math.max(1, +queryPageMatch[1]) });
          return;
        }
        state.setState({ currentPage: 1 });
      }
    },
    currentPage: () => {
      console.log("currentPage changed to", state.getState("currentPage"));
      render.updateFilteredList({
        data: state.getState("filteredData"),
        page: state.getState("currentPage"),
      });
      scrollTop();
    },
  };

  const state = makeState(initialState, onChange);
  bindListeners(state);
}

// 整理程式碼
// Footer 註github原始碼

main();
