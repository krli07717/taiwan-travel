import renewSwiper from "./vendor/swiper.js";
import fetchBy from "./api/fetchApi.js";
import makeState from "./modules/state.js";
import render from "./views/render.js";
import bindListeners from "./modules/listeners.js";
import { scrollTop, parseRouter } from "./modules/utils.js";
import { MODES, STATES } from "./modules/constants.js";

function main() {
  const { HOME_PAGE, FILTERED_PAGE, ITEM_PAGE } = MODES;
  const { MODE, QUERY_STRING, FILTERED_DATA, CURRENT_PAGE } = STATES;

  const initialState = {
    [MODE]: HOME_PAGE, // HOME_PAGE | FILTERED_PAGE | ITEM_PAGE
    [QUERY_STRING]: "", // city{1} , keyword{1} , category{8} , page{1} | id{1}
    [FILTERED_DATA]: [],
    [CURRENT_PAGE]: 1,
  };

  console.log(initialState);

  const onChange = {
    [MODE]: () => {
      console.log("mode changed to", state.getState(MODE));
      scrollTop();
    },
    [QUERY_STRING]: async () => {
      console.log("q cb exec");
      render.updateLoading();
      console.log("queryString changed to\n", state.getState(QUERY_STRING));
      if (state.getState(MODE) === ITEM_PAGE) {
        const { id } = parseRouter(state.getState(QUERY_STRING));
        const allData = state
          .getState(FILTERED_DATA)
          .map(({ data }) => data)
          .flat();
        const matchItem = allData.find((item) => item.ID === id);
        render.updateItempage(matchItem);
        return;
      }
      const searchParams = parseRouter(state.getState(QUERY_STRING));
      render.updateFilterDropdown(searchParams);
      const data = await fetchBy(searchParams);
      state.setState({
        [FILTERED_DATA]: data,
      });
    },
    [FILTERED_DATA]: () => {
      console.log(
        "filteredData changed, rendering",
        state.getState(FILTERED_DATA)
      );
      if (state.getState(MODE) === HOME_PAGE) {
        render.updateHomepage(state.getState(FILTERED_DATA));
        renewSwiper();
        return;
      }
      if (state.getState(MODE) === FILTERED_PAGE) {
        const queryPageMatch = /.*&page=(\d*).*/g.exec(
          state.getState(QUERY_STRING)
        );
        if (queryPageMatch) {
          state.setState({ [CURRENT_PAGE]: Math.max(1, +queryPageMatch[1]) });
          return;
        }
        state.setState({ [CURRENT_PAGE]: 1 });
      }
    },
    [CURRENT_PAGE]: () => {
      console.log("currentPage changed to", state.getState(CURRENT_PAGE));
      render.updateFilteredList({
        data: state.getState(FILTERED_DATA),
        page: state.getState(CURRENT_PAGE),
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