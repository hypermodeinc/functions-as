import { dql } from "..";
import { DQLResponse } from "../types/dqltypes";

describe("DQL Host Functions", () => {
  it("can query DQL", () => {
    const response = dql.query<string>("ping", "pong");
    const expected = new DQLResponse<string>();
    expected.data = "pong";
    expect(response).toStrictEqual(expected);
  });
});
