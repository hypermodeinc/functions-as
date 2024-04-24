import { connection } from "..";
import { GQLResponse } from "../types/gqltypes";

describe("GraphQL Host Functions", () => {
  it("can execute GraphQL", () => {
    const response = connection.invokeGraphqlApi<string>("host", "ping");
    const expected = new GQLResponse<string>();
    expected.data = "pong";
    expect(response).toStrictEqual(expected);
  });
});
