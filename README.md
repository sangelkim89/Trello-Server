# Trello Clone -Server
1. Intro
This is the server-side of the project Trello Clone.
2. Project
Stack :​
​Server :​

Node.js / mongoose/ Express / JWT / MongoDB
​Deploy :​

Heroku
Before Starting: This is the server-side file for our project, make sure to check out the client-side: https://github.com/codestates/Serendipity-client/tree/master
Setup :

Installing : Please install with:
npm(yarn) install
Running the program : 
You will have to change the cors: origin to your localhost:{port} in the index.js file, after doing so, open the terminal and simply type: 
npm start 

Features : Resolvers:

-signup: create an account
-login: checks to see if the given info matches with the database and returns a status
-getUser: finds a User from the database with the given info and returns it
-boardCreate/Edit/Delete: creates/edits/deletes a board from the database with the given info
-containerCreate/Edit/Delete: creates/edits/deletes a container from the database with the given info
-cardCreate/Edit/Delete: creates/edits/deletes a card from the database with the given info
-editUserInfo: finds a User from the database and changes its info
-deleteAccount: finds and deletes the User, and deletes boards, containers, and cards associated with the User
-getCards: returns all the cards
-getContainers: returns all the containers
-changeCardPosition: finds a card and updates its associations
