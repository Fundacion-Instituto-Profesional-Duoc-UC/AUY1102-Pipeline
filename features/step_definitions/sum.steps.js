const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const sum = require('../../src/sum');

let a, b, result;

Given('I have numbers {int} and {int}', function (int1, int2) {
  a = int1;
  b = int2;
});

When('I sum the numbers', function () {
  result = sum(a, b);
});

Then('the result should be {int}', function (expectedResult) {
  assert.strictEqual(result, expectedResult);
});
