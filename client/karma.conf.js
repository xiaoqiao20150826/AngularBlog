// Karma configuration
// Generated on Fri Nov 07 2014 20:11:45 GMT+0900 (대한민국 표준시)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',   

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // <script..로 바로로딩 혹은 서버에 '이름만 포함'
    files: [
			/* vendor libraries */
				// 전역인것. 선로딩할려구.
			"bower_components/underscore/underscore-min.js",
			"bower_components/jquery/dist/jquery.min.js",
			"bower_components/requirejs/require.js",
				// 이름포함만
			{pattern: 'bower_components/**/*', included: false},   
			/* test libraries */
			/* application scripts */
			{pattern: 'src/**/*.js', included: false},   //이름포함만
		    /* Specs (tests) */
			{pattern: 'test/**/*Spec.js', included: false},
			/* test main*/
			
			
			'test/test-main.js'		// requirejs main(진입점) 파일이름
    ],


    // list of files to exclude
    exclude: [
                'src/bootstrap.js'
              , 'src/main.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
