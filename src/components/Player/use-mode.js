// 增强功能单独使用
import { computed } from "vue";
import { useStore } from "vuex";
import { PLAYER_MODE } from "@/assets/js/constants";
import { playerStoreType } from "@/store/player-store";

export default function useMode() {
  const $store = useStore();
  const playerMode = computed(() => $store.state["playerStore"].playerMode);
  const modeIcon = computed(() => getModeInfo()[0]);
  const modeText = computed(() => getModeInfo()[1]);
  const changeMode = () => {
    const mode = (playerMode.value + 1) % 3; // 重复循环
    $store.dispatch(playerStoreType("changeMode"), { mode });
  };

  function getModeInfo() {
    const mode = playerMode.value;
    if (mode === PLAYER_MODE.sequence) {
      return ["icon-sequence", "顺序播放"];
    }
    if (mode === PLAYER_MODE.random) {
      return ["icon-random", "随机播放"];
    }
    return ["icon-loop", "循环播放"];
  }

  return {
    modeIcon,
    modeText,
    changeMode,
  };
}
