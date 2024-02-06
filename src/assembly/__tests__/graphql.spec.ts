import { graphql } from "..";
import { GQLResponse } from "../gqltypes";

describe("GraphQL Host Functions", () => {
  it("can execute GraphQL", () => {
    const response = graphql.execute<string>("ping");
    const expected = new GQLResponse<string>();
    expected.data = "pong";
    expect(response).toStrictEqual(expected);
  });
});
