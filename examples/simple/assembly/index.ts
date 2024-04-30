import { Person } from "./person";

// This function adds two 32-bit signed integers together, and returns the result.
export function add(a: i32, b: i32): i32 {
  return a + b;
}

// This function takes a first name and a last name, and concatenates them to returns a full name.
export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// This function makes a list of people, and returns it.
export function getPeople(): Person[] {
  return [
    new Person("Bob", "Smith"),
    new Person("Alice", "Jones"),
    new Person("Charlie", "Brown"),
  ];
}

// This function returns a random person from the list of people.
export function getRandomPerson(): Person {
  const people = getPeople();
  const index = <i32>Math.floor(Math.random() * people.length);
  const person = people[index];
  return person;
}
