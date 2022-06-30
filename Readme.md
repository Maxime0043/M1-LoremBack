# Table of contents

- [Specifications](#specifications)
  - [Features](#features)
  - [Database](#database)
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

# <a id="specifications"></a>Specifications

## <a id="features"></a>Features

## <a id="database"></a>Database

## <a id="tasks-assignment"></a>Tasks assignment

# <a id="documentation"></a>Documentation

## <a id="api"></a>API

Link : [projet-technique-h3-2022.herokuapp.com](https://projet-technique-h3-2022.herokuapp.com)

### <a id="users"></a>Users

#### <a id="user-register"></a>Register - [POST]

> Allows a user to register :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/user/register
> ```
>
> Data to be sent :
>
> ```json
> {
>     lastname: String, // From 2 to 50 characters
>     firstname: String, // From 2 to 50 characters
>     email: String, // 255 characters maximum in email format
>     password: String, // From 6 to 255 characters
>     role: String, // "author" | "editor"
> }
> ```

#### <a id="user-login"></a>Login - [POST]

> Allows a user to login :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/user/login
> ```
>
> Data to be sent :
>
> ```json
> {
>     email: String, // 255 characters maximum in email format
>     password: String, // From 6 to 255 characters
> }
> ```

#### <a id="user-account"></a>My Account - [GET]

> Allows you to retrieve the information of the connected user :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/user/account
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

---

### <a id="articles"></a>Articles

#### <a id="article-get"></a>List - [GET]

> Allows you to retrieve all articles :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/article
> ```

> Allows you to retrieve one article :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/article/:id
> ```

> Allows you to retrieve all the articles of a user :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/user/articles
> ```

#### <a id="article-add"></a>Add - [POST]

> Allows an author to create an article :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/article
> ```
>
> Data to be sent :
>
> ```json
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

#### <a id="article-update"></a>Update - [PUT]

> Allows an author to modify one of his articles :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/article/:id
> ```
>
> Data to be sent :
>
> ```json
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
>     authorization: <token>
> }
> ```

#### <a id="article-delete"></a>Delete - [DELETE]

> Allows an author to delete one of his articles :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/article/:id
> ```
>
> Headers to be sent :
>
> ```json
> {
>     authorization: <token>
> }
> ```

---

### <a id="groups"></a>Groups

#### <a id="group-get"></a>List - [GET]

> Allows you to retrieve all groups of editors :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group
> ```

> Allows you to retrieve one group :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:id
> ```

> Retrieves all groups from the connected editor :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/editor
> ```
>
> Headers to be sent :
>
> ```json
> {
>     authorization: <token>
> }
> ```
>
> Allows you to retrieve all the articles in a group :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:id/article
> ```

#### <a id="group-add"></a>Add - [POST]

> Allows an editor to create a group :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group
> ```
>
> Data to be sent :
>
> ```json
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

> Allows an editor to add an article to a group :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:id/article
> ```
>
> Data to be sent :
>
> ```json
> {
>     id_article: String, // Corresponds to the ObjectID of an item
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

#### <a id="group-update"></a>Update - [PUT]

> Allows an editor to modify one of his groups :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:id
> ```
>
> Data to be sent :
>
> ```json
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

#### <a id="group-delete"></a>Delete - [DELETE]

> Allows an editor to delete one of his groups and remove all articles linked to it :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:id
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```

> Allows an editor to delete an article from one of his groups :
>
> ```txt
> projet-technique-h3-2022.herokuapp.com/api/v1/group/:groupId/article/:articleId
> ```
>
> Headers to be sent :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```
