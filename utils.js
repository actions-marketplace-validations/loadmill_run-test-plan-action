const convertStrToArr = (strWithCommas) => {
    return typeof strWithCommas !== "string" ? null : strWithCommas.split(",");
}

const toParams = (rawParams) => {
    const parameters = {};

    const splitted = rawParams && rawParams.split(',') || [];
    splitted.forEach(pair => {
        const pivot = pair.indexOf('=');

        if (pivot <= 0) {
            throw new Error(`Invalid parameter assignment: ${pair}`);
        }

        const name = pair.slice(0, pivot);
        parameters[name] = pair.slice(pivot + 1, pair.length);
    });

    return parameters;
}

module.exports = {
    convertStrToArr,
    toParams
}