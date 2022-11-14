const core = require('@actions/core');
const { convertStrToArr, toParams } = require('./utils');
const { checkHealth } = require('./health-check');

const failFailed = (err = 'Failed to run test plan. Please contact support') => {
    core.setFailed(err);
}

(async () => {
try {
    const loadmill = require('loadmill')({token: core.getInput('token')});

    const id = core.getInput('id');
    const additionalDescription = core.getInput('additionalDescription');
    const labels = core.getInput('labels');
    const parameters = core.getInput('parameters');
    const branch = core.getInput('branch');
    const labelsExpression = core.getInput('labelsExpression');
    const parallel = core.getInput('parallel');
    const pool = core.getInput('pool');
    const healthcheckURL = core.getInput('healthcheckURL');
    const healthcheckTimeout = core.getInput('healthcheckTimeout');

    if (healthcheckURL) {
        await handleHealthCheck(healthcheckURL, healthcheckTimeout);
    }

    console.log(`🏃 Running test plan with ID ${id}!`);

    const running = await loadmill.runTestPlan({
        id,
        options: {
            additionalDescription,
            labels: convertStrToArr(labels),
            labelsExpression,
            branch,
            parallel,
            pool
        }
    },
        toParams(parameters)
    );

    if (!running) {
        failFailed();
        return;
    }

    console.log(`⏱ Waiting for test plan to finish ${JSON.stringify(running)}`);

    const result = await loadmill.wait(running);
    console.log(`🏁 Test Plan result ${JSON.stringify(result, null, 2)}`);
    core.setOutput("result", result);

    if (result && !result.passed) {
        failFailed(`🚨 Test Plan has failed. More details can be found at ${result.url}`);
    }

} catch (error) {
    failFailed(error.message);
}
})()
.then(() => {
    console.log(`Finished runnning Loadmill Test Plan`);
});

async function handleHealthCheck(healthcheckURL, healthcheckTimeout) {
    const failedHealthCheckPrompt = 'Failed the health check 🫀❌: ';
    try {
        const isHealthy = await checkHealth(healthcheckURL, healthcheckTimeout);
        if (!isHealthy) {
            failFailed(failedHealthCheckPrompt + 'Timed out ⌛️.');
        }
    } catch (error) {
        failFailed(failedHealthCheckPrompt + error);
    }
}

