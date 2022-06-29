require("dotenv").config();

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../database/models/User.model");
const { Request } = require("../database/models/Request.model");
const { Article } = require("../database/models/Article.model");
const { Role } = require("../database/enum");

let tokenAuthor = "";
let tokenEditor = "";

let idArticle = "";
let idGroup = "";

describe("Request API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

    await User.deleteMany({});
    await Article.deleteMany({});
    await Request.deleteMany({});

    await supertest(app)
      .post("/api/v1/user/register")
      .send({
        lastname: "jean",
        firstname: "jean",
        email: "testeditor@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.EDITOR,
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const resEditor = await supertest(app)
      .post("/api/v1/user/login")
      .send({
        email: "testeditor@test.fr",
        password: "jesuisunmotdepasse",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    const dataEditor = JSON.parse(resEditor.text);
    tokenEditor = dataEditor.token;

    await supertest(app)
      .post("/api/v1/user/register")
      .send({
        lastname: "jean",
        firstname: "jean",
        email: "testauthor@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.AUTHOR,
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const resAuthor = await supertest(app)
      .post("/api/v1/user/login")
      .send({
        email: "testauthor@test.fr",
        password: "jesuisunmotdepasse",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    const dataUser = JSON.parse(resAuthor.text);
    tokenAuthor = dataUser.token;

    const resArticle = await supertest(app)
      .post("/api/v1/article")
      .send({
        title: "Titre",
        image: "https://picsum.photos/200/300",
        content:
          "CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT",
      })
      .set("authorization", `Bearer ${tokenAuthor}`)
      .expect(201)
      .expect("Content-Type", /json/);

    const dataArticle = JSON.parse(resArticle.text);
    idArticle = dataArticle._id;

    const resGroup = await supertest(app)
      .post("/api/v1/group")
      .send({
        title: "GROUPTEST",
      })
      .set("authorization", `Bearer ${tokenEditor}`)
      .expect(201)
      .expect("Content-Type", /json/);

    const dataGroup = JSON.parse(resGroup.text);
    idGroup = dataGroup._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Article.deleteMany({});
    await Request.deleteMany({});
    await mongoose.connection.close();
  });
  describe("Route /api/v1/request", () => {
    test("Method POST\t -> Valid Data", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .send({
          id_article: idArticle,
          id_group: idGroup,
        })
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(201)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);
      let request = await Request.findById(data._id);
      request = JSON.parse(JSON.stringify(request));

      expect(data).toMatchObject(request);
    });

    test("Method POST\t -> Invalid Data", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data).toHaveProperty("error");
    });

    test("Method POST\t -> Invalid Article", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .send({
          id_article: "idArticle",
          id_group: idGroup,
        })
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Article ID not valid !");
    });

    test("Method POST\t -> Invalid Group", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .send({
          id_article: idArticle,
          id_group: "idGroup",
        })
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Group ID not valid !");
    });

    test("Method POST\t -> Article Not Found", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .send({
          id_article: "62bc349abcadf6ed5bb802d3",
          id_group: idGroup,
        })
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Article not found");
    });

    test("Method POST\t -> Group Not Found", async () => {
      const response = await supertest(app)
        .post("/api/v1/request")
        .send({
          id_article: idArticle,
          id_group: "62bc349abcadf6ed5bb802d3",
        })
        .set("authorization", `Bearer ${tokenAuthor}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Group not found");
    });
  });
});
