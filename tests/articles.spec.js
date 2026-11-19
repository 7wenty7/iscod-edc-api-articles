const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  let token;
  const USER_ID = "6390e1d1b2a4c3a1f0e4d111";
  const ARTICLE_ID = "6390e1d1b2a4c3a1f0e4d222";
  const MOCK_ARTICLE = { _id: ARTICLE_ID, title: "Mon article", status: "draft", user: USER_ID };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn({ _id: USER_ID, role: "admin" }, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn({ ...MOCK_ARTICLE, status: "published" }, "findOneAndUpdate");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send({ title: "Mon article" })
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.user).toBe(USER_ID);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put("/api/articles/" + ARTICLE_ID)
      .send({ status: "published" })
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("published");
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete("/api/articles/" + ARTICLE_ID)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });
});
