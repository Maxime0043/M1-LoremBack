const app = require("../app");
const supertest = require("supertest");

describe("Request API", () => {
  test("POST /api/v1/request", async () => {
    const response = await supertest(app)
      .post("/api/v1/request")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toMatchObject({
      message: "Example POST /api/v1/request",
    });
  });
});
