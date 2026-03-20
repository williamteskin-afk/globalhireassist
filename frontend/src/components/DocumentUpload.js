import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileText, Image, X, Download, Loader2, CheckCircle, File } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FILE_ICONS = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/jpg': Image,
  'image/png': Image,
  'image/webp': Image,
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DocumentUpload({ applicationId, onDocumentsChange }) {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    if (!applicationId) return;
    try {
      const res = await fetch(`${API}/applications/${applicationId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
        onDocumentsChange?.(data);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, [applicationId, onDocumentsChange]);

  useState(() => { if (applicationId) loadDocuments(); }, [applicationId]);

  const uploadFile = async (file) => {
    if (!applicationId) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await fetch(`${API}/applications/${applicationId}/documents`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        const doc = await res.json();
        setDocuments(prev => [doc, ...prev]);
        onDocumentsChange?.([...documents, doc]);
        toast.success(`${file.name} uploaded successfully`);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 10MB.`);
        return;
      }
      uploadFile(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const removeDocument = async (docId) => {
    try {
      await fetch(`${API}/documents/${docId}`, { method: 'DELETE', credentials: 'include' });
      setDocuments(prev => prev.filter(d => d.id !== docId));
      toast.success('Document removed');
    } catch {
      toast.error('Failed to remove document');
    }
  };

  return (
    <div className="space-y-4" data-testid="document-upload-section">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        data-testid="document-dropzone"
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-gold bg-gold/5 scale-[1.01]'
            : 'border-slate-200 hover:border-gold/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp"
          onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
          data-testid="document-file-input"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-gold animate-spin" />
            <p className="text-sm font-semibold text-navy font-sans">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-navy/5 flex items-center justify-center">
              <Upload className="h-6 w-6 text-navy" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy font-sans">
                {dragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
              </p>
              <p className="text-xs text-slate-400 font-sans mt-1">
                PDF, JPG, PNG, DOC, DOCX up to 10MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-navy font-sans flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </p>
          <div className="space-y-2">
            {documents.map(doc => {
              const Icon = FILE_ICONS[doc.content_type] || File;
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white group hover:border-slate-200 transition-colors"
                  data-testid={`document-${doc.id}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy font-sans truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-400 font-sans">{formatSize(doc.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={`${API}/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-navy" data-testid={`download-doc-${doc.id}`}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-500" onClick={() => removeDocument(doc.id)} data-testid={`remove-doc-${doc.id}`}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for viewing documents (admin/dashboard)
export function DocumentList({ applicationId, showDelete = false }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    if (!applicationId) return;
    fetch(`${API}/applications/${applicationId}/documents`)
      .then(r => r.ok ? r.json() : [])
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (loading) return <p className="text-sm text-slate-400 font-sans">Loading documents...</p>;
  if (documents.length === 0) return <p className="text-sm text-slate-400 font-sans">No documents uploaded</p>;

  return (
    <div className="space-y-2" data-testid="document-list">
      {documents.map(doc => {
        const Icon = FILE_ICONS[doc.content_type] || File;
        return (
          <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50">
            <Icon className="h-4 w-4 text-navy shrink-0" />
            <span className="text-sm font-sans text-navy truncate flex-1">{doc.filename}</span>
            <Badge variant="outline" className="text-xs shrink-0">{formatSize(doc.size)}</Badge>
            <a href={`${API}/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
              <Button size="icon" variant="ghost" className="h-7 w-7 text-navy hover:text-gold" data-testid={`dl-doc-${doc.id}`}>
                <Download className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        );
      })}
    </div>
  );
}
