import { get } from "./base";
export function getTopList(id) {
  return get("/api/getTopList", {
    id: id,
  });
}

export function getTopDetail(top) {
  return get("/api/getTopDetail", {
    id: top.id,
    preiod: top.preiod,
  });
}

