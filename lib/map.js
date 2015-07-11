var map = {
    and: 'and::',
    or: 'or::',
    not: 'not::',
    each: 'each::',
    some: 'some::',
    oneOf: 'or::',
    optional: 'optional::',

    where: 'where:',
    type: 'type:',
    class: 'class:',
    length: 'length:',

    '==': '==:',
    '===': '===:',
    '!=': '!=:',
    '!==': '!==:',
    '>': '>:',
    '<': '<:',
    '>=': '>=:',
    '<=': '<=:',
    eq: 'eq:',
    neq: 'neq:',
    gt: 'gt:',
    lt: 'lt:',
    ge: 'ge:',
    le: 'le:',
    min: 'min:',
    max: 'max:',
    'in': 'in:',
    notIn: 'notIn:'
};

mapKeyWord = function (word) {
    word = map[word] || word;
    return word;
};