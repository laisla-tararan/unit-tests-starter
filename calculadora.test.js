const { soma, subtrai, multiplica, divide, ehPar, raiz, media } = require('./calculadora')

//O grupo é o describe.
describe('soma', () => {
    test('soma dois numeros positivos', () => {
        expect(soma(2,3)).toBe(5)
    })
    test('soma com numeros negativos', () => {
        expect(soma(-2,-3)).toBe(-5)
    })
})

describe('raiz', () => {
    test('calcula a raiz do número nao exato com precisao', () => {
        expect(raiz(2)).toBeCloseTo(1.414)
    })

    test('lanca erro para numero negativo', () => {
        expect(() => raiz(-4)).toThrow('Nao e possivel calcular raiz de numero negativo')
    })
})

//Exercícios da Aula 5

describe('subtrai', () => {
    test('subtrai dois numeros', () => {
        expect(subtrai(4,2)).toBe(2)
    })

    test('subtrai um numero negativo quando o resultado for negativo', () => {
        expect(subtrai(2,3)).toBe(-1)
    })
})

describe('multiplica', () => {
    test('multiplica dois numeros', () => {
        expect(multiplica(2,3)).toBe(6)
    })

    test('quando um dos fatores for 0', () => {
        expect(multiplica(2,0)).toBe(0)
    })

    test('o resultado deve ser maior do que cada um dos fatores quando ambos forem maiores que 1', () => {
        expect(multiplica(2,3)).toBeGreaterThan(2)
        expect(multiplica(2,3)).toBeGreaterThan(3)
    })
})

describe('divide', () => {
    test('divide dois numeros', () => {
        expect(divide(4,2)).toBe(2)
    })

    test('lanca erro quando b for 0', () => {
        expect(() => divide(4,0)).toThrow('Nao e possivel dividir por zero')
    })
})

describe('ehPar', () => {
    test('numero par', () => {
        expect(ehPar(4)).toBe(true)
    })

    test('numero impar', () => {
        expect(ehPar(5)).toBe(false)
    })
})

describe('media', () => {
    test('media de uma lista de inteiros', () => {
        expect(media([1, 2, 3])).toBe(2)
    })

    test('media quando o resultado for decimal', () => {
        expect(media([1, 2, 3, 4])).toBe(2.5)
    })

    test('lanca erro quando a lista estiver vazia', () => {
        expect(() => media([])).toThrow('A lista de numeros nao pode ser vazia')
    })
    test('lanca erro quando o argumento nao for um array', () => {
        expect(() => media(1, 2, 3, 4)).toThrow('A lista de numeros nao pode ser vazia')
    })
})