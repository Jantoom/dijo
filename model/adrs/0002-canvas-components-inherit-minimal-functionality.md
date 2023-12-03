# 2. Canvas Components Inherit Minimal Functionality

Date: 2023-26-05

## Status

Accepted

## Summary

*In the context of* creating an application that supports the addition of new asset types,  
*facing* requirements on developing with future-proofing, consistency and extensibility,  
*we decided* to implement the front-end logic for the general use of canvas components such that they share funcitonality,  
*to achieve* consistent logical behaviour across components and assets in the canvas,  
*accepting* the overhead required to develop to make extensions as seamless as possible.

## Context

- The system must be extensible to allow continuous addition of features and digital assets.
- Any new component types will need to retain basic functions for resizing, moving and rotation
- The design needs to be easily converted between JSON to a rendered HTML page and back
- Development team has experience using React, TypeScript and CSS.

## Decision

Each asset or component will be wrapped by a Container.
- Provides functionality for rotation, resizing and moving.
- Updates to any component for generic functionality will be provided to all other components.
- The addition of new components should be as simple as possible, only specifying HTML for that component and properties unique to it.
- This follows good design practices as common functionality is reused instead of duplicated between components.
A canvas will be responsible for managing all components within the page for movement, storage and resizing.
- Provides a clear separation from the front-end navigation and marketplace so it can be developed independently.

## Consequences

Advantages

- The addition of new asset types has basic functionality already provided so extensibility of new component types is easier.
- Ensures the consistency of the design and how basic component manipulation is handled.
- Maintenance and updates to functionality only have to occur in the Component Container Wrapper which will update all types of components.
- Storing the page as a JSON file will be handled by the Component Container, decreasing workload when adding new component types.

Disadvantages

- Development time for currently supported assets will be higher as functionality must be generic and abstracted.
- Updates to currently supported fields may not have backwards compatibility and would need to be updated on the frontend.
