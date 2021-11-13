export default function makeState(initState, onChange) {
  let previousState = {};
  let state = { ...initState };

  function getState(key) {
    const isValidKey = typeof key === "string" && state[key] !== undefined;
    if (isValidKey) return state[key];
    return { ...state };
  }

  async function setState(changeState, callback) {
    previousState = { ...state };
    state = { ...state, ...changeState };
    try {
      if (typeof callback === "function") await callback();
      for (let key of Object.keys(changeState)) {
        if (typeof onChange[key] === "function") await onChange[key]();
      }
    } catch (error) {
      throw error;
    }
  }

  return {
    getState,
    setState,
  };
}
