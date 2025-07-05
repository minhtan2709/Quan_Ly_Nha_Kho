# Warehouse Management System

This project is a warehouse management system built with React and Material UI. It features a modular structure with clearly separated components for managing various aspects of warehouse operations, including authentication, products, locations, inbound and outbound records, stocktaking, reports, and user management.

## Project Structure

The project is organized into the following main directories:

- **public/**: Contains static files such as the favicon, HTML entry point, manifest, and robots.txt.
- **src/**: Contains all the source code for the application, including components, hooks, utilities, and types.

### Key Components

- **Auth Module**: Handles user authentication with components for login, registration, and user details.
- **Products Module**: Manages product listings, forms for adding/editing products, and product details.
- **Locations Module**: Manages warehouse locations with similar structure to the products module.
- **Inbound Module**: Handles inbound records with listing, form, and detail views.
- **Outbound Module**: Manages outbound records with components for listing, forms, and details.
- **Stocktaking Module**: Provides functionality for stocktaking operations.
- **Reports Module**: Displays various reports related to stock and inventory.
- **Users Module**: Manages user accounts with components for listing, forms, and details.

### Layout

The application features a responsive layout that includes:

- **AppBar**: Displays the application title and user menu.
- **SideBar**: Provides navigation links to different modules of the application.
- **MainLayout**: Wraps the main content area where different module components are rendered based on the current route.

### Routing

Routing is managed using `react-router-dom` v6, allowing for seamless navigation between different modules of the application.

### API Integration

API calls are made using Axios, with a JWT token interceptor to manage authentication tokens for secure API requests.

### Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd warehouse-management-app
npm install
```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.