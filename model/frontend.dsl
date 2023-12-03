workspace {

    model {
        user = person "User"
        softwareSystem = softwareSystem "Dijo" {
        
            webapp = container "Web Application" {
                
                routeManager = component "Route Manager" "Provides the user with the a page based on route request" "React Router"{
                    user -> this
                }
                
                login = component "Login Page" "Allows users to authenticate and login to the application" "React Component" {
                    routeManager -> this
                }
                register = component "Register Page" "Allows users to register an account for the application" "React Component" {
                    routeManager -> this

                }
                
                main = component "Main Page" "Main page of the application that displays the canvas and supporting interfaces" "React Component" {
                    routeManager -> this
   
                }
                
                canvas = component "Canvas Component" "Canvas to visaulise and display assets in an interctive environment" "React Component" {
                    main -> this

                }
                
                assets = component "Assets Page" "Allows users to manage their owned assets and notebooks" "React Component" {
                    routeManager -> this
                }
                
                marketplace = component "Marketplace Page" "Allows users to purchase new assets for use in their notebookes" "React Component" {
                    routeManager -> this

                }

                authAPI = component "Authentication API" "Provides the authentication functions for API calls to the backend" "TypeScript" {
                    login -> this
                    register -> this
                }
                
                assetsAPI = component "Assets API" "Provides the asset functions for API calls to the backend" "TypeScript" {
                    assets -> this
                    main -> this
                    marketplace -> this
                }
                
                notebooksAPI = component "Notebooks API" "Provides the notebook functions for API calls to the backend" "TypeScript" {
                    main -> this
                    assets -> this
                }
                
                
                authReducer = component "Authentication Reducer" "Manages local storage of authentication" "TypeScript" {
                    login -> this
                    main -> this
                    authAPI -> this
                }
                
            }
            
            authServer = container "Authentication Server" "" "Python and Flask"{
                
                authReducer -> this
                authAPI -> this
            }
            notebooksServer = container "Notebook Server" "" "Python and Flask"{
                
                authReducer -> this
                notebooksAPI -> this
            }
            assetsServer = container "Assets Server" "" "Python and Flask"{
                
                authReducer -> this
                assetsAPI -> this
            }
         }
    }
    
    views {
        component webApp "SystemContext" {
            include *
        }
    	theme default
    }

}