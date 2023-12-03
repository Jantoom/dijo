# 1. Storing Page Content as a String

Date: 2023-26-05

## Status

Accepted, may be superseded by Object representation

## Summary

*In the context of* ensuring agile, independent development of the frontend and backend,  
*facing* imminent time constraints on the project,  
*we decided* to limit backend parsing of pages and simply store content in a string field on the database,  
*to achieve* reduction of the overhead required to have a deployable backend,  
*accepting* structure and format of received JSON-ified page content from the frontend will not be validated on the backend.

## Context

- The system must be extensible to allow continuous addition of features and digital assets.
  - The current architecture of the backend allows for modular additions of features.
- Page content as a string may contain 10-1000 lines of text.
- Separation of frontend and backend applications.
  - Communication between them is likely to use JSON for defining pages.
  - Pages need to be transformable to plaintext and back.
  - Frontend necessitates reconstructing pages from backend responses.
  - Backend does not inherently need to reconstruct pages to store them, but it is desirable.
- Features and digital assets to be added are not well-defined, and are very likely to be rescoped several times in the remaining weeks of the project.
- Development team has some experience using Flask-SQLAlchemy.

## Decision

Backend storage of page content will be left as a string field in the `Pages` table.
This will neglect validation and parsing of JSON-ified pages.
Database management will not need to implement migration when definitions of digital assets change.
A frontend request to retrieve page content will receive the same body given when previously requesting to store page content.
This leaves the implementation details of pages to the frontend, separating these concerns from the backend.

The backend implementation will utilised Flask-SQLAlchemy.
Little exploration is required due to migration not being important.
Chosen database backend (PostgreSQL) is capable of storing stringified page content.

In the future, the object representation path may supersede this decision for 'correctness'.

## Consequences

Advantages

- Separation of concerns, keeping digital asset implementation details in just the frontend.
- Ensures consistency, if asset definitions are only implemented in one place.
- Allows frontend developers to stay in just the frontend when changing asset definitions.
- In terms of beta development and the relevant quality attributes, is actually more extensible than object representations in the database, with developers not needing to refactor and ensure feature parity in the frontend and backend.
- Facilitates rapid testing of frontend de/construction of objects using the backend.
- Less complexity of the backend architecture.
- Marginally less computation required on the backend, important for load testing.
- Significantly less computation required from the database. Returns one object instead of finding several in an assets/pages-related table. Restricts access/locks to one row describing the entire page instead of several for all the assets on the page.
- Time will be free for more pressing aspects of the project like the documentation, code, report, and video.

Neutral

- Digital copies of assets on a page are never really queried on, let alone used without the context of the page they belong to. Having the ability to query asset-copy fields is not an advantage at all for the object representation path.

Disadvantages

- Incoming page content is not guaranteed to be valid, however it is auto-generated from the frontend application when constructing a request so this will rarely (but not never) be an issue in production.
