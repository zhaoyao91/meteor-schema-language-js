sl_js = {
    updateValidationList: function (list) {
    },

    parse: parseSchema,

    name: 'sl_js' // debug only
};

function parseSchema(schema) {
    if (schema === null || schema === undefined || schema !== schema) return parseNone(schema);
    else if (typeof schema === 'string') return parseString(schema);
    else if (Array.isArray(schema)) return parseArray(schema);
    else if (typeof schema === 'object') return parseObject(schema);
    else throw new Error('fail to parse schema: ' + schema);
}

function parseNone(schema) {
    throw new Error('fail to parse schema: schema cannot be null, undefined or NaN');
}

function parseString(string) {
    if (string.indexOf('schema:') === 0) {
        return string.slice(7);
    }

    return {
        name: string
    }
}

function parseObject(object) {
    var params = [];
    var schemas = [];

    for (var i in object) {
        if (object.hasOwnProperty(i)) {
            params.push(i);
            schemas.push(parseSchema(object[i]));
        }
    }

    return {
        name: 'each',
        params: params,
        schemas: schemas
    }
}

function parseArray(array) {
    if (array.length === 0) throw new Error('fail to parse schema: cannot parse empty array');
    else if (array.length === 1 && typeof array[0] === 'object') return parseObjectInArray(array[0]);
    else {
        array[0] = mapKeyWord(array[0]);
        if ((isForSchemas(array[0]))) return parseArrayForSchemas(array);
        else if (isForParams(array[0])) return parseArrayForParams(array);
        else return parseAndArray(array);
    }
}

function parseObjectInArray(object) {
    var params = [];
    var schemas = [];

    for (var i in object) {
        if (object.hasOwnProperty(i)) {
            params.push(i);
            schemas.push(parseSchema(object[i]));
        }
    }

    return {
        name: 'some',
        params: params,
        schemas: schemas
    }
}

function isForSchemas(string) {
    return (string.length > 2 && string[string.length - 1] === ':' && string[string.length - 2] === ':');
}

function isForParams(string) {
    return (string.length > 1 && string[string.length - 1] === ':');
}

function parseArrayForSchemas(array) {
    var name = array[0].slice(0, array[0].length - 2);
    if (name === 'optional') return parseOptionalArray(array.slice(1, array.length));

    var schemas = [];

    for (var i = 1; i < array.length; i++) {
        schemas.push(parseSchema(array[i]));
    }

    return {
        name: name,
        schemas: schemas
    }
}

function parseArrayForParams(array) {
    var name = array[0].slice(0, array[0].length - 1);
    var params = [];

    for (var i = 1; i < array.length; i++) {
        params.push(array[i]);
    }

    return {
        name: name,
        params: params
    }
}

function parseAndArray(array) {
    var schemas = [];
    for (var i = 0; i < array.length; i++) {
        schemas.push(parseSchema(array[i]));
    }

    return {
        name: 'and',
        schemas: schemas
    }
}

function parseOptionalArray(array) {
    var schemas = [];
    for (var i = 0; i < array.length; i++) {
        schemas.push(parseSchema(array[i]));
    }

    if (schemas.length > 1) return {
        name: 'optional',
        schemas: [
            {name: 'and', schemas: schemas}
        ]
    };
    else return {
        name: 'optional',
        schemas: schemas
    }
}