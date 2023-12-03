# 6. Error Handling in Services Layer

Date: 2023-06-05

## Status

Accepted, in progress

## Summary

*In the context of* delivering an application that is easily extensible,  
*facing* hard coupling between errors that occur in the service layer and their interpretation in the routes layer,  
*we decided* to enforce the throwing of exceptions in the services layer that are caught in the routes layer & sent back to the requester, and treat the functions as total black boxes in the routes layer,  
*to achieve* decoupling of services layer implementation and routes layer interpretation, which allows for slimmer route definitions increasing extensibility,  
*accepting* major refactors to the services layer and unit tests to account for deliberately thrown exceptions.

## Context

- The system is to maintain several service functions that conduct business logic and interact with the persistence layer.
- Service functions deal with many moving parts, and are therefore prone to causing errors.
  - Errors can come from the function (i.e. KeyErrors when accessing the dictionary parameter) or they can bubble up from nested functions.
  - One solution for the KeyErrors would be to access values in the dictionary using `dict.get('key')` instead of `dict['key']`, but this does not address the ambiguity of returned None values (actually increases it by handling this error silently).
- All errors are caught in the routes layer, which sends the error message back to the requester.
  - There is no easy mechanism in the routes layer to make these messages prettier without creating an extensive switch statement that handles every possible exception.
- The current backend has the routes layer assuming the cause of the return value equalling None for some endpoints (e.g. the get_asset endpoint assumes that a return of None from asset_service.get_asset means that the asset does not exist).
  - There could be several reasons to why the return value is None.
- The current backend has the services layer not catching any errors, meaning there is no preprocessing of errors before they bubble up to the routes layer.
  - This allows error messages sent to the client to expose the implementation of the backend, which is a security concern.
  - 
- The development team has experience using Python & Flask for the backend.

## Decision

The backend will enforce the services layer to catch exceptions and preprocess the messages before they are sent to the routes layer.
Using exceptions actively decreases the possibilities for why a returned value would be None.
The routes layer no longer makes conditional statements based on the return value of service functions equalling None. This is to ensure no assumptions are made about this value.
In cases of endpoints sending specific & presumptuous messages back to the user based on a None value, these messages will be moved to the services layer and throw as an exception. This brings the description of the message closer to the cause of the message, increasing the likelihood that the description is accurate.

## Consequences

Advantages

- The routes layer becomes decoupled with the services layer, due to the removal of assumptions on the return value of service functions.
- Routes layer is slimmed down, allowing for faster creation of endpoint routes and clarity of procedures. From the routes perspective, we achieve definitions that only have to worry about successful scenarios.
- More specific, client-friendly error messages. Less verbose, security-compromising error messages.
- Another layer for each domain, "normalising" the file structure. This increases modularity and therefore extensibility, a relevant quality attribute.

Neutral

- Catching specific exceptions to make errors more client-friendly can be quite tedious, but this functionality is non-negotiable for security reasons. Whether this happens in the services or routes layer is besides this point.
- Status codes will need to be sent along with the custom error messages since they are closely related and the routes layer is no longer making custom messages.

Disadvantages

- While the routes layer becomes slimmer, this increases the complexity of the services layer. For an already verbose layer due to ORM calls and conditional statements, adding exception throwing will bloat some functions. An intelligent way of limiting this bloat must be employed, perhaps a common function for specific exceptions that occur in many different service functions.
