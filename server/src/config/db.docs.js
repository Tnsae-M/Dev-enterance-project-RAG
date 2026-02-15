import DB from "./db.js";

export function createDoc({ filename, uploader_id, content = "" }) {
  const stmt = DB.prepare(`
    INSERT INTO documents (filename, uploader_id, content)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(filename, uploader_id, content);
  return info.lastInsertRowid;
}

export function updateDoc(fileID, { status, content = "" }) {
  const stmt = DB.prepare(`
    UPDATE documents
    SET status = ?, content = ?
    WHERE fileID = ?
  `);
  stmt.run(status, content, fileID);
}

export function getDocs() {
  return DB.prepare(
    "SELECT fileID, filename, uploader_id, status, created_at FROM documents ORDER BY fileID DESC"
  ).all();
}

export function deleteDoc(fileID) {
  const result = DB.prepare("DELETE FROM documents WHERE fileID = ?").run(fileID);
  return result.changes;
}

