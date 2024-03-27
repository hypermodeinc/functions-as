import { QueryParameters } from "..";

describe("Query Parameters Object", () => {
  it("can serialize", () => {
    const params = new QueryParameters();
    params.set("key1", "abc");
    params.set("key2", 123);
    params.set("key3", true);
    params.set("key4", [123, 456, 789]);
    params.set("key5", [1.234, 2.345, 3.456]);

    const result = params.toJSON();

    const expected = `{"key1":"abc","key2":123,"key3":true,"key4":[123,456,789],"key5":[1.234,2.345,3.456]}`;

    expect(result).toBe(expected);
  });
});
