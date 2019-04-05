module.exports = {
  "plugins": [
    "import"
  ],
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "node": true,
    "jest": true,
    "browser": true
  },
  "extends": ["airbnb", "plugin:react/recommended"],
  "rules": {
    "no-console": 0,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": [1, {
      "js": "never",
      "jsx": "never"
    }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/forbid-prop-types": [1, {"forbid": ["any"]}],
    "react/prefer-stateless-function": 0,
    "arrow-body-style": 0,
    "react/no-array-index-key": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "class-methods-use-this": 0,
    "no-unused-expressions": 0,
    "global-require": 0,
    "react/prop-types": [0],
    "linebreak-style": 0,
    "no-underscore-dangle": 0,

    "indent": [1, 4],
    "triple-equals": true,
    "trailing-comma": [true, {"multiline": "always", "singleline": "never"}],

    "block-spacing": 2,
    "brace-style": ["error", "1tbs", {"allowSingleLine": true}],
    "semi": ["error", "never"],
    "key-spacing": ["error", {
        "multiLine": {
            "beforeColon": false,
            "afterColon": true,
            // "on": "value",
        },
        "singleLine": {
            "beforeColon": false,
            "afterColon": true,
            // "on": "value",
        },
        "align": {
            "beforeColon": false,
            "afterColon": true,
            "on": "value",
        },
    }],
    "object-curly-newline": ["error", {
        "multiline": true,
    }],
    "array-bracket-spacing": ["error", "always"],
    "implicit-arrow-linebreak": ["error", "beside"],
  }
};
