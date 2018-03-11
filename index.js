#!/usr/bin/env node

'use strict';

var fs = require('fs');
var through = require('through2');
var parseOSM = require('osm-pbf-parser');

var types = {};

var osm = parseOSM();

var stream = fs.createReadStream(process.argv[2]).pipe(osm).pipe(through.obj(function(items, enc, next) {
  console.log('#', items.length);
  items.forEach(function(item) {
    types[item.type] = types[item.type] || 0;
    ++types[item.type];

    if (item.type === 'relation') {
      console.log('item=', item);
    }

    //console.log('.');
  });

  next();
}));

stream.on('error', function(err){
  console.log('error', err);
});
stream.on('finish', function(){
  console.log('finish', types);
});
