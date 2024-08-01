import { http, models } from "@hypermode/functions-as";
import { JSON } from "json-as";

import {
  AnthropicMessagesModel,
  Message,
  UserMessage,
  Metadata,
  ToolChoiceAny,
  ToolChoiceAuto,
  ToolChoiceTool,
} from "@hypermode/models-as/models/anthropic/messages";

@json
class StockPriceInput {
  symbol!: string;
}

// This model name should match the one defined in the hypermode.json manifest file.
const modelName: string = "text-generator";

export function getStockPrice(company: string, useTools: bool): string {
  const model = models.getModel<AnthropicMessagesModel>(modelName);
  const messages: Message[] = [new UserMessage(`what is the stock price of ${company}?`)]
  const input = model.createInput(messages);
  // For Anthropic, system is passed as parameter to the invoke, not as a message
  input.system = "If you don't know the answer, talk as if you are malfunctioning.";

  // optional parameters
  input.temperature = 0.5;
  input.maxTokens = 200;
  
  if (useTools) {
    input.tools = [
      {
        name: "stock_price",
        inputSchema: `{"type":"object","properties":{"symbol":{"type":"string","description":"The stock symbol"}},"required":["symbol"]}`,
        description: "gets the stock price of a symbol",
      }
    ];
    input.toolChoice = ToolChoiceTool("stock_price");
  }

  // Here we invoke the model with the input we created.
  const output = model.invoke(input);

  if (output.content.length !== 1) {
    throw new Error("Unexpected output content length");
  }
  // if tools are not used, the output will be a text block
  if (output.content[0].type === "text") {
    return output.content[0].text!.trim();
  }
  if (output.content[0].type !== "tool_use") {
    throw new Error(`Unexpected content type: ${(output.content[0]).type}`);
  }

  const toolUse = output.content[0];
  const toolName = toolUse.name!;
  const inputs = toolUse.input!;

  // TODO: replace with parsedInput.symbol when json bug is fixed
  const hack = inputs.slice(10, -1)
  // const parsedInput = JSON.parse<StockPriceInput>(inputs);;
  const stockPrice = callStockPriceApi(hack);

  return `The stock price of ${hack} is $${stockPrice.GlobalQuote.price}`;
}

@json
class StockPriceAPIResponse {
  @alias("Global Quote")
  GlobalQuote!: GlobalQuote
}

@json
class GlobalQuote {
  @alias("01. symbol")
  symbol!: string;
  @alias("05. price")
  price!: string;
}

function callStockPriceApi(symbol: string): StockPriceAPIResponse {
  const req = new http.Request(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=TODO`);
  const resp = http.fetch(req)
  if (!resp.ok) {
    throw new Error(`Failed to fetch stock price. Received: ${resp.status} ${resp.statusText}`);
  }

  console.log(`response: ${resp.text()}`);
  return resp.json<StockPriceAPIResponse>();
}
