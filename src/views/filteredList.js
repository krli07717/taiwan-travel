export default function getFilteredListTemplate(dataObj) {
  const filteredCity = new URLSearchParams(location.search).get("city");
  const filteredTitle = filteredCity === null ? "搜尋結果" : filteredCity;

  const RESULT_CARDS_PER_PAGE = 9;

  const { data, page } = dataObj;
  const allData = data.map(({ data }) => data).flat();
  const maxPages = Math.ceil(allData.length / RESULT_CARDS_PER_PAGE);

  // handle bad get request error
  if (allData.some((data) => data.Message !== undefined)) {
    return `<div class="error" style="height:100%; display: flex; align-items:center; justify-content:center;">
              <h3 style="font-size: 60px;">Bad Request!</h3>
            </div>`;
  }

  const renderPage = Math.floor(page) <= maxPages ? Math.floor(page) : 1;
  const renderData = allData.slice(
    RESULT_CARDS_PER_PAGE * (renderPage - 1),
    RESULT_CARDS_PER_PAGE * renderPage
  );

  const resultCardsHTML = renderData.reduce((cardsHTML, item) => {
    cardsHTML += `
            <div class="result_card" data-id=${item.ID}>
              <div class="card_img">
                <img src="${item.Picture?.PictureUrl1}" alt="${
      item.Picture?.PictureDescription1
    }" onerror="this.onerror=null;this.src='./img/banner.png';"/>
              </div>
              <div class="card_info">
                <h4 class="card_title">${item.Name}</h4>
                <div class="card_detail">
                  <div class="location">
                    <div class="location_green">
                      <img src="./img/location-green.svg" alt="location icon - green">
                    </div>
                    <span>${item.Address ?? item.Location ?? "未提供"}</span>
                  </div>
                  <div class="time">
                    <div class="time_green">
                      <img src="./img/time-green.svg" alt="time icon - green">
                    </div>
                    <span>${item.OpenTime ?? item.StartTime ?? "未提供"}</span>
                  </div>
                </div>
              </div>
            </div>
        `;
    return cardsHTML;
  }, ``);

  const disabledPreviousPage = renderPage === 1 ? "disabled" : "";
  const disabledNextPage =
    renderPage === maxPages || maxPages <= 1 ? "disabled" : "";

  const pagination = `
            <div class="pagination">
                <a class="start_page ${disabledPreviousPage}" data-page=1 >&lt;&lt;</a>
                <a class="previous_page ${disabledPreviousPage}" data-page=${
    renderPage - 1
  }>&lt;</a>
                <a class="current_page disabled">${renderPage}</a>
                <a class="next_page ${disabledNextPage}" data-page=${
    renderPage + 1
  }>&gt;</a>
                <a class="end_page ${disabledNextPage}" data-page=${maxPages}>&gt;&gt;</a>
            </div>
    `;

  const noResults =
    "<h3 style='font-size: 40px; text-align: center; margin: auto 0;'>查無結果</h3>";

  return `
        <section class="filter_results">
            <h3 class="filtered_title">${filteredTitle}</h3>
            ${
              resultCardsHTML
                ? `<div class="result_list">
                    ${resultCardsHTML}
                  </div>
                  ${pagination}
                  `
                : noResults
            }
        </section>
    `;
}
