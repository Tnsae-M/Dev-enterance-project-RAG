import { ChromaClient } from "chromadb";

const client = new ChromaClient({ path: "http://localhost:8000" });

async function reset() {
    try {
        // This deletes the specific collection and all its data
        await client.deleteCollection({ name: "website_knowledge_base" });
        console.log("Collection 'website_knowledge_base' deleted successfully.");
    } catch (error) {
        console.error("Error deleting collection (it might not exist):", error.message);
    }
}

reset();