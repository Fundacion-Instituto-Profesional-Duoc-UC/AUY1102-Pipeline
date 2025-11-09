import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
let a: number, b: number, result: number;

Given('a = {int}', function(x: number) { a = x; });
Given('b = {int}', function(x: number) { b = x; });
When('I sum them', function() { result = a + b; });
Then('the result should be {int}', function(expected: number) { assert.strictEqual(result, expected); });
