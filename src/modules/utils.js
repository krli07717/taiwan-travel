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
    paramKey === "categories"
      ? (routerObj[paramKey] = paramValue.split(","))
      : (routerObj[paramKey] = paramValue);
    return routerObj;
  }, {});
}

function isInvalidQuery() {
  const onloadSearchParams = new URLSearchParams(location.search);
  return (
    !onloadSearchParams.has("city") &&
    !onloadSearchParams.has("categories") &&
    !onloadSearchParams.has("keyword")
  );
}

export { scrollTop, parseRouter, isInvalidQuery };
