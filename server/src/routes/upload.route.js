import express from "express";
import multer from "multer";
import processDocs from "../services/doc.processor.js";
import authAdmin from "../middlewares/auth.midware.js";
import { createDoc, updateDoc, getDocs, deleteDoc } from "../config/db.docs.js";

const router = express.Router();
const storage = multer.memoryStorage();

// File filter to accept only supported file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.txt', '.md'];
  const fileExt = file.originalname.slice((file.originalname.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  
  if (allowedTypes.includes(`.${fileExt}`)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: .${fileExt}. Supported types: .pdf, .txt, .md`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter
});

router.get("/documents", authAdmin, (req, res) => {
  try {
    const documents = getDocs();
    res.status(200).json({ status: "success", documents });
  } catch (e) {
    console.error("List documents failed:", e);
    res.status(500).json({ status: "failure", message: "Failed to list documents." });
  }
});

router.delete("/documents/:id", authAdmin, (req, res) => {
  try {
    const fileID = parseInt(req.params.id, 10);
    if (isNaN(fileID)) {
      return res.status(400).json({ status: "failure", message: "Invalid document id." });
    }
    const changes = deleteDoc(fileID);
    if (changes === 0) {
      return res.status(404).json({ status: "failure", message: "Document not found." });
    }
    res.status(200).json({ status: "success", message: "Document deleted." });
  } catch (e) {
    console.error("Delete document failed:", e);
    res.status(500).json({ status: "failure", message: "Failed to delete document." });
  }
});

router.post("/upload", authAdmin, upload.single("file"), async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({
                status:"failure",
                message:"No file uploaded. Supported types: .pdf, .txt, .md",
            })
        };
         const fileName=req.file.originalname;
        //create DB record
        const fileId=createDoc({
            filename:fileName,
            uploader_id:req.user?.id||null
        });
       
        //pass to document processor
        const result=await processDocs(
            req.file.buffer,
            fileName,
            `file_${Date.now()}`
        );
        
        //change status to done
        updateDoc(fileId,{status:"done",content:result.snippet||""});

        res.status(200).json({
            message:"File processed successfully.",
            fileId,
            status:"done",
            vec_in_chroma:result.vec_in_chroma,
            num_chunks:result.num_chunks
        });
    }catch(e){
        console.log("Upload route failed: ",e);
        res.status(500).json({
            status:"failure",
            message:e.message || "Something went wrong when uploading document"
        })
    }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: "failure",
        message: "File too large. Maximum size is 15MB."
      });
    }
  }
  if (error.message && error.message.includes('Unsupported file type')) {
    return res.status(400).json({
      status: "failure",
      message: error.message
    });
  }
  next(error);
});

export default router;
