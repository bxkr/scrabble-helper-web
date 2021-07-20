export function readJson(path: string): Promise<any> {
  return fetch(path)
    .then((response) => response.text())
    .then((data) => {
      return JSON.parse(data);
    });
}
