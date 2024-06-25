import { postgresql } from "@hypermode/functions-as";

// The name of the PostgreSQL host, as specified in the hypermode.json manifest
const host = "neon";

class Person {
  id: i32 = 0;
  name!: string;
  age!: i32;
  home!: postgresql.Point;
}

export function queryPeople(): Person[] {
  const query = "select name, age, home from people";
  const response = postgresql.query<Person>(host, query);
  return response.rows;
}

export function getPerson(name: string): Person | null {
  const query = "select age, home from people where name = $1";

  const params: postgresql.Params = new postgresql.Params();
  params.push(name);

  const response = postgresql.query<Person>(host, query, params);
  return response.rows[0];
}

export function addPerson(name: string, age: i32, lat: f64, lon: f64): Person {
  const query = `
    insert into people (name, age, home)
    values ($1, $2, $3) RETURNING id`;

  const params: postgresql.Params = new postgresql.Params();
  params.push(name);
  params.push(age);
  params.push(new postgresql.Point(lat, lon));

  const response = postgresql.query<i32[]>(host, query, params);

  if (response.rowsAffected !== 1) {
    throw new Error("Failed to insert person.");
  }

  const id = response.rows[0][0];
  return <Person>{ id, name, age, home: new postgresql.Point(lat, lon) };
}
