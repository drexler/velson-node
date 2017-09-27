### Velocity-JSON Transformer

[AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) currently limits log events to 1 KiB. Log events larger than 1024 bytes,
such as request and response bodies,will be truncated by [AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) before submission to [CloudWatch](https://aws.amazon.com/cloudwatch/) Logs. Thus for large request bodies undergoing template transformation before being forwarded
to the http integration backend, debugging a faulty transform becomes guesswork if the error location is within the truncated portion. This tool
aims to provide the full transform output by mimicking how [AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) transforms a JSON-formated request/response body with the Integration Request/Response Method's mapping template.

*This provides a Node wrapper around the [Velson](https://github.com/drexler/velson) jar*
