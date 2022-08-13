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
