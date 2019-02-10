# AWS Lambda Terraform setup

To apply this configuration, create a `secrets.auto.tfvars` file and populate it with values for:

The AWS user who has permission to create these resources:
- `AWS_ACCESS_KEY`
- `AWS_SECRET_KEY`
- `AWS_REGION`

The Elasticsearch user (these variables are passed into Lambda functions as environment variables to allow them to write to the ES cluster):
- `ES_ACCESS_KEY`
- `ES_SECRET_KEY`
- `ES_REGION`
- `ELASTICSEARCH_HOST`

**Important:** Because we aren't currently managing DynamoDB through Terraform, it is necessary to manually activate the appropriate DynamoDB triggers and connect them to our Lambda functions.

