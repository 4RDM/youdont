module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint/eslint-plugin"],
	extends: [
		"plugin:@typescript-eslint/recommended",
	],
	root: true,
	env: {
		node: true,
		jest: false,
	},
	ignorePatterns: [".eslintrc.js"],
	rules: {
        "no-mixed-spaces-and-tabs": "error",
		"no-unused-vars": "off",
		"no-empty-function": "off",
		"indent": ["error", 4],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"array-bracket-spacing": [
			"error",
			"never"
		],
		"object-curly-spacing": [
			"warn",
			"always"
		],
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-empty-function": "warn",
		"@typescript-eslint/no-unused-vars": "warn",
		"@typescript-eslint/no-explicit-any": "error"
	},
};
