import express from "express";
import { handleChatRequest } from "../utils/llm.service.js";

const router=express.Router();
router.post('/chat',async (req,res)=>{
    const {message,history}=req.body;
    // Basic Validation
    if (!message) {
        return res.status(400).json({
             error: "Message is required"
             });
    }
    try {
        //Call the RAG Pipeline
        const stream = await handleChatRequest(message, history);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

    if (!stream) {
        return res.status(500).json({ error: "No stream available" });
    }
        // Iterate through the stream and write to the response object
        for await (const chunk of stream) {
            const chunkText =typeof chunk.text==="function"
            ?chunk.text():(chunk.text||chunk.candidates?.[0]
                ?.content?.parts?.[0]?.text||"");
            if(chunkText){
                res.write(chunkText);
            }
        }

        // Signal the end of the stream
        res.end();

    } catch (error) {
        console.error("Chat Route Error:", error);
        
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to process chat request" });
        } else {
            res.write("\n[Error: Connection lost or AI failed to complete response]");
            res.end();
        }
    }
});

export default router;