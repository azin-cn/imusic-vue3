import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import storage from "good-storage";

import MusicList from "@/components/MusicList";
import { processSongsUrl } from "@/service/singer";

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList,
    },
    props: {
      data: {
        type: Object,
        default: () => {},
      },
    },
    setup({ data }) {
      const songs = ref([]);
      const loading = ref(true);
      const computedData = computed(() => {
        const cacheData = storage.session.get(key);
        if (!data && !cacheData) {
          //如果两个都不存在，返回上一级路由
          useRouter().go(-1);
          return;
        }
        return data || cacheData; // 如果singer存在则使用singer，如果不存在即刷新时，使用缓存singer
      });

      const pic = computed(() => computedData.value.pic);
      const title = computed(() => computedData.value.name || computedData.value.title);

      (async () => {
        // setup函数执行时发送请求
        const data = computedData.value;
        let result = await fetch(data);
        songs.value = await processSongsUrl(result.songs);
        loading.value = false;
      })();
      return {
        songs,
        loading,
        computedData,
        pic,
        title,
      };
    },
  };
}
