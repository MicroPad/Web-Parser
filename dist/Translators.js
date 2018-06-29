"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var date_fns_1 = require("date-fns");
var xml2js_1 = require("xml2js");
var Translators;
(function (Translators) {
    var Json;
    (function (Json) {
        function toNotepad(json) {
            var jsonObj = JSON.parse(json);
            var notepad = new index_1.Notepad(jsonObj.title, {
                lastModified: date_fns_1.parse(jsonObj.lastModified),
                notepadAssets: jsonObj.notepadAssets || []
            });
            jsonObj.sections.forEach(function (section) { return notepad = notepad.addSection(restoreSection(section)); });
            return notepad;
        }
        Json.toNotepad = toNotepad;
        function restoreSection(section) {
            var restored = new index_1.Section(section.title).clone({ internalRef: section.internalRef });
            section.sections.forEach(function (s) { return restored = restored.addSection(restoreSection(s)); });
            section.notes.forEach(function (n) { return restored = restored.addNote(restoreNote(n)); });
            return restored;
        }
        function restoreNote(note) {
            return new index_1.Note(note.title, note.time, note.elements, note.bibliography, note.internalRef);
        }
    })(Json = Translators.Json || (Translators.Json = {}));
    var Xml;
    (function (Xml) {
        function toNotepadFromNpx(xml) {
            return __awaiter(this, void 0, void 0, function () {
                function parseSection(sectionObj) {
                    var section = new index_1.Section(sectionObj.$.title);
                    (sectionObj.section || []).forEach(function (item) {
                        section = section.addSection(parseSection(item));
                    });
                    return section;
                }
                var res, notepad;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, parseXml(xml)];
                        case 1:
                            res = _a.sent();
                            notepad = new index_1.Notepad(res.notepad.$.title, { lastModified: res.notepad.$.lastModified });
                            if (res.notepad.section) {
                                res.notepad.section.forEach(function (s) { return notepad = notepad.addSection(parseSection(s)); });
                            }
                            return [2, notepad];
                    }
                });
            });
        }
        Xml.toNotepadFromNpx = toNotepadFromNpx;
        function parseXml(xml, opts) {
            if (opts === void 0) { opts = {}; }
            return new Promise(function (resolve, reject) {
                xml2js_1.parseString(xml, __assign({ trim: true }, opts), function (err, res) {
                    if (err)
                        reject(err);
                    resolve(res);
                });
            });
        }
    })(Xml = Translators.Xml || (Translators.Xml = {}));
})(Translators = exports.Translators || (exports.Translators = {}));