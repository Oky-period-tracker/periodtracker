const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

const RNFB_PODFILE_SNIPPET = `
    # Allow non-modular headers in React Native Firebase when using use_frameworks! :linkage => :static
    installer.pods_project.targets.each do |target|
      if target.name.start_with?('RNFB')
        target.build_configurations.each do |config|
          config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        end
      end
    end
`

/**
 * Expo config plugin that patches the iOS Podfile so RNFB (React Native Firebase)
 * builds with use_frameworks! :linkage => :static. Inserts CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES
 * for RNFB targets. Runs at prebuild so EAS Build gets the fix.
 */
function withRNFBPodfile(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      if (!fs.existsSync(podfilePath)) {
        return config
      }
      let contents = fs.readFileSync(podfilePath, 'utf8')
      if (contents.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
        return config
      }
      // Insert after react_native_post_install(...) and before the "end" that closes post_install
      let newContents = contents.replace(
        /(ccache_enabled\?\(podfile_properties\),\s*\n\s+\))\s*\n(\s+end)/m,
        (_, closeParen, endLine) => `${closeParen}${RNFB_PODFILE_SNIPPET}\n${endLine}`
      )
      // Fallback: match closing paren of a multi-line call followed by "  end" (post_install block)
      if (newContents === contents && /post_install do/.test(contents)) {
        newContents = contents.replace(
          /(    \)\s*\n)(  end\s*\n)/m,
          (_, paren, endLine) => `${paren}${RNFB_PODFILE_SNIPPET}\n${endLine}`
        )
      }
      if (newContents !== contents) {
        fs.writeFileSync(podfilePath, newContents)
      }
      return config
    },
  ])
}

module.exports = withRNFBPodfile
