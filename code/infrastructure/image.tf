# ----- FRONTEND -----

resource "aws_ecr_repository" "dijo_front" {
  name = "dijo-front"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "docker_image" "dijo_fr" {
  name = "${aws_ecr_repository.dijo_front.repository_url}:latest"
  depends_on = [ local_file.url ]

  build {
    context    = "../frontend"
    dockerfile = "Dockerfile.dev"
  }
}

resource "docker_registry_image" "dijo_fr" {
  name = docker_image.dijo_fr.name
}

# ----- BACKEND -----

resource "aws_ecr_repository" "admin" {
  name = "admin"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "auth" {
  name = "auth"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "marketplace" {
  name = "marketplace"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "notebook" {
  name = "notebook"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "docker_image" "admin" {
  name = "${aws_ecr_repository.admin.repository_url}:latest"
  
  build {
    context    = ".."
    dockerfile = "backend/src/admin/Dockerfile.dev"
  }
}

resource "docker_image" "auth" {
  name = "${aws_ecr_repository.auth.repository_url}:latest"
  
  build {
    context    = ".."
    dockerfile = "backend/src/auth/Dockerfile.dev"
  }
}

resource "docker_image" "marketplace" {
  name = "${aws_ecr_repository.marketplace.repository_url}:latest"

  build {
    context    = ".."
    dockerfile = "backend/src/marketplace/Dockerfile.dev"
  }
}

resource "docker_image" "notebook" {
  name = "${aws_ecr_repository.notebook.repository_url}:latest"

  build {
    context    = ".."
    dockerfile = "backend/src/notebook/Dockerfile.dev"
  }
}

resource "docker_registry_image" "admin" {
  name = docker_image.admin.name
}

resource "docker_registry_image" "auth" {
  name = docker_image.auth.name
}

resource "docker_registry_image" "marketplace" {
  name = docker_image.marketplace.name
}

resource "docker_registry_image" "notebook" {
  name = docker_image.notebook.name
}

