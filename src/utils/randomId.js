export default function randomId(key = "id") {
  const id = key + "-" + Math.random().toString(36).slice(2);

  return id;
}
