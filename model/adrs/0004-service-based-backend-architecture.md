# 4. Service-Based Backend Architecture

Date: 2023-05-30

## Status

Accepted

## Summary

*In the context of* delivering an application that is easily extensible and highly available,  
*facing* an existing monolithic, technically-partitioned architecture and developer dependence on pending work,  
*we decided* to eventually switch to a domain-partitioned service-based architecture,  
*to achieve* adherance of our quality attributes of extensibility and availability,  
*accepting* downtime of backend feature development to allow for restructuring and refactoring of infrastructure code.

## Context

- The system is to serve several features.
- Features fall into easily identifiable domains such as authentication, billing, marketplace browsing, notebooking etc.
- Some features are used more often and take more time than others.
- There is an expectation for more features in the future.
- The current backend follows a facade design pattern using a monolithic architecture.
  - This is reflected in the infrastructure code with only one scalable cluster for the backend service.
- The current backend is quite granular already, allowing for easy regrouping of components.
- References to tables in the current singular database are lowly-coupled.
- Some of the development team has experience using Terraform to define a service-based architecture.

## Decision

The backend will be refactored from a technically-partioned monolithic architecture to a domain-partioned service-based architecture (that will still use the facade design pattern).
Changes will be reflected in the infrastructure code, including more ECS services, target groups, and redirect policies.
This will likely evolve into using separate databases for some domains.
Frontend requests will be filtered based on the route, reaching specific clusters instead of any backend instance.

The refactoring will involve restructuring the backend source files, adding new Dockerfiles, and editing the infrastructure code. This includes defining the core files needed between all deployable services.
This suits the current development team's experience and the remaining time left for the MVP.

## Consequences

Advantages

- Enables modularity of components, making extensions of the backend quite trivial.
- Utilises a more advanced infrastructure, marginally increasing availability and scalability (not a core QA but desirable)
- Separation of features may make for a better unit testing experience.
- Another grouping layer for source files, making relationships between future facades, services etc. more apparent (as opposed to the monolithic approach).
- Potentially lower data coupling if databases are separated out.

Neutral

- Minor increase of file structure complexity.
- Database instances may use replicas to increase reliability. Domain partioning may increase the number of instances, but will decrease the individual loads for replication.

Disadvantages

- Increased complexity for a currently small-sized product. Acceptable given future requirements.
- Loss of distinction between the different layers in the backend service.
- Some level of bounday code is introduced.
