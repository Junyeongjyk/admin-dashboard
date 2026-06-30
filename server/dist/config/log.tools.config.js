"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.handleSend = exports.log = void 0;
const common_1 = require("../common/functions/common");
const log = (title, discription, error) => {
    console.log(`${(0, common_1.nowDate)()} | [LOG] |TITLE: ${title} | DESCRIPTION: ${discription} | ERROR: ${error}`);
};
exports.log = log;
const handleSend = (data = [], discription = "Success", status = 1) => {
    return { status, data, message: discription };
};
exports.handleSend = handleSend;
const handleError = (title, error, discription = "ERROR", status = 0) => {
    console.log(`${(0, common_1.nowDate)()} | [ERROR] | TITLE: ${title} | ERROR: ${error} | DISCRIPTION: ${discription}`);
    return { status, message: discription };
};
exports.handleError = handleError;
//# sourceMappingURL=log.tools.config.js.map