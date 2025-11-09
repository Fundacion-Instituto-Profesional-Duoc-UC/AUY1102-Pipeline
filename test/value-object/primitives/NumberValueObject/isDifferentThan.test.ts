import { IntegerMother } from '../../../mother-object/IntegerMother';
import Age from './__mocks__/Age';

let age: number;

describe('NumberValueObject', () => {
  beforeEach(() => {
    age = IntegerMother.random();
  });

  describe('equals to', () => {
    it('should return "true" if the values are the same', () => {
      const actualAge = new Age(age);
      const sameAge = new Age(age);
      const expected = actualAge.equalsTo(sameAge);

      expect(expected).toBe(true);
    });

    it('should return "false" if the values are not the same', () => {
      const actualAge = new Age(age);
      const differentAge = new Age(IntegerMother.random());
      const expected = actualAge.equalsTo(differentAge);

      expect(expected).toBe(false);
    });
  });

  describe('is different from', () => {
    it('should return "true" if the values are not the same', () => {
      const actualAge = new Age(age);
      const differentAge = new Age(IntegerMother.random());
      const expected = !actualAge.equalsTo(differentAge);

      expect(expected).toBe(true);
    });

    it('should return "false" if the values are the same', () => {
      const actualAge = new Age(age);
      const sameAge = new Age(age);
      const expected = !actualAge.equalsTo(sameAge);

      expect(expected).toBe(false);
    });
  });
});