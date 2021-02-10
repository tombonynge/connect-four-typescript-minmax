module.exports = {
    mode: "development",
    output: {
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
};
