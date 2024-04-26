"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEntryResolver = createEntryResolver;
exports.createFileTransform = createFileTransform;
exports.createGlobFilter = createGlobFilter;
var _configPlugins = require("@expo/config-plugins");
var _minipass = _interopRequireDefault(require("minipass"));
var _path = _interopRequireDefault(require("path"));
var _picomatch = _interopRequireDefault(require("picomatch"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require("debug")("expo:file-transform");
function escapeXMLCharacters(original) {
    const noAmps = original.replace("&", "&amp;");
    const noLt = noAmps.replace("<", "&lt;");
    const noGt = noLt.replace(">", "&gt;");
    const noApos = noGt.replace('"', '\\"');
    return noApos.replace("'", "\\'");
}
class Transformer extends _minipass.default {
    constructor(settings){
        super();
        this.settings = settings;
        this.data = "";
    }
    write(data) {
        this.data += data;
        return true;
    }
    getNormalizedName() {
        if ([
            ".xml",
            ".plist"
        ].includes(this.settings.extension)) {
            return escapeXMLCharacters(this.settings.name);
        }
        return this.settings.name;
    }
    end() {
        const name = this.getNormalizedName();
        const replaced = this.data.replace(/Hello App Display Name/g, name).replace(/HelloWorld/g, _configPlugins.IOSConfig.XcodeUtils.sanitizedName(name)).replace(/helloworld/g, _configPlugins.IOSConfig.XcodeUtils.sanitizedName(name.toLowerCase()));
        super.write(replaced);
        return super.end();
    }
}
function createEntryResolver(name) {
    return (entry)=>{
        if (name) {
            // Rewrite paths for bare workflow
            entry.path = entry.path.replace(/HelloWorld/g, entry.path.includes("android") ? _configPlugins.IOSConfig.XcodeUtils.sanitizedName(name.toLowerCase()) : _configPlugins.IOSConfig.XcodeUtils.sanitizedName(name)).replace(/helloworld/g, _configPlugins.IOSConfig.XcodeUtils.sanitizedName(name).toLowerCase());
        }
        if (entry.type && /^file$/i.test(entry.type) && _path.default.basename(entry.path) === "gitignore") {
            // Rename `gitignore` because npm ignores files named `.gitignore` when publishing.
            // See: https://github.com/npm/npm/issues/1862
            entry.path = entry.path.replace(/gitignore$/, ".gitignore");
        }
    };
}
function createFileTransform(name) {
    return (entry)=>{
        const extension = _path.default.extname(entry.path);
        // Binary files, don't process these (avoid decoding as utf8)
        if (![
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".psd",
            ".tiff",
            ".svg",
            ".jar",
            ".keystore",
            ".gz",
            // Font files
            ".otf",
            ".ttf", 
        ].includes(extension) && name) {
            return new Transformer({
                name,
                extension
            });
        }
        return undefined;
    };
}
function createGlobFilter(globPattern, options) {
    const matcher = (0, _picomatch).default(globPattern, options);
    debug('filter: created for pattern(s) "%s" (%s)', Array.isArray(globPattern) ? globPattern.join('", "') : globPattern, options);
    return (path)=>{
        const included = matcher(path);
        debug("filter: %s - %s", included ? "include" : "exclude", path);
        return included;
    };
}

//# sourceMappingURL=createFileTransform.js.map