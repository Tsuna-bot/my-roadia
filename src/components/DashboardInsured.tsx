import { useState } from 'react';
import {
  Car,
  FileText,
  MessageSquare,
  CheckCircle,
  Wrench,
  ClipboardList,
  Info,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { useTabs } from '../contexts/TabsContext';
import { useNavigation } from '../contexts/NavigationContext';
import { mockFolders, getCurrentStatus, calculateProgress } from '../data/mockData';
import Card from './Card';
import Chip from './Chip';
import LinearProgress from './LinearProgress';
import Button from './Button';
import Dialog from './Dialog';
import EADWizardInsured from './EADWizardInsured';

export default function DashboardInsured() {
  const { openFolder } = useTabs();
  const { navigateTo } = useNavigation();
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [eadWizardOpen, setEadWizardOpen] = useState(false);

  // Actions rapides pour l'assuré
  const quickActions = [
    { id: 'newClaim', label: 'Déclarer un sinistre', icon: AlertCircle, color: 'text-accent' },
    { id: 'ead', label: 'Expertise à distance', icon: Camera, color: 'text-accent' },
    { id: 'messages', label: 'Messagerie', icon: MessageSquare, color: 'text-accent' },
  ];

  // Récupérer le dossier de l'assuré depuis mockFolders
  const insuredFolder = mockFolders.find(f => f.id === 'insured-1');

  // Calculer les données du dossier
  const claim = insuredFolder ? {
    id: insuredFolder.id,
    ref: insuredFolder.reference.replace('#', ''),
    vehicle: `${insuredFolder.vehicle.brand} ${insuredFolder.vehicle.model}`,
    repairer: 'Garage Dupont',
    status: getCurrentStatus(insuredFolder),
    progress: calculateProgress(insuredFolder),
  } : null;

  // Activités récentes pour l'assuré
  const allActivities = [
    {
      id: '1',
      icon: CheckCircle,
      title: 'Expertise validée',
      description: 'Le rapport d\'expertise de votre sinistre #2025-0342 a été approuvé',
      time: 'Il y a 2h',
      color: 'text-success',
    },
    {
      id: '2',
      icon: Wrench,
      title: 'Réparations démarrées',
      description: 'Le Garage Dupont a commencé les réparations de votre Renault Clio',
      time: 'Il y a 1 jour',
      color: 'text-accent',
    },
    {
      id: '3',
      icon: MessageSquare,
      title: 'Nouveau message',
      description: 'Garage Dupont vous a envoyé un message concernant #2025-0342',
      time: 'Il y a 2 jours',
      color: 'text-neutral-40',
    },
    {
      id: '4',
      icon: ClipboardList,
      title: 'Document ajouté',
      description: 'Devis de réparation disponible pour #2025-0342',
      time: 'Il y a 3 jours',
      color: 'text-neutral-40',
    },
    {
      id: '5',
      icon: Camera,
      title: 'Photos validées',
      description: 'L\'expert a approuvé vos photos du véhicule',
      time: 'Il y a 4 jours',
      color: 'text-accent',
    },
    {
      id: '6',
      icon: Info,
      title: 'Rendez-vous confirmé',
      description: 'Votre rendez-vous d\'expertise est prévu le 20 janvier',
      time: 'Il y a 5 jours',
      color: 'text-success',
    },
  ];

  const INITIAL_DISPLAY_COUNT = 4;
  const visibleActivities = showAllActivities
    ? allActivities
    : allActivities.slice(0, INITIAL_DISPLAY_COUNT);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'newClaim':
        // TODO: Ouvrir wizard déclaration de sinistre
        console.log('Déclarer un sinistre');
        break;
      case 'ead':
        setEadWizardOpen(true);
        break;
      case 'messages':
        navigateTo('messages');
        break;
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 flex flex-col gap-4 md:gap-12">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-neutral-10 leading-tight mb-1">
          Bonjour, Jean Martin
        </h1>
        <p className="text-sm md:text-base text-neutral-60">
          Voici un résumé de vos sinistres en cours
        </p>
      </div>

      {/* Layout en 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
        {/* Colonne gauche - Actions rapides + Mes sinistres */}
        <div className="lg:col-span-9 flex flex-col gap-4 md:gap-16">
          {/* Actions rapides */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="text-lg font-semibold text-neutral-10">
              Actions rapides
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="w-full h-full rounded-lg transition-all duration-[250ms] group focus-ring"
                  >
                    <Card className="w-full h-full !border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-[250ms] rounded-xl">
                      <div className="p-1 md:p-6 text-center flex flex-col items-center justify-center h-full gap-1 md:gap-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 md:mb-4 rounded-md bg-accent/10 text-accent flex items-center justify-center">
                          <Icon size={24} className="md:w-7 md:h-7" />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-neutral-10 leading-tight">
                          {action.label}
                        </span>
                      </div>
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mon sinistre */}
          {claim && (
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-neutral-10">
                  Mon sinistre en cours
                </h2>
              </div>

              <div className="group">
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
                  onClick={() => openFolder(claim.id, claim.ref)}
                >
                  <div className="p-4 md:p-6">
                  {/* Header avec référence du sinistre et label Action requise */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-10">
                      #{claim.ref}
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium h-[24px] !border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span>Action requise</span>
                    </div>
                  </div>

                  {/* Informations du sinistre */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Car size={18} className="text-neutral-60 flex-shrink-0" />
                      <span className="text-sm font-medium text-neutral-10">
                        {claim.vehicle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench size={18} className="text-neutral-60 flex-shrink-0" />
                      <span className="text-sm text-neutral-40">
                        {claim.repairer}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar avec statut et pourcentage */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <Chip
                        label={claim.status}
                        variant="default"
                        size="small"
                        className="bg-accent/10 text-accent font-medium text-xs h-[24px]"
                      />
                      <span className="text-xs font-semibold text-accent">
                        {claim.progress}%
                      </span>
                    </div>
                    <LinearProgress value={claim.progress} />
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-start md:justify-end">
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                        e?.stopPropagation();
                        setEadWizardOpen(true);
                      }}
                      className="w-full md:w-auto gap-2"
                    >
                      <Camera size={18} />
                      Compléter mon dossier
                    </Button>
                  </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Activités récentes (sidebar sur desktop) */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-3xl flex flex-col gap-4 md:gap-6">
            <h2 className="text-lg font-semibold text-neutral-10">
              Activités récentes
            </h2>
            <Card>
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
              <div className="border-t-0 p-2 md:p-4 flex justify-center">
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
          <EADWizardInsured
            folderId={claim?.id || ''}
            onClose={() => setEadWizardOpen(false)}
            onSubmit={(data) => {
              console.log('EAD submitted:', data);
              // TODO: Handle EAD submission
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}
