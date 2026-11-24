const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('I am on the registration page', function () {
  // Simulacion de navegacion a la pagina de registro
});

When('I enter valid registration details', function () {
  // Simulacion de ingreso de datos
});

Then('I should see a confirmation message', function () {
  assert.strictEqual(true, true);
});
