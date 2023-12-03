resource "aws_appautoscaling_target" "admin" { 
    max_capacity       = 10 
    min_capacity       = 1 
    resource_id        = "service/dijo/admin" 
    scalable_dimension = "ecs:service:DesiredCount" 
    service_namespace  = "ecs" 

    depends_on = [aws_ecs_service.admin]
} 

resource "aws_appautoscaling_target" "auth" { 
    max_capacity       = 10 
    min_capacity       = 1 
    resource_id        = "service/dijo/auth" 
    scalable_dimension = "ecs:service:DesiredCount" 
    service_namespace  = "ecs" 

    depends_on = [aws_ecs_service.auth]
} 

resource "aws_appautoscaling_target" "marketplace" { 
    max_capacity       = 10 
    min_capacity       = 1 
    resource_id        = "service/dijo/marketplace" 
    scalable_dimension = "ecs:service:DesiredCount" 
    service_namespace  = "ecs" 

    depends_on = [aws_ecs_service.marketplace]
} 

resource "aws_appautoscaling_target" "notebook" { 
    max_capacity       = 10 
    min_capacity       = 1 
    resource_id        = "service/dijo/notebook" 
    scalable_dimension = "ecs:service:DesiredCount" 
    service_namespace  = "ecs" 

    depends_on = [aws_ecs_service.notebook]
} 

resource "aws_appautoscaling_policy" "admin-cpu" { 
    name               = "admin_cpu" 
    policy_type        = "TargetTrackingScaling" 
    resource_id        = aws_appautoscaling_target.admin.resource_id 
    scalable_dimension = aws_appautoscaling_target.admin.scalable_dimension 
    service_namespace  = aws_appautoscaling_target.admin.service_namespace 
    
    target_tracking_scaling_policy_configuration { 
        predefined_metric_specification { 
            predefined_metric_type = "ECSServiceAverageCPUUtilization" 
        } 

        target_value = 10 
    } 
}

resource "aws_appautoscaling_policy" "auth-cpu" { 
    name               = "auth_cpu" 
    policy_type        = "TargetTrackingScaling" 
    resource_id        = aws_appautoscaling_target.auth.resource_id 
    scalable_dimension = aws_appautoscaling_target.auth.scalable_dimension 
    service_namespace  = aws_appautoscaling_target.auth.service_namespace 
    
    target_tracking_scaling_policy_configuration { 
        predefined_metric_specification { 
            predefined_metric_type = "ECSServiceAverageCPUUtilization" 
        } 

        target_value = 10 
    } 
}

resource "aws_appautoscaling_policy" "marketplace-cpu" { 
    name               = "marketplace_cpu" 
    policy_type        = "TargetTrackingScaling" 
    resource_id        = aws_appautoscaling_target.marketplace.resource_id 
    scalable_dimension = aws_appautoscaling_target.marketplace.scalable_dimension 
    service_namespace  = aws_appautoscaling_target.marketplace.service_namespace 
    
    target_tracking_scaling_policy_configuration { 
        predefined_metric_specification { 
            predefined_metric_type = "ECSServiceAverageCPUUtilization" 
        } 

        target_value = 10 
    } 
}

resource "aws_appautoscaling_policy" "notebook-cpu" { 
    name               = "notebook_cpu" 
    policy_type        = "TargetTrackingScaling" 
    resource_id        = aws_appautoscaling_target.notebook.resource_id 
    scalable_dimension = aws_appautoscaling_target.notebook.scalable_dimension 
    service_namespace  = aws_appautoscaling_target.notebook.service_namespace 
    
    target_tracking_scaling_policy_configuration { 
        predefined_metric_specification { 
            predefined_metric_type = "ECSServiceAverageCPUUtilization" 
        } 

        target_value = 10 
    } 
}
