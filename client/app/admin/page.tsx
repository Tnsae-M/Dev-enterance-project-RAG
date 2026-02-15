"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { getApiBase } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


type DocRow = {
  fileID: number;
  filename: string;
  uploader_id: number | null;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchDocuments() {
    const apiBase = getApiBase();
    try {
      const res = await fetch(`${apiBase}/api/file/documents`, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 0) {
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "Server is down. Please try again later.",
          });
        }
        setDocuments([]);
        return;
      }
      const data = await res.json();
      setDocuments(data.documents ?? []);
    } catch {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Server is down. Please try again later.",
      });
      setDocuments([]);
    } finally {
      setFetchLoading(false);
    }
  }


  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "admin") {
      router.replace("/");
      return;
    }
    fetchDocuments();
  }, [loading, user, router]);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = fileInputRef.current;
    if (!input?.files?.length || uploading) return;
    setUploadError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", input.files[0]);
    try {
      const res = await fetch(`${getApiBase()}/api/file/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "done") {
        fetchDocuments();
        input.value = "";
      } else {
        setUploadError(data.message ?? "Upload failed.");
      }
    } catch {
      setUploadError("Server is down. Please try again later.");
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "Server is down. Please try again later.",
      });
    } finally {

      setUploading(false);
    }
  }

  async function handleDelete(fileID: number) {
    if (deletingId != null) return;
    setDeletingId(fileID);
    try {
      const res = await fetch(`${getApiBase()}/api/file/documents/${fileID}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.status === "success") {
        setDocuments((prev) => prev.filter((d) => d.fileID !== fileID));
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (loading || (!user || user.role !== "admin")) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/chat" className="inline-flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Back to Chat
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="inline-flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>

          </div>
        </div>

        {/* Upload area */}
        <div className="rounded-xl border border-border/60 bg-card p-6 mb-6">
          <h2 className="text-lg font-medium text-foreground mb-3">Upload document</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a PDF to add it to the RAG pipeline. Max 15MB.
          </p>
          <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:text-sm"
            />
            <Button type="submit" disabled={uploading} className="inline-flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {uploading ? "Uploading…" : "Upload"}
            </Button>

          </form>
          {uploadError && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {uploadError}
            </p>
          )}
        </div>

        {/* Documents table */}
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <h2 className="text-lg font-medium text-foreground p-4 border-b border-border/40">Stored documents</h2>
          {fetchLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading documents…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No documents yet. Upload a PDF above.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((d) => (
                    <TableRow key={d.fileID}>
                      <TableCell>{d.fileID}</TableCell>
                      <TableCell className="font-medium">{d.filename}</TableCell>
                      <TableCell>{d.status}</TableCell>
                      <TableCell>{d.created_at ? new Date(d.created_at).toLocaleString() : "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(d.fileID)}
                          disabled={deletingId === d.fileID}
                          aria-label={`Delete ${d.filename}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>

                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </main>
  );
}
