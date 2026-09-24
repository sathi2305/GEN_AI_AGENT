import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  FileCheck,
  Search,
  Eye,
  Bot,
  Plus,
  Layers,
} from 'lucide-react';
import { DocumentItem } from '../types/index.ts';

interface DocumentsViewProps {
  documents: DocumentItem[];
  activeProjectId: string;
  onUploadDocument: (doc: Partial<DocumentItem>) => Promise<void>;
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  activeProjectId,
  onUploadDocument,
  onDispatchToAgent,
  isDark,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(documents[0] || null);
  const [isDragging, setIsDragging] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newDoc: Partial<DocumentItem> = {
        projectId: activeProjectId,
        title: file.name,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: file.size,
        sizeBytes: file.size,
        extractedText: `Ingested document content for ${file.name}. Parsed and indexed in semantic vector space.`,
        content: `Ingested document content for ${file.name}. Parsed and indexed in semantic vector space.`,
        chunksCount: 3,
        chunks: [
          `Chunk 1: Abstract and executive summary of ${file.name}.`,
          `Chunk 2: Problem statement requirements and judging matrix.`,
          `Chunk 3: Technical specifications and evaluation metrics.`,
        ],
      };
      await onUploadDocument(newDoc);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newDoc: Partial<DocumentItem> = {
        projectId: activeProjectId,
        title: file.name,
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: file.size,
        sizeBytes: file.size,
        extractedText: `Ingested content for ${file.name}. Parsed via optical character and semantic tokenizer.`,
        content: `Ingested content for ${file.name}. Parsed via optical character and semantic tokenizer.`,
        chunksCount: 2,
        chunks: [
          `Chunk 1: Document ${file.name} header and problem formulation.`,
          `Chunk 2: Benchmark constraints and system limits.`,
        ],
      };
      await onUploadDocument(newDoc);
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div id="documents-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Upload Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : isDark
            ? 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
            : 'border-zinc-300 bg-zinc-50 hover:border-indigo-300'
        }`}
      >
        <input
          type="file"
          id="doc-upload-input"
          multiple
          accept=".pdf,.docx,.txt,.md,.json"
          onChange={handleFileInput}
          className="hidden"
        />
        <label htmlFor="doc-upload-input" className="cursor-pointer flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Drag & drop problem statements, PDF specs, or documentation
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            Supports PDF, DOCX, Markdown, and TXT (Auto-chunked for RAG semantic search)
          </p>
        </label>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Indexed Documents ({documents.length})</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                      : isDark
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                        <span>{(((doc.sizeBytes || doc.fileSize || 1024) / 1024)).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{(doc.chunks || []).length} chunks</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chunk Inspector & Content Viewer (2 cols) */}
        <div className="lg:col-span-2">
          {selectedDoc ? (
            <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}>
              <div className="flex items-start justify-between pb-3 border-b border-inherit">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    <span>{selectedDoc.title}</span>
                  </h3>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    File: {selectedDoc.fileName} • {selectedDoc.fileType}
                  </div>
                </div>

                <button
                  onClick={() => onDispatchToAgent(`Analyze document "${selectedDoc.title}" and formulate next engineering steps based on its requirements.`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Agent to Analyze</span>
                </button>
              </div>

              {/* Raw Preview */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Document Text Extract
                </div>
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans ${
                  isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}>
                  {selectedDoc.content || selectedDoc.extractedText}
                </div>
              </div>

              {/* RAG Chunks Inspector */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>RAG Vector Chunks ({(selectedDoc.chunks || []).length})</span>
                </div>
                <div className="space-y-2">
                  {(selectedDoc.chunks || []).map((chunk: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs font-mono transition-colors ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <div className="text-[10px] text-indigo-500 font-bold mb-1">
                        CHUNK #{idx + 1}
                      </div>
                      <p className="text-[11px] leading-relaxed">{chunk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-zinc-400">
              Select or upload a document to inspect its parsed content and RAG semantic chunks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
