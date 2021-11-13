export default function getHomepageTemplate(dataList) {
  const categories = dataList.reduce((categoriesHTML, { urlName, data }) => {
    const categoryList = data.reduce((categoryListHTML, item) => {
      categoryListHTML += `
                <div class="result_card swiper-slide" data-id=${item.ID}>
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
                          <img
                            src="./img/location-green.svg"
                            alt="location icon - green"
                          />
                        </div>
                        <span>${
                          item.Address ?? item.Location ?? "未提供"
                        }</span>
                      </div>
                      <div class="time">
                        <div class="time_green">
                          <img
                            src="./img/time-green.svg"
                            alt="time icon - green"
                          />
                        </div>
                        <span>${
                          item.OpenTime ?? item.StartTime ?? "未提供"
                        }</span>
                      </div>
                    </div>
                  </div>
                </div>
            `;
      return categoryListHTML;
    }, ``);

    // <div class="share">
    // </div>

    const categoryHTML = `
        <section class="category">
            <div class="category_text">
                <div class="location_purple">
                    <img
                    src="./img/location-purple.svg"
                    alt="location icon - purple"
                    />
                </div>
                <h3 class="theme">${urlName}</h3>
                <a class="more">更多${urlName}</a>
            </div>
            <div class="category_list swiper">
                <div class="swiper-wrapper">
                    ${categoryList}
                    <div class="swiper-scrollbar"></div>
                </div>
            </div>
        </section>
        `;

    categoriesHTML += categoryHTML;
    return categoriesHTML;
  }, ``);

  const bannerHTML = `
  <section class="banner">
    <h2 class="banner_text">探索。<br />福爾摩沙</h2>
  </section>
  `;

  return `
  ${bannerHTML}
  <section class="categories">
    ${categories}
  </section>
  `;
}
