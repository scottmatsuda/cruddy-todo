const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, id) => {
    let destination = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(destination, text, (error) => {
      if (error) {
        callback(error);
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.readAll = (callback) => {
  // output = array
  let fileArray = [];

  fs.readdir(exports.dataDir, (error, files) => {
    if (error) {
      callback(error);
    } else {
      _.each(files, (file) => {
        let id = file.slice(0, file.length - 4);
        file = {id: id, text: id};
        fileArray.push(file);
      });
      callback(null, fileArray);
    }
  });
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
