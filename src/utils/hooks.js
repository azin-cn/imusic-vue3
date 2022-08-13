import { computed } from "vue";
import { useStore, mapState, createNamespacedHelpers } from "vuex";

/**
 * 允许单个变量和多个变量，经过computed处理后返回state对象
 * @param {Array} variables
 * @param {string} module
 */
export function useMapState(keys = [], moduleName = "") {
  const $store = useStore();
  // 如果指定模块名，从模块中拿到mapState
  // const mapState = moduleName === "" ? mapState : createNamespacedHelpers().mapState;
  const state = moduleName === "" ? mapState(keys) : mapState(moduleName, keys);

  const targetState = {};
  Object.keys(state).forEach((key) => {
    const target = state[key].bind({ $store });
    targetState[key] = computed(target);
  });

  return targetState;
}
