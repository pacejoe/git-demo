'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        connect: {
            all: {
                options: {
                    port: 9000,
                    hostname: "localhost",
                    middleware: function (connect, options) {
                        return [
                            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
                            connect.static(options.base),
                            proxySnippet
                        ];
                    }
                },
                proxies: [{
                    context: '/service',
                    host: 'localhost',
                    port: 8080 ,
                    rewrite: {
                        '^/service': '/'
                    }
                }]
            }
        },
        regarde: {
            all: {
                files: ['index.html, **/*.js'],
                tasks: ['livereload']
            }
        }
    });

    grunt.registerTask('serve', [
        'livereload-start',
        'configureProxies:all',
        'connect',
        'regarde'
    ]);
};