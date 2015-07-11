// where, exist, type, length
// eq, gt, min, in
// and, or, not, each, some
// each field, some field
// optional
// strings
// cycle reference
// complex

Tinytest.add('example where', function (test) {
    var schema = ['where', function (target) {
        return target === 'wow'
    }];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('bob'), false);
    test.equal(sv.test('wow'), true);
});

Tinytest.add('example exist', function (test) {
    var schema = 'exist';
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(null), false);
    test.equal(sv.test(), false);
    test.equal(sv.test('wow'), true);
});

Tinytest.add('example type', function (test) {
    var schema = ['type', 'number'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('bob'), false);
    test.equal(sv.test(1), true);
});

Tinytest.add('example length', function (test) {
    var schema = ['length', 2];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('bob'), false);
    test.equal(sv.test('bb'), true);
    test.equal(sv.test([1, 2]), true);


    schema = ['length', [2, 4]];
    sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('1'), false);
    test.equal(sv.test([1, 2, 3, 4, 5]), false);
    test.equal(sv.test('12'), true);
    test.equal(sv.test([1, 2, 3]), true);
});

Tinytest.add('example eq', function (test) {
    var bl = SchemaValidation.defaultOptions.language;
    SchemaValidation.setDefaultOptions({language: sl_js});

    var schema = ['eq', 5];
    var sv = new SchemaValidation(schema);

    test.equal(sv.test('6'), false);
    test.equal(sv.test('5'), true);
    test.equal(sv.test(5), true);

    SchemaValidation.setDefaultOptions({language: bl});
});

Tinytest.add('example gt', function (test) {
    var schema = ['gt', 5];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), false);
    test.equal(sv.test(6), true);
});

Tinytest.add('example min', function (test) {
    var schema = ['min', 5];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(4), false);
    test.equal(sv.test(5), true);
});

Tinytest.add('example in', function (test) {
    var schema = ['in', [1, 2]];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), false);
    test.equal(sv.test(2), true);
});

Tinytest.add('example and', function (test) {
    var schema = ['and', 'isString', ['length', 3]];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), false);
    test.equal(sv.test('bb'), false);
    test.equal(sv.test('bbb'), true);

    schema = ['isString', ['length', 3]];
    sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), false);
    test.equal(sv.test('bb'), false);
    test.equal(sv.test('bbb'), true);
});

Tinytest.add('example or', function (test) {
    var schema = ['or', 'isString', 'isNumber'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), true);
    test.equal(sv.test('bbb'), true);
    test.equal(sv.test({}), false);
});

Tinytest.add('example not', function (test) {
    var schema = ['not', 'isString'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(5), true);
    test.equal(sv.test('bbb'), false);
    test.equal(sv.test({}), true);
});

Tinytest.add('example each', function (test) {
    var schema = ['each', 'isNumber'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test([5, 6]), true);
    test.equal(sv.test([5, '6']), false);
});

Tinytest.add('example some', function (test) {
    var schema = ['some', 'isNumber'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(['5', '6']), false);
    test.equal(sv.test([5, '6']), true);
});

Tinytest.add('example each field', function (test) {
    var schema = {name: 'isString', age: 'isNumber'};
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test({name: 'bob', age: 20}), true);
    test.equal(sv.test({name: 'alan', age: '20'}), false);
});

Tinytest.add('example some field', function (test) {
    var schema = [{name: 'isString', age: 'isNumber'}];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test({name: 'bob', age: '20'}), true);
    test.equal(sv.test({name: 20, age: '20'}), false);
});

Tinytest.add('example optional', function (test) {
    var schema = ['optional', 'isString'];
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(), true);
    test.equal(sv.test(null), true);
    test.equal(sv.test('2'), true);
    test.equal(sv.test(2), false);

    schema = ['optional', 'isNumber', ['gt', 5]];
    sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test(), true);
    test.equal(sv.test(null), true);
    test.equal(sv.test('2'), false);
    test.equal(sv.test(2), false);
    test.equal(sv.test(6), true);
});

Tinytest.add('example strings', function (test) {
    SchemaValidation.stringValidations.enable(function (name) {
        return '.' + name
    });

    var schema = '.isEmail';
    var sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('qq@qq.com'), true);
    test.equal(sv.test('qq.com'), false);

    schema = ['.contains:', 'bob'];
    sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('hello bob'), true);
    test.equal(sv.test('hello world'), false);

    schema = ['.isIn:', ['1', '2']];
    sv = new SchemaValidation(schema, {language: sl_js});

    test.equal(sv.test('1'), true);
    test.equal(sv.test('3'), false);

    SchemaValidation.stringValidations.disable();
});

Tinytest.add('example cycle-reference', function (test) {
    var schemas = {
        people: {
            name: 'isString',
            friends: ['optional', ['each', 'schema:people']]
        }
    };
    var sv = SchemaValidation.batchNew(schemas, {language: sl_js}).people;

    var bob = {
        name: 'bob'
    };

    var alan = {
        name: 'alan',
        friends: [bob]
    };

    var evil = {
        name: 'evil',
        friends: ['god']
    };


    test.equal(sv.test(bob), true);
    test.equal(sv.test(alan), true);
    test.equal(sv.test(evil), false);
});

Tinytest.add('example complex', function (test) {
    SchemaValidation.stringValidations.enable(function (name) {
        return '.' + name
    });

    var schema = ['optional', {
        id: 'isNumber',
        name: 'isString',
        role: ['optional', ['oneOf', 'isString', ['in', [1, 2]]]],
        birth: ['optional', ['class', Date]],
        profile: ['optional', 'isObject', {
            nickname: ['optional', 'isString'],
            about: ['optional', 'isString'],
            email: ['optional', '.isEmail', ['.contains:', '@qq.com']]
        }],
        phones: ['each', 'isString'],
        options: ['isObject', [{
            bindPhone: 'isBoolean',
            bindEmail: 'isBoolean'
        }]]
    }];

    var pass1 = {
        id: 123,
        name: 'bob',
        role: 'admin',
        options: {
            bindPhone: true
        }
    };
    var pass2 = {
        id: 321,
        name: 'alan',
        role: 1,
        birth: new Date,
        profile: {
            nickname: 'doge',
            about: 'I am doge'
        },
        options: {
            bindEmail: false
        }
    };
    var pass3 = {
        id: 123,
        name: 'bob',
        role: 'admin',
        profile: {
            email: 'qq@qq.com'
        },
        options: {
            bindPhone: true
        }
    };
    var fail1 = {
        id: '123',
        name: 'bob',
        role: 'admin',
        options: {
            bindPhone: true
        }
    };
    var fail2 = {
        id: 321,
        name: 'alan',
        role: 1,
        birth: new Date,
        profile: {
            nickname: 23333,
            about: 'I am doge'
        },
        options: {
            bindEmail: false
        }
    };
    var fail3 = {
        id: 123,
        name: 'bob',
        role: 'admin',
        profile: {
            email: 'qq@163.com'
        },
        options: {
            bindPhone: true
        }
    };

    var sv = new SchemaValidation(schema, {language: sl_js});
    test.equal(sv.test(pass1), true);
    test.equal(sv.test(pass2), true);
    test.equal(sv.test(pass3), true);
    test.equal(sv.test(fail1), false);
    test.equal(sv.test(fail2), false);
    test.equal(sv.test(fail3), false);

    SchemaValidation.stringValidations.disable();
});