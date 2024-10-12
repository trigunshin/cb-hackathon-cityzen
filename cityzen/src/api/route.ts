export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const prompt = [
      {
        role: "system",
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        `,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        ...prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });
    // Convert the response into a friendly text-stream
    return response.toDataStreamResponse();
  } catch (e) {
    throw e;
  }
}
