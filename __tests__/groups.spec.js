require("dotenv").config();

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Import models
const { Article } = require("../database/models/Article.model");
const { Group } = require("../database/models/Group.model");
const { User } = require("../database/models/User.model");
const { Role } = require("../database/enum");

const groupRoute = "/api/v1/group";
let groupTest;
let articleTest;
let userTest;
let token;
let token2;

describe("Group API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

    await new Promise((r) => setTimeout(r, 2000));

    // Create an editor
    await supertest(app).post("/api/v1/user/register").send({
      lastname: "jean",
      firstname: "jean",
      email: "test@test.fr",
      password: "jesuisunmotdepasse",
      role: Role.EDITOR,
    });

    const res = await supertest(app).post("/api/v1/user/login").send({
      email: "test@test.fr",
      password: "jesuisunmotdepasse",
    });

    const data = JSON.parse(res.text);
    userTest = data;
    token = data.token;

    // Create an editor
    await supertest(app).post("/api/v1/user/register").send({
      lastname: "jean",
      firstname: "jean",
      email: "test2@test.fr",
      password: "jesuisunmotdepasse",
      role: Role.EDITOR,
    });

    const res2 = await supertest(app).post("/api/v1/user/login").send({
      email: "test2@test.fr",
      password: "jesuisunmotdepasse",
    });

    const data2 = JSON.parse(res2.text);
    token2 = data2.token;

    // Create an author
    await supertest(app).post("/api/v1/user/register").send({
      lastname: "jean",
      firstname: "jean",
      email: "author@test.fr",
      password: "jesuisunmotdepasse",
      role: Role.AUTHOR,
    });

    const authorRes = await supertest(app).post("/api/v1/user/login").send({
      email: "author@test.fr",
      password: "jesuisunmotdepasse",
    });

    const authorData = JSON.parse(authorRes.text);
    const authorToken = authorData.token;

    // Create Article
    const res3 = await supertest(app)
      .post("/api/v1/article")
      .send({
        title: "eugfiuef",
        image: "ehuehfoe",
        content:
          "piojgohzbkdznd kjqzgdkgqkzgkdjzhqkdkjqzbk jdbkqbzkbdkjqbjkqbkjbzdkjbjk bjkqbjkzbkjdbkjqbkjdbkdjbzjkb jkzbkj bkjbkjbkj",
      })
      .set("authorization", `Bearer ${authorToken}`);
    articleTest = JSON.parse(res3.text);
  });

  afterAll(async () => {
    await Article.deleteMany({});
    await Group.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe(`Route ${groupRoute}`, () => {
    test("Method GET\t", async () => {
      const res = await supertest(app)
        .get(groupRoute)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      let groups = await Group.find({});
      groups = JSON.parse(JSON.stringify(groups));

      expect(data).toMatchObject(groups);
    });

    test("Method POST \t-> Valid DATA and Valid token", async () => {
      const res = await supertest(app)
        .post(groupRoute)
        .send({
          title: "je suis un test",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(201)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      let group = await Group.findById(data._id);
      group = JSON.parse(JSON.stringify(group));

      expect(group.title).toBe("je suis un test");

      groupTest = group;
    });

    test("Method POST \t-> Valid DATA and Unvalid token", async () => {
      const res = await supertest(app)
        .post(groupRoute)
        .send({
          title: "je suis un test",
        })
        .set("authorization", "123")
        .expect(401)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Valid DATA without token", async () => {
      const res = await supertest(app)
        .post(groupRoute)
        .send({
          title: "je suis un test",
        })
        .expect(401)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Invalid DATA", async () => {
      const res = await supertest(app)
        .post(groupRoute)
        .send({
          titl: "aa",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method PUT \t-> Undefined method", async () => {
      const res = await supertest(app)
        .put(groupRoute)
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method DELETE \t-> Undefined method", async () => {
      const res = await supertest(app)
        .delete(groupRoute)
        .expect(404)
        .expect("Content-Type", /html/);
    });
  });

  describe(`Route ${groupRoute}/:id`, () => {
    test("Method GET \t-> Valid ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/${groupTest._id}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      let group = await Group.findById(groupTest._id);
      group = JSON.parse(JSON.stringify(group));

      expect(data).toMatchObject(group);
    });

    test("Method GET \t-> undefined ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/dvfdscnjodz`)
        .expect(400);
    });

    test("Method GET \t-> Invalid ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/62bc078c1e9759579c64c035`)
        .expect(400);
    });

    test("Method PUT \t-> Valid ID and Valid DATA", async () => {
      const response = await supertest(app)
        .put(`${groupRoute}/${groupTest._id}`)
        .send({
          title: "titre modifié",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(response.text);
      expect(data.title).toBe("titre modifié");
    });

    test("Method PUT \t-> Invalid ID", () => {
      return supertest(app)
        .put(`${groupRoute}/zkjdfkjehfl`)
        .send({
          title: "test modifié",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method PUT \t-> Invalid DATA", () => {
      return supertest(app)
        .put(`${groupRoute}/${groupTest._id}`)
        .send({
          titl: "test modifié",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });
  });

  describe(`Route ${groupRoute}/:id/article`, () => {
    test("Method GET \t-> Valid ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/${groupTest._id}/article`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      const group = await Group.findById(groupTest._id);
      const articles = JSON.parse(JSON.stringify(group.articles));

      expect(data).toMatchObject(articles);
    });

    test("Method GET \t-> undefined ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/dvfdscnjodz/article`)
        .expect(400);
    });

    test("Method POST \t-> Valid DATA and Valid token", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: articleTest._id,
        })
        .set("authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      let group = await Group.findById(data._id);
      group = JSON.parse(JSON.stringify(group));

      expect(data).toMatchObject(group);
    });

    test("Method POST \t-> Valid DATA and Unvalid token", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: articleTest._id,
        })
        .set("authorization", "123")
        .expect(401)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Valid DATA without token", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: articleTest._id,
        })
        .expect(401)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Valid DATA and Unvalid Group", async () => {
      const groupRes = await supertest(app)
        .post(groupRoute)
        .send({
          title: "je suis un test",
        })
        .set("authorization", `Bearer ${token2}`);

      const data = JSON.parse(groupRes.text);
      const groupId = data._id;

      const res = await supertest(app)
        .post(`${groupRoute}/${groupId}/article`)
        .send({
          id_article: articleTest._id,
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Invalid Article Id", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: "62bc19c21e9759579c64c038",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method POST \t-> Invalid DATA", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_articl: "qdhgdgzqkudgqizhdi",
        })
        .set("authorization", `Bearer ${token}`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method PUT \t-> Undefined method", async () => {
      const res = await supertest(app)
        .put(`${groupRoute}/${groupTest._id}/article`)
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method DELETE \t-> Undefined method", async () => {
      const res = await supertest(app)
        .delete(`${groupRoute}/${groupTest._id}/article`)
        .expect(404)
        .expect("Content-Type", /html/);
    });
  });

  describe(`Route ${groupRoute}/editor/`, () => {
    test("Method GET \t-> Valid token", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/editor`)
        .set("authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      let group = await Group.find({ id_editor: userTest.id });
      group = JSON.parse(JSON.stringify(group));

      expect(group.id_editor).toBe(userTest._id);
    });

    test("Method GET \t-> undefined token", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/editor`)
        .set("authorization", `Bearer ozihdoihzqildhqozd`)
        .expect(400);
    });

    test("Method GET \t-> Without token", async () => {
      const res = await supertest(app).get(`${groupRoute}/editor`).expect(401);
    });

    test("Method GET \t-> Valid token and Not found User", async () => {
      await supertest(app).post("/api/v1/user/register").send({
        lastname: "jean",
        firstname: "jean",
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.EDITOR,
      });

      const userRes = await supertest(app).post("/api/v1/user/login").send({
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
      });

      const user = JSON.parse(userRes.text);
      const userToken = user.token;

      await User.findByIdAndDelete(user.id);

      const res = await supertest(app)
        .get(`${groupRoute}/editor`)
        .set("authorization", `Bearer ${userToken}`)
        .expect(400);
    });

    test("Method GET \t-> Valid token and Valid User role", async () => {
      await supertest(app).post("/api/v1/user/register").send({
        lastname: "jean",
        firstname: "jean",
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
        role: Role.AUTHOR,
      });

      const userRes = await supertest(app).post("/api/v1/user/login").send({
        email: "test3@test.fr",
        password: "jesuisunmotdepasse",
      });

      const user = JSON.parse(userRes.text);
      const userToken = user.token;

      const res = await supertest(app)
        .get(`${groupRoute}/editor`)
        .set("authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });
});
