import { useState } from 'react';
import {
  ChevronLeft,
  Car,
  User,
  Phone,
  Mail,
  MapPin,
  Wrench,
  FileText,
  MessageSquare,
  Eye,
  Check,
  Inbox,
  Search as SearchIcon,
  Calendar,
  Cloud,
  Construction,
  Folder as FolderIcon,
  Building2,
  CreditCard,
  Camera,
  Plus,
  MoreVertical,
  Download,
  Clock,
  Paperclip,
  Image,
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { mockFolders, getCurrentStatus } from '../data/mockData';
import Card from './Card';
import Chip from './Chip';
import LinearProgress from './LinearProgress';
import Divider from './Divider';
import Tabs from './Tabs';
import Tab from './Tab';
import Button from './Button';
import Dialog from './Dialog';
import DocumentUpload, { UploadedDocument } from './DocumentUpload';
import SearchBar from './SearchBar';
import EADWizardRepairer from './EADWizardRepairer';
import TicketSubmission from './TicketSubmission';
import AppointmentDialog from './AppointmentDialog';
import Menu from './Menu';
import MenuItem from './MenuItem';
import DatePicker from './DatePicker';

export interface VehiclePhoto {
  id: string;
  url: string;
  uploadDate: string;
}

interface FolderDetailsProps {
  folderId: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  'Réception de la mission': { label: 'Réception de la mission', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Étude de la mission': { label: 'Étude de la mission', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Planification d\'un examen': { label: 'Planification d\'un examen', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Examen initial': { label: 'Examen initial', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Cession': { label: 'Cession', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Complétion d\'un dossier à distance': { label: 'Complétion d\'un dossier à distance', color: 'text-accent', bgColor: 'bg-accent/10' },
  'Réparations': { label: 'Réparations', color: 'text-accent', bgColor: 'bg-accent/10' },
};

const getStepIcon = (stepLabel: string) => {
  const icons: Record<string, any> = {
    'Réception de la mission': Inbox,
    'Étude de la mission': SearchIcon,
    'Planification d\'un examen': Calendar,
    'Complétion d\'un dossier à distance': Camera,
    'Examen initial': FileText,
    'Cession': Wrench,
    'Réparations': Construction,
  };
  const Icon = icons[stepLabel] || FolderIcon;
  return <Icon size={20} />;
};

export default function FolderDetails({ folderId }: FolderDetailsProps) {
  const { navigateTo } = useNavigation();
  const folder = mockFolders.find(f => f.id === folderId);
  const [activeTab, setActiveTab] = useState(0);
  const [documents, setDocuments] = useState<UploadedDocument[]>(folder?.documents || []);
  const [photos, setPhotos] = useState<VehiclePhoto[]>(folder?.photos || []);
  const [repairDate, setRepairDate] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [eadWizardOpen, setEadWizardOpen] = useState(false);
  const [documentSearch, setDocumentSearch] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [documentMenuAnchor, setDocumentMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const handlePhotoClick = (photoUrl: string) => {
    setSelectedPhotoUrl(photoUrl);
    setLightboxOpen(true);
  };

  const handleDocumentUpload = (doc: UploadedDocument) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const handleDocumentMenuOpen = (event: React.MouseEvent<HTMLElement>, docId: string) => {
    setDocumentMenuAnchor(event.currentTarget);
    setSelectedDocumentId(docId);
  };

  const handleDocumentMenuClose = () => {
    setDocumentMenuAnchor(null);
    setSelectedDocumentId(null);
  };

  const handleViewDocument = () => {
    const doc = documents.find(d => d.id === selectedDocumentId);
    if (doc?.url) {
      window.open(doc.url, '_blank');
    }
    handleDocumentMenuClose();
  };

  const handleDownloadDocument = () => {
    const doc = documents.find(d => d.id === selectedDocumentId);
    if (doc?.url) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.click();
    }
    handleDocumentMenuClose();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newPhoto: VehiclePhoto = {
          id: `photo-${Date.now()}-${Math.random()}`,
          url: URL.createObjectURL(file),
          uploadDate: new Date().toLocaleDateString('fr-FR'),
        };
        setPhotos((prev) => [...prev, newPhoto]);
      });
    }
  };

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 md:p-6">
        <h2 className="text-xl font-bold text-neutral-10">
          Dossier introuvable
        </h2>
        <p className="text-base text-neutral-40">
          Le dossier #{folderId} n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => navigateTo('dossiers')}
          className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80"
        >
          <ChevronLeft size={24} />
          Retour aux dossiers
        </button>
      </div>
    );
  }

  const currentStatusLabel = getCurrentStatus(folder);
  const statusInfo = statusConfig[currentStatusLabel] || {
    label: currentStatusLabel,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 flex flex-col gap-4 md:gap-16">
      {/* Back Button + Header */}
      <div>
        <button
          onClick={() => navigateTo('dossiers')}
          className="flex items-center gap-1 mb-6 text-sm font-semibold text-neutral-40 hover:text-neutral-10 transition-colors duration-150"
        >
          <ChevronLeft size={24} />
          Retour
        </button>

        {/* Timeline Card */}
        <Card>
          <div className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <h1 className="text-base md:text-lg font-semibold text-neutral-10">
                Dossier {folder.reference}
              </h1>
              <Chip
                label={statusInfo.label}
                variant="default"
                size="small"
                className={`${statusInfo.bgColor} ${statusInfo.color} font-semibold w-fit`}
              />
            </div>

            <p className="text-xs md:text-sm text-neutral-40 mb-12">
              Créé le {folder.createdDate}
            </p>

            {/* Timeline */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-neutral-10 mb-6">
                Suivi du dossier
              </h3>
              <div className="flex flex-col-reverse md:flex-row md:items-start relative">
                {folder.timeline.map((step, index, array) => {
                  const isCurrentStep = !step.completed && folder.timeline.slice(0, index).every(s => s.completed);
                  const isFirstStep = index === 0;
                  const isLastStep = index === array.length - 1;
                  const nextStep = array[index + 1];
                  const StepIconComponent = getStepIcon(step.label);

                  return (
                    <div key={index} className="flex md:flex-col md:flex-1 md:items-center gap-4 md:gap-0 relative mb-6 md:mb-0 first:mb-0 last:mb-6 md:last:mb-0">
                      {/* Connector line to next step */}
                      {!isLastStep && (
                        <div
                          className={`
                            absolute
                            top-9 left-[17px] w-0.5 h-[calc(100%-36px+var(--gap-6))]
                            md:top-5 md:left-1/2 md:right-0 md:h-0.5 md:w-1/2 md:bottom-auto
                            ${step.completed ? 'bg-accent' : 'bg-neutral-90'}
                            z-0
                          `}
                        />
                      )}

                      {/* Connector line from previous step */}
                      {!isFirstStep && (
                        <div
                          className={`
                            absolute
                            top-9 left-[17px] w-0.5 h-[calc(100%-36px+var(--gap-6))]
                            md:top-5 md:left-0 md:right-1/2 md:h-0.5 md:w-1/2 md:bottom-auto
                            ${(step.completed || isCurrentStep) ? 'bg-accent' : 'bg-neutral-90'}
                            z-0
                          `}
                        />
                      )}

                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        {/* White background to hide line behind icon during pulse */}
                        <div className="absolute inset-0 bg-white rounded-full z-0" />
                        <div
                          className={`
                            w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                            border-2 z-10 relative
                            transition-all duration-150
                            ${step.completed
                              ? 'bg-accent border-accent text-white'
                              : isCurrentStep
                                ? 'bg-accent border-accent text-white animate-pulse'
                                : 'bg-white border-neutral-85 text-neutral-60'
                            }
                          `}
                          style={isCurrentStep ? {
                            animationDuration: '2s',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, scale-pulse 2s ease-in-out infinite'
                          } : undefined}
                        >
                          {step.completed ? <Check size={20} strokeWidth={3} /> : StepIconComponent}
                        </div>
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <div className="md:text-center md:mt-2">
                          <p
                            className={`
                              text-xs leading-tight
                              ${step.completed || isCurrentStep
                                ? 'font-semibold text-neutral-10'
                                : 'font-medium text-neutral-60'
                              }
                            `}
                          >
                            {step.label}
                          </p>
                        </div>

                        {isCurrentStep && (
                          <div className="mt-4 md:mt-2 flex justify-center">
                            {step.label === 'Complétion d\'un dossier à distance' && (
                              <Button
                                variant="primary"
                                size="small"
                                onClick={() => setEadWizardOpen(true)}
                                className="text-xs px-4 py-2 w-full md:w-auto"
                              >
                                Compléter à distance
                              </Button>
                            )}
                            {step.label === 'Planification d\'un examen' && (
                              <Button
                                variant="primary"
                                size="small"
                                onClick={() => setAppointmentDialogOpen(true)}
                                className="text-xs px-4 py-2 w-full md:w-auto"
                              >
                                Planifier un examen
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-neutral-60">
                  Progression globale
                </span>
                <span className="text-sm font-bold text-neutral-10">
                  {folder.progress}%
                </span>
              </div>
              <LinearProgress value={folder.progress} />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)} variant="fullWidth">
        <Tab icon={<Eye size={24} className="md:w-5 md:h-5" />} label={<span className="hidden sm:inline">Vue d'ensemble</span>} />
        <Tab icon={<FolderIcon size={24} className="md:w-5 md:h-5" />} label={<span className="hidden sm:inline">Documents</span>} />
        <Tab icon={<MessageSquare size={24} className="md:w-5 md:h-5" />} label={<span className="hidden sm:inline">Messagerie</span>} />
      </Tabs>

      {/* Tab 0: Overview */}
      {activeTab === 0 && (
        <div className="flex flex-col gap-16">
          {/* Synthèse - Grid 4 colonnes */}
          <div>
            <h2 className="text-sm md:text-base lg:text-lg font-bold text-neutral-10 mb-4 md:mb-6">
              Synthèse
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {/* Vehicle */}
              <Card>
                <div className="p-4 md:p-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Car size={24} className="text-accent" />
                      <h3 className="text-base md:text-lg font-bold text-neutral-10">
                        Véhicule
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Marque et modèle</p>
                        <p className="text-sm md:text-base font-semibold text-neutral-10">
                          {folder.vehicle.brand} {folder.vehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Année</p>
                        <p className="text-sm md:text-base font-medium text-neutral-10">
                          {folder.vehicle.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Immatriculation</p>
                        <p className="text-sm md:text-base font-medium text-neutral-10">
                          {folder.vehicle.plate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Client */}
              <Card>
                <div className="p-4 md:p-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <User size={24} className="text-accent" />
                      <h3 className="text-base md:text-lg font-bold text-neutral-10">
                        Assuré
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <p className="text-sm md:text-base font-semibold text-neutral-10">
                        {folder.client.name}
                      </p>
                      <div className="flex items-center gap-1 min-w-0">
                        <Phone size={18} className="text-neutral-60 flex-shrink-0" />
                        <p className="text-sm font-medium text-neutral-40 truncate">
                          {folder.client.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail size={18} className="text-neutral-60 flex-shrink-0" />
                        <p className="text-sm font-medium text-neutral-40 break-all">
                          {folder.client.email}
                        </p>
                      </div>
                      <div className="flex items-start gap-1 min-w-0">
                        <MapPin size={18} className="text-neutral-60 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium text-neutral-40 break-words">
                          {folder.client.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Insurance */}
              <Card>
                <div className="p-4 md:p-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Building2 size={24} className="text-accent" />
                      <h3 className="text-base md:text-lg font-bold text-neutral-10">
                        Assurance
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Compagnie</p>
                        <p className="text-sm md:text-base font-semibold text-neutral-10">
                          {folder.insurance?.company || 'AXA Assurances'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Numéro de contrat</p>
                        <p className="text-sm font-medium text-neutral-40 font-mono">
                          {folder.insurance?.contractNumber || 'AX-2024-789456'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={18} className="text-neutral-60" />
                        <p className="text-sm font-medium text-neutral-40">
                          {folder.insurance?.phone || '01 40 25 26 27'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment */}
              <Card>
                <div className="p-4 md:p-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <CreditCard size={24} className="text-accent" />
                      <h3 className="text-base md:text-lg font-bold text-neutral-10">
                        Règlement direct
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-60">Consenti par l'assureur</p>
                        <Chip label="Non" variant="default" size="small" className="bg-neutral-95 text-neutral-40" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-60">Accordé par l'expert</p>
                        <Chip label="Non" variant="default" size="small" className="bg-neutral-95 text-neutral-40" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-60">Franchise</p>
                        <Chip label="Non" variant="default" size="small" className="bg-neutral-95 text-neutral-40" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Actions à compléter - Grid 3 colonnes */}
          <div>
            <h2 className="text-base md:text-lg font-bold text-neutral-10 mb-6">
              Actions à compléter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                {/* Repair Date */}
                <Card>
                  <div className="p-4 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Wrench size={20} md-size={24} className="text-accent" />
                      <h3 className="text-sm md:text-base font-bold text-neutral-10">
                        Mise en réparation
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Date de mise en réparation</p>
                        <DatePicker
                          value={repairDate}
                          onChange={setRepairDate}
                          placeholder="Sélectionner une date"
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="medium"
                        disabled={!repairDate}
                        className="w-full mt-auto"
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Photo Date */}
                <Card>
                  <div className="p-4 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <Camera size={20} md-size={24} className="text-accent" />
                      <h3 className="text-sm md:text-base font-bold text-neutral-10">
                        Date de prise de photos
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                      <div>
                        <p className="text-xs text-neutral-60 mb-1">Date de prise de photos</p>
                        <DatePicker
                          value={photoDate}
                          onChange={setPhotoDate}
                          placeholder="Sélectionner une date"
                        />
                      </div>
                      <p className="text-sm text-neutral-40">
                        Planifiez la date pour la prise de photos.
                      </p>
                      <Button
                        variant="primary"
                        size="medium"
                        disabled={!photoDate}
                        className="w-full mt-auto"
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Feedback */}
                <Card>
                  <div className="p-4 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <MessageSquare size={20} md-size={24} className="text-accent" />
                      <h3 className="text-sm md:text-base font-bold text-neutral-10">
                        Donner votre avis
                      </h3>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                      <p className="text-sm text-neutral-40">
                        Partagez votre expérience sur ce dossier et aidez-nous à améliorer notre service.
                      </p>
                      <Divider />
                      <p className="text-xs text-neutral-60">
                        Vos retours sont précieux pour nous permettre d'améliorer continuellement la qualité de nos services.
                      </p>
                      <Button
                        variant="primary"
                        size="medium"
                        onClick={() => setActiveTab(2)}
                        className="w-full mt-auto"
                      >
                        Donner votre avis
                      </Button>
                    </div>
                  </div>
                </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Documents & Photos */}
      {activeTab === 1 && (
        <div className="flex flex-col gap-4 md:gap-16">
          {/* Documents */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-bold text-neutral-10">
                Documents
              </h2>
              <Chip
                label={`${documents.length} document${documents.length > 1 ? 's' : ''}`}
                variant="default"
                size="small"
                className="bg-accent/10 text-accent font-bold"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              {/* Upload */}
              <Card>
                <div className="p-4 md:p-8">
                  <h3 className="text-sm md:text-base font-bold text-neutral-10 mb-4 md:mb-6">
                    Ajouter un document
                  </h3>
                  <DocumentUpload folderId={folderId} onUploadComplete={handleDocumentUpload} />
                </div>
              </Card>

              {/* List */}
              <Card>
                <div className="p-4 md:p-8">
                  <h3 className="text-sm md:text-base font-bold text-neutral-10 mb-4 md:mb-6">
                    Documents partagés
                  </h3>

                  <div className="mb-6">
                    <SearchBar
                      placeholder="Rechercher dans les documents..."
                      onSearch={setDocumentSearch}
                      variant="neutral"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    {documents
                      .filter(doc =>
                        doc.name.toLowerCase().includes(documentSearch.toLowerCase()) ||
                        doc.type.toLowerCase().includes(documentSearch.toLowerCase())
                      )
                      .map(doc => (
                        <div
                          key={doc.id}
                          className="p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-md flex justify-between items-center bg-neutral-95"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <FileText size={20} className="text-accent flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-10 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-neutral-60">
                                {doc.type}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDocumentMenuOpen(e, doc.id)}
                            className="p-2 rounded-sm text-neutral-60 hover:bg-accent/10 hover:text-accent transition-colors duration-150"
                          >
                            <MoreVertical size={20} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>

              {/* Document Menu */}
              <Menu
                anchorEl={documentMenuAnchor}
                open={Boolean(documentMenuAnchor)}
                onClose={handleDocumentMenuClose}
              >
                <MenuItem onClick={handleViewDocument}>
                  <Eye size={18} className="mr-2 text-neutral-40" />
                  Voir
                </MenuItem>
                <MenuItem onClick={handleDownloadDocument}>
                  <Download size={18} className="mr-2 text-neutral-40" />
                  Télécharger
                </MenuItem>
              </Menu>
            </div>
          </div>

          <Divider />

          {/* Photos */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-bold text-neutral-10">
                Photos du véhicule
              </h2>
              <Chip
                label={`${photos.length} photo${photos.length > 1 ? 's' : ''}`}
                variant="default"
                size="small"
                className="bg-accent/10 text-accent font-bold"
              />
            </div>

            <input
              type="file"
              id="vehicle-photo-upload"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl p-2 md:p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {/* Add Photo */}
                <label
                  htmlFor="vehicle-photo-upload"
                  className="aspect-square bg-neutral-95 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-accent/5 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-[250ms] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                >
                  <Plus size={24} className="text-neutral-60" />
                  <span className="text-2xs md:text-xs font-semibold text-neutral-60 text-center px-1">
                    Ajouter
                  </span>
                </label>

                {/* Photos */}
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => handlePhotoClick(photo.url)}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-95 cursor-pointer hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-[250ms] group"
                  >
                  <img
                    src={photo.url}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-[250ms] hidden md:flex">
                    <Eye size={40} className="text-white" />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Messaging */}
      {activeTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
          {/* Left: Nouveau message */}
          <div className="lg:col-span-2">
            <TicketSubmission
              folderId={folder.reference}
              onSubmitTicket={(subject, message) => {
                console.log('Ticket submitted:', { subject, message });
              }}
              embedded={true}
            />
          </div>

          {/* Right: Historique des conversations */}
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
                  {/* Message 1 */}
                  <div className="p-4 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-95">
                    <div className="flex flex-col gap-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-10 truncate mb-1">
                            Demande de photos supplémentaires
                          </p>
                          <span className="text-xs text-accent font-medium">
                            {folder.reference}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-xs text-neutral-40 line-clamp-2">
                        Bonjour, pourriez-vous me fournir les photos des dégâts à l'arrière du véhicule ?
                        Les images actuelles ne permettent pas de bien évaluer l'étendue des dommages.
                      </p>

                      {/* Response */}
                      <div className="mt-1 pt-2 border-t border-neutral-90">
                        <p className="text-xs text-neutral-40 line-clamp-2">
                          Bonjour, j'ai ajouté 4 nouvelles photos de l'arrière dans l'onglet Documents.
                          N'hésitez pas si vous avez besoin d'angles spécifiques supplémentaires.
                        </p>
                      </div>

                      {/* Attached Files */}
                      <div className="mt-1 pt-2 border-t border-neutral-90">
                        <div className="flex items-center gap-1 mb-2">
                          <Paperclip size={14} className="text-neutral-40" />
                          <span className="text-sm font-medium text-neutral-40">
                            2 fichiers joints
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2 p-4 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Image size={14} className="text-success" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm text-neutral-10 truncate font-medium">
                                  photo_arriere_1.jpg
                                </span>
                                <span className="text-xs text-neutral-60">
                                  1.2 MB
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-2 rounded-md text-neutral-60 hover:text-accent hover:bg-accent/10 transition-all duration-150" title="Aperçu">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 rounded-md text-neutral-60 hover:text-accent hover:bg-accent/10 transition-all duration-150" title="Télécharger">
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 p-4 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Image size={14} className="text-success" />
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm text-neutral-10 truncate font-medium">
                                  photo_arriere_2.jpg
                                </span>
                                <span className="text-xs text-neutral-60">
                                  1.5 MB
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-2 rounded-md text-neutral-60 hover:text-accent hover:bg-accent/10 transition-all duration-150" title="Aperçu">
                                <Eye size={18} />
                              </button>
                              <button className="p-2 rounded-md text-neutral-60 hover:text-accent hover:bg-accent/10 transition-all duration-150" title="Télécharger">
                                <Download size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-1 text-neutral-60 pt-2">
                        <Clock size={12} />
                        <span className="text-xs">
                          15 janvier 2024 à 14:30
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="p-4 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-95">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-10 truncate mb-1">
                            Question sur le devis
                          </p>
                          <span className="text-xs text-accent font-medium">
                            {folder.reference}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-40 line-clamp-2">
                        Le montant estimé des réparations vous semble-t-il correct ? Souhaitez-vous des précisions sur certains postes ?
                      </p>

                      <div className="mt-1 pt-2 border-t border-neutral-90">
                        <p className="text-xs text-neutral-40 line-clamp-2">
                          Le devis est conforme à nos attentes. Nous pouvons procéder aux réparations dès réception de l'accord.
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-neutral-60 pt-2">
                        <Clock size={12} />
                        <span className="text-xs">
                          14 janvier 2024 à 10:15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AppointmentDialog
        open={appointmentDialogOpen}
        onClose={() => setAppointmentDialogOpen(false)}
        folderId={folder.reference}
      />

      {eadWizardOpen && (
        <Dialog
          open={eadWizardOpen}
          onClose={() => setEadWizardOpen(false)}
          maxWidth="lg"
          fullScreen={window.innerWidth < 768}
          title="Expertise à distance"
        >
          <div className="p-4 md:p-8">
            <EADWizardRepairer
              folderId={folderId}
              onClose={() => setEadWizardOpen(false)}
            />
          </div>
        </Dialog>
      )}

      {/* Photo Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="lg"
      >
        <div className="relative flex items-center justify-center min-h-[70vh] p-4 md:p-6 bg-black/95">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
          >
            <ChevronLeft size={24} />
          </button>
          <img
            src={selectedPhotoUrl}
            alt="Photo agrandie"
            className="max-w-full max-h-[80vh] object-contain rounded-md"
          />
        </div>
      </Dialog>
      </div>
    </div>
  );
}
