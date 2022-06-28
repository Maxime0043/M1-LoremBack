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

let idArticle1 = "";
let idArticle2 = "";

describe("Article API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

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
