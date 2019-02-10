
resource "aws_lambda_function" "dynamoUsersToElasticsearch" {
    filename         = "../dynamoUsersToElasticsearch.zip"
    function_name    = "dynamoUsersToElasticsearch"
    role             = "${aws_iam_role.DynamoDB_Elasticsearch_Trigger.arn}"
    handler          = "index.handler"
    source_code_hash = "${base64sha256(file("../dynamoUsersToElasticsearch.zip"))}"
    runtime          = "nodejs8.10"
    description      = "Updates our Elasticsearch cluster when items in the DynamoDB Users and UserProfiles tables are inserted, updated, or deleted."

    environment {
        variables = {
            ELASTICSEARCH_HOST = "${var.ELASTICSEARCH_HOST}"
            ES_ACCESS_KEY = "${var.ES_ACCESS_KEY}"
            ES_SECRET_KEY = "${var.ES_SECRET_KEY}"
            ES_REGION = "${var.ES_REGION}"
        }
    }
}


# Create a CloudWatch log group to capture output from this Lambda function.
resource "aws_cloudwatch_log_group" "dynamoUsersToElasticsearch" {
    name              = "/aws/lambda/${aws_lambda_function.dynamoUsersToElasticsearch.function_name}"
    retention_in_days = 7
}

