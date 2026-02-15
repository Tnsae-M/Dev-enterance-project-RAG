import {getEncoding} from "js-tiktoken";
//function to create a chunk
const encoder= getEncoding("cl100k_base");
const default_chunk_size= 500;
const default_overlap_size= 100;
async function createChunk(
    content,
    chunk_size= default_chunk_size,
    overlap_size= default_overlap_size
){
    if(!content|| typeof content !== "string"){
            throw new Error("Invaild text input for chunking!");
    };
    //clean the content before encoding
    const cleanedContent = content
        .replace(/\s+/g, ' ')
        .trim();
    const tokens=encoder.encode(cleanedContent);
    const chunks=[];
    const step= chunk_size - overlap_size;
    if(step <= 0){
        throw new Error("Chunk size must be greater than overlap size!");
    };
    let start=0;
    while(start<tokens.length){
        const end= Math.min(start+chunk_size, tokens.length);
        const chunk_tokens= tokens.slice(start,end);
        const chunk_text= encoder.decode(chunk_tokens);
        chunks.push(chunk_text.trim());
        start+= step;
    };
        return chunks;
};
export default createChunk;