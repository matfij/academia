## CloudFormation (Cfn)

Infrastructure as a code soultion - organizes AWS resources into Stacks.
Based on JSON/YAML config it creates AWS resources. (Only L1 resources)

---

## AWS CDK Application

More declarative IaaC which can be compiled to CloudFormation config, with L1, L2, and L3 resources.

---

## AWS CDK Constructs

Base building blocks of AWS infrastructure resources, there are 3 level of constructs:

1. Low level constructs (L1) - Cloud formation resources, requires long configuration
2. AWS resources - CDK defaults, boilerplate, type safety
3. Patterns - combine multiple type of resources (Serverless API = Lambda + Gateway)

If contruct id changes the resource will be recreated which may lead to data loss and error state.

---

## AWS CDK commands

-   `cdk init app ==language typescript`
-   `cdk bootstrap` (prepares environment for all applications)
-   `cdk synth` (validates and generates Cfn template)
-   `cdk deploy` (deploys CDK stack, optionally with parameters: `--parameters duration=3`, `--all`, `<stack_name>`)
-   `cdk list` (prints all stacks)
-   `cdk diff` (local vs deployed version)
-   `cdk destroy <stack_name>` (deletes deployed stack)

---

## Cfn intrinsic functions

-   `Fn::Ref` - reference from outside a contruct
-   `Fn::Or`, `Fn::Equals` - conditional operations for input parameters
-   `Fn::Join` - combines strings
-   ...

---

## Multiple stacks

Why?

1. some stacks may conaint sensitive info (IAM roles, secrets)
2. some stacks may take a long time to deploy
3. better organization

How?

-   no official rules
-   separate by resource type (state, data, computing)
-   separete for IAM roles, policies, secrets
-   separate for complex resources (VPCs, DNS)

Cross-stack referencing - CfnOutput, Cfn intrinsic function - importValue or by exporting property from stack class.
Referenced stacks can not be deleted.

## CDK Aspects

check or modify resources after they where created (visitor pattern), e.g. for adding tags, linter, static analysis.
