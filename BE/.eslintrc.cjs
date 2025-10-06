module.exports = {
    
    env: {
        browser: true, 
        es2020: true, 
        node: true, 
    },

    
    extends: [
        'eslint:recommended', 
        'plugin:prettier/recommended', 
    ],

    
    parser: '@babel/eslint-parser',

    
    parserOptions: {
<<<<<<< HEAD
        ecmaVersion: 'latest', 
        sourceType: 'module', 
        allowImportExportEverywhere: true, 
=======
        requireConfigFile: false,
        ecmaVersion: 'latest', // Dùng phiên bản ECMAScript mới nhất
        sourceType: 'module', // Cho phép dùng import/export
        allowImportExportEverywhere: true, // Cho phép import/export ở bất kỳ đâu
>>>>>>> ee4f157002f78adbe95170de39afa6726dac5b1a
    },

    
    settings: {
        react: {
            version: '18.2', 
        },
    },

    
    plugins: [],

    
    rules: {
        'no-console': 1, 
        'no-lonely-if': 1, 
        'no-unused-vars': 1, 
        "no-multiple-empty-lines": ["warn", { "max": 1 }] 
    },
}
