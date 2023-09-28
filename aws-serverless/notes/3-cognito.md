## AWS Cognito

User pools - store user data, basic auth (JWT)

Identity pools - fine-grained access control, direct call AWS SDK commands

User logs in to cognito, receives JWT and can access secure API (or other resource).

Force confirm user: `aws cognito-idp admin-set-user-password --user-pool-id eu-central-1_i5mnA0EGS --username test --password "specAA11#" --permanent`
