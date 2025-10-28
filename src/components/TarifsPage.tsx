import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Euro, ChevronDown, Trash2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Dialog from './Dialog';
import Select from './Select';
import SearchBar from './SearchBar';
import FilterButton from './FilterButton';
import Chip from './Chip';
import DatePicker from './DatePicker';
import Divider from './Divider';
import { mockPricingRates, PricingRate } from '../data/mockData';

const categoryLabels: Record<string, string> = {
  'main-oeuvre': 'Main d\'oeuvre',
  'pieces': 'Pièces',
  'expertise': 'Expertise',
  'deplacement': 'Déplacement',
};

const categoryColors: Record<string, string> = {
  'main-oeuvre': 'bg-accent/10 text-accent',
  'pieces': 'bg-accent/10 text-accent',
  'expertise': 'bg-accent/10 text-accent',
  'deplacement': 'bg-accent/10 text-accent',
};

// Composant Accordion personnalisé
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function Accordion({ title, children, defaultExpanded = false }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [height, setHeight] = useState<number | undefined>(defaultExpanded ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  return (
    <div className="rounded-xl bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-neutral-90 transition-colors duration-150"
      >
        <h3 className="text-sm md:text-base font-semibold text-neutral-10">{title}</h3>
        <ChevronDown
          size={20}
          className={`text-neutral-60 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        ref={contentRef}
        style={{ height: height }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="p-4 md:p-6 border-t border-neutral-90">
          {children}
        </div>
      </div>
    </div>
  );
}

// Composant PriceField réutilisable
interface PriceFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

function PriceField({ label, value, onChange }: PriceFieldProps) {
  return (
    <div className="flex-1">
      <label className="block text-xs md:text-sm font-medium text-neutral-40 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="
            w-full px-4 pr-[40px] h-[44px] text-sm rounded-xl
            bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]
            border-0 outline-none
            placeholder:text-neutral-60
            hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
            focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
            transition-all duration-[250ms]
          "
        />
        <Euro size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-60" />
      </div>
    </div>
  );
}

// Composant Toggle Switch personnalisé
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-4 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`
          relative w-[48px] h-[24px] rounded-full transition-colors duration-[250ms] cursor-pointer
          ${checked ? 'bg-accent' : 'bg-neutral-85'}
        `}
      >
        <div
          className={`
            absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full
            transition-transform duration-[250ms] shadow-sm
            ${checked ? 'translate-x-[26px]' : 'translate-x-[2px]'}
          `}
        />
      </div>
      <span className="text-sm text-neutral-20">{label}</span>
    </label>
  );
}

const tarifFilters = [
  { value: 'all', label: 'Toutes catégories' },
  { value: 'main-oeuvre', label: 'Main d\'oeuvre' },
  { value: 'pieces', label: 'Pièces' },
  { value: 'expertise', label: 'Expertise' },
  { value: 'deplacement', label: 'Déplacement' },
];

export default function TarifsPage() {
  const [rates, setRates] = useState<PricingRate[]>(mockPricingRates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<PricingRate | null>(null);
  const [animatingRateId, setAnimatingRateId] = useState<string | null>(null);
  const [hasInitiallyRendered, setHasInitiallyRendered] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Mark as initially rendered after first render
  useEffect(() => {
    setHasInitiallyRendered(true);
  }, []);

  const initialFormState: Partial<PricingRate> = {
    name: '',
    typeTarif: 'main-oeuvre',
    groupementAssurance: '',
    assurance: '',
    dateApplicative: new Date().toISOString().split('T')[0],
    devise: 'EUR',
    natureAccord: 'convention',
    referenceAccord: '',
    aPartirDeJours: 0,
    fraisGardiennage: false,
    reglementDirectReparateur: false,
    tolerieT1: 0,
    tolerieT2: 0,
    tolerieT3: 0,
    mecaniqueM1: 0,
    mecaniqueM2: 0,
    mecaniqueM3: 0,
    electriciteE1: 0,
    electriciteE2: 0,
    electriciteE3: 0,
    sellerieS1: 0,
    sellerieS2: 0,
    sellerieS3: 0,
    peintureP1: 0,
    peintureP2: 0,
    debosselageAvecPeinture: 0,
    debosselageSansPeinture: 0,
    ingredientsOpaque: 0,
    ingredientsVernis: 0,
    ingredientsNacre: 0,
    ingredientsAutre: 0,
    gardiennageJournalierTTC: 0,
    remplacementVehicule: 0,
    description: '',
    unitPrice: 0,
    unit: 'heure',
    tva: 20,
    isActive: true,
  };

  const [formData, setFormData] = useState<Partial<PricingRate>>(initialFormState);

  // Detect mobile
  const isMobile = window.innerWidth < 768;

  const filteredRates = rates
    .filter((rate) => {
      const matchesSearch =
        rate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.groupementAssurance.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.assurance.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || rate.typeTarif === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Les tarifs actifs avant les inactifs
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return 0;
    });

  const handleOpenModal = (rate?: PricingRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData(rate);
    } else {
      setEditingRate(null);
      setFormData(initialFormState);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRate(null);
    setFormData(initialFormState);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || formData.unitPrice === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingRate) {
      setRates(
        rates.map((r) =>
          r.id === editingRate.id
            ? {
                ...r,
                ...formData,
                lastModified: new Date().toISOString().split('T')[0],
              } as PricingRate
            : r
        )
      );
    } else {
      const newRate: PricingRate = {
        id: `${Date.now()}`,
        ...(formData as Omit<PricingRate, 'id' | 'createdDate' | 'lastModified'>),
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
      };
      setRates([...rates, newRate]);
    }

    handleCloseModal();
  };

  const handleToggleActive = (rateId: string) => {
    const card = cardRefs.current.get(rateId);
    if (!card) return;

    // FLIP: First - Get initial position
    const firstRect = card.getBoundingClientRect();

    setAnimatingRateId(rateId);

    // Update state immediately to trigger re-render
    setRates(
      rates.map((r) =>
        r.id === rateId
          ? {
              ...r,
              isActive: !r.isActive,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    // FLIP: Last & Invert - Get final position after next render
    requestAnimationFrame(() => {
      const lastRect = card.getBoundingClientRect();
      const deltaY = firstRect.top - lastRect.top;

      // Invert: Apply transform to move it back to original position
      card.style.transform = `translateY(${deltaY}px) scale(1.05)`;
      card.style.transition = 'none';
      card.style.zIndex = '100';
      card.style.animation = 'none'; // Disable slide-in animation

      // Play: Animate to final position
      requestAnimationFrame(() => {
        card.style.transition = 'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)';
        card.style.transform = 'translateY(0) scale(1)';

        // Cleanup after animation
        setTimeout(() => {
          card.style.zIndex = '';
          card.style.transition = '';
          card.style.transform = '';
          card.style.animation = '';
          setAnimatingRateId(null);
        }, 1050);
      });
    });
  };

  const handleDelete = (rateId: string) => {
    setRates(rates.filter((r) => r.id !== rateId));
    setDeleteConfirmId(null);
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16">
      {/* Page Header */}
      <div className="mb-6 md:mb-12">
        <h1 className="text-xl md:text-2xl font-bold text-neutral-10 mb-1 leading-tight">
          Tarifs
        </h1>
        <p className="text-sm md:text-base text-neutral-60">
          Gérez vos grilles tarifaires et accords
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Rechercher un tarif..."
          placeholderMobile="Rechercher..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Filter */}
      <div className="mb-6 md:mb-3xl">
        <FilterButton
          selected={categoryFilter}
          onChange={setCategoryFilter}
          filters={tarifFilters}
          className="w-full md:w-auto"
        />
      </div>

      {/* Rates List */}
      <div className="flex flex-col gap-4">
        {/* Empty card for creating new tarif */}
        <Card
          onClick={() => handleOpenModal()}
          className="
            border-2 border-dashed border-neutral-85 bg-neutral-95 cursor-pointer
            transition-all duration-150
            active:scale-[0.98]
            md:hover:border-accent md:hover:bg-accent/5 md:hover:-translate-y-[2px]
          "
        >
          <div className="p-2 md:p-4 flex items-center justify-center gap-1 md:gap-4">
            <Plus size={18} className="md:w-5 md:h-5 text-accent" />
            <span className="text-xs md:text-sm lg:text-base font-semibold text-accent">
              Créer un nouveau tarif
            </span>
          </div>
        </Card>

        {filteredRates.length === 0 ? (
          <Card className="p-4xl text-center">
            <p className="text-lg text-neutral-60">Aucun tarif trouvé</p>
          </Card>
        ) : (
          filteredRates.map((rate, index) => {
            const setCardRef = (el: HTMLDivElement | null) => {
              if (el) {
                cardRefs.current.set(rate.id, el);
              } else {
                cardRefs.current.delete(rate.id);
              }
            };

            return (
              <div key={rate.id} ref={setCardRef}>
                <Card
                  style={{
                    animationDelay: !hasInitiallyRendered && animatingRateId !== rate.id ? `${index * 50}ms` : '0ms',
                  }}
                  className={`
                    active:scale-[0.98]
                    md:hover:border-accent ${animatingRateId !== rate.id ? 'md:hover:-translate-y-[2px]' : ''}
                    ${rate.isActive ? 'bg-white' : 'bg-neutral-95'}
                    ${!hasInitiallyRendered && animatingRateId !== rate.id ? 'animate-slide-in' : ''}
                    transition-colors duration-300
                  `}
                >
              <div className="p-2 md:p-4 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 lg:gap-8">
                <div className="flex items-center gap-4 md:gap-8 flex-1">
                  <div className="flex-1">
                    <h3
                      className={`
                        text-sm md:text-base font-bold mb-1
                        ${rate.isActive ? 'text-neutral-10' : 'text-neutral-60'}
                      `}
                    >
                      {rate.name}
                    </h3>
                    <Chip
                      label={categoryLabels[rate.typeTarif]}
                      size="small"
                      className={categoryColors[rate.typeTarif]}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
                  <ToggleSwitch
                    label={rate.isActive ? 'Actif' : 'Inactif'}
                    checked={rate.isActive}
                    onChange={() => handleToggleActive(rate.id)}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(rate)}
                      className="
                        w-[40px] h-[40px] md:w-[44px] md:h-[44px]
                        flex items-center justify-center
                        rounded-md text-accent
                        hover:bg-accent/10
                        transition-colors duration-150
                      "
                      aria-label="Modifier le tarif"
                    >
                      <Edit size={20} />
                    </button>
                    {deleteConfirmId === rate.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(rate.id)}
                          className="
                            w-[40px] h-[40px] md:w-[44px] md:h-[44px]
                            flex items-center justify-center
                            rounded-md text-white bg-error
                            hover:bg-error/90
                            transition-colors duration-150
                          "
                          aria-label="Confirmer la suppression"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="
                            px-2 py-1 text-xs font-semibold
                            rounded-md text-neutral-60
                            hover:bg-neutral-90
                            transition-colors duration-150
                          "
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(rate.id)}
                        className="
                          w-[40px] h-[40px] md:w-[44px] md:h-[44px]
                          flex items-center justify-center
                          rounded-md text-error
                          hover:bg-error/10
                          transition-colors duration-150
                        "
                        aria-label="Supprimer le tarif"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullScreen={isMobile}
        className={isMobile ? 'rounded-none' : ''}
        title={editingRate ? 'Modifier le tarif' : 'Nouveau tarif'}
      >
        <div className="flex flex-col gap-12 p-8 overflow-auto">
          {/* Informations générales */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              Informations générales
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Nom du tarif
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Heure de main d'oeuvre"
                  className="
                    w-full px-4 h-[44px] text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                  "
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Type de tarif
                </label>
                <Select
                  value={formData.typeTarif || 'main-oeuvre'}
                  onChange={(value) => setFormData({ ...formData, typeTarif: value as PricingRate['typeTarif'] })}
                  options={[
                    { value: 'main-oeuvre', label: 'Main d\'oeuvre' },
                    { value: 'pieces', label: 'Pièces' },
                    { value: 'expertise', label: 'Expertise' },
                    { value: 'deplacement', label: 'Déplacement' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du tarif..."
                  rows={3}
                  className="
                    w-full p-4 text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                    resize-none
                  "
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Accord et assurance */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              Accord et assurance
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Groupement d'assurance
                </label>
                <input
                  type="text"
                  value={formData.groupementAssurance}
                  onChange={(e) => setFormData({ ...formData, groupementAssurance: e.target.value })}
                  placeholder="Ex: Axa Group"
                  className="
                    w-full px-4 h-[44px] text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                  "
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Assurance
                </label>
                <input
                  type="text"
                  value={formData.assurance}
                  onChange={(e) => setFormData({ ...formData, assurance: e.target.value })}
                  placeholder="Ex: Axa France"
                  className="
                    w-full px-4 h-[44px] text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                  "
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Nature de l'accord
                </label>
                <Select
                  value={formData.natureAccord || 'convention'}
                  onChange={(value) =>
                    setFormData({ ...formData, natureAccord: value as PricingRate['natureAccord'] })
                  }
                  options={[
                    { value: 'convention', label: 'Convention' },
                    { value: 'accord-cadre', label: 'Accord cadre' },
                    { value: 'tarif-libre', label: 'Tarif libre' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Référence de l'accord
                </label>
                <input
                  type="text"
                  value={formData.referenceAccord}
                  onChange={(e) => setFormData({ ...formData, referenceAccord: e.target.value })}
                  placeholder="Ex: CONV-AXA-2025-001"
                  className="
                    w-full px-4 h-[44px] text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                  "
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Tarification */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              Tarification
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Prix unitaire
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="
                      w-full px-4 pr-[40px] h-[44px] text-sm rounded-xl
                      bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                      border-0 outline-none
                      placeholder:text-neutral-60
                      hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                      focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                      transition-all duration-[250ms]
                    "
                  />
                  <Euro size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-60" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Devise
                </label>
                <Select
                  value={formData.devise || 'EUR'}
                  onChange={(value) => setFormData({ ...formData, devise: value as PricingRate['devise'] })}
                  options={[
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'GBP', label: 'GBP (£)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  Date applicative
                </label>
                <DatePicker
                  value={formData.dateApplicative || ''}
                  onChange={(value) => setFormData({ ...formData, dateApplicative: value })}
                  placeholder="Sélectionner une date"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-60 mb-1">
                  À partir de
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={formData.aPartirDeJours}
                    onChange={(e) => setFormData({ ...formData, aPartirDeJours: parseInt(e.target.value) })}
                    placeholder="0"
                    className="
                      flex-1 px-4 h-[44px] text-sm rounded-xl
                      bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                      border-0 outline-none
                      placeholder:text-neutral-60
                      hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                      focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                      transition-all duration-[250ms]
                    "
                  />
                  <span className="text-sm text-neutral-60">jours</span>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Options */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              Options
            </p>
            <div className="flex flex-col gap-2">
              <ToggleSwitch
                label="Frais de gardiennage"
                checked={formData.fraisGardiennage || false}
                onChange={(checked) => setFormData({ ...formData, fraisGardiennage: checked })}
              />
              <ToggleSwitch
                label="Règlement direct au réparateur"
                checked={formData.reglementDirectReparateur || false}
                onChange={(checked) => setFormData({ ...formData, reglementDirectReparateur: checked })}
              />
            </div>
          </div>

          {/* Sections tarifaires en accordéons */}
          <Accordion title="Tolerie">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="T1"
                value={formData.tolerieT1 || 0}
                onChange={(val) => setFormData({ ...formData, tolerieT1: val })}
              />
              <PriceField
                label="T2"
                value={formData.tolerieT2 || 0}
                onChange={(val) => setFormData({ ...formData, tolerieT2: val })}
              />
              <PriceField
                label="T3"
                value={formData.tolerieT3 || 0}
                onChange={(val) => setFormData({ ...formData, tolerieT3: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Mécanique">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="M1"
                value={formData.mecaniqueM1 || 0}
                onChange={(val) => setFormData({ ...formData, mecaniqueM1: val })}
              />
              <PriceField
                label="M2"
                value={formData.mecaniqueM2 || 0}
                onChange={(val) => setFormData({ ...formData, mecaniqueM2: val })}
              />
              <PriceField
                label="M3"
                value={formData.mecaniqueM3 || 0}
                onChange={(val) => setFormData({ ...formData, mecaniqueM3: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Electricité">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="E1"
                value={formData.electriciteE1 || 0}
                onChange={(val) => setFormData({ ...formData, electriciteE1: val })}
              />
              <PriceField
                label="E2"
                value={formData.electriciteE2 || 0}
                onChange={(val) => setFormData({ ...formData, electriciteE2: val })}
              />
              <PriceField
                label="E3"
                value={formData.electriciteE3 || 0}
                onChange={(val) => setFormData({ ...formData, electriciteE3: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Sellerie">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="S1"
                value={formData.sellerieS1 || 0}
                onChange={(val) => setFormData({ ...formData, sellerieS1: val })}
              />
              <PriceField
                label="S2"
                value={formData.sellerieS2 || 0}
                onChange={(val) => setFormData({ ...formData, sellerieS2: val })}
              />
              <PriceField
                label="S3"
                value={formData.sellerieS3 || 0}
                onChange={(val) => setFormData({ ...formData, sellerieS3: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Peinture">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="P1"
                value={formData.peintureP1 || 0}
                onChange={(val) => setFormData({ ...formData, peintureP1: val })}
              />
              <PriceField
                label="P2"
                value={formData.peintureP2 || 0}
                onChange={(val) => setFormData({ ...formData, peintureP2: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Débosselage">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="Avec peinture"
                value={formData.debosselageAvecPeinture || 0}
                onChange={(val) => setFormData({ ...formData, debosselageAvecPeinture: val })}
              />
              <PriceField
                label="Sans peinture"
                value={formData.debosselageSansPeinture || 0}
                onChange={(val) => setFormData({ ...formData, debosselageSansPeinture: val })}
              />
            </div>
          </Accordion>

          <Accordion title="Ingrédients">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-6">
                <PriceField
                  label="Opaque"
                  value={formData.ingredientsOpaque || 0}
                  onChange={(val) => setFormData({ ...formData, ingredientsOpaque: val })}
                />
                <PriceField
                  label="Vernis"
                  value={formData.ingredientsVernis || 0}
                  onChange={(val) => setFormData({ ...formData, ingredientsVernis: val })}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <PriceField
                  label="Nacré"
                  value={formData.ingredientsNacre || 0}
                  onChange={(val) => setFormData({ ...formData, ingredientsNacre: val })}
                />
                <PriceField
                  label="Autre"
                  value={formData.ingredientsAutre || 0}
                  onChange={(val) => setFormData({ ...formData, ingredientsAutre: val })}
                />
              </div>
            </div>
          </Accordion>

          <Accordion title="Coûts supplémentaires">
            <div className="flex flex-col md:flex-row gap-6">
              <PriceField
                label="Gardiennage journalier TTC"
                value={formData.gardiennageJournalierTTC || 0}
                onChange={(val) => setFormData({ ...formData, gardiennageJournalierTTC: val })}
              />
              <PriceField
                label="Remplacement véhicule"
                value={formData.remplacementVehicule || 0}
                onChange={(val) => setFormData({ ...formData, remplacementVehicule: val })}
              />
            </div>
          </Accordion>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button variant="secondary" size="medium" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button variant="primary" size="medium" onClick={handleSave}>
              {editingRate ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </div>
      </Dialog>
      </div>
    </div>
  );
}
