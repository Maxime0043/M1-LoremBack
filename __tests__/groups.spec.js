require("dotenv").config();

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Import models
const { Group } = require("../database/models/Group.model");
const { User } = require("../database/models/User.model");
const { Role } = require("../database/enum");

const groupRoute = "/api/v1/group";
let groupTest;
let userTest;
let token;

describe("Group API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));

    await new Promise((r) => setTimeout(r, 2000));

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
  });

  afterAll(async () => {
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

  describe(`Route ${groupRoute}/editor/:id`, () => {
    test("Method GET \t-> Valid ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/editor/${userTest.id}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);
      let group = await Group.find({ id_editor: userTest.id });
      group = JSON.parse(JSON.stringify(group));

      expect(data).toMatchObject(group);
    });

    test("Method GET \t-> undefined ID", async () => {
      const res = await supertest(app)
        .get(`${groupRoute}/editor/zkjfgkrgeou`)
        .expect(400);
    });
  });
});
