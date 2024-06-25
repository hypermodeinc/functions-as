import { postgresql } from "@hypermode/functions-as";

// The name of the PostgreSQL host, as specified in the hypermode.json manifest
const host = "neon";

class Person {
  id: i32 = 0;
  name!: string;
  age!: i32;
  home!: postgresql.Point;
}

export function getAllPeople(): Person[] {
  const query = "select * from people";
  const response = postgresql.query<Person>(host, query);
  return response.rows;
}

export function getPeopleByName(name: string): Person[] {
  const query = "select * from people where name = $1";

  const params = new postgresql.Params();
  params.push(name);

  const response = postgresql.query<Person>(host, query, params);
  return response.rows;
}

export function getPerson(id: i32): Person | null {
  const query = "select * from people where id = $1";

  const params = new postgresql.Params();
  params.push(id);

  const response = postgresql.query<Person>(host, query, params);
  return response.rows.length > 0 ? response.rows[0] : null;
}

export function addPerson(name: string, age: i32, lat: f64, lon: f64): Person {
  const query = `
    insert into people (name, age, home)
    values ($1, $2, $3) RETURNING id`;

  const params = new postgresql.Params();
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
