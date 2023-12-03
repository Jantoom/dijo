workspace {

    model {
        user = person "User"
        softwareSystem = softwareSystem "Dijo" {
            applicationPage = container "Application Page" "Web Client for users." "React, TypeScript" "browser" {
            }
            notebook = container "Notebook" {
                group "Facades" {
                    notebookListFacade = component "Notebook List Facade" "Facilitates notebook list retrieval and notebook creation." "Python/Flask" {
                        applicationPage -> this
                    }
                    notebookFacade = component "Notebook Facade" "Facilitates notebook getting, saving, and deletion, and page creation." "Python/Flask" {
                        applicationPage -> this
                    }
                    pageFacade = component "Page Facade" "Facilitates page getting, saving, and deleting." "Python/Flask" {
                        applicationPage -> this
                    }
                }
                group "Services" {
                    notebookService = component "Notebook Service" "Constructs and executes ORM queries to the database." "Python/SQLAlchemy" {
                        notebookListFacade -> this
                        notebookFacade -> this
                        pageFacade -> this
                    }
                }
                group "Models" {
                    notebookModel = component "Notebook Model" "Defines the fields for a notebook in the database." "Python/SQLAlchemy" {
                        notebookService -> this
                    }
                    pageModel = component "Page Model" "Defines the fields for a page in the database." "Python/SQLAlchemy" {
                        notebookService -> this
                    }
                }
            }
            s3bucket = container "S3 Bucket" "Stores and delivers assets." "AWS" "database" {
                notebookService -> this
            }
            database = container "Database Storage" "Storage for all Dijo models." "PostgreSQL" "database" {
                notebookService -> this
            }
         }
    }
    
    views {
        component notebook "BackendServiceDiagram" {
            include *
        }
    	styles {
            element ancillary {
                background #f2c679
                colour #000000
            }
            element browser {
                shape WebBrowser
                background #b3deff
                colour #000000
            }
            element window {
                shape Window
                background #b3deff
                colour #000000
            }
            element mobile {
                shape MobileDevicePortrait
                background #b3deff
                colour #000000
            }
            element database {
                shape Cylinder
                background #bfffda
                colour #000000
            }
            element view {
                shape Box
                background #f08fbe
                colour #000000
            }
            element failover {
                opacity 45
            }
        }
        themes default https://static.structurizr.com/themes/oracle-cloud-infrastructure-2021.04.30/theme.json
    }

}