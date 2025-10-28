import { useState } from 'react';
import {
  Euro,
  Calendar,
  FileText,
  CheckCircle,
  User,
  File,
  Clock,
  ClipboardList,
  Wrench,
  Car,
  Search,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { useTabs } from '../contexts/TabsContext';
import { useNavigation } from '../contexts/NavigationContext';
import { mockFolders, getCurrentStatus, calculateProgress } from '../data/mockData';
import SearchBar from './SearchBar';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';
import LinearProgress from './LinearProgress';
import Dialog from './Dialog';
import EADWizardRepairer from './EADWizardRepairer';
import AppointmentDialog from './AppointmentDialog';

export default function DashboardReparateur() {
  const { openFolder } = useTabs();
  const { navigateTo } = useNavigation();
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [eadWizardOpen, setEadWizardOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Quick actions
  const quickActions = [
    { id: 'tarifs', label: 'Tarifs', labelDesktop: 'Gérer mes tarifs', icon: Euro, color: 'text-accent' },
    { id: 'horaires', label: 'Horaires et absences', labelDesktop: 'Gérer mes horaires et absences', icon: Calendar, color: 'text-accent' },
    { id: 'report', label: 'Dernier dossier', labelDesktop: 'Dernier dossier', icon: FileText, color: 'text-accent' },
  ];

  // All folders mapped
  const allFolders = mockFolders.map(folder => {
    const currentStatus = getCurrentStatus(folder);
    const progress = calculateProgress(folder);
    return {
      id: folder.id,
      ref: folder.reference,
      client: folder.client.name,
      vehicle: `${folder.vehicle.brand} ${folder.vehicle.model}`,
      status: currentStatus,
      progress: progress,
      isPriority: currentStatus === 'Planification d\'un examen' || currentStatus === 'Complétion d\'un dossier à distance',
    };
  });

  // Priority folders
  const allPriorityFolders = allFolders.filter(folder => folder.isPriority);

  // Filter folders based on search
  const isSearchActive = searchQuery.trim() !== '';
  const displayedFolders = isSearchActive
    ? allFolders.filter(folder => {
        const query = searchQuery.toLowerCase();
        return (
          folder.ref.toLowerCase().includes(query) ||
          folder.vehicle.toLowerCase().includes(query) ||
          folder.client.toLowerCase().includes(query)
        );
      })
    : allPriorityFolders;

  // Recent activities
  const allActivities = [
    {
      id: '1',
      icon: CheckCircle,
      title: 'Dossier #2025-0339 validé',
      description: 'Le rapport d\'expertise a été approuvé par l\'assureur',
      time: 'Il y a 15 min',
      color: 'text-success',
    },
    {
      id: '2',
      icon: User,
      title: 'Nouveau message',
      description: 'Jean Martin a posé une question sur #2025-0342',
      time: 'Il y a 1h',
      color: 'text-accent',
    },
    {
      id: '3',
      icon: File,
      title: 'Document ajouté',
      description: 'Facture téléchargée pour #2025-0338',
      time: 'Il y a 2h',
      color: 'text-neutral-40',
    },
    {
      id: '4',
      icon: Clock,
      title: 'Rapport mis à jour',
      description: 'Modifications appliquées sur #2025-0341',
      time: 'Il y a 3h',
      color: 'text-neutral-40',
    },
    {
      id: '5',
      icon: Camera,
      title: 'Photos téléchargées',
      description: 'Nouvelles photos ajoutées pour #2025-0340',
      time: 'Il y a 5h',
      color: 'text-accent',
    },
    {
      id: '6',
      icon: ClipboardList,
      title: 'Nouveau dossier assigné',
      description: 'Dossier #2025-0343 vous a été attribué',
      time: 'Hier',
      color: 'text-warning',
    },
    {
      id: '7',
      icon: Wrench,
      title: 'Expertise terminée',
      description: 'Rapport d\'expertise complété pour #2025-0337',
      time: 'Hier',
      color: 'text-success',
    },
    {
      id: '8',
      icon: FileText,
      title: 'Devis généré',
      description: 'Estimation des réparations pour #2025-0336',
      time: 'Il y a 2 jours',
      color: 'text-accent',
    },
    {
      id: '9',
      icon: AlertTriangle,
      title: 'Action requise',
      description: 'Documents manquants sur #2025-0335',
      time: 'Il y a 3 jours',
      color: 'text-error',
    },
    {
      id: '10',
      icon: CheckCircle,
      title: 'Dossier clôturé',
      description: 'Le dossier #2025-0334 a été archivé',
      time: 'Il y a 5 jours',
      color: 'text-neutral-60',
    },
  ];

  const INITIAL_DISPLAY_COUNT = 4;
  const visibleActivities = showAllActivities
    ? allActivities
    : allActivities.slice(0, INITIAL_DISPLAY_COUNT);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'tarifs':
        navigateTo('tarifs');
        break;
      case 'horaires':
        navigateTo('profile');
        break;
      case 'report':
        if (allFolders.length > 0) {
          const latestFolder = allFolders[0];
          openFolder(latestFolder.id, latestFolder.ref);
        }
        break;
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 flex flex-col gap-4 md:gap-12" style={{ ['--card-border' as any]: 'none' }}>
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-neutral-10 leading-tight mb-1">
          Bonjour
        </h1>
        <p className="text-sm md:text-base text-neutral-60">
          Voici un aperçu de votre journée
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Rechercher un dossier par nom, véhicule ou assuré..."
        placeholderMobile="Rechercher..."
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Layout - 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
        {/* Left column - Quick actions + Priority folders */}
        <div className="lg:col-span-9 flex flex-col gap-4 md:gap-16">
          {/* Quick Actions */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="text-lg font-semibold text-neutral-10">
              Actions rapides
            </h2>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="w-full md:aspect-auto rounded-lg transition-all duration-[250ms] group focus-ring active:scale-95 md:active:scale-100"
                  >
                    <Card className="w-full h-full !border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-[250ms] rounded-xl">
                      <div className="p-2 md:p-6 text-center flex flex-col items-center justify-center h-full gap-1 md:gap-0">
                        <div className="w-10 h-10 md:w-14 md:h-14 md:mb-4 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                          <Icon size={20} className="md:w-7 md:h-7" />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-neutral-10 leading-tight">
                          <span className="md:hidden">{action.label}</span>
                          <span className="hidden md:inline">{action.labelDesktop}</span>
                        </span>
                      </div>
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Folders / Search Results */}
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-neutral-10">
                {isSearchActive ? 'Résultats de recherche' : 'Dossiers prioritaires'}
              </h2>
              <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-md font-medium h-[24px] !border-0">
                <span>{displayedFolders.length}</span>
              </div>
            </div>

            {displayedFolders.length === 0 ? (
              <div className="text-center py-3xl px-8 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl">
                <Search size={48} className="text-neutral-60 mx-auto mb-4" />
                <p className="text-base font-medium text-neutral-40 mb-1">
                  {searchQuery.trim() ? 'Aucun dossier trouvé' : 'Aucun dossier prioritaire'}
                </p>
                <p className="text-sm text-neutral-60">
                  {searchQuery.trim()
                    ? 'Essayez avec un autre nom, véhicule ou assuré'
                    : 'Les dossiers nécessitant une action apparaîtront ici'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className="
                      w-full rounded-lg transition-all duration-[250ms]
                      group
                    "
                  >
                    <Card
                      className="
                        w-full h-full !border-0
                        bg-white
                        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                        group-hover:shadow-md
                        group-hover:-translate-y-1
                        active:scale-[0.98] md:active:scale-100
                        transition-all duration-[250ms]
                        rounded-xl
                        cursor-pointer
                      "
                      onClick={() => openFolder(folder.id, folder.ref)}
                    >
                      <div className="p-4 md:p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-neutral-10">
                            {folder.ref}
                          </h3>
                          {folder.isPriority && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium h-[24px] !border-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                              <span>Action requise</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Car size={18} className="text-neutral-60 flex-shrink-0" />
                            <span className="text-sm font-medium text-neutral-10">
                              {folder.vehicle}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={18} className="text-neutral-60 flex-shrink-0" />
                            <span className="text-sm text-neutral-40">
                              {folder.client}
                            </span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-1">
                            <Chip
                              label={folder.status}
                              variant="default"
                              size="small"
                              className="bg-accent/10 text-accent font-medium text-xs h-[24px] !border-0"
                            />
                            <span className="text-xs font-semibold text-accent">
                              {folder.progress}%
                            </span>
                          </div>
                          <LinearProgress value={folder.progress} />
                        </div>

                        {/* CTA Button */}
                        {folder.status === 'Complétion d\'un dossier à distance' && (
                          <div className="flex justify-center md:justify-end">
                            <Button
                              variant="primary"
                              size="small"
                              onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                e?.stopPropagation();
                                setSelectedFolderId(folder.id);
                                setEadWizardOpen(true);
                              }}
                              className="w-full md:w-auto"
                            >
                              <Camera size={16} />
                              <span>Compléter à distance</span>
                            </Button>
                          </div>
                        )}
                        {folder.status === 'Planification d\'un examen' && (
                          <div className="flex justify-center md:justify-end">
                            <Button
                              variant="primary"
                              size="small"
                              onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                e?.stopPropagation();
                                setAppointmentDialogOpen(true);
                              }}
                              className="w-full md:w-auto"
                            >
                              <Calendar size={16} />
                              <span>Planifier un examen</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column - Recent Activities */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-3xl flex flex-col gap-4 md:gap-6">
            <h2 className="text-lg font-semibold text-neutral-10">
              Activités récentes
            </h2>
            <Card className="!border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl">
              <div className="p-2 md:p-6 flex flex-col gap-2 md:gap-4">
                {visibleActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex gap-2 md:gap-4 relative pb-2 md:pb-4 last:pb-0"
                    >
                      {/* Timeline line */}
                      {index !== visibleActivities.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-neutral-90" />
                      )}

                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color} bg-current/10`}>
                        <Icon size={20} className={activity.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 md:gap-2 mb-1">
                          <span className="text-sm font-semibold text-neutral-10 leading-tight truncate">
                            {activity.title}
                          </span>
                          <span className="text-xs text-neutral-60 whitespace-nowrap flex-shrink-0">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-40 leading-tight line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* See more button */}
              <div className="p-2 md:p-4 flex justify-center">
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="w-full py-2 rounded-md transition-all duration-150 hover:bg-neutral-95"
                >
                  <span className="text-sm font-semibold text-accent">
                    {showAllActivities ? 'Voir moins' : `Voir plus (${allActivities.length - INITIAL_DISPLAY_COUNT})`}
                  </span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* EAD Wizard Dialog */}
      <Dialog
        open={eadWizardOpen}
        onClose={() => setEadWizardOpen(false)}
        maxWidth="xl"
        fullScreen={window.innerWidth < 768}
        title="Expertise à distance"
      >
        <div className="p-4 md:p-8 h-full">
          <EADWizardRepairer
            folderId={selectedFolderId}
            onClose={() => setEadWizardOpen(false)}
            onSubmit={(data) => {
              console.log('EAD submitted:', data);
              // TODO: Handle EAD submission
            }}
          />
        </div>
      </Dialog>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={appointmentDialogOpen}
        onClose={() => setAppointmentDialogOpen(false)}
        folderId="dashboard"
      />
      </div>
    </div>
  );
}
