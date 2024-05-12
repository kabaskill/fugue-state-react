export default function randomId(key = "id") {
  const id = key + "-" + Math.random().toString(36).slice(7);

  return id;
}
