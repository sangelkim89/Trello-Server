# Trello Clone -Server
1. Intro

This is the server-side of the project Trello Clone.

2. Project

Stack :​

​-Server :​

express/ mongoose / JWT / MongoDB

​-Deploy :​

Heroku


-Before Starting: This is the server-side file for our project, make sure to check out the client-side: https://github.com/sangelkim89/Trello-Client


-Installing : Please install with:

npm(yarn) install

-Running the program : 

You will have to change the cors: origin to your localhost:{port} in the index.js file, after doing so, open the terminal and simply type: 

npm start 


-Link to project Notion page:

https://www.notion.so/16-6f2aeac08897469286c88b69d7aa699f

-Link to website:

http://clonetrello.s3-website.ap-northeast-2.amazonaws.com/



-Features : Resolvers:

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
