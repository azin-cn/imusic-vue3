import { get } from "./base";

const url = "/api/getSingerList";

export default function getSingerList() {
  return get(url);
}
