terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  shared_credentials_files = ["../credentials"]
  default_tags {
    tags = {
      Course     = "CSSE6400"
      Name       = "Dijo"
      Automation = "Terraform"
    }
  }
}

provider "docker" {
  registry_auth {
    address  = data.aws_ecr_authorization_token.ecr_token.proxy_endpoint
    username = data.aws_ecr_authorization_token.ecr_token.user_name
    password = data.aws_ecr_authorization_token.ecr_token.password
  }
}

locals { 
    database_username = "administrator" 
    database_password = "foobarbaz" # this is bad 
    secret_key = "abc123"
}

resource "local_file" "url" {
  content  = "VITE_URI=http://${aws_lb.dijo.dns_name}"
  filename = "../frontend/.env"
}

data "aws_ecr_authorization_token" "ecr_token" {}

data "aws_caller_identity" "current" {}

data "aws_iam_role" "lab" {
  name = "LabRole"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

output "load_balancer_back_dns" { 
   value = "http://${aws_lb.dijo.dns_name}/api/v1" 
}

output "load_balancer_front_dns" {
  value = "http://${aws_lb.front.dns_name}/"
}
