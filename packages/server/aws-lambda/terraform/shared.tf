

variable AWS_ACCESS_KEY {}
variable AWS_SECRET_KEY {}
variable AWS_REGION {}

variable ES_ACCESS_KEY {}
variable ES_SECRET_KEY {}
variable ES_REGION {}
variable ELASTICSEARCH_HOST {}

#
# Provider
#

provider "aws" {
  access_key = "${var.AWS_ACCESS_KEY}"
  secret_key = "${var.AWS_SECRET_KEY}"
  region     = "${var.AWS_REGION}"
}

#
# IAM roles and policies
#

# This role is shared by all of our Lambda functions that pipe DynamoDB updates into Elasticsearch.
resource "aws_iam_role" "DynamoDB_Elasticsearch_Trigger" {
    name = "DynamoDB_Elasticsearch_Trigger"
    path = "/service-role/"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Attach the "AWSLambdaDynamoDBExecutionRole" policy to our Lambda role.  This allows it to:
# - create CloudWatch logs and streams
# - read from DynamoDB streams
resource "aws_iam_role_policy_attachment" "DynamoDB_Elasticsearch_Trigger__AWSLambdaDynamoDBExecutionRole" {
    role = "${aws_iam_role.DynamoDB_Elasticsearch_Trigger.name}"
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaDynamoDBExecutionRole"
}

