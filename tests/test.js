Tinytest.add('single schema', function (test) {
    test.equal(sl_js.parse('isString'), {name: 'isString'});
});

Tinytest.add('schema with params', function (test) {
    test.equal(sl_js.parse(['type:', 'string']), {name: 'type', params: ['string']});
});

Tinytest.add('schema with schemas', function (test) {
    test.equal(sl_js.parse(['and::', 'isString', ['type:', 'string']]), {
        name: 'and',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });
});

Tinytest.add('schema and', function (test) {
    test.equal(sl_js.parse(['isString', ['type:', 'string']]), {
        name: 'and',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });
});

Tinytest.add('schema each field', function (test) {
    test.equal(sl_js.parse({name: 'isString', age: ['type:', 'number']}), {
        name: 'each',
        params: ['name', 'age'],
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['number']}
        ]
    });
});

Tinytest.add('schema some field', function (test) {
    test.equal(sl_js.parse([{name: 'isString', age: ['type:', 'number']}]), {
        name: 'some',
        params: ['name', 'age'],
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['number']}
        ]
    });
});

Tinytest.add('schema mapping', function (test) {
    function testFunc(target) {
        return target > 5
    }

    test.equal(sl_js.parse(['type', 'string']), {name: 'type', params: ['string']});
    test.equal(sl_js.parse(['where', testFunc]), {name: 'where', params: [testFunc]});
    test.equal(sl_js.parse(['==', 1]), {name: '==', params: [1]});
    test.equal(sl_js.parse(['in', [1, 2, 3]]), {name: 'in', params: [[1, 2, 3]]});

    test.equal(sl_js.parse(['and', 'isString', ['type:', 'string']]), {
        name: 'and',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });

    test.equal(sl_js.parse(['or', 'isString', ['type:', 'string']]), {
        name: 'or',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });

    test.equal(sl_js.parse(['each', 'isString', ['type:', 'string']]), {
        name: 'each',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });

    test.equal(sl_js.parse(['oneOf', 'isString', ['type:', 'string']]), {
        name: 'or',
        schemas: [
            {name: 'isString'},
            {name: 'type', params: ['string']}
        ]
    });
});

Tinytest.add('schema optional', function (test) {
    test.equal(sl_js.parse(['optional', 'isString', ['type:', 'string']]), {
        name: 'optional',
        schemas: [
            {
                name: 'and',
                schemas: [
                    {name: 'isString'},
                    {name: 'type', params: ['string']}
                ]
            }
        ]
    });

    test.equal(sl_js.parse(['optional', ['oneOf', 'isString', 'isNumber']]), {
        name: 'optional',
        schemas: [
            {
                name: 'or',
                schemas: [
                    {name: 'isString'},
                    {name: 'isNumber'}
                ]
            }
        ]
    });
});

Tinytest.add('schema in real', function (test) {
    var schema = ['optional', {
        id: 'isNumber',
        name: 'isString',
        role: ['optional', ['oneOf', 'isString', ['in', [1, 2]]]],
        birth: ['optional', ['class', Date]],
        profile: ['optional', 'isObject', {
            nickname: ['optional', 'isString'],
            about: ['optional', 'isString']
        }],
        phones: ['each', 'isString'],
        options: ['isObject', [{
            bindPhone: 'isBoolean',
            bindEmail: 'isBoolean'
        }]]
    }];

    var simpleSchema = {
        name: 'optional',
        schemas: [{
            name: 'each',
            params: ['id', 'name', 'role', 'birth', 'profile', 'phones', 'options'],
            schemas: [
                {name: 'isNumber'},
                {name: 'isString'},
                {
                    name: 'optional',
                    schemas: [{name: 'or', schemas: [{name: 'isString'}, {name: 'in', params: [[1, 2]]}]}]
                },
                {name: 'optional', schemas: [{name: 'class', params: [Date]}]},
                {
                    name: 'optional',
                    schemas: [{
                        name: 'and', schemas: [{name: 'isObject'}, {
                            name: 'each',
                            params: ['nickname', 'about'],
                            schemas: [
                                {name: 'optional', schemas: [{name: 'isString'}]},
                                {name: 'optional', schemas: [{name: 'isString'}]}
                            ]
                        }]
                    }]
                },
                {name: 'each', schemas: [{name: 'isString'}]},
                {
                    name: 'and',
                    schemas: [
                        {name: 'isObject'},
                        {
                            name: 'some',
                            params: ['bindPhone', 'bindEmail'],
                            schemas: [
                                {name: 'isBoolean'},
                                {name: 'isBoolean'}
                            ]
                        }
                    ]
                }
            ]
        }]
    };

    test.equal(sl_js.parse(schema), simpleSchema);
});

Tinytest.add('schema in validation', function (test) {
    var schema = ['optional', {
        id: 'isNumber',
        name: 'isString',
        role: ['optional', ['oneOf', 'isString', ['in', [1, 2]]]],
        birth: ['optional', ['class', Date]],
        profile: ['optional', 'isObject', {
            nickname: ['optional', 'isString'],
            about: ['optional', 'isString']
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

    var sv = new SchemaValidation(schema, {language: sl_js});
    test.equal(sv.test(pass1), true);
    test.equal(sv.test(pass2), true);
    test.equal(sv.test(fail1), false);
    test.equal(sv.test(fail2), false);
});

Tinytest.add('cycle schema in validation', function (test) {
    var schemas = {
        people: {
            name: 'isString',
            friends: ['optional', ['each', 'schema:people']]
        }
    };

    var sv = SchemaValidation.batchNew(schemas, {language: sl_js, batchParse: true}).people;

    var bob = {
        name: 'bob'
    };

    var alan = {
        name: 'alan'
    };

    var zy = {
        name: 'zy',
        friends: [bob, alan]
    };

    var evil = {
        name: 'evil',
        friends: [bob, 2333]
    };

    test.equal(sv.test(zy), true);
    test.equal(sv.test(evil), false);
});