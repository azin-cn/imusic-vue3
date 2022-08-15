import { get } from "./base";
export function getSongLyric(song) {
  if (song.lyric) {
    // 检查本地song对象是否含有lyric
    return Promise.resolve(song.lyric);
  }

  const mid = song.mid;
  return get("/api/getLyric", { mid }).then((res) => {
    const lyric = res ? res.lyric : "[00:00:00]该歌曲暂时无法获取歌词";
    return lyric;
  });
}

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }

  return get("/api/getSongsUrl", {
    mid: songs.map((song) => song.mid),
  }).then((res) => {
    const urls = res.map;
    return (
      songs
        // 逗号运算符，返回逗号后一个元素
        .map((song) => ((song.url = urls[song.mid]), song))
        .filter((song) => song.url.indexOf("vkey") > -1)
    );
  });
}
