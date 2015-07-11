# Examples
This doc assumes you have installed and set the package correctly. (Not yet? see [installation doc](https://github.com/zhaoyao91/meteor-schema-language-js#installation))

For simplicity, these examples only use `test` method of the schema validation. In practice, you can use `test`, `validate`, or `check`. For the differences, see [doc](https://github.com/zhaoyao91/meteor-schema-validation#schema-validation-1).

Also note, these examples do not cover all usages of this package and schema validation. Try as you learn and think, or see [doc](https://github.com/zhaoyao91/meteor-schema-validation) for more details.

### where

	var schema = ['where', function (target) {
        return target === 'wow'
    }];
    var sv = new SchemaValidation(schema);

    sv.test('bob'); // false
	sv.test('wow'); // true

### exist

	var schema = 'exist';
    var sv = new SchemaValidation(schema);

    sv.test(null); // false
    sv.test(); // false
    sv.test('wow'); // true

### type

	var schema = ['type', 'number'];
    var sv = new SchemaValidation(schema);

    sv.test('bob'); // false
    sv.test(1); // true

### isString

	var schema = 'isString';
    var sv = new SchemaValidation(schema);

    sv.test('bob'); // true
    sv.test(1); // false

### length

	var schema = ['length', 2]; // length == 2
    var sv = new SchemaValidation(schema);

    sv.test('bob'); // false
    sv.test('bb'); // true
    sv.test([1, 2]); //true

    schema = ['length', [2, 4]]; // 2 <= length <= 4
    sv = new SchemaValidation(schema);

	sv.test('1'); //false
    sv.test([1, 2, 3, 4, 5]); //false
    sv.test('12'); //true
	sv.test([1, 2, 3]); // true

### eq

	var schema = ['eq', 5];
    var sv = new SchemaValidation(schema);

    sv.test('6'); // false
    sv.test('5'); //true
    sv.test(5); //true

### gt

	var schema = ['gt', 5];
    var sv = new SchemaValidation(schema);

    sv.test(5); //false
    sv.test(6); //true

### min

	var schema = ['min', 5];
    var sv = new SchemaValidation(schema);

	sv.test(4); // false
    sv.test(5); // true

### in

	var schema = ['in', [1, 2]];
    var sv = new SchemaValidation(schema);

    sv.test(5); // false
    sv.test(2); // true

###  and
	var schema = ['and', 'isString', ['length', 3]];
    var sv = new SchemaValidation(schema);

    sv.test(5); // false
    sv.test('bb'); // false
    sv.test('bbb'); // true

	// for and validation, you can ignore the name 'and'
    schema = ['isString', ['length', 3]];
    sv = new SchemaValidation(schema);

    sv.test(5); // false
    sv.test('bb'); // false
    sv.test('bbb'); // true

### or
	var schema = ['or', 'isString', 'isNumber'];
	// var schema = ['oneOf', 'isString', 'isNumber']; // the same schema
	var sv = new SchemaValidation(schema);

    sv.test(5); // true
    sv.test('bbb'); // true
    sv.test({}); // false

### not
	var schema = ['not', 'isString'];
    var sv = new SchemaValidation(schema);

    sv.test(5); // true
    sv.test('bbb'); // false
    sv.test({}); // true

### each
	
	var schema = ['each', 'isNumber'];
    var sv = new SchemaValidation(schema);

    sv.test([5, 6]); // true
    sv.test([5, '6']); // false

### some

	var schema = ['some', 'isNumber'];
    var sv = new SchemaValidation(schema);

    sv.test(['5', '6']); // false
	sv.test([5, '6']); // true

### each field

	var schema = {name: 'isString', age: 'isNumber'};
    var sv = new SchemaValidation(schema);

    sv.test({name: 'bob', age: 20}); // true
    sv.test({name: 'alan', age: '20'}); // false

### some field

	var schema = [{name: 'isString', age: 'isNumber'}];
    var sv = new SchemaValidation(schema);

	sv.test({name: 'bob', age: '20'}); // true
	sv.test({name: 20, age: '20'}); // false

### optional

	var schema = ['optional', 'isString'];
    var sv = new SchemaValidation(schema);

    sv.test(); // true
    sv.test(null); // true
    sv.test('2'); // true
    sv.test(2); // false

	// if there are more than 1 sub schemas, they are grouped into an and validation
    schema = ['optional', 'isNumber', ['gt', 5]];
    sv = new SchemaValidation(schema);

    sv.test(); // true
    sv.test(null); // true
    sv.test('2'); // false
    sv.test(2); // false
    sv.test(6); // true

### strings

	SchemaValidation.stringValidations.enable(function (name) {
        return '.' + name
    });

    var schema = '.isEmail';
    var sv = new SchemaValidation(schema);

    sv.test('qq@qq.com'); // true
    sv.test('qq.com'); // false

    schema = ['.contains:', 'bob'];
    sv = new SchemaValidation(schema);

    sv.test('hello bob'); // true
    sv.test('hello world'); // false

    schema = ['.isIn:', ['1', '2']];
    sv = new SchemaValidation(schema);

    sv.test('1'); // true
    sv.test('3'); // false

    SchemaValidation.stringValidations.disable();

### cycle-reference

	var schemas = {
        people: {
            name: 'isString',
            friends: ['optional', ['each', 'schema:people']]
        }
    };
    var sv = SchemaValidation.batchNew(schemas).people;

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


    sv.test(bob); // true
    sv.test(alan); // true
    sv.test(evil); // false

### complex

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
        id: '123', // no no no
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
            nickname: 23333, // no no no
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
            email: 'qq@163.com' // no no no
        },
        options: {
            bindPhone: true
        }
    };

    var sv = new SchemaValidation(schema);
    sv.test(pass1); // true
    sv.test(pass2); //true
    sv.test(pass3); // true
	sv.test(fail1); // false
    sv.test(fail2); // false
    sv.test(fail3); // false

    SchemaValidation.stringValidations.disable();