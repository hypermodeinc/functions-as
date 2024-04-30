// For now, this import is required when we use @json, even if we're not calling
// methods on the JSON class.  It will be fixed in the future.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSON } from "json-as";

// The Product class and the sample product will be used in the some of the examples.
// Note that the class must be decorated with @json so that it can be serialized
// and deserialized properly when interacting with OpenAI.
@json
export class Product {
  id: string | null = null;
  name: string = "";
  price: f64 = 0.0;
  description: string = "";
}

export const sampleProduct = <Product>{
  id: "123",
  name: "Shoes",
  price: 50.0,
  description: "Great shoes for walking.",
};
