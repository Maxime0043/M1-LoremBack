require("dotenv").config();

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const { Article } = require("../database/models/Article.model");
const { Role } = require("../database/enum");
const { User } = require("../database/models/User.model");

let token1 = "";
let token2 = "";
let token3 = "";

const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYmMwMTU1MTc3NmI5OWU2NjRlYjc1MyIsImVtYWlsIjoidGVzdEB0ZXN0LmZyIiwibGFzdG5hbWUiOiJqZWFuIiwiZmlyc3RuYW1lIjoiamVhbiIsInJvbGUiOiJhdXRob3IiLCJpYXQiOjE2NTY0ODgyNzh9.zLuZIlPUvxPxnu6As6TBWCrmCY-ZEnlmxLwsJQewEjQ";

const fakeToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InByb3V0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuZnIiLCJsYXN0bmFtZSI6ImplYW4iLCJmaXJzdG5hbWUiOiJqZWFuIiwicm9sZSI6ImF1dGhvciIsImlhdCI6MTY1NjQ4ODY3OX0.-t6PvXMxqNgSymDdbNHLsbPNcuUAj1Q1ceFxD8r8f9I";

let idArticle1 = "";
let idArticle2 = "";

describe("Article API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

    await User.deleteMany({});
    await Article.deleteMany({});

    await supertest(app)
      .post("/api/v1/user/register")
      .send({
        lastname: "jean",
        firstname: "jean",
        email: "test@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.AUTHOR,
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const res = await supertest(app)
      .post("/api/v1/user/login")
      .send({
        email: "test@test.fr",
        password: "jesuisunmotdepasse",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    const data = JSON.parse(res.text);
    token1 = data.token;

    await supertest(app)
      .post("/api/v1/user/register")
      .send({
        lastname: "jean",
        firstname: "jean",
        email: "test2@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.AUTHOR,
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const res2 = await supertest(app)
      .post("/api/v1/user/login")
      .send({
        email: "test2@test.fr",
        password: "jesuisunmotdepasse",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    const data2 = JSON.parse(res2.text);
    token2 = data2.token;

    await supertest(app)
      .post("/api/v1/user/register")
      .send({
        lastname: "jean",
        firstname: "jean",
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.EDITOR,
      })
      .expect(201)
      .expect("Content-Type", /json/);

    const res3 = await supertest(app)
      .post("/api/v1/user/login")
      .send({
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
      })
      .expect(200)
      .expect("Content-Type", /json/);

    const data3 = JSON.parse(res3.text);
    token3 = data3.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Article.deleteMany({});
    await mongoose.connection.close();
  });

  describe("Route /api/v1/article", () => {
    test("Method GET \t-> Valid DATA", async () => {
      const response = await supertest(app)
        .get("/api/v1/article")
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toStrictEqual([]);
    });

    test("Method PUT \t-> Undefined method", async () => {
      const response = await supertest(app)
        .put("/api/v1/article")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method DELETE \t-> Undefined method", async () => {
      const response = await supertest(app)
        .delete("/api/v1/article")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method POST \t-> Valid DATA", async () => {
      const response = await supertest(app)
        .post("/api/v1/article")
        .send({
          title: "Titre",
          image: "https://picsum.photos/200/300",
          content:
            "CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT",
        })
        .set("authorization", `Bearer ${token1}`)
        .expect(201)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);
      let article1 = await Article.findById(data._id);
      article1 = JSON.parse(JSON.stringify(article1));

      expect(data).toMatchObject(article1);
      idArticle1 = data._id;

      const response2 = await supertest(app)
        .post("/api/v1/article")
        .send({
          title: "Titre",
          image: "https://picsum.photos/200/300",
          content:
            "CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT",
        })
        .set("authorization", `Bearer ${token2}`)
        .expect(201)
        .expect("Content-Type", /json/);

      const data2 = JSON.parse(response2.text);
      let article = await Article.findById(data2._id);
      article = JSON.parse(JSON.stringify(article));

      expect(data2).toMatchObject(article);
      idArticle2 = data2._id;
    });

    test("Method POST \t-> Invalid DATA", async () => {
      const response = await supertest(app)
        .post("/api/v1/article")
        .send({
          title: "Titre",
          image: "https://picsum.photos/200/300",
          content: "CONTENT",
        })
        .set("authorization", `Bearer ${token1}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Invalid User Role", async () => {
      const response = await supertest(app)
        .post("/api/v1/article")
        .send({
          title: "Titre",
          image: "https://picsum.photos/200/300",
          content:
            "CONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENTCONTENT",
        })
        .set("authorization", `Bearer ${token3}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });
  });

  describe("Route /api/v1/article/:id", () => {
    test("Method GET \t-> Valid DATA", async () => {
      const response = await supertest(app)
        .get(`/api/v1/article/${idArticle1}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.title).toBe("Titre");
    });

    test("Method GET \t-> Invalid DATA", async () => {
      const response = await supertest(app)
        .get(`/api/v1/article/jesuispasunid`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Invalid Id !");
    });

    test("Method GET \t-> Invalid Article Id", async () => {
      const response = await supertest(app)
        .get(`/api/v1/article/62baf4ac1e765f113baf5e2c`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Invalid Article Id !");
    });

    test("Method PUT \t-> Invalid Token", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${invalidToken}`)
        .send({
          title: "Titre B",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Invalid Token !");
    });

    test("Method PUT \t-> Invalid user id inside Token", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${fakeToken}`)
        .send({
          title: "Titre B",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Id must be valid !");
    });

    test("Method PUT \t-> Valid DATA", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${token1}`)
        .send({
          title: "Titre B",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.title).toBe("Titre B");
    });

    test("Method PUT \t-> Invalid DATA", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${token1}`)
        .send({
          title: "Ti",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data).toHaveProperty("error");
    });

    test("Method PUT \t-> Invalid Article Id", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/62baf4ac1e765f113baf5e2c`)
        .set("authorization", `Bearer ${token1}`)
        .send({
          title: "Titre",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Invalid Article Id !");
    });

    test("Method PUT \t-> Invalid User", async () => {
      const response = await supertest(app)
        .put(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${token2}`)
        .send({
          title: "Titre B",
        })
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data).toHaveProperty("error");
    });

    test("Method DELETE \t-> Valid DATA", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/article/${idArticle1}`)
        .set("authorization", `Bearer ${token1}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.title).toBe("Titre B");
    });

    test("Method DELETE \t-> Invalid DATA", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/article/${idArticle1}4`)
        .set("authorization", `Bearer ${token1}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data).toHaveProperty("error");
    });

    test("Method DELETE \t-> Invalid Article Id", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/article/62baf4ac1e765f113baf5e2c`)
        .set("authorization", `Bearer ${token1}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data.error).toBe("Invalid Article Id !");
    });

    test("Method DELETE \t-> Invalid User", async () => {
      const response = await supertest(app)
        .delete(`/api/v1/article/${idArticle2}`)
        .set("authorization", `Bearer ${token1}`)
        .expect(400)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);

      expect(data).toHaveProperty("error");
    });
  });
});
