const app = require("../app");
const supertest = require("supertest");

describe("Article API", () => {
  test("POST /api/v1/article", async () => {
    const response = await supertest(app)
      .post("/api/v1/article")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toMatchObject({
      message: "Example POST /api/v1/article",
    });
  });
});
