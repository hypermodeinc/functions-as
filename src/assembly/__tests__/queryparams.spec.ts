import { QueryVariables } from "..";

describe("Query Variables Object", () => {
  it("can serialize", () => {
    const vars = new QueryVariables();
    vars.set("key1", "abc");
    vars.set("key2", 123);
    vars.set("key3", true);
    vars.set("key4", [123, 456, 789]);
    vars.set("key5", [1.234, 2.345, 3.456]);

    const result = vars.toJSON();

    const expected = `{"key1":"abc","key2":123,"key3":true,"key4":[123,456,789],"key5":[1.234,2.345,3.456]}`;

    expect(result).toBe(expected);
  });
});