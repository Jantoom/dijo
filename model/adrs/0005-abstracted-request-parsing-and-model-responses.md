# 5. Abstracted Request Parsing and Model Responses

Date: 2023-06-05

## Status

Accepted, in progress (request schemas complete, response schemas not yet)

## Summary

*In the context of* delivering an application that is easily extensible and highly available,  
*facing* endpoint-specific exposure to individual request parameters,  
*we decided* to separate referencing and validation of parameters away from endpoint routes,  
*to achieve* greater modularity, higher fidelity of validation, decoupling of request-specific and service function-specific parameters,  
*accepting* increased file structure complexity of the backend.

## Context

- The system is to serve several functional endpoints with different parameters.
- Parameters are request-specific and have several validation rules they must follow to be valid.
- Parameters are subject to change depending on the evolution of the frontend requirements.
  - Such changes need to be reflected in the input validation and service function steps.
- The current backend exposes each individual parameter to the routes layer.
  - The routes layer is responsible for validating the parameters one by one.
  - This validation is quite verbose and relies of in-house functions to be correct.
- The current backend has primitive obsession when sending parameters to the service layer.
  - i.e. each parameter is sent individually to the functions in the service files.
- The current backend sends string representations of the models returned with no easy way to customise.
  - Some fields of the models should not be sent back to the client for security reasons.
- The development team has experience using Flask for the backend.
- There are modules that extend Flask and SQLAlchemy for input validation and serialised model manipulation.

## Decision

The backend will utilise Flask-Marshmallow and Marshmallow-SQLAlchemy to define Schemas. These schemas can be used for input validation, abstracting all input parameters into a dictionary automatically, and manipulating model fields for serialisation (hiding, augmenting, adding etc.).
Such schemas will be sent directly to the services layer, separating all parameter details from the routes layer.
Changes will be reflected in the backend code, including a schemas folder for every deployable container, which defines request schemas (input validation) and response schemas (model manipulation).
Frontend requests will be filtered based on the route, reaching specific clusters instead of any backend instance.

The refactoring will involve restructuring the backend source files, adding new Dockerfiles, and editing the infrastructure code. This includes defining the core files needed between all deployable services.
This suits the current development team's experience and the remaining time left for the MVP.

## Consequences

Advantages

- The routes layer becomes request & response-agnostic, decoupling them and making this layer more readable.
- Stronger validation is used, deprecating the in-house solutions that were not nearly as comprehensive.
- When request parameters change, there is no need for function signatures and all their references to be changed as well if a dictionary of all the parameters is what is sent instead.
- Another layer for each domain, "normalising" the file structure. This increases modularity and therefore extensibility, a relevant quality attribute.

Neutral

- Minor increase of file structure complexity.
- There is some redundancy introduced thanks to models already requiring validation. However, catching validation errors earlier in input parsing will ensure that validation errors when initialising a model happen for a more exotic reason.

Disadvantages

- Schemas expect a JSON seraliasable object for deserialisation. Non-primitive types like custom classes and the bytes type therefore cannot be loaded into the schemas as is. Files need to be read, and the bytes need to be encoded and decoded when used with schemas. This is extra work compared to sending the bytes directly as a parameter to the services layer.
