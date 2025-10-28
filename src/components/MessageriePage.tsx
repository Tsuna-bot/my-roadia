import { useState } from 'react';
import { Clock, MessageSquare, Paperclip, FileText, Image, Download, Eye } from 'lucide-react';
import TicketSubmission from './TicketSubmission';
import Card from './Card';
import Dialog from './Dialog';

interface AttachedFile {
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
}

interface TicketHistory {
  id: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
  folderId?: string;
  folderRef?: string;
  response?: string;
  responseDate?: string;
  attachedFiles?: AttachedFile[];
}

const mockTicketHistory: TicketHistory[] = [
  {
    id: '1',
    subject: 'Question sur mon dossier',
    message: 'Bonjour, je souhaiterais connaître l\'avancement de mon dossier #2025-0342.',
    date: '2024-01-15T14:30:00',
    status: 'resolved',
    folderRef: '#2025-0342',
    response: 'Bonjour, votre dossier est actuellement en phase d\'expertise. Nous vous tiendrons informé dès que l\'expert aura terminé son rapport.',
    responseDate: '2024-01-15T16:00:00',
  },
  {
    id: '2',
    subject: 'Demande de document',
    message: 'Pourriez-vous me transmettre une copie du rapport d\'expertise pour mon dossier #2025-0339 ?',
    date: '2024-01-14T10:15:00',
    status: 'resolved',
    folderRef: '#2025-0339',
    response: 'Le rapport d\'expertise vous a été envoyé par email. Vous pouvez également le télécharger depuis l\'onglet Documents de votre dossier.',
    responseDate: '2024-01-14T14:20:00',
    attachedFiles: [
      { name: 'rapport_expertise_2025-0339.pdf', size: '2.4 MB', type: 'pdf', url: '#' },
      { name: 'facture_reparation.pdf', size: '856 KB', type: 'pdf', url: '#' },
    ],
  },
  {
    id: '3',
    subject: 'Question sur le remboursement',
    message: 'Quand vais-je recevoir le remboursement pour les réparations du dossier #2025-0338 ?',
    date: '2024-01-13T16:45:00',
    status: 'in_progress',
    folderRef: '#2025-0338',
    attachedFiles: [
      { name: 'photo_dommages_avant.jpg', size: '1.2 MB', type: 'image', url: '#' },
      { name: 'photo_dommages_arriere.jpg', size: '1.5 MB', type: 'image', url: '#' },
    ],
  },
  {
    id: '4',
    subject: 'Modification de rendez-vous',
    message: 'Je ne peux pas me rendre au rendez-vous prévu le 20 janvier. Est-il possible de le reporter ?',
    date: '2024-01-12T09:20:00',
    status: 'pending',
  },
];

export default function MessageriePage() {
  const [ticketHistory] = useState<TicketHistory[]>(mockTicketHistory);
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={14} className="text-error" />;
      case 'image':
        return <Image size={14} className="text-success" />;
      default:
        return <FileText size={14} className="text-neutral-60" />;
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16">
      <div className="mb-6 md:mb-12">
        <h1 className="text-xl md:text-2xl font-bold text-neutral-10 mb-1 leading-tight">
          Messagerie
        </h1>
        <p className="text-sm md:text-base text-neutral-60">
          Envoyez un message ou consultez l'historique de vos conversations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Formulaire de soumission */}
        <div className="lg:col-span-2">
          <TicketSubmission
            folderId="general"
            onSubmitTicket={(subject, message) => {
              console.log('Message envoyé:', { subject, message });
            }}
            embedded={true}
          />
        </div>

        {/* Historique des conversations */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={20} className="text-accent" />
                <h2 className="text-base md:text-lg font-bold text-neutral-10">
                  Historique des messages
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {ticketHistory.length === 0 ? (
                  <div className="text-center py-3xl">
                    <MessageSquare size={48} className="text-neutral-60 mx-auto mb-4" />
                    <p className="text-sm text-neutral-40">
                      Aucun message pour le moment
                    </p>
                  </div>
                ) : (
                  ticketHistory.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-95"
                    >
                      <div className="flex flex-col gap-2">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-10 truncate mb-1">
                              {ticket.subject}
                            </p>
                            {ticket.folderRef && (
                              <span className="text-xs text-accent font-medium">
                                {ticket.folderRef}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-xs text-neutral-40 line-clamp-2">
                          {ticket.message}
                        </p>

                        {/* Response */}
                        {ticket.response && (
                          <div className="mt-1 pt-2 border-t border-neutral-85">
                            <p className="text-xs text-neutral-40 line-clamp-2">
                              {ticket.response}
                            </p>
                          </div>
                        )}

                        {/* Attached Files */}
                        {ticket.attachedFiles && ticket.attachedFiles.length > 0 && (
                          <div className="mt-1 pt-2 border-t border-neutral-85">
                            <div className="flex items-center gap-1 mb-2">
                              <Paperclip size={14} className="text-neutral-40" />
                              <span className="text-xs font-medium text-neutral-30">
                                {ticket.attachedFiles.length} fichier{ticket.attachedFiles.length > 1 ? 's' : ''} joint{ticket.attachedFiles.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              {ticket.attachedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="
                                    flex items-center justify-between gap-2 p-4 rounded-md
                                    bg-neutral-98 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                                  "
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {getFileIcon(file.type)}
                                    <div className="flex flex-col flex-1 min-w-0">
                                      <span className="text-xs text-neutral-10 truncate font-medium">
                                        {file.name}
                                      </span>
                                      <span className="text-xs text-neutral-40">
                                        {file.size}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => setPreviewFile(file)}
                                      className="
                                        p-2 rounded-md
                                        text-neutral-60 hover:text-accent hover:bg-accent/10
                                        transition-all duration-150
                                      "
                                      title="Aperçu"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <a
                                      href={file.url}
                                      download
                                      className="
                                        p-2 rounded-md
                                        text-neutral-60 hover:text-accent hover:bg-accent/10
                                        transition-all duration-150
                                      "
                                      title="Télécharger"
                                    >
                                      <Download size={18} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center gap-1 text-neutral-40 pt-2">
                          <Clock size={12} />
                          <span className="text-xs">
                            {formatDate(ticket.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* File Preview Dialog */}
      {previewFile && (
        <Dialog
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
          maxWidth="lg"
          title={previewFile.name}
        >
          <div className="p-2 md:p-8">
            {previewFile.type === 'image' ? (
              <div className="flex items-center justify-center bg-neutral-98 rounded-md p-4 md:p-6">
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-md"
                />
              </div>
            ) : previewFile.type === 'pdf' ? (
              <div className="flex flex-col items-center gap-4 md:p-6 py-3xl">
                <FileText size={64} className="text-error" />
                <div className="text-center">
                  <p className="text-base font-semibold text-neutral-10 mb-1">
                    {previewFile.name}
                  </p>
                  <p className="text-sm text-neutral-60 mb-6">
                    Fichier PDF • {previewFile.size}
                  </p>
                  <a
                    href={previewFile.url}
                    download
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors duration-150"
                  >
                    <Download size={18} />
                    Télécharger le fichier
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 md:p-6 py-3xl">
                <FileText size={64} className="text-neutral-60" />
                <div className="text-center">
                  <p className="text-base font-semibold text-neutral-10 mb-1">
                    {previewFile.name}
                  </p>
                  <p className="text-sm text-neutral-60 mb-6">
                    {previewFile.size}
                  </p>
                  <a
                    href={previewFile.url}
                    download
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors duration-150"
                  >
                    <Download size={18} />
                    Télécharger le fichier
                  </a>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}
      </div>
    </div>
  );
}
