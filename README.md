# Table of contents

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

# <a id="documentation"></a>I. Documentation

## <a id="api"></a>1.1. API

Link : [projet-technique-h3-2022.herokuapp.com/api/v1](https://projet-technique-h3-2022.herokuapp.com/api/v1)

The different commands for the project :

- Start the application : `npm run start`
- Launch the tests of the application : `npm run test`
- Launch the application tests and display their coverage : `npm run coverage`

### <a id="users"></a>1.1.1. Users

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
>
> Data returned [![](https://badgen.net/badge/code/201/green)]() :
>
> ```javascript
> {
>     lastname: String,
>     firstname: String,
>     email: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     lastname: String,
>     firstname: String,
>     email: String,
>     role: String, // "author" | "editor"
>     token: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     lastname: String,
>     firstname: String,
>     email: String,
>     role: String, // "author" | "editor"
> }
> ```

---

### <a id="articles"></a>1.2.2. Articles

#### <a id="article-get"></a>a. List - [GET]

> Allows you to retrieve all articles.
>
> Path : `/article`
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> [
>   {
>    _id: String,
>    title: String,
>    image: String,
>    content: String,
>    updated_at: Date,
>    published_at: Date,
>    published: String,
>    id_group: Group,
>    id_author: User,
>    created_at: String,
>   },
>   ...
> ]
> ```

> Allows you to retrieve one article.
>
> Path : `/article/:id`
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   title: String,
>   image: String,
>   content: String,
>   updated_at: Date,
>   published_at: Date,
>   published: String,
>   id_group: Group,
>   id_author: User,
>   created_at: String,
> }
> ```

> Allows you to retrieve all the articles of a user.
>
> Path : `/user/articles`
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> [
>   {
>    _id: String,
>    title: String,
>    image: String,
>    content: String,
>    updated_at: Date,
>    published_at: Date,
>    published: String,
>    id_group: Group,
>    id_author: String,
>    created_at: String,
>   },
>   ...
> ]
> ```

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
>   "authorization": "Bearer <token>"
> }
> ```
>
> Data returned [![](https://badgen.net/badge/code/201/green)]() :
>
> ```javascript
> {
>   _id: String,
>   title: String,
>   image: String,
>   content: String,
>   updated_at: Date,
>   published_at: Date,
>   published: String,
>   id_group: Group,
>   id_author: User,
>   created_at: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   title: String,
>   image: String,
>   content: String,
>   updated_at: Date,
>   published_at: Date,
>   published: String,
>   id_group: Group,
>   id_author: User,
>   created_at: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   title: String,
>   image: String,
>   content: String,
>   updated_at: Date,
>   published_at: Date,
>   published: String,
>   id_group: Group,
>   id_author: User,
>   created_at: String,
> }
> ```

---

### <a id="groups"></a>1.2.3. Groups

#### <a id="group-get"></a>a. List - [GET]

> Allows you to retrieve all groups of editors.
>
> Path : `/group`
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> [
>     {
>       _id: String,
>       title: String,
>       articles: [Article],
>       id_editor: String,
>     },
>     ...
> ]
> ```

> Allows you to retrieve one group.
>
> Path : `/group/:id`
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     title: String,
>     articles: [Article],
>     id_editor: String,
> }
> ```

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
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> [
>     {
>       _id: String,
>       title: String,
>       articles: [Article],
>       id_editor: String,
>     },
>     ...
> ]
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     title: String,
>     articles: [],
>     id_editor: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     title: String,
>     articles: [Article],
>     id_editor: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     title: String,
>     articles: [Article],
>     id_editor: String,
> }
> ```

> Allows an editor to delete an article from one of his groups.
>
> Path : `/group/:groupId/article/:articleId`
>
> Headers to be sent [![](https://badgen.net/badge/code/200/green)]() :
>
> ```json
> {
>   "authorization": "Bearer <token>"
> }
> ```
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>     _id: String,
>     title: String,
>     articles: [Article],
>     id_editor: String,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   request_at: Date,
>   id_group: Group,
>   id_article: Article,
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
>
> Data returned [![](https://badgen.net/badge/code/201/green)]() :
>
> ```javascript
> {
>   _id: String,
>   requested_at: Date,
>   id_group: Group,
>   id_article: Article,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   requested_at: Date,
>   id_group: Group,
>   id_article: Article,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   requested_at: Date,
>   id_group: Group,
>   id_article: Article,
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
>
> Data returned [![](https://badgen.net/badge/code/200/green)]() :
>
> ```javascript
> {
>   _id: String,
>   requested_at: Date,
>   id_group: Group,
>   id_article: Article,
> }
> ```
