## AWS Lambda

### Challenges

-   dependency management
    -   prevent dev dependencies deployment
    -   tree-shake other dependencies
-   Typescript and compilation boundling (creating one runnable file from project files)

NodejsFunction - CDK construct can do boundling and tree shaking, compile to TS to JS,
omit dev dependencies (with ES build lib under the hoof).

### Architecture

-   one lambda for each resource method handler
-   one lambda for each resource (recommended)
-   one lambda for all application - monolythic lambda

Mutliple lambdas: granural deployments, easier to read and monitor
