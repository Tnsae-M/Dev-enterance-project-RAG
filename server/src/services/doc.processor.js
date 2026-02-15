import createChunk from "./chunk.service.js";
import { createRequire } from "module";
import generateEmbedding from "./embedding.service.js";
import  vectorService  from "./vector.service.js";
const require=createRequire(import.meta.url);
const pdf=require("pdf-parse");


function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}

async function processDocs(fileBuffer,fileName,fileID){
    try{
        console.log(`Processing document: ${fileName}`);
        
        const fileExt = getFileExtension(fileName);
        let rawText;
        
        // Handle different file types
        if (fileExt === 'txt' || fileExt === 'md') {
            // Read text files directly as string
            rawText = fileBuffer.toString('utf-8');
        } else if (fileExt === 'pdf') {
            // Parse PDF files
            const data = await pdf(fileBuffer);
            rawText = data.text;
        } else {
            throw new Error(`Unsupported file type: .${fileExt}. Supported types: .pdf, .txt, .md`);
        }
        
        if(!rawText||rawText.trim().length<10){
            throw new Error("Document is empty or contains insufficient text.")
        };

        //chunking phase
        const chunks=await createChunk(rawText);
        console.log(`${chunks.length} chunks created!`);
        //embedding phase
        const vectors=await generateEmbedding(chunks);
        console.log(`${vectors.length} embeddings generated!`);
        //store in vector DB
        const storedIds=await vectorService.addDocs(fileID,chunks,vectors);
        console.log(`${fileName} processed and indexed successfully!`);
        return {
            success:true,
            ID:fileID,
            file:fileName,
            vec_in_chroma:storedIds.length,
            num_chunks:chunks.length,
            snippet:chunks.slice(0,2).join("\n")
        };
    }catch(e){
        console.error(`Error processing document ${fileID}: `,e);
        throw new Error(e.message || "Document processing failed");
    }


};
export default processDocs;
