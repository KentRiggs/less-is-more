# Less is More - An App for Letting Go

"Less is More" is a full-stack application designed to allow users to enter an apology into the ether anonymously or with added personal details. Built with React and Flask, this app uses visual effects to help users express themselves and let go of burdens in a symbolic and meaningful way.

## Features

- **Anonymous Apologies**: Users can submit apologies anonymously via the HomePage.js. The text uses particle effects to simulate the text burning up, representing the release of their burdens.
- **Personal Apologies**: Through the CreateUser.js modal, users can make their apologies personal by providing details such as username, email, password (stored in the users table), recipient, event date, event location (stored in the intended_for table), and apology text (stored in the apologies table).
- **Account Management**: Users can create an account, login, and logout using NavigationBar.js. The Amend.js allows logged-in users to edit their personal information and apologies.
- **Visualization**: The MemorialPage.js displays apologies in a structured and minimal format to convey that all apologies have the same gravity when let go.
- **Dynamic Filtering**: Apologies can be filtered by categories through user interaction on the UI.

## Technical Highlights

- **Backend**: Implemented using Flask and SQLAlchemy, meeting the requirements of using at least 4 models and handling full CRUD operations using RESTful conventions for Flatiron School final project requirements.
- **Client-Side Routing**: Utilizes React Router for managing at least 3 client-side routes.
- **Data Validation**: Incorporates Formik and Yup for form handling and validation.
- **Advanced Visuals**: Features particle effects using particles.js, a library not covered in the original project curriculum.
- **Security**: Implements authentication and authorization to ensure secure access to user-specific functionalities.

## Many-to-Many Relationship

This project includes a many-to-many relationship between apologies and categories through the apology_categories join table, showcasing the ability to handle complex data associations within a relational database.

## Installation

To set up this project locally begin in your terminal:

1. Clone the repository
2. Navigate to the project directory: `cd less-is-more`
3. Install backend dependencies using pipenv: `pipenv install`
4. Install frontend dependencies:
       `cd src
       npm install`
6. Start the backend server:
       `cd src/server
       python app.py`
8. In a new terminal, start the frontend: `npm start`


The application should now be running on your local machine, with the backend on `http://localhost:5555` and the frontend accessible via `http://localhost:3000`.

## Repository

Visit the GitHub repository to view the code and contribute:

[Less is More GitHub Repository](https://github.com/KentRiggs/less-is-more)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

Big thanks to the Spuds cohort of Flatiron School in the full stack software engineer program and our instructor Emiley Palmquist. Wouldn't have been the same, or possible, without y'all. 
Special thanks to the use of open-source libraries like React, Flask, SQLAlchemy, Formik, Yup, and particles.js.
