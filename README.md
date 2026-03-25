## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Approach

The project is structured using the Model-View-Controller (MVC) pattern, which helps in separating concerns and organizing the codebase effectively. The main components of the project include:
- **Models**: These represent the data and business logic of the application. They are responsible for managing the state and handling data manipulation.
- **Views**: These are responsible for rendering the user interface and displaying data to the user
- **Services**: These are responsible for handling external API calls and other asynchronous operations. They provide a layer of abstraction for data fetching and manipulation, allowing the controllers to focus on business logic.
- **Utilities**: These are helper functions and modules that provide common functionality across the application, such as formatting dates, handling errors, or managing state.
- **Assets**: This directory contains static files such as images and stylesheets that are used in the application.
- **Tests**: This directory contains unit tests for the various components of the application, ensuring that the code is reliable and maintainable.
- **Views**: This directory contains the main view components of the application and its components, some types according to the page, which are responsible for rendering the user interface and displaying data to the user.

## Components structure
The components are organized based on their functionality and the pages they belong to. For example, components that could be used across multiple pages are placed in the `components` directory, while components specific to a particular page are placed in the `views` directory under their respective page folders. This structure helps in maintaining a clear separation of concerns and makes it easier to manage and scale the application as it grows. Some of the components that uses frequently across the application are registered as global components, which allows them to be used in any part of the application without the need for importing them in each file. This approach helps in reducing redundancy and improving code reusability, making the development process more efficient.

## Assumptions
As some of the requirements were missing, such as the real API data, only how data could look, I created a mock file with the list of possible domains that could come, also created simulation of API calls using `setTimeout` to mimic the behavior of real asynchronous API calls. This allows us to test the functionality of the application without relying on an actual backend, and it also helps in identifying any potential issues or bugs that may arise when working with real data. Additionally, I made some assumptions about the structure of the data and how it would be used in the application, which may not be entirely accurate but serves as a starting point for development.

## Tradeoffs
As the design was totally missing I figured out, based on my experience, that the best way to display the data is using a table, as it allows us to easily display and organize the data in a clear and concise manner. However, this approach may limit the amount of information that can be displayed at once, which could be a drawback for users who need to see more detailed information about each domain, so to fix issue with some information that could be missing in the table, I decided to add popup with all the information according to the data model provided in the requirements.

## Backend API proposal
To implement the backend API for this project, we can create a RESTful API that provides endpoints for fetching domain data. The API can be structured as follows:
- **GET /api/getDomainsList**: This endpoint will return a list of all domains, including their registrar, statuses, dates and other relevant information for the table. The response can be paginated to handle large datasets efficiently without taking all possible data, which could reach up to 1000+ objects in a list.
As the request parameters I would write as:
```json
{
  "pageNumber": 1,
  "pageSize": 20,
  "id": "245gds2cd4xq23",
  "domainName": "example.com",
  "registrar": "Registrar Name",
  "status": "active"
}
```
And according to its parameters, the API will return:
```json
{
  "data": [
    {
      "id": "245gds2cd4xq23",
      "domainName": "example.com",
      "registrar": "Registrar Name",
      "status": "active"
    }
  ],
  "pagination": {
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 50,
    "totalItems": 1000
  }
}
```

If the API call fails, it will return an appropriate error message and status code, which can be handled by the frontend to display an error message to the user.
Example of error response:
```json
{
  "error": "Failed to fetch domain data. Please try again later."
}
```
or (in case of missing or invalid parameters on client-side):
```json
{
  "error": "Invalid request parameters. Please check your input and try again."
}
```

In current implementation, I am passing the all the information received from simulated API, but for better performance on client-side, I would add one API for fetching the details of a specific domain, which would be called when the user clicks on a domain in the table to view more information in the popup. This way, we can avoid sending unnecessary data to the client and improve the overall performance of the application.
Example of the new endpoint:
- **GET /api/getDomainDetails/:id**: This endpoint will return detailed information about a specific domain based on its ID. The response will include all relevant information about the domain, such as its name, registrar, status, creation date, expiration date, and any other relevant details that may be needed for the popup display.
And as the response:
```json
{
  "id": "245gds2cd4xq23",
  "domain": "example.com",
  "registrar": "Registrar Name",
  "status": "active",
  "creationDate": "2020-01-01T00:00:00Z",
  "expirationDate": "2025-01-01T00:00:00Z",
  "created_at": "2025-01-01T00:00:00Z",
  "expires_at": "2025-01-01T00:00:00Z",
  "nameservers": ["ns1.namecheap.com", "ns2.namecheap.com"],
  "updated_at": "2025-01-01T00:00:00Z"
}
```
In case of an error, it will return an appropriate error message and status code, similar to the previous endpoint, which can be handled by the frontend to display an error message to the user.
Example of error response:
```json
{
  "error": "Failed to fetch domain details. Please try again later."
}
```

### Future Improvements
- Improve the UI/UX design of the application to make it more visually appealing and user-friendly.
- Provide accessibility features to ensure that the application is usable by people with disabilities, such as screen reader support and keyboard navigation.
- Implement additional features such as sorting, allowing users to easily find specific domains based on their criteria.
