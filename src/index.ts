export * from './value-object';

function fetchData() {
  fetch('https://api.example.com/data')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

fetchData();