const { HttpClient } = require('@actions/http-client');
const { sleep } = require('./utils');

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;

const MIN_HEALTH_CHECK_TIMEOUT = SECOND_IN_MS;
const DEFAULT_HEALTH_CHECK_TIMEOUT = MINUTE_IN_MS;
const MAX_HEALTH_CHECK_TIMEOUT = 5 * MINUTE_IN_MS;
const WAIT_HEALTH_CHECK_INTERVAL = 5 * SECOND_IN_MS;

const checkHealth = async (healthcheckURL, healthcheckTimeout) => {
    const http = new HttpClient('loadmill-run-test-plan-action');

    timeLimit = parseToValidTimeout(healthcheckTimeout);
    const startTime = Date.now();
    let elapsedTime = 0;
    let attemptCount = 0;

    console.log('🫀 Checking env health.');
    while (elapsedTime < timeLimit) {
        try {
	          const { message: { statusCode } } = await http.get(healthcheckURL);
            if (statusCode === 200) {
                console.log('🫀✅ Env is up. Health check completed successfully.');
                return true;
            }
        } catch (e) { }
        await sleep(WAIT_HEALTH_CHECK_INTERVAL);
        elapsedTime = Date.now() - startTime;
    }
};

const parseToValidTimeout = (n) => {
    const parsed = Number.parseInt(n);
    return Number.isNaN(parsed) ?
        DEFAULT_HEALTH_CHECK_TIMEOUT :
        Math.min(
          Math.max(parsed, MIN_HEALTH_CHECK_TIMEOUT),
          MAX_HEALTH_CHECK_TIMEOUT);
};

module.exports = {
    checkHealth,
};
