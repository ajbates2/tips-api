# Tips API

API server for 'tips.' project

<a href='https://github.com/ajbates2/tips'>Tips Repo</a>

<a href='https://tips-sigma.vercel.app/'>Live App</a>

## Endpoints

```/shifts and /paychecks```

Both endpoints get, post, and delete in relatively similar ways. '/shifts' contains a bit more complex data. On successful login, the user id is passed in a json web token which then calls an array of objects that have the correct user_id

```/user and /auth```

Post request for new user deals with error handling and shares some logic with the '/auth' endpoint in that it passes the jwt into local storage after succesful account creation.

```/roles and /jobs```

Simple post requests for each endpoint at this time.

## Technology Used

*   Express.js
*   Node.js
*   Postgresql
