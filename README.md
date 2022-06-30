# Table of contents

- [Specifications](#specifications)
  - [Features](#features)
  - [Software architecture of the application](#architecture)
    - [Front-end slicing](#front-end)
    - [Back-end slicing](#back-end)
    - [Organization of the database](#database)
    - [Deploying the application](#deploy)
      - [Deployment of the front-end](#deploy-front)
      - [Deployment of the back-end](#deploy-back)
  - [Tasks assignment](#tasks-assignment)
- [Documentation](#documentation)
  - [API](#api)
    - [Users](#users)
      - [Register - [POST]](#user-register)
      - [Login - [POST]](#user-login)
      - [My Account - [GET]](#user-account)
    - [Articles](#articles)
      - [List - [GET]](#article-get)
      - [Add - [POST]](#article-add)
      - [Update - [PUT]](#article-update)
      - [Delete - [DELETE]](#article-delete)
    - [Groups](#groups)
      - [List - [GET]](#group-get)
      - [Add - [POST]](#group-add)
      - [Update - [PUT]](#group-update)
      - [Delete - [DELETE]](#group-delete)
    - [Requests](#requests)
      - [Get - [GET]](#request-get)
      - [Add - [POST]](#request-post)
      - [Delete - [DELETE]](#request-delete)

# <a id="specifications"></a>I. Specifications

## <a id="features"></a>1.1. Features

## <a id="architecture"></a>1.2. Software architecture of the application

### <a id="front-end"></a>1.2.1. Front-end slicing

### <a id="back-end"></a>1.2.2. Back-end slicing

### <a id="database"></a>1.2.3. Organization of the database

### <a id="deploy"></a>1.2.4. Deploying the application

#### <a id="deploy-front"></a>a. Deployment of the front-end

#### <a id="deploy-back"></a>b. Deployment of the back-end

## <a id="tasks-assignment"></a>1.3. Tasks assignment

# <a id="documentation"></a>II. Documentation

## <a id="api"></a>2.1. API

Link : [projet-technique-h3-2022.herokuapp.com/api/v1](https://projet-technique-h3-2022.herokuapp.com/api/v1)

### <a id="users"></a>2.1.1. Users

#### <a id="user-register"></a>a. Register - [POST]

> Allows a user to register.
>
> Path : `/user/register`
>
> Data to be sent :
>
> ```javascript
> {
>     lastname: String, // From 2 to 50 characters
>     firstname: String, // From 2 to 50 characters
>     email: String, // 255 characters maximum in email format
>     password: String, // From 6 to 255 characters
>     role: String, // "author" | "editor"
> }
> ```

#### <a id="user-login"></a>b. Login - [POST]

> Allows a user to login.
>
> Path : `/user/login`
>
> Data to be sent :
>
> ```javascript
> {
>     email: String, // 255 characters maximum in email format
>     password: String, // From 6 to 255 characters
> }
> ```

#### <a id="user-account"></a>c. My Account - [GET]

> Allows you to retrieve the information of the connected user.
>
> Path : `/user/account`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

---

### <a id="articles"></a>1.2.2. Articles

#### <a id="article-get"></a>a. List - [GET]

> Allows you to retrieve all articles.
>
> Path : `/article`

> Allows you to retrieve one article.
>
> Path : `/article/:id`

> Allows you to retrieve all the articles of a user.
>
> Path : `/user/articles`

#### <a id="article-add"></a>b. Add - [POST]

> Allows an author to create an article.
>
> Path : `/article`
>
> Data to be sent :
>
> ```javascript
> {
>     title: String, // 3 characters minimum
>     image: String, // 2 characters minimum
>     content: String, // 50 characters minimum
> }
> ```
>
> Headers to be sent :
>
> ```json
> {
>   authorization: "Bearer <token>"
> }
> ```

#### <a id="article-update"></a>c. Update - [PUT]

> Allows an author to modify one of his articles.
>
> Path : `/article/:id`
>
> Data to be sent :
>
> ```javascript
> {
>     title: String, // 3 characters minimum
>     image: String, // 2 characters minimum
>     content: String, // 50 characters minimum
> }
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

#### <a id="article-delete"></a>d. Delete - [DELETE]

> Allows an author to delete one of his articles.
>
> Path : `/article/:id`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

---

### <a id="groups"></a>1.2.3. Groups

#### <a id="group-get"></a>a. List - [GET]

> Allows you to retrieve all groups of editors.
>
> Path : `/group`

> Allows you to retrieve one group.
>
> Path : `/group/:id`

> Retrieves all groups from the connected editor.
>
> Path : `/group/editor`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```
>
> Allows you to retrieve all the articles in a group.
>
> Path : `/group/:id/article`

#### <a id="group-add"></a>b. Add - [POST]

> Allows an editor to create a group.
>
> Path : `/group`
>
> Data to be sent :
>
> ```javascript
> {
>     title: String, // 3 characters minimum
> }
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

#### <a id="group-update"></a>c. Update - [PUT]

> Allows an editor to modify one of his groups.
>
> Path : `/group/:id`
>
> Data to be sent :
>
> ```javascript
> {
>     title: String, // 3 characters minimum
> }
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

#### <a id="group-delete"></a>d. Delete - [DELETE]

> Allows an editor to delete one of his groups and remove all articles linked to it.
>
> Path : `/group/:id`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

> Allows an editor to delete an article from one of his groups.
>
> Path : `/group/:groupId/article/:articleId`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

---

### <a id="requests"></a>1.2.4. Requests

#### <a id="request-get"></a>a. Get - [GET]

> Allows you to retrieve all requests according to the user's role.
>
> Path : `/request`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

#### <a id="request-post"></a>b. Add - [POST]

> Allows an autor to create a request for his article.
>
> Path : `/request`
>
> Data to be sent :
>
> ```javascript
> {
>     id_article: String, // Corresponds to the ObjectID of an item
>     id_group: String, // Corresponds to the ObjectID of an item
> }
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

#### <a id="request-delete"></a>c. Delete - [DELETE]

> Allows an editor to validate a request.
>
> `/request/:id/valid`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

> Allows an editor to refused a request.
>
> `/request/:id/refuse`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

> Allows an autor to cancel a request.
>
> `/request/:id/cancel`
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```
