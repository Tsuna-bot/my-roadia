import { useState } from 'react';
import { Car, User, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useTabs } from '../contexts/TabsContext';
import { mockFolders, getCurrentStatus, calculateProgress } from '../data/mockData';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import ViewToggle from './ViewToggle';
import Card from './Card';
import LinearProgress from './LinearProgress';

type ViewMode = 'grid' | 'list';

interface DossiersPageProps {
  clientName?: string; // Optionnel: si fourni, filtre les dossiers pour ce client
}

export default function DossiersPage({ clientName }: DossiersPageProps = {}) {
  const { openFolder } = useTabs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Map all folders with current status, filtré par client si nécessaire
  const allFolders = mockFolders
    .filter(folder => !clientName || folder.client.name === clientName)
    .map(folder => {
    const currentStatus = getCurrentStatus(folder);
    const progress = calculateProgress(folder);
    return {
      id: folder.id,
      ref: folder.reference,
      client: folder.client.name,
      vehicle: `${folder.vehicle.brand} ${folder.vehicle.model}`,
      immatriculation: folder.vehicle.plate,
      status: currentStatus,
      progress: progress,
      dateCreation: folder.createdDate,
      location: folder.client.address,
      isPriority: currentStatus === 'Planification d\'un examen' || currentStatus === 'Complétion d\'un dossier à distance',
    };
  });

  // Filter folders based on search and filters
  const filteredFolders = allFolders.filter(folder => {
    // Search filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      folder.ref.toLowerCase().includes(query) ||
      folder.vehicle.toLowerCase().includes(query) ||
      folder.client.toLowerCase().includes(query) ||
      folder.immatriculation.toLowerCase().includes(query);

    // Status filter
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'priority' && folder.isPriority) ||
      folder.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full">
      {/* Centered content container - max width 1920px */}
      <div className="max-w-[1920px] mx-auto p-4 md:p-16">
      {/* Header */}
      <div className="mb-6 md:mb-12">
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-10 leading-tight">
            {clientName ? 'Mes sinistres' : 'Tous les dossiers'}
          </h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-md font-medium h-[24px] !border-0">
            <span>{filteredFolders.length}</span>
          </div>
        </div>
        <p className="text-sm md:text-base text-neutral-60">
          {clientName ? 'Suivez l\'avancement de vos sinistres déclarés' : 'Gérez tous vos dossiers en cours et archivés'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder={clientName
            ? "Rechercher par référence, véhicule ou immatriculation..."
            : "Rechercher par référence, véhicule, assuré ou immatriculation..."
          }
          placeholderMobile="Rechercher..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-3xl md:items-center md:justify-between">
        <FilterButton
          selected={selectedFilter}
          onChange={setSelectedFilter}
          className="w-full md:w-auto"
        />
        <div className="hidden md:block">
          <ViewToggle
            value={viewMode}
            onChange={setViewMode}
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredFolders.length === 0 && (
        <div className="text-center py-3xl px-8 bg-neutral-98 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <Car size={48} className="text-neutral-60 mx-auto mb-4" />
          <p className="text-base font-medium text-neutral-40 mb-1">
            Aucun dossier trouvé
          </p>
          <p className="text-sm text-neutral-60">
            {searchQuery || selectedFilter !== 'all'
              ? 'Essayez de modifier vos critères de recherche ou filtres'
              : 'Les dossiers apparaîtront ici'}
          </p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredFolders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => openFolder(folder.id, folder.ref)}
              className="
                w-full text-left rounded-lg transition-all duration-[250ms]
                group focus-ring active:scale-[0.98] md:active:scale-100
              "
            >
              <Card className="
                w-full h-full !border-0
                bg-white
                shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                md:group-hover:shadow-md
                md:group-hover:-translate-y-1
                transition-all duration-[250ms]
                rounded-xl
              ">
                <div className="p-4 md:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-10">
                      {folder.ref}
                    </h3>
                    {folder.isPriority && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium h-[24px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span>Prioritaire</span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle & Client */}
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

                  {/* Date & Location */}
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-neutral-60 flex-shrink-0" />
                      <span className="text-xs text-neutral-60">
                        Créé le {new Date(folder.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-neutral-60 flex-shrink-0" />
                      <span className="text-xs text-neutral-60 truncate">
                        {folder.location}
                      </span>
                    </div>
                  </div>

                  {/* Status & Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-end mb-1">
                      <span className="text-xs font-semibold text-accent">
                        {folder.progress}%
                      </span>
                    </div>
                    <LinearProgress value={folder.progress} />
                    <div className="mt-1">
                      <span className="text-xs font-medium text-accent">
                        {folder.status}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="flex items-center justify-end text-accent text-sm font-semibold gap-1">
                    <span>Voir le dossier</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredFolders.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => openFolder(folder.id, folder.ref)}
              className="
                w-full text-left rounded-lg transition-all duration-[250ms]
                group focus-ring active:scale-[0.98] md:active:scale-100
              "
            >
              <Card className="
                w-full !border-0
                bg-white
                shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                md:group-hover:shadow-md
                md:group-hover:-translate-y-1
                transition-all duration-[250ms]
                rounded-xl
              ">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Left: Reference & Priority */}
                    <div className="flex items-center gap-4 md:w-48">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-neutral-10 mb-1">
                          {folder.ref}
                        </h3>
                        {folder.isPriority && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium h-[24px] w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span>Prioritaire</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Vehicle & Client Info */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Car size={16} className="text-neutral-60 flex-shrink-0" />
                          <span className="text-sm font-medium text-neutral-10">
                            {folder.vehicle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-neutral-60 flex-shrink-0" />
                          <span className="text-sm text-neutral-40">
                            {folder.client}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={16} className="text-neutral-60 flex-shrink-0" />
                          <span className="text-xs text-neutral-60">
                            {new Date(folder.dateCreation).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-neutral-60 flex-shrink-0" />
                          <span className="text-xs text-neutral-60 truncate">
                            {folder.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Progress */}
                    <div className="md:w-64">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-xs font-semibold text-accent">
                          {folder.progress}%
                        </span>
                      </div>
                      <LinearProgress value={folder.progress} />
                      <div className="mt-1">
                        <span className="text-xs font-medium text-accent">
                          {folder.status}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center w-8">
                      <ChevronRight size={20} className="text-accent" />
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
