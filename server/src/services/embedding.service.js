import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// configure the .env path since it's not in this folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
//create AI
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
async function generateEmbeddings(chunks){
    try{
        const response = await genai.models.embedContent({
            model:"gemini-embedding-001",
            contents: chunks.map(text => ({
                parts: [{ text }]
                 })),
        config: { outputDimensionality: 768 }
        });

        if (response && response.embeddings) {
            return response.embeddings.map(e => e.values);
        };
        console.error("API returned success but no embeddings found in response.");
        return [];
    }catch(e){
        console.error("Embedding error: ",e.message);
        return [];
    }
}
export default generateEmbeddings;