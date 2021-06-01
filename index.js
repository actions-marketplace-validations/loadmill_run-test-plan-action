const core = require('@actions/core');

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
(async () => {
try {
    const loadmill = require('./lib/index')({token: core.getInput('token')});

    const planId = core.getInput('id');
    const additionalDescription = core.getInput('additionalDescription');
    const labels = core.getInput('labels');
    const parameters = core.getInput('parameters');

    console.log(`Running test plan with ID ${planId}!`);

    const running = await loadmill.runTestPlan({
        id,
        options: {
            additionalDescription,
            labels: convertStrToArr(labels)
        }
    },
        toParams(parameters)
    );

    console.log(`Waiting for test plan to finish ${JSON.stringify(running)}`);

    const awaited = await loadmill.wait(running);
    console.log(`Test Plan result ${JSON.stringify(awaited)}`);

    core.setOutput("result", awaited);
} catch (error) {
    console.log(`Test Plan Error ${error}`);
    core.setFailed(error.message);
}
})()
.then(() => {
    console.log(`Finished runnning Loadmill Test Plan`);
});
