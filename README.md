# Schema-Language-js
**a simple schema language using plain javascript.**

## Installation
- install schema-validation: `meteor add zhaoyao91:schema-validation`
- install sl-js: `meteor add zhaoyao91:sl-js`
- set sl-js as the default language of schema-validation: `SchemaLanguage.setDefaultOptions({language: sl_js})`
- define your schema using sl-js,  new a schema validation instance, and test, validate or check your variables. 

## Instruction
This is a schema language for [schema-validation](https://github.com/zhaoyao91/meteor-schema-validation#schema-language). It use pure plain js things(string, array, object) to define schema, and clearly reflects the structure of the target object.

## Grammer
### basic translations
- **'name' => {name: 'name'}** - a schema without params and sub schemas
- **'schema:name' => 'name'** - a schema reference
- **['name:', ...] => {name: 'name', params: [...]}** - a schema with params
- **['name::', ...] => {name: 'name', schemas: [*...]}** - a schema with sub schemas
- **[...] => {name: 'and', schemas: [...]}** - and schema
- **{field1: schema1, field2: schema2 ...} => {name: 'each', params: ['field1', 'field2' ...], schemas: [*schema1, *schema2 ...]}** - each schema for fields
- **[{field1: schema1, field2: schema2 ...}] => {name: 'some', params: ['field1', 'field2' ...], schemas: [*schema1, *schema2 ...]}** - some schema for fields

### name mapping
In [name, ...], if name is one of the keys of the following list, it will be mapped into the corresponding value before further translation.
- **and -> and::**
- **or -> or::**
- **not -> not::**
- **each -> each::**
- **some -> some::**
- **oneOf -> or::**
- **optional -> optional::**
- **where -> where:**
- **type -> type:**
- **class -> class:**
- **length -> length:**
- **== -> ==:**
- **=== -> ===:**
- **!= -> !=:**
- **!== -> !==:**
- **> -> >:**
- **< -> <:**
- **>= -> >=:**
- **<= -> <=:**
- **eq -> eq:**
- **neq -> neq:**
- **gt -> gt:**
- **lt -> lt:**
- **ge -> ge:**
- **le -> le:**
- **min -> min:**
- **max -> max:**
- **in -> in:**
- **notIn -> notIn:**

### optional validation
If a schema is **[optional, ...]** or **[optional::, ...]**
- **if there is only one sub schema => {name: 'optional', schemas: [*...]}**
- **is there are more than one sub schemas => {name: 'optional', 'schemas: [{name: 'and', schemas: [*...]}]'}**

## Usage Examples
see [examples](https://github.com/zhaoyao91/meteor-schema-language-js/blob/master/docs/Examples.md)

## Tests
In the project with this package, run `meteor test-packages zhaoyao91:sl-js`.

##License (MIT)

	Copyright (c) 2015 Zhao Yao zhaoyao91@163.com

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.