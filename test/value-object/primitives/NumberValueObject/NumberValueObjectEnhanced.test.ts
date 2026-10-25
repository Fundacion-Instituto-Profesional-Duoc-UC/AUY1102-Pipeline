import { IntegerMother } from '../../../mother-object/IntegerMother';
import Age from './__mocks__/Age';

describe('NumberValueObject - Enhanced Test Suite (Guía 2.1.4)', () => {
  it('debe almacenar correctamente el valor numérico (inmutabilidad)', () => {
    const valor = 42;
    const ageObj = new Age(valor);
    expect(ageObj.value).toBe(valor);
  });

  it('debe manejar correctamente valores negativos en comparaciones', () => {
    const negative = new Age(-10);
    const positive = new Age(5);
    expect(negative.isSmallerThan(positive)).toBe(true);
    expect(positive.isBiggerThan(negative)).toBe(true);
  });

  it('debe manejar correctamente el valor neutro cero', () => {
    const zeroA = new Age(0);
    const zeroB = new Age(0);
    expect(zeroA.equalsTo(zeroB)).toBe(true);
  });

  it('debe cumplir con la propiedad reflexiva de igualdad (A === A)', () => {
    const val = IntegerMother.random();
    const ageObj = new Age(val);
    expect(ageObj.equalsTo(ageObj)).toBe(true);
  });

  it('debe cumplir con la propiedad simétrica de igualdad', () => {
    const val = IntegerMother.random();
    const age1 = new Age(val);
    const age2 = new Age(val);
    expect(age1.equalsTo(age2)).toBe(true);
  });
});