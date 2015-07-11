Package.describe({
    name: 'zhaoyao91:sl-js',
    version: '1.0.0',
    summary: 'a simple schema language using plain javascript.',
    git: 'https://github.com/zhaoyao91/meteor-schema-language-js',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');

    api.addFiles('lib/map.js');
    api.addFiles('lib/sl-js.js');

    api.export('sl_js');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('zhaoyao91:sl-js');
    api.use('zhaoyao91:schema-validation');

    api.addFiles('tests/test.js');
    api.addFiles('tests/example.js');
});
