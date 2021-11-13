import getHomepageTemplate from "./homepage.js";
import getItempageTemplate from "./itempage.js";
import getFilteredListTemplate from "./filteredList.js";

function bindDomWithTemplate(node, getTemplate) {
  return function renderByData(data) {
    node.innerHTML = getTemplate(data);
  };
}

export default (function render() {
  const cityInputs = document.querySelectorAll("input[name='city']");
  const categoryInputs = document.querySelectorAll("input[class='theme']");
  const keywordInput = document.querySelector("input#filter_keyword");
  const chosenCity = document.querySelector(".selected_city");

  function updateFilterDropdown(props) {
    cityInputs.forEach((cityInput) => {
      if (cityInput.id === props.city) {
        cityInput.checked = true;
        //選擇的城市取代placeholder「選擇目的地」
        chosenCity.classList.remove("placeholder");
        chosenCity.textContent = props.city;
        return;
      }
      cityInput.checked = false;
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

  const main = document.querySelector("main");
  const updateHomepage = bindDomWithTemplate(main, getHomepageTemplate);
  const updateItempage = bindDomWithTemplate(main, getItempageTemplate);
  const updateFilteredList = bindDomWithTemplate(main, getFilteredListTemplate);
  const updateLoading = () => {
    console.log("loading");
    main.innerHTML = `
    <div class="loading">
        <img src="./img/loading.svg" alt="loading" />
    </div>
    `;
  };

  return {
    updateFilterDropdown,
    updateHomepage,
    updateItempage,
    updateFilteredList,
    updateLoading,
  };
})();
