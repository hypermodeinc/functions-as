import { expect, it, run } from "as-test";
import { graphql } from "..";

it("can serialize", () => {
  const vars = new graphql.Variables();
  vars.set("key1", "abc");
  vars.set("key2", 123);
  vars.set("key3", true);
  vars.set("key4", [123, 456, 789]);
  vars.set("key5", [1.234, 2.345, 3.456]);
  vars.set("key6", <Foo>{ a: 1, b: 2, c: 3 });

  const result = vars.toJSON();

  const expected = `{"key1":"abc","key2":123,"key3":true,"key4":[123,456,789],"key5":[1.234,2.345,3.456],"key6":{"a":1,"b":2,"c":3}}`;

  expect(result).toBe(expected);
});


@json
class Foo {
  a!: i32;
  b!: i32;
  c!: i32;
}

run();
