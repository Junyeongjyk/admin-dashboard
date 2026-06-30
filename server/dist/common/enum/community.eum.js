"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchType = exports.CommunityCategory = exports.CommunityPostType = void 0;
var CommunityPostType;
(function (CommunityPostType) {
    CommunityPostType["GENERAL"] = "GENERAL";
    CommunityPostType["QUESTION"] = "QUESTION";
    CommunityPostType["SHARE"] = "SHARE";
    CommunityPostType["REVIEW"] = "REVIEW";
    CommunityPostType["OPINION"] = "OPINION";
    CommunityPostType["REQUEST"] = "REQUEST";
    CommunityPostType["REPORT"] = "REPORT";
    CommunityPostType["ALL"] = "ALL"; //모두 표현
})(CommunityPostType || (exports.CommunityPostType = CommunityPostType = {}));
var CommunityCategory;
(function (CommunityCategory) {
    CommunityCategory["USER"] = "USER";
    CommunityCategory["PARTNER"] = "PARTNER";
})(CommunityCategory || (exports.CommunityCategory = CommunityCategory = {}));
var SearchType;
(function (SearchType) {
    SearchType["TITLE"] = "TITLE";
    SearchType["CONTENT"] = "CONTENT";
    SearchType["AUTHOR"] = "AUTHOR"; //작성자
})(SearchType || (exports.SearchType = SearchType = {}));
//# sourceMappingURL=community.eum.js.map