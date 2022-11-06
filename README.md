# Run Loadmill Test Plan action

This action runs a loadmill test plan, waits for it to complete and returns the result.

## Inputs

### `id`

**Required** The test plan id to run.

### `token`

**Required** User token to run the test plan on behalf of. In order to run the test plan you will need to generate an [API Token](https://docs.loadmill.com/integrations/api-tokens).

It's recommended to use [GitHub's secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) when using sensitive data like an API token

### `additionalDescription`

Added at the end of the test plan run description (e.g. build number).

### `labels`

Execute flows that are assigned to a specific label (e.g. "label1,label2")

### `labelsExpression`

Execute flows that match the labels expression. An expression may contain the characters ( ) & | ! (e.g. '(label1 | label2) & !label3')

### `parallel`

Set the concurrency amount of running test suites in a test plan. Max concurrency is 10.

### `pool`

Execute tests from a dedicated agent's pool (when using private agent)

### `parameters`

Override pre-defined parameter values via command line arguments by passing name=value pairs seperated by comma  (e.g. "name=value,name2=value2")

### `branch`

Run the test plan's suites from a Git branch

## Outputs

### `result`

The result of the test plan run.

## Example usage

### A simple example
```
uses: loadmill/run-test-plan-action@v1
with:
  id: '<test-plan-id>'
  token: '<my-generated-token>'
  additionalDescription: "Commit ${{ github.ref }} by ${{ github.actor }}"
```

### Using a secret called LOADMILL_API_TOKEN
```
uses: loadmill/run-test-plan-action@v1
with:
  id: '<test-plan-id>'
  token: ${{ secrets.LOADMILL_API_TOKEN }}
  additionalDescription: "Commit ${{ github.ref }} by ${{ github.actor }}"
```

### An example with labels
```
uses: loadmill/run-test-plan-action@v1
with:
  id: '<test-plan-id>'
  token: '<my-generated-token>'
  additionalDescription: "Commit ${{ github.ref }} by ${{ github.actor }}"
  labels: 'sanity,regression'
```

### An example with overrided parameters
```
uses: loadmill/run-test-plan-action@v1
with:
  id: '<test-plan-id>'
  token: '<my-generated-token>'
  additionalDescription: "Commit ${{ github.ref }} by ${{ github.actor }}"
  labels: 'sanity,regression'
  parameters: 'host=www.example.com,port:443'
```
