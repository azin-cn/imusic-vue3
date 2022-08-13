import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { getSongLyric } from "@/service/song";
import { playerStoreType, SET_SONG_LYRIC } from "@/store/player-store";

import Lyric from "lyric-parser";

export default function useLyric(state) {
  const $store = useStore();
  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);
  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  const playingLyric = ref(null);
  const pureMusicLyric = ref(null);
  const currentSong = computed(() => $store.getters["playerStore/currentSong"]);

  // 监听当前正在播放的歌曲
  watch(currentSong, async (song) => {
    if (!song.id || !song.url) {
      return; // 不是合法的歌曲对象格式
    }
    stopLyric(); // 切换新歌，停止播放歌词
    currentLyric.value = null; // 重置
    currentLineNum.value = 0;
    pureMusicLyric.value = null;
    playingLyric.value = null;

    const lyric = await getSongLyric(song);
    $store.commit(playerStoreType(SET_SONG_LYRIC), { mid: song.mid, lyric });

    if (currentSong.value.lyric !== lyric) {
      return; // 防止在请求歌词过程中，当前歌曲发生变化
    }

    currentLyric.value = new Lyric(lyric, handleNext);

    if (state.ready) {
      if (currentLyric.value.lines.length === 1) {
        pureMusicLyric.value = currentLyric.value.lines[0].txt ?? "pure music";
        playingLyric.value = pureMusicLyric.value;
        currentLyric.value = "";
        return;
      }
      playLyric(); // 如果歌曲ready，歌词有值
    }
  });

  function handleNext(line) {
    // 在每次换行时被切换
    const { lineNum, txt } = line;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl) {
      return;
    }

    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    console.log(playingLyric.value);
    if (lineNum > 5) {
      const lineEL = listEl.children[lineNum - 5];
      scrollComp.scroll.scrollToElement(lineEL, 300);
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000);
    }
  }

  function playLyric() {
    const lyric = currentLyric.value; // 歌词滚动也是一个事件，需要配合歌曲播放事件，包括ready，currentTime等
    if (lyric) {
      lyric.seek(state.currentTime * 1000);
    }
  }

  function stopLyric() {
    const lyric = currentLyric.value; // 歌词滚动也是一个事件，需要配合歌曲播放事件，包括ready，currentTime等
    if (lyric) {
      lyric.stop();
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric,
  };
}
