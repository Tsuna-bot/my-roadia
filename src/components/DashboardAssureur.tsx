import { useState } from 'react';
import {
  CheckCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  AlertTriangle,
  Gavel,
  Folder,
  Info,
  X,
} from 'lucide-react';
import Card from './Card';
import StatistiquesInsurer from './StatistiquesInsurer';
import MessageCommunication from './MessageCommunication';

export default function DashboardAssureur() {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Activités récentes pour l'assureur
  const allActivities = [
    {
      id: '1',
      title: 'Nouveau dossier créé',
      description: 'DOS-2025-0042 - Collision latérale',
      time: 'Il y a 30 min',
      icon: Folder,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
    },
    {
      id: '2',
      title: 'Expertise terminée',
      description: 'Rapport validé pour DOS-2025-0038',
      time: 'Il y a 1h',
      icon: TrendingUp,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      id: '3',
      title: 'Document reçu',
      description: 'Constat amiable pour DOS-2025-0041',
      time: 'Il y a 2h',
      icon: FileText,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
    },
    {
      id: '4',
      title: 'Nouveau message',
      description: 'L\'expert a contacté DOS-2025-0040',
      time: 'Il y a 3h',
      icon: MessageSquare,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
    },
    {
      id: '5',
      title: 'Nouveau assuré',
      description: 'Jean Martin a été ajouté au système',
      time: 'Il y a 5h',
      icon: User,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      id: '6',
      title: 'Action requise',
      description: 'Validation en attente pour DOS-2025-0037',
      time: 'Hier',
      icon: AlertTriangle,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
    },
    {
      id: '7',
      title: 'Dossier clôturé',
      description: 'DOS-2025-0036 archivé avec succès',
      time: 'Hier',
      icon: CheckCircle,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      id: '8',
      title: 'Décision juridique',
      description: 'Arbitrage complété pour DOS-2025-0035',
      time: 'Il y a 2 jours',
      icon: Gavel,
      iconColor: 'text-neutral-40',
      iconBg: 'bg-neutral-95',
    },
    {
      id: '9',
      title: 'Rapport statistique',
      description: 'Analyse mensuelle disponible',
      time: 'Il y a 3 jours',
      icon: TrendingUp,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      id: '10',
      title: 'Expert assigné',
      description: 'Marie Martin assignée à DOS-2025-0034',
      time: 'Il y a 5 jours',
      icon: User,
      iconColor: 'text-accent',
      iconBg: 'bg-accent/10',
    },
  ];

  const INITIAL_DISPLAY_COUNT = 3;
  const visibleActivities = showAllActivities
    ? allActivities
    : allActivities.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 flex flex-col gap-4 md:gap-12">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-neutral-10 leading-tight mb-1">
          Bonjour M. Christophe MITHIEUX
        </h1>
        <p className="text-sm md:text-base text-neutral-60">
          Vue d'ensemble de tous les dossiers d'expertise
        </p>
      </div>

      {/* Important Message Banner */}
      {showBanner && (
        <div>
          <div className="relative bg-accent/10 rounded-xl p-2 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-2 md:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Info size={20} className="text-accent" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-neutral-10 mb-1">
                  Message important
                </h3>
                <p className="text-sm text-neutral-40 leading-relaxed">
                  Le jour férié du 25 décembre ne sera pas travaillé par nos équipes. Nous vous souhaitons de joyeuses fêtes de fin d'année.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-accent/20 transition-colors duration-150"
                aria-label="Fermer le message"
              >
                <X size={18} className="text-neutral-60" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layout en 2 colonnes sur desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
        {/* Colonne gauche - Statistiques + Communication */}
        <div className="lg:col-span-9 flex flex-col gap-4 md:gap-16">
          {/* Statistiques */}
          <StatistiquesInsurer />

          {/* Communication */}
          <MessageCommunication />
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}>
                        <Icon size={20} className={activity.iconColor} />
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
    </div>
  );
}
