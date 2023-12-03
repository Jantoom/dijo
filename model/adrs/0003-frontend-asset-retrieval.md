# 3. Frontend Asset Retrieval

Date: *2023-05-30*

## Status

Accepted

## Summary

*In the context of* how static asset content is retrieved and delivered,  
*facing* conflicting methods of placing responsibility on the frontend or backend,  
*we decided* to have the frontend retrieve asset content using references,  
*to achieve* a simpler and more managable method of retrieving data from the backend and database,  
*accepting* the requirement and latency of extra requests.

## Context

- The main type of asset that needs to be rendered is in the format of an image.
- The marketplace and canvas could potential requirely lots of images to be displayed.
- There are two main approaches that have been discussed:
  - Having the backend/server be responsible of providing asset data.
  - Providing the frontend with references and URLs to the asset content and letting it retrieve the data itself.
- Development team is split into backend using Python and Flask, and the frontend using React and TypeScript.

## Decision

The front end will be responsible for rendering the images after retrieving asset content references or URLs.

- This will allow the frontend to retrieve more information about assets and provide more flexibility in how it utilises the data.
- This puts more workload on the frontend to render theh content.
The backend will only provide metadata about the assets.
- This will allow it to provide more data in a smaller payload.
- The decreased payload will allow the server to be more available

## Consequences

Advantages

- Decreases the workload in conversion between binary to web-renderable formats.
- Retrieval of multiple assets has a smaller payload and decreases latency.
- When rendering multiple assets, an HTTP request will be required for each type.
- Decreases the amount of work or time that a process of the server will remain busy for.

Neutral

- All assets retrieved by the frontend from the server do not have to be rendered all at once

Disadvantages

- The frontend may incur extra latency due to added HTTP requests to fetch asset reference then asset.
- Adds extra dependency on servers hosting static content which.
