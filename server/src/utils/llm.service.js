import { GoogleGenAI } from "@google/genai";
import generateEmbeddings from "../services/embedding.service.js";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// configure the .env path since it's not in this folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const genAi=new GoogleGenAI({
apiKey:process.env.GEMINI_API_KEY
});
const chromaClient=new ChromaClient({
    path:"http://localhost:8000"
});

 function formatHistory(history){
    if (!Array.isArray(history)) return [];
    return history.map((msg) => {
      let validParts = [];
            
            if (typeof msg.parts === 'string') {
                validParts = [{ text: msg.parts }];
            } else if (Array.isArray(msg.parts)) {
                validParts = msg.parts.map(p => {
                    if (typeof p === 'string') return { text: p };
                    if (p && p.text) return { text: p.text };
                    return null;
                }).filter(Boolean);
            } else if (msg.text) { 
                validParts = [{ text: msg.text }];
            }
            if (validParts.length === 0) return null;

            // 2. Handle "role". strictly 'user' or 'model'.
            const validRole = (msg.role === 'model' || msg.role === 'assistant') ? 'model' : 'user';

            return {
                role: validRole,
                parts: validParts
            };
    }).filter(item=>item !== null);
};
export const handleChatRequest = async (message, incomingHistory = []) => {
    try {
        // 1. Vectorize the User Question 
        const queryVectors = await generateEmbeddings([message]);
        const queryVector = queryVectors[0];

        // 2. Search ChromaDB
        const collection = await chromaClient.
        getOrCreateCollection({ 
            name: "website_knowledge_base",
            embeddingFunction:null,
            metadata:{"hnsw:space":"cosine"}
        });
        
        const searchResults = await collection.query({
            queryEmbeddings: [queryVector],
            nResults: 3, // Retrieve top relevant results
        });
        // Flatten the retrieved documents
        const context = searchResults.documents[0]?.join("\n\n")||"No context found";
        const validHistory=formatHistory(incomingHistory);
        // 4. Create the System Instruction
        const systemPrompt = `
            You are DevArcAi,a system design and architecture assistant.
            If the answer isn't in the context, say "I'm sorry, I don't have information on that, but I'd be happy to help with other site-related questions."
            
            CONTEXT:
            ${context}
        `;
       const result = await genAi.models.generateContentStream({
            model: "gemini-2.5-flash-lite", 
            config: {
                // Moving context here is cleaner
                systemInstruction: { parts: [{ text: systemPrompt }] }, 
            },
            contents: [
                ...validHistory,
                { role: "user", parts: [{ text: message }] }
            ]
        });
        if (!result) {
                throw new Error("Gemini API failed to return a valid response object.");
            }
        console.log("stream initialized successfully in stream");
        return result;

    } catch (error) {
        console.error("LLM service error:", error);
        throw error;
    }
};