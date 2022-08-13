import {
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { playerStoreType, SET_CURRENT_INDEX } from "@/store/player-store";
import { useMapState } from "@/utils";

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);
  const $store = useStore();

  const { fullScreen, playlist, currentIndex } = useMapState(
    ["fullScreen", "playlist", "currentIndex"],
    "playerStore"
  );

  // 当非全屏 & 当前播放列表有值的情况下：slider才显示
  const sliderShow = computed(() => !fullScreen.value && !!playlist.value);

  onMounted(() => {
    // 初始化slider插件，注意wathc所在的位置完全是为了方便
    let sliderVal;

    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });

          sliderVal.on("slidePageChanged", ({ pageX }) => {
            $store.commit(playerStoreType(SET_CURRENT_INDEX), pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    slider.value?.destroy();
  });

  onActivated(() => {
    slider.value?.enable();
    slider.value?.refresh();
  });

  onDeactivated(() => {
    slider.value?.disable();
  });
  return {
    slider,
    sliderWrapperRef,
  };
}
