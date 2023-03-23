terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.8.0"
    }
  }
}

variable "management_api_key" {}

// Management application API Key
provider "basistheory" {
  api_key = var.management_api_key
}

// Reporter Resources
resource "basistheory_reactor_formula" "reporter_formula" {
  name        = "Reporter Formula"
  description = "Detokenizes tokens"
  type        = "private"
  icon        = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  code        = file("./reactor.js")
}

resource "basistheory_application" "reporter_application" {
  name        = "Reporter Application"
  type        = "private"
  rule {
    description = "Read and use tokens"
    priority    = 1
    container   = "/"
    transform   = "reveal"
    permissions = [
      "token:read",
    ]
  }
}

resource "basistheory_reactor" "reporter_reactor" {
  name           = "Reporter Reactor"
  formula_id     = basistheory_reactor_formula.reporter_formula.id
  application_id = basistheory_application.reporter_application.id
}


resource "basistheory_application" "invoker_application" {
  name        = "Invoker Application"
  type        = "private"
  rule {
    description = "Allow invoking a reactor"
    priority    = 1
    container   = "/"
    transform   = "redact"
    permissions = [
      "token:use",
    ]
  }
}

output "invoker_api_key" {
  value = basistheory_application.invoker_application.key
  sensitive = true
}
output "reactor_id" {
  value = basistheory_reactor.reporter_reactor.id
}