import { WordMother } from '../../../../test/mother-object/WordMother';
import FirstName from '../../../../test/value-object/primitives/StringValueObject/__mocks__/FirstName'

let firstName: FirstName;
let name: string;

describe('StringValueObject', () => {
  beforeEach(() => {
    name = WordMother.random()
  })

  describe('different to', () => {
    it(`should return "true" if the values are different`, () => {
      // Creamos un valor que garantizamos sea diferente al de 'name'
      const differentName = name + '-different';
      
      firstName = new FirstName(differentName);
      
      // Comparamos el valor diferente contra el valor original
      const expected = firstName.differentTo(name);

      expect(expected).toBe(true);
    })

    it(`should return "false" if the values are not different`, () => {
      firstName = new FirstName(name)
      const expected = firstName.differentTo(name);

      expect(expected).toBe(false);
    })
  })
})
