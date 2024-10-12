import * as dotenv from "dotenv";
dotenv.config();
import { NextApiRequest, NextApiResponse } from "next";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAIApi from "openai";
import { Metadata } from "llamaindex";
const { PINECONE_API_KEY, OPENAI_API_KEY } = process.env;

export default async function requestHandler(
  request: NextApiRequest,
  response: NextApiResponse
) {}

async function queryPinecone(queryText: any) {
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY environment variable is not set.");
  }
  const pinecone = new Pinecone();
  const openai = new OpenAIApi({ apiKey: OPENAI_API_KEY });
  // Generate query embedding
  const response = await openai.createEmbedding({
    model: "text-embedding-3-large",
    input: queryText,
  });
  const queryEmbedding = response.data.data[0].embedding;

  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY environment variable is not set.");
  }

  // Query Pinecone
  try {
    //get index
    const index = pinecone.Index<Metadata>("cityzen-text-embedding-3-large");
    //get namespace
    const pineconeNamespace = index.namespace("cityzen-text-embedding-3-large");

    // Query the index with the defined request
    const queryResult = await pineconeNamespace.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (e) {
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
}
