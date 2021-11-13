function scrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

function parseRouter(searchParamString) {
  const searchParams = new URLSearchParams(decodeURI(searchParamString));
  return [...searchParams].reduce((routerObj, [paramKey, paramValue]) => {
    if (paramKey === "categories") {
      routerObj[paramKey] = paramValue.split(",");
    } else {
      routerObj[paramKey] = paramValue;
    }
    return routerObj;
  }, {});
}

export { scrollTop, parseRouter };
