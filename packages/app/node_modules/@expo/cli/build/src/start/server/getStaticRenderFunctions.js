"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createMetroEndpointAsync = createMetroEndpointAsync;
exports.requireFileContentsWithMetro = requireFileContentsWithMetro;
exports.getStaticRenderFunctions = getStaticRenderFunctions;
var _fs = _interopRequireDefault(require("fs"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _path = _interopRequireDefault(require("path"));
var _requireFromString = _interopRequireDefault(require("require-from-string"));
var _resolveFrom = _interopRequireDefault(require("resolve-from"));
var _metroErrorInterface = require("./metro/metroErrorInterface");
var _manifestMiddleware = require("./middleware/ManifestMiddleware");
var _metroOptions = require("./middleware/metroOptions");
var _serverLogLikeMetro = require("./serverLogLikeMetro");
var _ansi = require("../../utils/ansi");
var _delay = require("../../utils/delay");
var _errors = require("../../utils/errors");
var _fn = require("../../utils/fn");
var _profile = require("../../utils/profile");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class MetroNodeError extends Error {
    constructor(message, rawObject){
        super(message);
        this.rawObject = rawObject;
    }
}
const debug = require("debug")("expo:start:server:node-renderer");
const cachedSourceMaps = new Map();
// Support unhandled rejections
require("source-map-support").install({
    retrieveSourceMap (source) {
        if (cachedSourceMaps.has(source)) {
            return cachedSourceMaps.get(source);
        }
        return null;
    }
});
function wrapBundle(str) {
    // Skip the metro runtime so debugging is a bit easier.
    // Replace the __r() call with an export statement.
    // Use gm to apply to the last require line. This is needed when the bundle has side-effects.
    return str.replace(/^(__r\(.*\);)$/gm, "module.exports = $1");
}
// TODO(EvanBacon): Group all the code together and version.
const getRenderModuleId = (projectRoot)=>{
    const moduleId = _resolveFrom.default.silent(projectRoot, "expo-router/node/render.js");
    if (!moduleId) {
        throw new Error(`A version of expo-router with Node.js support is not installed in the project.`);
    }
    return moduleId;
};
const moveStaticRenderFunction = (0, _fn).memoize(async (projectRoot, requiredModuleId)=>{
    // Copy the file into the project to ensure it works in monorepos.
    // This means the file cannot have any relative imports.
    const tempDir = _path.default.join(projectRoot, ".expo/static");
    await _fs.default.promises.mkdir(tempDir, {
        recursive: true
    });
    const moduleId = _path.default.join(tempDir, "render.js");
    await _fs.default.promises.writeFile(moduleId, await _fs.default.promises.readFile(requiredModuleId, "utf8"));
    // Sleep to give watchman time to register the file.
    await (0, _delay).delayAsync(50);
    return moduleId;
});
/** @returns the js file contents required to generate the static generation function. */ async function getStaticRenderFunctionsContentAsync(projectRoot, devServerUrl, { dev =false , minify =false , environment , baseUrl , routerRoot  }) {
    const root = (0, _manifestMiddleware).getMetroServerRoot(projectRoot);
    const requiredModuleId = getRenderModuleId(root);
    let moduleId = requiredModuleId;
    // Cannot be accessed using Metro's server API, we need to move the file
    // into the project root and try again.
    if (_path.default.relative(root, moduleId).startsWith("..")) {
        moduleId = await moveStaticRenderFunction(projectRoot, requiredModuleId);
    }
    return requireFileContentsWithMetro(root, devServerUrl, moduleId, {
        dev,
        minify,
        environment,
        baseUrl,
        routerRoot
    });
}
async function ensureFileInRootDirectory(projectRoot, otherFile) {
    // Cannot be accessed using Metro's server API, we need to move the file
    // into the project root and try again.
    if (!_path.default.relative(projectRoot, otherFile).startsWith(".." + _path.default.sep)) {
        return otherFile;
    }
    // Copy the file into the project to ensure it works in monorepos.
    // This means the file cannot have any relative imports.
    const tempDir = _path.default.join(projectRoot, ".expo/static-tmp");
    await _fs.default.promises.mkdir(tempDir, {
        recursive: true
    });
    const moduleId = _path.default.join(tempDir, _path.default.basename(otherFile));
    await _fs.default.promises.writeFile(moduleId, await _fs.default.promises.readFile(otherFile, "utf8"));
    // Sleep to give watchman time to register the file.
    await (0, _delay).delayAsync(50);
    return moduleId;
}
async function createMetroEndpointAsync(projectRoot, devServerUrl, absoluteFilePath, { dev =false , platform ="web" , minify =false , environment , engine ="hermes" , baseUrl , routerRoot  }) {
    const root = (0, _manifestMiddleware).getMetroServerRoot(projectRoot);
    const safeOtherFile = await ensureFileInRootDirectory(projectRoot, absoluteFilePath);
    const serverPath = _path.default.relative(root, safeOtherFile).replace(/\.[jt]sx?$/, "");
    const urlFragment = (0, _metroOptions).createBundleUrlPath({
        platform,
        mode: dev ? "development" : "production",
        mainModuleName: serverPath,
        engine,
        environment,
        lazy: false,
        minify,
        baseUrl,
        isExporting: true,
        asyncRoutes: false,
        routerRoot,
        inlineSourceMap: false,
        bytecode: false
    });
    let url;
    if (devServerUrl) {
        url = new URL(urlFragment.replace(/^\//, ""), devServerUrl).toString();
    } else {
        url = "/" + urlFragment.replace(/^\/+/, "");
    }
    debug("fetching from Metro:", root, serverPath, url);
    return url;
}
async function requireFileContentsWithMetro(projectRoot, devServerUrl, absoluteFilePath, props) {
    const url = await createMetroEndpointAsync(projectRoot, devServerUrl, absoluteFilePath, props);
    const res = await (0, _nodeFetch).default(url);
    // TODO: Improve error handling
    if (res.status === 500) {
        const text = await res.text();
        if (text.startsWith('{"originModulePath"') || text.startsWith('{"type":"TransformError"')) {
            const errorObject = JSON.parse(text);
            var ref;
            throw new MetroNodeError((ref = (0, _ansi).stripAnsi(errorObject.message)) != null ? ref : errorObject.message, errorObject);
        }
        throw new Error(`[${res.status}]: ${res.statusText}\n${text}`);
    }
    if (!res.ok) {
        throw new Error(`Error fetching bundle for static rendering: ${res.status} ${res.statusText}`);
    }
    const content = await res.text();
    const map = await (0, _nodeFetch).default(url.replace(".bundle?", ".map?")).then((r)=>r.json()
    );
    cachedSourceMaps.set(url, {
        url: projectRoot,
        map
    });
    return {
        src: wrapBundle(content),
        filename: url
    };
}
async function getStaticRenderFunctions(projectRoot, devServerUrl, options) {
    const { src: scriptContents , filename  } = await getStaticRenderFunctionsContentAsync(projectRoot, devServerUrl, options);
    return evalMetroAndWrapFunctions(projectRoot, scriptContents, filename);
}
function evalMetroAndWrapFunctions(projectRoot, script, filename) {
    const contents = evalMetro(projectRoot, script, filename);
    // wrap each function with a try/catch that uses Metro's error formatter
    return Object.keys(contents).reduce((acc, key)=>{
        const fn = contents[key];
        if (typeof fn !== "function") {
            return {
                ...acc,
                [key]: fn
            };
        }
        acc[key] = async function(...props) {
            try {
                return await fn.apply(this, props);
            } catch (error) {
                await (0, _metroErrorInterface).logMetroError(projectRoot, {
                    error
                });
                throw new _errors.SilentError(error);
            }
        };
        return acc;
    }, {});
}
function evalMetro(projectRoot, src, filename) {
    (0, _serverLogLikeMetro).augmentLogs(projectRoot);
    try {
        return (0, _profile).profile(_requireFromString.default, "eval-metro-bundle")(src, filename);
    } catch (error) {
        // Format any errors that were thrown in the global scope of the evaluation.
        if (error instanceof Error) {
            (0, _metroErrorInterface).logMetroErrorAsync({
                projectRoot,
                error
            }).catch((internalError)=>{
                debug("Failed to log metro error:", internalError);
                throw error;
            });
        } else {
            throw error;
        }
    } finally{}
}

//# sourceMappingURL=getStaticRenderFunctions.js.map