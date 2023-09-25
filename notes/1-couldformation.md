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

---

## AWS CDK commands

-   `cdk init app ==language typescript`
-   `cdk bootstrap` (prepares environment for all applications)
-   `cdk synth` (validates and generates Cfn template)
-   `cdk deploy` (deploys CDK stack, optionally with parameters: `--parameters duration=3`)
-   `cdk list` (prints all stacks)
-   `cdk diff` (local vs deployed version)
-   `cdk destroy <stack_name>` (deletes deployed stack)
