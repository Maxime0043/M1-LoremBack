const app = require("../app");
const supertest = require("supertest");

describe("Post API", () => {
  test("POST /api/v1/post", async () => {
    const response = await supertest(app)
      .post("/api/v1/post")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toMatchObject({
      message: "Example POST /api/v1/post",
    });
  });
});
