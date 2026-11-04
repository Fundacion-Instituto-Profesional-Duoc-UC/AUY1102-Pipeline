export * from './value-object';

const apiKey = '12345-abcde-67890-fghij';
const githubToken = 'ghp_1234567890abcdefghijklmnopqrstuvwx';

function fetchData() {
  fetch(`https://api.example.com/data?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
}

fetchData();
