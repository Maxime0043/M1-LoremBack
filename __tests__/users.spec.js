const app = require("../app");
const supertest = require("supertest");

describe("User API", () => {
  test("POST /api/v1/user", async () => {
    const response = await supertest(app)
      .post("/api/v1/user")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toMatchObject({
      message: "Example POST /api/v1/user",
    });
  });
});
