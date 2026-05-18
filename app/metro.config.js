const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Read OKY_PRIVATE_RESOURCES from the shell or app/.env. When set to 1 and
// app/src/resources-global exists, rewrite every import pointing into
// app/src/resources (tracked public baseline) to the same path under
// app/src/resources-global (the private git checkout). The main repo
// tree is not touched, git status stays clean.
let usePrivate = process.env.OKY_PRIVATE_RESOURCES === '1';
if (!process.env.OKY_PRIVATE_RESOURCES) {
  try {
    const envFile = path.join(__dirname, '.env');
    if (fs.existsSync(envFile)) {
      const match = fs.readFileSync(envFile, 'utf8').match(/^\s*OKY_PRIVATE_RESOURCES=([^\s#]*)/m);
      if (match && match[1].replace(/["']/g, '') === '1') {
        usePrivate = true;
      }
    }
  } catch (e) {
    // ignore
  }
}

const publicResources = path.resolve(__dirname, 'src/resources');
const privateResources = path.resolve(__dirname, 'src/resources-global');

if (usePrivate && fs.existsSync(privateResources)) {
  const defaultResolver = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith('.') || moduleName.startsWith('/')) {
      const absolute = path.resolve(path.dirname(context.originModulePath), moduleName);
      if (absolute === publicResources || absolute.startsWith(publicResources + path.sep)) {
        const redirected = absolute.replace(publicResources, privateResources);
        return context.resolveRequest(context, redirected, platform);
      }
    }
    if (typeof defaultResolver === 'function') {
      return defaultResolver(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
