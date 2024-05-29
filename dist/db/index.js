"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uri = 'mongodb://localhost:27017/earnMachine';
(0, mongoose_1.connect)(uri)
    .then(() => {
    console.log('connected to mongodb');
})
    .catch(err => {
    console.log(err);
});
