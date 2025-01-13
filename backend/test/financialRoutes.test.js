const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index"); 
const { expect } = chai;

chai.use(chaiHttp);

describe("Financial Routes", () => {
  it("should fetch all budgets", (done) => {
    chai.request(app)
      .get("/api/financial/budgets")
      .set("Authorization", "Bearer <valid-token>")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should add a new budget", (done) => {
    const budget = { name: "Food", amount: 500 };

    chai.request(app)
      .post("/api/financial/budgets")
      .set("Authorization", "Bearer <valid-token>")
      .send(budget)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id");
        done();
      });
  });
});
