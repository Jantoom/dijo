workspace {

    model {
        user = person "Dijo User" "User who has created personal journals and wants to purchase or sell assets"
        dijoSystem = softwareSystem "Dijo System" "Allows users to create and store virtual diary journals using assets found online" {
        
            user -> this "Uses"
        
            webApplication = container "Web Application" "Serves static website assets and pages." "TypeScript and React" "app"{
                user -> this "Uses" "HTTPS"
            }
            
            applicationPage = container "Application Page" "Provides personal digital journals storage and asset marketplace." "TypeScript and React" "WebPage" {
                user -> this "Uses"
                webApplication -> this "Provides"
            }
            
            loadBalancer = container "Load Balancer" "Used to manage and distribute requests for the API server" "EC2" ""{
                applicationPage -> this "Uses" "HTTPS"
            }
            
            authApi = container "Authentication Server" "REST API for authentication, login and account registration" "Python and Flask" "app"{
                loadBalancer -> this "Uses" "HTTPS"
            }

            notebookApi = container "Notebook Server" "REST API for retrieval and updates of digital journals." "Python and Flask" "app"{
                loadBalancer -> this "Uses" "HTTPS"
            }

            assetApi = container "Asset Server" "REST API for retrieval and posting of digital assets." "Python and Flask" "app"{
                loadBalancer -> this "Uses" "HTTPS"
            }

            adminApi = container "Admin Server" "REST API for administration duties" "Python and Flask" "app"{
                loadBalancer -> this "Uses" "HTTPS"
            }
            
            database = container "Database" "Stores user journals, user-owned assets and marketplace assets" "Relational Database - PostgreSQL" "Database" {
                authApi -> this "Reads and Writes" "MySQL Protocol/SSL"
                notebookApi -> this "Reads and Writes" "MySQL Protocol/SSL"
                assetApi -> this "Reads and Writes" "MySQL Protocol/SSL"
                adminApi -> this "Reads and Writes" "MySQL Protocol/SSL"
            }
            
            bucket = container "File Storage" "Stores various file types for the assets supported on the marketplace" "Object Storage" "File Storage"{
                assetApi -> this "Retrieves and Uploads"
                adminApi -> this "Retrieves and Uploads"
            }
        }
        
        live = deploymentEnvironment "Live" {

            deploymentNode "Amazon Web Services" {
                tags "Amazon Web Services - Cloud"

                region = deploymentNode "US-East-1" {
                    tags "Amazon Web Services - Region"

                    deploymentNode "EC2" {
                        tags "Amazon Web Services - EC2"
                        
                        loadBalancerInstance = containerInstance loadBalancer
                    }
                    
                    s3 = infrastructureNode "S3 File Storage" {
                        description "Stores various file types for the assets supported on the marketplace"
                        tags "Amazon Web Services - Simple Storage Service S3 Bucket"
                    }
                    
                    deploymentNode "ECS Backend Cluster" {
                    
                        tags "Amazon Web Services - Elastic Container Service"
                        
                        deploymentNode "Notebook Autoscaling Group" {
                            tags "Amazon Web Services - Auto Scaling"
    
                            deploymentNode "Notebook Fargate" {
                                tags "Amazon Web Services - Fargate"
    
                                notebookServerInstance = containerInstance notebookApi
                            }
                        }
                        
                        deploymentNode "Authentication Autoscaling Group" {
                            tags "Amazon Web Services - Auto Scaling"
    
                            deploymentNode "Authentication Fargate" {
                                tags "Amazon Web Services - Fargate"
    
                                authServerInstance = containerInstance authApi
                            }
                        }
                        
                        deploymentNode "Assets Autoscaling Group" {
                            tags "Amazon Web Services - Auto Scaling"
    
                            deploymentNode "Assets Fargate" {
                                tags "Amazon Web Services - Fargate"
    
                                assetServerInstance = containerInstance assetApi
                            }
                        }
                        
                        deploymentNode "Admin Autoscaling Group" {
                            tags "Amazon Web Services - Auto Scaling"
    
                            deploymentNode "Admin Fargate" {
                                tags "Amazon Web Services - Fargate"
    
                                adminServerInstance = containerInstance adminApi
                            }
                        }
                    }


                    deploymentNode "Amazon RDS" {
                        tags "Amazon Web Services - RDS"

                        deploymentNode "PostgreSQL" {
                            tags "Amazon Web Services - RDS MySQL instance"

                            databaseInstance = containerInstance database
                        }
                    }
                    
                    deploymentNode "ECS Frontend Cluster" {
                    
                        tags "Amazon Web Services - Elastic Container Service"
    
                            deploymentNode "Fargate" {
                                tags "Amazon Web Services - Fargate"
    
                                webApplicationProvider = containerInstance webApplication
                            }
                    }

                }
            }
            
            deploymentNode "Customer's Computer" "" "MS Windows, Apple macOS or Linux" {
                deploymentNode "Web Browser" "" "Chrome, Firefox, Safari or Edge" {
                    liveInteractiveWebPagesInstance = containerInstance applicationPage
                }
            }

            # elb -> webApplicationInstance "Forwards requests to" "HTTPS"
            assetServerInstance -> s3 "Retrieves and Uploads"
            adminServerInstance -> s3 "Retrieves and Uploads"
            # webApplicationInstance -> databaseInstance "Reads and Writes"
        }
        
        
    }

    views {
        systemContext dijoSystem "SystemContext" {
            include *
            # autoLayout lr
        }
        
        container dijoSystem {
            include *
            # autolayout lr
        }
        
        deployment dijoSystem "Live" "AmazonWebServicesDeployment" {
            include *
            # autolayout lr
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            
            element "Database" {
                shape Cylinder
            }
            
            element "WebPage" {
                shape WebBrowser
            }
            
            element "File Storage" {
                shape Folder
            }
        }
        
        themes default
        themes https://static.structurizr.com/themes/amazon-web-services-2020.04.30/theme.json
    }
    
}