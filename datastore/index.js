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
  let fileArray = [];

  fs.readdir(exports.dataDir, (error, files) => {
    if (error) {
      callback(error);
    } else {
      _.each(files, (file) => {
        let id = file.slice(0, file.length - 4);
        file = { id: id, text: id };
        fileArray.push(file);
      });
      callback(null, fileArray);
    }
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  let destination = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(destination, (error, data) => {
    if (error) {
      callback(error);
    } else {
      let text = data.toString('utf8');
      console.log('id: ', id, '  text: ', text);
      callback(null, { id, text });
    }
  });


  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  let destination = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(destination, (error, data) => {
    if (error) {
      callback(error);
    } else {
      fs.writeFile(destination, text, (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
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
