import { useState, useEffect } from 'react';
import {
  Car,
  Camera,
  CheckCircle,
  X,
  AlertCircle,
  Gauge,
  Hash,
  Info,
  Save,
  ChevronRight,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import Button from './Button';
import { mockFolders } from '../data/mockData';

interface EADWizardInsuredProps {
  folderId?: string;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

// Wizard steps configuration for INSURED - Uber style (1 question per screen)
const steps = [
  {
    id: 'vehicle-info',
    question: 'Vérifiez les informations de votre véhicule',
    field: 'vehicleErrorMessage',
    type: 'vehicle-info',
    icon: Car,
    help: 'Les informations ci-dessous sont correctes ? Sinon, signalez-nous les erreurs.',
    optional: true,
    label: 'Véhicule'
  },
  {
    id: 'registration-card',
    question: 'Photo de la carte grise',
    field: 'carteGrise',
    type: 'photo',
    icon: FileText,
    help: 'Prenez une photo de votre carte grise (recto et verso si besoin)',
    optional: true,
    label: 'Carte grise'
  },
  {
    id: 'odometer',
    question: 'Photo du compteur kilométrique',
    field: 'photoCompteur',
    type: 'photo',
    icon: Gauge,
    help: 'Prenez une photo claire du compteur allumé',
    optional: true,
    label: 'Compteur'
  },
  {
    id: 'serial-number',
    question: 'Photo du numéro de série',
    field: 'numeroSerie',
    type: 'photo',
    icon: Hash,
    help: 'Prenez une photo du numéro VIN (visible sur le pare-brise ou châssis)',
    optional: true,
    label: 'N° série'
  },
  {
    id: 'vehicle-photos',
    question: 'Photos du véhicule (4 angles)',
    field: 'photos4angles',
    type: 'photo-grid',
    icon: Camera,
    help: 'Prenez 4 photos de votre véhicule sous différents angles',
    optional: true,
    label: 'Photos véhicule'
  },
  {
    id: 'damage-photos',
    question: 'Photo(s) du sinistre',
    field: 'photoSinistre',
    type: 'photo',
    icon: AlertCircle,
    help: 'Prenez des photos des dommages causés par le sinistre',
    optional: true,
    label: 'Sinistre'
  },
  {
    id: 'observations',
    question: 'Observations et PRE',
    field: 'observations',
    type: 'observations',
    icon: Info,
    help: 'Ajoutez des observations complémentaires et le procès-verbal de remise en état (PRE)',
    optional: true,
    label: 'Observations'
  },
];

export default function EADWizardInsured({
  folderId,
  onClose,
  onSubmit,
}: EADWizardInsuredProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Get folder data
  const folder = mockFolders.find(f => f.id === folderId);
  const vehicle = folder?.vehicle;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form data state
  const [formData, setFormData] = useState({
    vehicleErrorMessage: '',
    carteGrise: [] as UploadedFile[],
    photoCompteur: [] as UploadedFile[],
    numeroSerie: [] as UploadedFile[],
    photo34AvantDroit: [] as UploadedFile[],
    photo34AvantGauche: [] as UploadedFile[],
    photo34ArriereDroit: [] as UploadedFile[],
    photo34ArriereGauche: [] as UploadedFile[],
    photoSinistre: [] as UploadedFile[],
    observations: '',
    pre: '',
  });

  // File upload handler
  const handleFileUpload = (fieldName: keyof typeof formData, files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] as UploadedFile[]), ...newFiles],
    }));
  };

  // Remove uploaded file
  const handleRemoveFile = (fieldName: keyof typeof formData, fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] as UploadedFile[]).filter((f) => f.id !== fileId),
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('EAD Assuré soumis:', formData);
    onSubmit?.(formData);
    onClose?.();
  };

  const handleSaveDraft = () => {
    console.log('Brouillon sauvegardé:', formData);
    alert('Brouillon sauvegardé ! Vous pourrez reprendre plus tard.');
    onClose?.();
  };

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData?.icon || Camera;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Safety check
  if (!currentStepData) {
    return null;
  }

  // Desktop: Single scrollable form
  if (!isMobile) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Vehicle Info */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Car size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-10">Informations du véhicule</h3>
                  <p className="text-xs text-neutral-60">Signalez toute erreur si nécessaire</p>
                </div>
              </div>

              {vehicle && (
                <div className="mb-4 p-4 bg-neutral-98 rounded-xl border border-neutral-90">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-60 text-xs">Marque et modèle</span>
                      <p className="font-semibold text-neutral-10">{vehicle.brand} {vehicle.model}</p>
                    </div>
                    <div>
                      <span className="text-neutral-60 text-xs">Année</span>
                      <p className="font-semibold text-neutral-10">{vehicle.year}</p>
                    </div>
                    <div>
                      <span className="text-neutral-60 text-xs">Immatriculation</span>
                      <p className="font-semibold text-neutral-10">{vehicle.plate}</p>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                value={formData.vehicleErrorMessage}
                onChange={(e) => setFormData({ ...formData, vehicleErrorMessage: e.target.value })}
                rows={3}
                placeholder="Signalez une erreur..."
                className="w-full p-4 text-sm rounded-xl bg-neutral-98 border border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
              />
            </section>

            {/* Photos Section */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Camera size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-10">Documents et photos</h3>
                  <p className="text-xs text-neutral-60">Téléchargez les documents nécessaires</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Carte grise */}
                <FileUploadBox
                  label="Carte grise"
                  icon={FileText}
                  files={formData.carteGrise}
                  onUpload={(files) => handleFileUpload('carteGrise', files)}
                  onRemove={(id) => handleRemoveFile('carteGrise', id)}
                />

                {/* Compteur */}
                <FileUploadBox
                  label="Compteur km"
                  icon={Gauge}
                  files={formData.photoCompteur}
                  onUpload={(files) => handleFileUpload('photoCompteur', files)}
                  onRemove={(id) => handleRemoveFile('photoCompteur', id)}
                />

                {/* Numéro série */}
                <FileUploadBox
                  label="Numéro de série"
                  icon={Hash}
                  files={formData.numeroSerie}
                  onUpload={(files) => handleFileUpload('numeroSerie', files)}
                  onRemove={(id) => handleRemoveFile('numeroSerie', id)}
                />

                {/* Sinistre */}
                <FileUploadBox
                  label="Photos sinistre"
                  icon={AlertCircle}
                  files={formData.photoSinistre}
                  onUpload={(files) => handleFileUpload('photoSinistre', files)}
                  onRemove={(id) => handleRemoveFile('photoSinistre', id)}
                  multiple
                />
              </div>
            </section>

            {/* 4 Angles */}
            <section>
              <h4 className="text-sm font-semibold text-neutral-10 mb-4">Photos 3/4 du véhicule</h4>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { field: 'photo34AvantDroit', label: 'Avant droit' },
                  { field: 'photo34AvantGauche', label: 'Avant gauche' },
                  { field: 'photo34ArriereDroit', label: 'Arrière droit' },
                  { field: 'photo34ArriereGauche', label: 'Arrière gauche' },
                ].map(({ field, label }) => (
                  <FileUploadBox
                    key={field}
                    label={label}
                    icon={Camera}
                    files={formData[field as keyof typeof formData] as UploadedFile[]}
                    onUpload={(files) => handleFileUpload(field as keyof typeof formData, files)}
                    onRemove={(id) => handleRemoveFile(field as keyof typeof formData, id)}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* Observations */}
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Info size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-10">Observations</h3>
                  <p className="text-xs text-neutral-60">Informations complémentaires</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-10 mb-1">
                    Observations
                  </label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    rows={4}
                    placeholder="Observations complémentaires..."
                    className="w-full p-4 text-sm rounded-xl bg-neutral-98 border border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-10 mb-1">
                    PRE (Procès-verbal)
                  </label>
                  <textarea
                    value={formData.pre}
                    onChange={(e) => setFormData({ ...formData, pre: e.target.value })}
                    rows={4}
                    placeholder="Contenu du PRE..."
                    className="w-full p-4 text-sm rounded-xl bg-neutral-98 border border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="flex-shrink-0 px-8 py-6 border-t border-neutral-90 bg-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="secondary" size="medium" onClick={handleSaveDraft}>
              <Save size={18} />
              Sauvegarder
            </Button>
            <div className="flex gap-4">
              <Button variant="secondary" size="medium" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="primary" size="medium" onClick={handleSubmit}>
                <CheckCircle size={18} />
                Terminer
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Uber-style wizard (current implementation)
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Progress Bar - Thin and subtle */}
      <div className="h-1 bg-neutral-95 flex-shrink-0 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header - Compact */}
      <div className="px-4 pt-4 pb-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={currentStep === 0 ? onClose : handlePrevious}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-95 transition-colors focus-ring"
          aria-label={currentStep === 0 ? 'Fermer' : 'Précédent'}
        >
          <ArrowLeft size={24} className="text-neutral-10" />
        </button>
        <span className="text-xs text-neutral-60 font-medium">
          {currentStep + 1}/{totalSteps}
        </span>
        <button
          onClick={handleSaveDraft}
          className="p-2 -mr-2 rounded-full hover:bg-neutral-95 transition-colors focus-ring"
          aria-label="Sauvegarder"
        >
          <Save size={20} className="text-neutral-60" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Icon + Question + Help text - Horizontal layout */}
        <div className="mb-4">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <StepIcon size={20} className="text-accent md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-bold text-neutral-10 leading-tight">
                {currentStepData.question}
              </h2>
            </div>
          </div>
          <p className="text-xs md:text-sm text-neutral-60 leading-snug pl-[52px] md:pl-[60px]">
            {currentStepData.help}
          </p>
        </div>

        {/* Input based on type */}
        {currentStepData.type === 'vehicle-info' && (
          <div>
            {vehicle && (
              <div className="mb-4 p-4 bg-neutral-98 rounded-xl border-2 border-neutral-90">
                <h4 className="text-xs font-semibold text-neutral-10 mb-2 flex items-center gap-1">
                  <Car size={16} className="text-accent" />
                  Informations du véhicule
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div>
                    <span className="text-neutral-60">Marque</span>
                    <p className="font-semibold text-neutral-10">{vehicle.brand} {vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-neutral-60">Année</span>
                    <p className="font-semibold text-neutral-10">{vehicle.year}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-neutral-60">Immatriculation</span>
                    <p className="font-semibold text-neutral-10">{vehicle.plate}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 p-2 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex gap-1">
                <Info size={14} className="text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-40 leading-snug">
                  Une erreur ? Signalez-la ci-dessous.
                </p>
              </div>
            </div>

            <textarea
              value={formData.vehicleErrorMessage}
              onChange={(e) => setFormData({ ...formData, vehicleErrorMessage: e.target.value })}
              rows={4}
              placeholder="Ex: Le modèle est incorrect..."
              className="w-full p-4 text-sm rounded-xl bg-neutral-98 border-2 border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
            />
          </div>
        )}

        {currentStepData.type === 'photo' && (
          <div>
            <label className="block cursor-pointer mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(currentStepData.field as keyof typeof formData, e.target.files)}
                className="hidden"
              />
              <div className="aspect-[16/9] md:aspect-[4/3] rounded-xl border-2 border-dashed border-neutral-85 bg-neutral-98 flex flex-col items-center justify-center hover:border-accent hover:bg-accent/5 transition-all">
                <Camera size={40} className="text-accent mb-4" />
                <span className="text-base font-semibold text-neutral-10 mb-1">Prendre une photo</span>
                <span className="text-xs text-neutral-60">ou galerie</span>
              </div>
            </label>

            {formData[currentStepData.field as keyof typeof formData] && (formData[currentStepData.field as keyof typeof formData] as UploadedFile[]).length > 0 && (
              <div className="grid grid-cols-3 gap-1">
                {(formData[currentStepData.field as keyof typeof formData] as UploadedFile[]).map((file) => (
                  <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-95 group">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveFile(currentStepData.field as keyof typeof formData, file.id)}
                      className="absolute top-1 right-1 p-1 bg-error/90 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity focus-ring"
                      aria-label="Supprimer"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-1 left-1">
                      <CheckCircle size={16} className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStepData.type === 'photo-grid' && (
          <div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { field: 'photo34AvantDroit', label: 'Avant droit', short: 'AD' },
                { field: 'photo34AvantGauche', label: 'Avant gauche', short: 'AG' },
                { field: 'photo34ArriereDroit', label: 'Arrière droit', short: 'RD' },
                { field: 'photo34ArriereGauche', label: 'Arrière gauche', short: 'RG' },
              ].map(({ field, label, short }) => {
                const fieldData = formData[field as keyof typeof formData] as UploadedFile[];
                const hasPhoto = fieldData && fieldData.length > 0;

                return (
                  <label key={field} className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileUpload(field as keyof typeof formData, e.target.files)}
                      className="hidden"
                    />
                    <div className={`aspect-square rounded-lg border-2 ${hasPhoto ? 'border-success bg-success/5' : 'border-dashed border-neutral-85 bg-neutral-98'} flex flex-col items-center justify-center hover:border-accent transition-all relative overflow-hidden group`}>
                      {hasPhoto ? (
                        <>
                          <img src={fieldData[0].url} alt={label} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Changer</span>
                          </div>
                          <div className="absolute top-1 right-1 bg-success rounded-full p-1">
                            <CheckCircle size={14} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Camera size={24} className="text-accent mb-1" />
                          <span className="text-[10px] font-semibold text-neutral-10 mb-0.5">{short}</span>
                          <span className="text-[9px] font-medium text-neutral-60 text-center px-1 leading-tight">{label}</span>
                        </>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {currentStepData.type === 'observations' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-10 mb-1">
                Observations
              </label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={4}
                placeholder="Ex: Éclats de peinture..."
                className="w-full p-4 text-sm rounded-xl bg-neutral-98 border-2 border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-10 mb-1">
                PRE (Procès-verbal)
              </label>
              <textarea
                value={formData.pre}
                onChange={(e) => setFormData({ ...formData, pre: e.target.value })}
                rows={4}
                placeholder="Contenu du PRE..."
                className="w-full p-4 text-sm rounded-xl bg-neutral-98 border-2 border-neutral-85 focus:border-accent focus:bg-white transition-all outline-none placeholder:text-neutral-60 resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA - Clean and accessible */}
      <div className="px-6 pb-4 pt-4 bg-white border-t border-neutral-90 flex-shrink-0">
        <div className="space-y-2">
          {currentStep < totalSteps - 1 ? (
            <>
              <Button
                variant="primary"
                size="large"
                onClick={handleNext}
                className="w-full justify-center"
              >
                Continuer
                <ChevronRight size={20} />
              </Button>

              {currentStepData.optional && (
                <button
                  onClick={handleNext}
                  className="w-full py-4 text-sm text-neutral-60 font-medium hover:text-neutral-10 transition-colors focus-ring rounded-lg"
                >
                  Passer cette étape
                </button>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={handleSubmit}
              className="w-full justify-center"
            >
              <CheckCircle size={20} />
              Terminer l'expertise
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for file upload boxes (desktop)
function FileUploadBox({
  label,
  icon: Icon,
  files,
  onUpload,
  onRemove,
  multiple = false,
  compact = false,
}: {
  label: string;
  icon: React.ComponentType<any>;
  files: UploadedFile[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  multiple?: boolean;
  compact?: boolean;
}) {
  const hasFiles = files.length > 0;

  return (
    <div>
      <label className="text-xs font-semibold text-neutral-10 mb-2 flex items-center gap-1">
        <Icon size={14} className="text-accent" />
        {label}
      </label>

      {!hasFiles ? (
        <label className="block cursor-pointer">
          <input
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
          />
          <div className={`${compact ? 'aspect-square' : 'aspect-video'} rounded-lg border-2 border-dashed border-neutral-85 bg-neutral-98 flex flex-col items-center justify-center hover:border-accent hover:bg-accent/5 transition-all`}>
            <Camera size={compact ? 20 : 28} className="text-accent mb-1" />
            <span className="text-xs text-neutral-60">Ajouter</span>
          </div>
        </label>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {files.map((file) => (
            <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-95 group">
              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(file.id)}
                className="absolute top-1 right-1 p-1 bg-error/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {multiple && (
            <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-85 bg-neutral-98 flex items-center justify-center cursor-pointer hover:border-accent transition-all">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onUpload(e.target.files)}
                className="hidden"
              />
              <Camera size={20} className="text-accent" />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
