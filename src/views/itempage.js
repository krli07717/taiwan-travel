export default function getItempageTemplate(item) {
  return `
        <section class="result_page">
          <section class="page_headline">
            <div class="last_page">
              <img src="./img/arrow-left.svg" alt="last page icon" />
            </div>
            <h4 class="page_title">${item.Name}</h4>
            <div class="print">
              <img src="./img/print.svg" alt="print icon" />
            </div>
            <div class="share">
              <img src="./img/share-green.svg" alt="share icon green" />
            </div>
          </section>
          <section class="page_picture">
            <div class="page_picture_wrapper">
            <img src="${item.Picture?.PictureUrl1}" alt="${
    item.Picture?.PictureDescription1
  }" onerror="this.onerror=null;this.src='./img/banner-lg.png';"/>
            </div>
          </section>
          <section class="page_info">
            <div class="address">
              <div class="location_green">
                <img
                  src="./img/location-green.svg"
                  alt="location icon - green"
                />
              </div>
              <span>${item.Address ?? item.Location ?? "未提供"}</span>
            </div>
            <div class="open_time">
              <div class="time_green">
                <img src="./img/time-green.svg" alt="time icon - green" />
              </div>
              <span>${item.OpenTime ?? item.StartTime ?? "未提供"}</span>
            </div>
            <div class="phone">
              <div class="phone_green">
                <img src="./img/phone.svg" alt="phone icon - green" />
              </div>
              <span>${item.Phone ?? "未提供"}</span>
            </div>
          </section>
          <section class="page_intro">
            <h5>景點介紹</h5>
            <article>
              ${item.DescriptionDetail ?? item.Description ?? "未提供"}
            </article>
          </section>
          <section class="page_traffic">
            <h5>交通方式</h5>
            <iframe
              src="https://maps.google.com/maps?q=${
                item.Position?.PositionLat
              }, ${item.Position?.PositionLon}&z=15&output=embed"
              width="100%"
              frameborder="0"
              style="border: 0; border-radius: 8px"
            ></iframe>
            <article>
            ${item.TravelInfo ?? "未提供交通方式"}
            </article>
          </section>
        </section>
    `;
}
