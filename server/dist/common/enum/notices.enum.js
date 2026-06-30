"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticePriority = exports.NoticeTarget = exports.NoticesCategory = void 0;
var NoticesCategory;
(function (NoticesCategory) {
    NoticesCategory["NORMAL"] = "NORMAL";
    NoticesCategory["SYSTEM"] = "SYSTEM";
    NoticesCategory["UPDATE"] = "UPDATE";
    NoticesCategory["EVENT"] = "EVENT";
    NoticesCategory["POLICY"] = "POLICY";
    NoticesCategory["ETC"] = "ETC";
})(NoticesCategory || (exports.NoticesCategory = NoticesCategory = {}));
var NoticeTarget;
(function (NoticeTarget) {
    NoticeTarget["PARTNER"] = "PARTNER";
    NoticeTarget["USER"] = "USER";
    NoticeTarget["ALL"] = "ALL";
})(NoticeTarget || (exports.NoticeTarget = NoticeTarget = {}));
var NoticePriority;
(function (NoticePriority) {
    NoticePriority["NORMAL"] = "NORMAL";
    NoticePriority["IMPORTANT"] = "IMPORTANT";
    NoticePriority["URGENT"] = "URGENT";
})(NoticePriority || (exports.NoticePriority = NoticePriority = {}));
//# sourceMappingURL=notices.enum.js.map