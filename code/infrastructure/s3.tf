variable "bucket_name" {
  default = "assets-dijo-s3"
}

resource "aws_s3_bucket" "assets" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = var.bucket_name
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 30000
  }

}
