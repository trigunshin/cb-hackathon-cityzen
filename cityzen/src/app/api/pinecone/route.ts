import * as dotenv from "dotenv";
dotenv.config();
//@ts-ignore
import { PineconeClient } from "@pinecone-database/pinecone";
import { NextApiRequest, NextApiResponse } from "next";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAIApi from "openai";
import { MetadataMode, NodeWithScore } from "llamaindex";
const { PINECONE_API_KEY, OPENAI_API_KEY } = process.env;

export async function POST(request: Request) {
    console.log("here")
  try {
    const { input } = await request.json()
    //init pinecone client
    const client = new PineconeClient();
    await client.init({
      apiKey: PINECONE_API_KEY,
      environment: "us-east-1",
    });

    const index = client.Index("cityzen-text-embedding-3-large");

    // Query the index
    const queryEngine = index.asQueryEngine();
    const { response, sourceNodes } = await queryEngine.query({
      query: input,
    });

    // Output response with sources
    console.log(response);
    if (sourceNodes) {
        sourceNodes.forEach((source: NodeWithScore, index: number) => {
          console.log(
            `\n${index}: Score: ${source.score} - ${source.node
              .getContent(MetadataMode.NONE)
              .substring(0, 50)}...\n`
          );
        });
      }
      return new Response(JSON.stringify({ response, sourceNodes }), {
        headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}