const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // Write new file
  // If the dataDir DNE yet, make a brand new directory and first file starting at counter 00001 and add todo to the file
  // Otherwise getNextUniqueId and store a new todo
  counter.getNextUniqueId((err, id) => {
    //     /targetfile/ + id
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err)=>{
      if (err) {
        callback(err);
      } else {
        callback(null, {id, text});
      }
    });
  });
};


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=>{
    var data = _.map(files, (file)=>{
      var id = fs.basename(file, '.txt');
      return {
        id: id,
        text: id
      };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  // fs.readdir(exports.dataDir, (err, id)=>{
  //   todoList = _.map(files, (file)=>{
  //     if (fs.basename(file, '.txt') === id) {
  //       callback(null, {id: id, text: id});
  //     }
  //   })
  // })

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
