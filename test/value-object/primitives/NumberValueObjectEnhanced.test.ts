import { IntegerMother } from '../../../mother-object/IntegerMother';
import Age from './__mocks__/Age';

describe('NumberValueObject - Enhanced Test Suite (Guía 2.1.4)', () => {
  describe('Pruebas Avanzadas y Casos Borde de NumberValueObject', () => {
    it('debe almacenar correctamente el valor numérico provisto en el constructor (inmutabilidad)', () => {
      const valor = 42;
      const ageObj = new Age(valor);
      expect(ageObj.value).toBe(valor);
    });

    it('debe manejar correctamente valores negativos en comparaciones', () => {
      const negativeAge = new Age(-10);
      const positiveAge = new Age(5);
      const zeroAge = new Age(0);

      expect(negativeAge.isSmallerThan(positiveAge)).toBe(true);
      expect(positiveAge.isBiggerThan(negativeAge)).toBe(true);
      expect(negativeAge.isSmallerThan(zeroAge)).toBe(true);
      expect(negativeAge.equalsTo(positiveAge)).toBe(false);
    });

    it('debe manejar correctamente el valor neutro cero (0)', () => {
      const zeroA = new Age(0);
      const zeroB = new Age(0);
      const positive = new Age(1);

      expect(zeroA.equalsTo(zeroB)).toBe(true);
      expect(zeroA.isSmallerThan(positive)).toBe(true);
      expect(positive.isBiggerThan(zeroA)).toBe(true);
      expect(zeroA.isBiggerThan(zeroB)).toBe(false);
      expect(zeroA.isSmallerThan(zeroB)).toBe(false);
    });

    it('debe manejar con precisión números con punto flotante (decimales)', () => {
      const decimalA = new Age(25.4);
      const decimalB = new Age(25.4);
      const decimalC = new Age(25.41);

      expect(decimalA.equalsTo(decimalB)).toBe(true);
      expect(decimalC.isBiggerThan(decimalA)).toBe(true);
      expect(decimalA.isSmallerThan(decimalC)).toBe(true);
    });

    it('debe cumplir con la propiedad reflexiva de igualdad (A === A)', () => {
      const randomValue = IntegerMother.random();
      const ageObj = new Age(randomValue);

      expect(ageObj.equalsTo(ageObj)).toBe(true);
    });

    it('debe cumplir con la propiedad simétrica de igualdad (A == B <=> B == A)', () => {
      const val = IntegerMother.random();
      const age1 = new Age(val);
      const age2 = new Age(val);

      expect(age1.equalsTo(age2)).toBe(age2.equalsTo(age1));
      expect(age1.equalsTo(age2)).toBe(true);
    });

    it('debe cumplir con la asimetría estricta entre isBiggerThan e isSmallerThan', () => {
      const minor = new Age(15);
      const mayor = new Age(65);

      expect(minor.isSmallerThan(mayor)).toBe(true);
      expect(mayor.isBiggerThan(minor)).toBe(true);
      expect(minor.isBiggerThan(mayor)).toBe(false);
      expect(mayor.isSmallerThan(minor)).toBe(false);
    });
  });
});