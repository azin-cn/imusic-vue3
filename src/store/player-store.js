import { load } from "@/assets/js/store-array";
import { shuffle } from "@/utils";

import { FAVORITE_LIST, PLAYER_MODE } from "@/assets/js/constants";
export const SET_PLAYING = "set_playing";
export const SET_SEQUENCE_LIST = "set_sequence_list";
export const SET_PLAYLIST = "set_playlist";
export const SET_PLAYER_MODE = "set_player_mode";
export const SET_CURRENT_INDEX = "set_current_index";
export const SET_FULL_SCREEN = "set_full_screen";
export const SET_FAVORITE_LIST = "set_favorite_list";
export const SET_SONG_LYRIC = "set_song_lyric";

export function playerStoreType(type) {
  return `playerStore/${type}`;
}

const getters = {
  currentSong(state) {
    return state.playlist[state.currentIndex] || {};
  },
};

const mutations = {
  [SET_PLAYING]: (state, playing) => (state.playing = playing),
  [SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [SET_PLAYER_MODE](state, mode) {
    state.playerMode = mode;
  },
  [SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [SET_FULL_SCREEN](state, isFull) {
    state.fullScreen = isFull;
  },
  [SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  },
  [SET_SONG_LYRIC](state, { mid, lyric }) {
    state.sequenceList.forEach((song) => {
      // 可以考虑使用for循环或者findIndex提高性能
      if (song.mid === mid) {
        song.lyric = lyric;
      }
    });
  },
};

const actions = {
  playSelectedSong({ commit, state }, { list, index }) {
    commit(SET_PLAYING /* 设置播放状态 */, true);
    commit(SET_PLAYER_MODE /* 设置播放模式 */, PLAYER_MODE.sequence);
    commit(SET_SEQUENCE_LIST /* 设置顺序播放列表 */, list);
    commit(SET_PLAYLIST /* 设置真实的播放列表，默认顺序播放 */, list);
    commit(SET_CURRENT_INDEX /* 当前歌曲播放索引 */, index);
    commit(SET_FULL_SCREEN /* 全屏 */, true);
  },

  randomPlay({ commit }, { list }) {
    commit(SET_PLAYING /* 设置播放状态 */, true);
    commit(SET_PLAYER_MODE /* 设置播放模式 */, PLAYER_MODE.random);
    commit(SET_SEQUENCE_LIST /* 设置顺序播放列表 */, list);
    commit(SET_PLAYLIST /* 设置真实的播放列表，此时为随机播放 */, shuffle(list));
    commit(SET_CURRENT_INDEX /* 当前歌曲播放索引 */, 0);
    commit(SET_FULL_SCREEN /* 全屏 */, true);
  },

  changeMode({ commit, state, getters }, { mode }) {
    const currentID = getters.currentSong.id;

    if (mode === PLAYER_MODE.random) {
      commit(SET_PLAYLIST, shuffle(state.sequenceList)); // 重新排序
    }
    if (mode === PLAYER_MODE.sequence) {
      commit(SET_PLAYLIST, state.sequenceList);
    }

    // 改变模式，但是当前的歌曲不能打断
    const index = state.playlist.findIndex((song) => song.id === currentID);
    commit(SET_CURRENT_INDEX, index);
    commit(SET_PLAYER_MODE, mode);
  },

  removeSong({ commit, state }, { song }) {
    const sequenceList = state.sequenceList.slice();
    const playlist = state.playlist.slice();

    const sequenceIndex = findIndex(sequenceList, song);
    const playIndex = findIndex(playlist, song);
    if (sequenceIndex < 0 || playIndex < 0) return;

    sequenceList.splice(sequenceIndex, 1);
    playlist.splice(playIndex, 1);

    let currentIndex = state.currentIndex; // 删除的歌曲在当前播放歌曲之前 || 删除播放的歌曲并且正好是最后一个
    if (playIndex < currentIndex || currentIndex === playlist.length) {
      currentIndex--;
    }

    commit(SET_SEQUENCE_LIST, sequenceList);
    commit(SET_PLAYLIST, playlist);
    commit(SET_CURRENT_INDEX, currentIndex);
    if (!playlist.length) {
      commit(types.SET_PLAYING, false);
    }

    function findIndex(list, song) {
      return list.findIndex((item) => item.mid === song.mid);
    }
  },
  clearSongList() {},
};

export const playerStore = {
  namespaced: true,
  state() {
    return {
      sequenceList: [], // 顺序播放列表
      playlist: [], // 当前播放列表
      playing: false, // 播放状态
      playerMode: PLAYER_MODE.sequence, // 顺序播放状态
      currentIndex: 0, // 当前播放索引
      fullScreen: false, // 是否全屏
      favoriteList: load(FAVORITE_LIST),
    };
  },
  getters,
  mutations,
  actions,
};
