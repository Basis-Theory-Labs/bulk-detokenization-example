# Bulk Detokenization Example

This repository shows how to read bulk sensitive data within an [Asynchronous Reactor](https://developers.basistheory.com/docs/concepts/what-are-reactors#asynchronous-reactors), while preventing going over [Rate Limits](https://developers.basistheory.com/docs/api/rate-limits).

## Provision Resources with Terraform

[Create a new Management Application](https://portal.basistheory.com/applications/create?name=Terraform&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&permissions=reactor%3Acreate&permissions=reactor%3Aread&permissions=reactor%3Aupdate&permissions=reactor%3Adelete&type=management) with full `application` and `reactor` permissions.

Paste the API key to a new `terraform.tfvars` file at this repository root:

```terraform
management_api_key = "key_W8wA8CmcbwXxJsomxeWHVy"
```

Initialize Terraform:

```shell
terraform init
```

And run Terraform to provision all the required resources:

```shell
terraform apply
```

## Invoke the Reactor

Using the `reactor_id` and `reactor_api_key` generated as a Terraform state outputs, make the following request:

```shell
curl -L -X POST 'https://api-dev.basistheory.com/reactors/{{reactor_id}}/react' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'BT-API-KEY: {{invoker_api_key}}' \
--data-raw '{
  "args": {
      "tokenIds": ["6439b6be-82b3-4b0b-a6d2-597843bfc617"]
  },
  "callback_url": "https://boxay5ij3yzwx2l.m.pipedream.net",
  "timeout_ms": 120000
}'
```

> Make sure to replace the variables above with the Terraform outputs stored in Terraform state.

| Parameter       | Description                                           |
|-----------------|-------------------------------------------------------|
| `args.tokenIds` | The tokens (id) to detokenize                         |
| `callback_url`  | A webhook to call with the results of the Reactor run |
| `timeout_ms`    | Timeout for the Reactor function to run               |

The `callback_url` will be called with the contents returned by the Reactor function.
