import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.jsx"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  ...fixupConfigRules(pluginReactConfig),
  {
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "react/prop-types": "off",
      "react/jsx-key": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  { ignores: [".expo"] },
];
