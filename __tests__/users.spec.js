require("dotenv").config();

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Import models + Enums
const { User } = require("../database/models/User.model");
const { Role } = require("../database/enum");

const userRoute = "/api/v1/user";

describe("User API", () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.TEST_DATABASE_URL)
      .then(() => console.log("Connected to mongo"))
      .catch((err) => console.error("Failed to connect to mongo, ", err));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe(`Route ${userRoute}/register`, () => {
    test("Method GET \t-> Undefined method", async () => {
      const res = await supertest(app)
        .get(userRoute + "/register")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method PUT \t-> Undefined method", async () => {
      const res = await supertest(app)
        .put(userRoute + "/register")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method DELETE \t-> Undefined method", async () => {
      const res = await supertest(app)
        .delete(userRoute + "/register")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method POST \t-> Valid DATA", async () => {
      const res = await supertest(app)
        .post(userRoute + "/register")
        .send({
          lastname: "jean",
          firstname: "jean",
          email: "test@test.fr",
          password: "jesuisunmotdepasse",
          role: Role.AUTHOR,
        })
        .expect(201)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);

      expect(data.email).toBe("test@test.fr");

      let user = await User.findOne({
        email: data.email,
      });
      userTest = user;
    });

    test("Method POST \t-> Email already exist", async () => {
      const res = await supertest(app)
        .post(userRoute + "/register")
        .send({
          lastname: "jean",
          firstname: "jean",
          email: "test@test.fr",
          password: "test2",
        })
        .expect(400)
        .expect("Content-Type", /json/);
    });

    test.each([
      { lastname: 23, firstname: 47, email: 123, password: 1 },
      {
        lastname: "jean",
        firstname: "jean",
        email: "A1Z2E3R4@A1Z2E3R4.fr",
        password: "1",
      },
      { email: "A1Z2E3R4@A1Z2E3R4.fr" },
      { lastname: "jean" },
      { firstname: "jean" },
      { password: "fauxpassword" },
      {},
    ])(
      "Method POST \t-> Invalid DATA : Should refuse %p. ",
      async (invalidObject) => {
        const result = await supertest(app)
          .post(userRoute + "/register")
          .send(invalidObject)
          .expect(400);
      }
    );
  });

  describe(`Route ${userRoute}/login`, () => {
    test("Method GET \t-> Undefined method", async () => {
      const res = await supertest(app)
        .get(userRoute + "/login")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method PUT \t-> Undefined method", async () => {
      const res = await supertest(app)
        .put(userRoute + "/login")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method DELETE \t-> Undefined method", async () => {
      const res = await supertest(app)
        .delete(userRoute + "/login")
        .expect(404)
        .expect("Content-Type", /html/);
    });

    test("Method POST \t-> Valid DATA", async () => {
      const res = await supertest(app)
        .post(userRoute + "/login")
        .send({
          email: "test@test.fr",
          password: "jesuisunmotdepasse",
        })
        .expect(200)
        .expect("Content-Type", /json/);

      const data = JSON.parse(res.text);

      expect(data.token);
      expect(data.email).toBe("test@test.fr");
    });

    test.each([
      { email: "fauxmail@test.fr", password: "test" },
      { email: "test@test.fr", password: "fauxMotDePasse" },
      { email: "test@test.fr" },
      { password: "fauxMotDePasse" },
      {},
    ])(
      "Method POST \t-> Invalid DATA : Should refuse %p. Invalid DATA",
      async (invalidObject) => {
        const result = await supertest(app)
          .post(userRoute + "/login")
          .send(invalidObject)
          .expect(400);
      }
    );
  });
});
