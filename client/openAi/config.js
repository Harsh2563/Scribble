import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export async function analyze(input) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
    stream: true,
  });

  let output = "";
  for await (const chunk of stream) {
    output += chunk.choices[0]?.delta?.content || "";
  }

  return output;
}

analyze().then(console.log);