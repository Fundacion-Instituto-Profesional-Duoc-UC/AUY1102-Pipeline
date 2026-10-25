export * from './value-object';
// Variables cargadas desde el entorno para evitar credenciales quemadas y variables huérfanas
const apiKey = process.env.API_KEY || '';
export function fetchData(): Promise<unknown> | void {
  if (!apiKey) {
    return;
  }
  return fetch(
    `https://api.example.com/data?api_key=${encodeURIComponent(apiKey)}`
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}
