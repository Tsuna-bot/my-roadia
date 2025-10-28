import { useState } from 'react';
import { Upload, Trash2, FileText } from 'lucide-react';
import Button from './Button';
import Select from './Select';

interface DocumentUploadProps {
  folderId: string;
  onUploadComplete?: (document: UploadedDocument) => void;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  documentType: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface PendingDocument {
  file: File;
  documentType: string;
  id: string;
}

const documentTypes = [
  { value: 'facture', label: 'Facture' },
  { value: 'devis', label: 'Devis' },
  { value: 'rapport-expertise', label: 'Rapport d\'expertise' },
  { value: 'constat', label: 'Constat amiable' },
  { value: 'carte-grise', label: 'Carte grise' },
  { value: 'permis-conduire', label: 'Permis de conduire' },
  { value: 'attestation-assurance', label: 'Attestation d\'assurance' },
  { value: 'autre', label: 'Autre' },
];

export default function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPendingDocs: PendingDocument[] = Array.from(files).map((file) => ({
      file,
      documentType: '',
      id: `${Date.now()}-${Math.random()}`,
    }));

    setPendingDocuments((prev) => [...prev, ...newPendingDocs]);
  };

  const handleDocumentTypeChange = (docId: string, documentType: string) => {
    setPendingDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, documentType } : doc))
    );
  };

  const handleRemoveDocument = (docId: string) => {
    setPendingDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const handleUploadAll = () => {
    const docsToUpload = pendingDocuments.filter((doc) => doc.documentType);

    if (docsToUpload.length === 0) return;

    docsToUpload.forEach((pendingDoc) => {
      const uploadedDoc: UploadedDocument = {
        id: pendingDoc.id,
        name: pendingDoc.file.name,
        type: pendingDoc.file.type,
        documentType: pendingDoc.documentType,
        size: pendingDoc.file.size,
        uploadDate: new Date().toLocaleDateString('fr-FR'),
        url: URL.createObjectURL(pendingDoc.file),
      };

      onUploadComplete?.(uploadedDoc);
    });

    setPendingDocuments([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const allDocumentsHaveType = pendingDocuments.length > 0 && pendingDocuments.every((doc) => doc.documentType);

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-md p-4 md:p-6 text-center
          transition-all duration-150
          ${isDragging
            ? 'border-accent bg-accent/5'
            : 'md:border-neutral-85 md:bg-neutral-95 border-transparent bg-transparent'
          }
        `}
      >
        <Upload
          size={48}
          className={`mx-auto mb-2 hidden md:block ${isDragging ? 'text-accent' : 'text-neutral-60'}`}
        />

        <p className="text-sm font-semibold text-neutral-10 mb-1 hidden md:block">
          Glissez-déposez vos fichiers ici
        </p>

        <p className="text-xs text-neutral-60 mb-4 hidden md:block">
          ou
        </p>

        <label htmlFor="file-upload" className="block cursor-pointer">
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <Button
            variant="primary"
            size="medium"
            className="w-full md:w-auto gap-2 cursor-pointer"
            as="div"
          >
            <Upload size={18} />
            <span className="md:hidden">Choisir des fichiers</span>
            <span className="hidden md:inline">Parcourir les fichiers</span>
          </Button>
        </label>
      </div>

      {/* Pending Documents */}
      {pendingDocuments.length > 0 && (
        <div className="flex flex-col gap-4">
          {pendingDocuments.map((doc) => (
            <div key={doc.id} className="p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText size={20} className="text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-10 truncate">
                      {doc.file.name}
                    </p>
                    <p className="text-xs text-neutral-60">
                      {formatFileSize(doc.file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="p-1 rounded-sm hover:bg-error/10 text-neutral-60 hover:text-error transition-colors duration-150"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <Select
                value={doc.documentType}
                onChange={(value) => handleDocumentTypeChange(doc.id, value)}
                options={documentTypes}
                placeholder="Sélectionner un type..."
                variant="neutral"
                className="text-sm"
              />
            </div>
          ))}

          <Button
            variant="primary"
            size="medium"
            onClick={handleUploadAll}
            disabled={!allDocumentsHaveType}
            className="w-full gap-2"
          >
            <Upload size={18} />
            Téléverser {pendingDocuments.length} document{pendingDocuments.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
}
