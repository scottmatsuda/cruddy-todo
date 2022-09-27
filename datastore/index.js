const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((error, id) => {


    let destination = path.join(exports.dataDir, `${id}.txt`);
    // console.log('destination: ', destination);
    // console.log('text', text);

    // console.log('arguments: ', arguments);

    // let args = arguments;
    // let tempId = args[0];
    // let destination = path.join(exports.dataDir, `/${tempId}.txt`);
    // let destination = path.join(exports.dataDir, '/:id.txt');

    // this line of code is being executed, but we don't know how to get access to id
    // writeCounter(id + 1, callback);

    //writefile takes in parameter of file, data, options, callback
    fs.writeFile(destination, text, (error) => {
      if (error) {
        // throw ('error: unsuccessful');
        callback(error);
      } else {
        callback(null, { id, text });
        // console.log('success');

      }
    });
  });


  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });


  // let path = exports.dataDir + '/:id';
  // fs.writeFile(path, text, (err) => {
  //   if (err) {
  //     throw ('error writing counter');
  //   } else {
  //     console.log('create success');
  //   }
  // });

  // callback(null, { id, text });




};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
