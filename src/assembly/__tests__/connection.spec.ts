import { connection } from "..";
import { GQLResponse } from "../types/gqltypes";
import { DQLResponse } from "../types/dqltypes";

describe("GraphQL Host Functions", () => {
  it("can execute GraphQL", () => {
    const response = connection.invokeGraphqlApi<string>("host", "ping");
    const expected = new GQLResponse<string>();
    expected.data = "pong";
    expect(response).toStrictEqual(expected);
  });
});

describe("DQL Host Functions", () => {
  it("can query DQL", () => {
    const response = connection.invokeDgraphDqlQuery<string>("host", "ping");
    const expected = new DQLResponse<string>();
    expected.data = "pong";
    expect(response).toStrictEqual(expected);
  });
});
