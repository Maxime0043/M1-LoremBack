require("dotenv").config();

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Import models
const { Article } = require("../database/models/Article.model");
const { Group } = require("../database/models/Group.model");
const { User } = require("../database/models/User.model");
const { Role, RequestState } = require("../database/enum");

const groupRoute = "/api/v1/group";
const articleRoute = "/api/v1/article";

let groupTest;
let articleTest;
let userTest;
let token;
let token2;
let authorToken;

describe("Group API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

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
    authorToken = authorData.token;

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

    test("Method POST \t-> Undefined method", async () => {
      const res = await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: "kjzbfkz",
        })
        .expect(404)
        .expect("Content-Type", /html/);
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

  describe(`Route ${groupRoute}/:groupId/article/:articleId`, () => {
    test("Method DELETE \t-> Valid IDs and Invalid token", async () => {
      const res = await supertest(app)
        .delete(`${groupRoute}/${groupTest._id}/article/${articleTest.id}`)
        .set("authorization", `Bearer qkuzgdkuqhdhqzid`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method DELETE \t-> Valid Group Id and Invalid Article Id", async () => {
      const res = await supertest(app)
        .delete(
          `${groupRoute}/${groupTest._id}/article/62bc078c1e9759579c64c035`
        )
        .set("authorization", `Bearer ${token}`)
        .expect(400);
    });

    test("Method DELETE \t-> Valid Article Id and Invalid Group Id", async () => {
      const res = await supertest(app)
        .delete(
          `${groupRoute}/62bc078c1e9759579c64c035/article/${articleTest.id}`
        )
        .set("authorization", `Bearer ${token}`)
        .expect(400);
    });

    test("Method DELETE \t-> Valid IDs and Valid token", async () => {
      // Create an Article
      const artRes = await supertest(app)
        .post("/api/v1/article")
        .send({
          title: "eugfiuef",
          image: "ehuehfoe",
          content:
            "piojgohzbkdznd kjqzgdkgqkzgkdjzhqkdkjqzbk jdbkqbzkbdkjqbjkqbkjbzdkjbjk bjkqbjkzbkjdbkjqbkjdbkdjbzjkb jkzbkj bkjbkjbkj",
        })
        .set("authorization", `Bearer ${authorToken}`);

      let newArticle = JSON.parse(artRes.text);

      // Link article to group
      await supertest(app)
        .post(`${groupRoute}/${groupTest._id}/article`)
        .send({
          id_article: newArticle._id,
        })
        .set("authorization", `Bearer ${token}`);

      newArticle = await Article.findById(newArticle._id);

      // Remove Article from Group
      const res = await supertest(app)
        .delete(
          `${groupRoute}/${groupTest._id}/article/${newArticle._id.toString()}`
        )
        .set("authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const article = JSON.parse(res.text);
      const group = await Group.findById(groupTest._id);

      expect(group.articles).not.toEqual(
        expect.arrayContaining([newArticle._id])
      );

      expect(article.published).toBe(RequestState.IN_WAIT);
      expect(article.id_group).toBe(null);
      expect(article.published_at).toBe(null);
    });
  });

  describe(`Route ${groupRoute}/:id - METHOD DELETE ONLY`, () => {
    test("Method DELETE \t-> Valid ID and Invalid token", async () => {
      const res = await supertest(app)
        .delete(`${groupRoute}/${groupTest._id}`)
        .set("authorization", `Bearer qkuzgdkuqhdhqzid`)
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test("Method DELETE \t-> Invalid ID", async () => {
      const res = await supertest(app)
        .delete(`${groupRoute}/62bc078c1e9759579c64c035`)
        .set("authorization", `Bearer ${token}`)
        .expect(400);
    });

    test("Method DELETE \t-> Valid ID and Valid token", async () => {
      // Inserting the article in the group
      await Article.findByIdAndUpdate(articleTest._id, {
        published: RequestState.IN_WAIT,
        id_group: groupTest._id.toString(),
        published_at: Date.now(),
      });
      articleTest = await Article.findById(articleTest._id);

      await Group.findByIdAndUpdate(groupTest._id.toString(), {
        articles: [...groupTest.articles, articleTest._id.toString()],
      });

      // We delete our group
      await supertest(app)
        .delete(`${groupRoute}/${groupTest._id}`)
        .set("authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /json/);

      let group = await Group.findById(groupTest._id);
      group = JSON.parse(JSON.stringify(group));

      expect(group).toBe(null);

      // Initial verification
      expect(articleTest.id_group.toString()).toBe(groupTest._id);

      // We check that the article have been updated
      const artRes = await supertest(app)
        .get(`${articleRoute}/${articleTest._id.toString()}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const artData1Get = JSON.parse(artRes.text);

      expect(artData1Get.published).toBe(RequestState.IN_WAIT);
      expect(artData1Get.id_group).toBe(null);
      expect(artData1Get.published_at).toBe(null);
    });
  });
});
