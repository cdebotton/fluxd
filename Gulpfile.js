'use strict';

var pruno = require('pruno')
       .use(require('gulp'));

require('./mixes/to5Task');

pruno(function(mix) {
  mix
    .del('./dist')
    .to5();
});
