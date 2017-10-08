### Velocity-JSON Transformer

[AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) currently limits log events to 1 KiB. Log events larger than 1024 bytes,
such as request and response bodies,will be truncated by [AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) before submission to [CloudWatch](https://aws.amazon.com/cloudwatch/) Logs. Thus for large request bodies undergoing template transformation before being forwarded
to the http integration backend, debugging a faulty transform becomes guesswork if the error location is within the truncated portion. This tool
aims to provide the full transform output by mimicking how [AWS API Gateway](https://aws.amazon.com/documentation/apigateway/) transforms a JSON-formated request/response body with the Integration Request/Response Method's mapping template.

*This provides a Node wrapper around the [Velson](https://github.com/drexler/velson) jar*

##### Features:
* Indicating error-causing line number within a mapping template if transform fails.
* Checks for malformed JSON.
* Checks for duplicate properties within generated JSON.
* Provides a well formatted JSON output.

**Note: Not all [AWS Mapping Template built-in functions and variables](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html) are currently supported.*

Built-in Functions | Description | Supported |
--- | --- |--- |
*$input.json(x)* | Evaluates a JSONPath expression and returns the results as a JSON string. |`yes`
*$input.path(x)* | Takes a JSONPath expression string (x) and returns an object representation of the result. |`yes`
*$util.base64Encode()* | Encodes the data into a base64-encoded string. |`yes`
*$util.base64Decode()* | Decodes the data from a base64-encoded string. |`yes`


##### Prerequisite
- [Java 1.8](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
- [Node 6](https://nodejs.org/en/blog/release/v6.0.0/)+


##### Usage
Velson provides both a command line interface to allow for local transforms within the terminal
and an API for embedding within your programs, whichever is most convenient.

###### Installation
```shell
$ npm install save velson
```

```javascript
var transformer = require("velson")

const templatePath = './template.vm';
const requestFilePath = './request.json';

const engine = new transformer.VelsonEngine();
try {
  engine.initialize(templatePath, requestFilePath);
  const transformedOutput = engine.transform();
  console.log(JSON.stringify(transformedOutput, null, 2));
} catch (error) {
  console.log(error.message);
}
```

###### Using Velson CLI
```shell
$ npm install [-g] velson
```

```shell
$ velson

  Usage: velson [options]


  Options:

    -V, --version           output the version number
    -t, --template [value]  Path to the Velocity template mapping file. (required)
    -r, --request [value]   Path to request JSON file. (required)
    -h, --help              output usage information
```
```shell
$ velson -t ./template.vm -r ./request.json
```
*template.vm*
```velocity
#set($source = $input.path('$'))
{
  "source": {
    "integerProperty": $source.integerProperty,
    "numberProperty": $source.numberProperty,
    "nullPropertyInQuotes": "$source.nullProperty",
    "stringProperty": "$source.stringProperty",
    "arrayProperty": $source.arrayProperty,
    "arrayPropertySize": $source.arrayProperty.size(),
    "booleanProperty": $source.booleanProperty,
    "missingProperty": "$source.missingProperty"
  },
  "input-json": {
    "integerPropertyViaJson": $input.json('$.integerProperty'),
    "numberPropertyViaJson": $input.json('$.numberProperty'),
    "nullPropertyViaJson": $input.json('$.nullProperty'),
    "stringPropertyViaJson": $input.json('$.stringProperty'),
    "arrayPropertyViaJson": $input.json('$.arrayProperty'),
    "arrayPropertyTestViaJson": $input.json('$.arrayProperty[0].test'),
    "booleanPropertyViaJson": $input.json('$.booleanProperty'),
    "missingPropertyViaJson": $input.json('$.missingProperty')
  },
  "util": {
    "base64EncodedStringProperty": "$util.base64Encode($source.stringProperty)",
    "originalStringPropertyDecoded": "$util.base64Decode($util.base64Encode($source.stringProperty))"
  }
}
```
*request.json*
```json
{
    "integerProperty": 1,
    "numberProperty": 2.6,
    "nullProperty": null,
    "stringProperty": "string",
    "arrayProperty": [
      {
        "itemOne": 1,
        "test": "here"
      },
      {
        "itemOne": 2,
        "test": "there"
      }
    ],
    "booleanProperty": true
}
```
