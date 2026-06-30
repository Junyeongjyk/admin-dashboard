"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupPath = exports.LoginAction = exports.UserStatus = exports.Gender = exports.UserType = exports.SignupType = void 0;
var SignupType;
(function (SignupType) {
    SignupType["USER"] = "USER";
    SignupType["PARTNER"] = "PARTNER";
})(SignupType || (exports.SignupType = SignupType = {}));
var UserType;
(function (UserType) {
    UserType["USER"] = "USER";
    UserType["PARTNER"] = "PARTNER";
    UserType["ADMIN"] = "ADMIN";
})(UserType || (exports.UserType = UserType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["WITHDRAWN"] = "WITHDRAWN";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var LoginAction;
(function (LoginAction) {
    LoginAction["LOGIN"] = "LOGIN";
    LoginAction["LOGOUT"] = "LOGOUT";
    LoginAction["LOGIN_FAIL"] = "LOGIN_FAIL";
})(LoginAction || (exports.LoginAction = LoginAction = {}));
var SignupPath;
(function (SignupPath) {
    SignupPath["NORMAL"] = "NORMAL";
    SignupPath["ADMIN"] = "ADMIN";
})(SignupPath || (exports.SignupPath = SignupPath = {}));
//# sourceMappingURL=users.enum.js.map