import getHomepageTemplate from "./homepage.js";
import getItempageTemplate from "./itempage.js";
import getFilteredListTemplate from "./filteredList.js";
import loadingHTML from "./loading.js";

function bindDomWithTemplate(node, getTemplate) {
  return function renderByData(data) {
    node.innerHTML = getTemplate(data);
  };
}

const cityInputs = document.querySelectorAll("input[name='city']");
const categoryInputs = document.querySelectorAll("input[class='theme']");
const keywordInput = document.querySelector("input#filter_keyword");
const chosenCity = document.querySelector(".selected_city");
const main = document.querySelector("main");

function updateFilterDropdown(props) {
  cityInputs.forEach((cityInput) => {
    if (cityInput.id !== props.city) {
      cityInput.checked = false;
      return;
    }
    cityInput.checked = true;
    //取代placeholder樣式與文字「選擇目的地」
    chosenCity.classList.remove("placeholder");
    chosenCity.textContent = props.city;
  });
  keywordInput.value = props.keyword ?? "";
  categoryInputs.forEach((categoryInput) => {
    if (props.categories?.includes(categoryInput.id)) {
      categoryInput.checked = true;
      return;
    }
    categoryInput.checked = false;
  });
}

export default (function render() {
  const updateHomepage = bindDomWithTemplate(main, getHomepageTemplate);
  const updateItempage = bindDomWithTemplate(main, getItempageTemplate);
  const updateFilteredList = bindDomWithTemplate(main, getFilteredListTemplate);
  const updateLoading = () => {
    main.innerHTML = loadingHTML;
  };

  return {
    updateFilterDropdown,
    updateHomepage,
    updateItempage,
    updateFilteredList,
    updateLoading,
  };
})();
