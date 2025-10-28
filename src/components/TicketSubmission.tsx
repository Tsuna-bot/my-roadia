import { useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Select from './Select';

interface TicketSubmissionProps {
  folderId: string;
  onSubmitTicket?: (subject: string, message: string) => void;
  embedded?: boolean;
}

const ticketSubjects = [
  { value: 'question-dossier', label: 'Question sur mon dossier' },
  { value: 'demande-document', label: 'Demande de document' },
  { value: 'question-remboursement', label: 'Question sur le remboursement' },
  { value: 'modification-rendez-vous', label: 'Modification de rendez-vous' },
  { value: 'signalement-probleme', label: 'Signalement d\'un problème' },
  { value: 'autre', label: 'Autre' },
];

export default function TicketSubmission({ onSubmitTicket, embedded = false }: TicketSubmissionProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = () => {
    if (subject && message.trim()) {
      onSubmitTicket?.(subject, message);
      setSubject('');
      setMessage('');
      setSelectedFiles([]);
    }
  };

  return (
    <div className={embedded ? '' : 'p-6 md:p-16'}>
      <Card>
        <div className="p-4 md:p-8">
          <h2 className="text-base md:text-lg font-bold text-neutral-10 mb-6">
            Envoyer un message
          </h2>

          <div className="flex flex-col gap-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-40 mb-1">
                Sujet *
              </label>
              <Select
                value={subject}
                onChange={setSubject}
                options={ticketSubjects}
                placeholder="Sélectionner un sujet..."
                variant="neutral"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-neutral-40 mb-1">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Décrivez votre demande..."
                className="
                  w-full p-4 text-sm rounded-xl
                  shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-95
                  border-0 outline-none
                  placeholder:text-neutral-60
                  hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                  transition-all duration-[250ms]
                "
              />
            </div>

            {/* Attachments */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-sm"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip size={16} className="text-neutral-60 flex-shrink-0" />
                      <span className="text-sm text-neutral-10 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-neutral-60 flex-shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 rounded-sm hover:bg-error/10 text-neutral-60 hover:text-error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label htmlFor="file-attach" className="flex-shrink-0 md:order-1">
                <input
                  id="file-attach"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="medium"
                  className="gap-2 w-full md:w-auto"
                  as="div"
                >
                  <Paperclip size={18} />
                  Joindre des fichiers
                </Button>
              </label>

              <Button
                variant="primary"
                size="medium"
                onClick={handleSubmit}
                disabled={!subject || !message.trim()}
                className="gap-2 w-full md:w-auto md:ml-auto md:order-2"
              >
                <Send size={18} />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
