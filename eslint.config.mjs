import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'


export default [
	{files: ['**/*.{js,mjs,cjs,ts}']},
	{languageOptions: { globals: globals.node }},
	{
		rules: {
			quotes: ['error', 'single'], // Usa aspas simples
			semi: ['error', 'never'], // Remove ponto e vírgula no final
			indent: ['error', 'tab'], // Usa indentação com tab
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
]