import {ChromaClient} from 'chromadb';

// Initialize ChromaDB client
const chromaClient = new ChromaClient({path:"http://localhost:8000"});

const vectorService={
    async addDocs(fileID,chunks,vectors){ {
        try{
        // Create a collection if it doesn't exist
        const collection=await chromaClient.getOrCreateCollection(
            {name:"website_knowledge_base",
            embeddingFunction:null,
            metadata:{"hnsw:space":"cosine"}
        });
   
    // Prepare metadata and IDs
    const ids=chunks.map((_,index)=>`${fileID}_chunk_${index}`);
    // metadata helps to manage specific docs later
    const metadatas=chunks.map(()=>({fileID:fileID}));
    // add the chunks and embeddings to chromaDB
await collection.add({
    ids:ids,
    embeddings:vectors,
    metadatas:metadatas,
    documents:chunks
});
    return ids;
    }catch(er){
        console.error("ChromaDB error: ",er);
        throw new Error("failed to store vectors in chromaDB");
    }
}
}};
export default vectorService;