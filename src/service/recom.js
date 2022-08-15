import { get } from "./base";

const url = "/api/getRecommend";

export function getRecom() {
  return get(url);
}

export function getAlbumDetail(album) {
  return get("/api/getAlbum", {
    id: album.id,
  });
}

export function processAlbumsUrl(songs) {
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
