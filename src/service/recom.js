import { get } from "./base";

const url = "/api/getRecommend";

export function getRecom() {
  return get(url);
}
