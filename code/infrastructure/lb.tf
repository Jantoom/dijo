# ----- FRONTEND -----

resource "aws_lb" "front" {
  name               = "front"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private.ids
  security_groups    = [aws_security_group.dijo.id]
}

resource "aws_lb_target_group" "front_target" {
  name        = "front-target"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_security_group.front.vpc_id
  target_type = "ip"

  health_check {
    matcher = "200,301,302"
    path    = "/"
  }
}

resource "aws_lb_listener" "front_target" {
  load_balancer_arn = aws_lb.front.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.front_target.arn
  }
}

# ----- BACKEND -----

resource "aws_lb" "dijo" {
  name               = "dijo"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private.ids
  security_groups    = [aws_security_group.dijo.id]
}

resource "aws_lb_listener" "dijo" {
  load_balancer_arn = aws_lb.dijo.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "fixed-response"
    
    fixed_response {
      content_type = "text/plain"
      message_body = "Endpoint not registered LOL."
      status_code = 404
    }
  }
}

resource "aws_lb_listener_rule" "admin_forward" {
  listener_arn = aws_lb_listener.dijo.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.admin.arn
  }

  condition {
    path_pattern {
      values = ["*/admin*"]
    }
  }
}

resource "aws_lb_listener_rule" "auth_forward" {
  listener_arn = aws_lb_listener.dijo.arn
  priority     = 101

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.auth.arn
  }

  condition {
    path_pattern {
      values = ["*/users*"]
    }
  }
}

resource "aws_lb_listener_rule" "marketplace_forward" {
  listener_arn = aws_lb_listener.dijo.arn
  priority     = 102

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.marketplace.arn
  }

  condition {
    path_pattern {
      values = ["*/assets*"]
    }
  }
}

resource "aws_lb_listener_rule" "notebook_forward" {
  listener_arn = aws_lb_listener.dijo.arn
  priority     = 103

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.notebook.arn
  }

  condition {
    path_pattern {
      values = ["*/notebooks*"]
    }
  }
}

resource "aws_lb_target_group" "admin" {
  name        = "admin"
  port        = 6400
  protocol    = "HTTP"
  vpc_id      = aws_security_group.admin.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/v1/admin/health"
    port                = "6400"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
  }
}

resource "aws_lb_target_group" "auth" {
  name        = "auth"
  port        = 6400
  protocol    = "HTTP"
  vpc_id      = aws_security_group.auth.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/v1/users/health"
    port                = "6400"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
  }
}

resource "aws_lb_target_group" "marketplace" {
  name        = "marketplace"
  port        = 6400
  protocol    = "HTTP"
  vpc_id      = aws_security_group.marketplace.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/v1/assets/health"
    port                = "6400"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
  }
}

resource "aws_lb_target_group" "notebook" {
  name        = "notebook"
  port        = 6400
  protocol    = "HTTP"
  vpc_id      = aws_security_group.notebook.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/v1/notebooks/health"
    port                = "6400"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
  }
}

# ----- SECURITY GROUPS -----

resource "aws_security_group" "dijo" {
  name        = "dijo"
  description = "Dijo Security Group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}