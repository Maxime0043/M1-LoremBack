const app = require("../app");
const supertest = require("supertest");

describe("Group API", () => {
  test("POST /api/v1/group", async () => {
    const response = await supertest(app)
      .post("/api/v1/group")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(response.body).toMatchObject({
      message: "Example POST /api/v1/group",
    });
  });
});
