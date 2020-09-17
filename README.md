# Tips API

API server for 'tips.' project

<a href='https://github.com/ajbates2/tips' target='_blank'>Tips Repo</a>

<a href='https://tips-sigma.vercel.app/' target='_blank'>Live App</a>

Demo account: { email: 'foo@bar.com' password: 'password' }

## Endpoints

```/shifts and /paychecks```

Both endpoints get, post, and delete in relatively similar ways. '/shifts' contains a bit more complex data. On successful login, the user id is passed in a json web token which then calls an array of objects that have the correct user_id

```/user and /auth```

Post request for new user deals with error handling and shares some logic with the '/auth' endpoint in that it passes the jwt into local storage after succesful account creation.

```/roles and /jobs```

Simple post requests for each endpoint at this time.

## Set up

Major dependencies for this repo include Postgres and Node

To get set up locally do the following:

    1. Clone this repo to your machine, cd into the dir and run npm install
    2. Create the dev and test DB's: ```createdb -U USER -d tips``` and ```createdb -U USER -d tips-test```
    3. create an .env file in root project with the following:
    ```NODE_ENV=development
    PORT=8000
    API_TOKEN=3bbc6278-af64-11ea-b3de-0242ac130004
    DATABASE_URL="postgresql://USER:1@localhost/tips"
    TEST_DATABASE_URL="postgresql://USER:1@localhost/tips-test"
    JWT_SECRET="make-that-shmoney"```
    Make sure to update the username
    4. Run migrations for dev and test ```npm run migrate``` and ```npm run migrate:test```
    5. Seed the database for dev ```psql -U <db-user> -d tips -f ./seeds/seed.tips_tables.sql```
    6. ```npm t``` runs tests
    7. ```npm run dev``` starts app in dev mode

## Technology Used

*   Express.js
*   Node.js
*   Postgresql