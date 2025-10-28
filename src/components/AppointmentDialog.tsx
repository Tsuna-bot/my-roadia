import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import Dialog from './Dialog';
import Button from './Button';
import Divider from './Divider';

interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  folderId?: string;
}

export default function AppointmentDialog({ open, onClose, folderId }: AppointmentDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    origin: '',
    description: '',
    mileage: '',
    airbagDeployed: '',
    vehicleTowed: '',
    inspectionType: '',
  });

  const handleClose = () => {
    setStep(1);
    setFormData({
      origin: '',
      description: '',
      mileage: '',
      airbagDeployed: '',
      vehicleTowed: '',
      inspectionType: '',
    });
    onClose();
  };

  const handleConfirm = () => {
    console.log('Rendez-vous demandé:', { folderId, ...formData });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" title={step === 1 ? 'Planifier un examen' : 'Choisir le type d\'expertise'}>
      {step === 1 ? (
        <div className="flex flex-col gap-12 p-4 md:p-8">
          {/* Informations sur le sinistre */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              Informations sur le sinistre
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Origine de l'événement (ex: Collision, vol...)"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="
                  w-full p-4 text-sm rounded-xl
                  bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                  border-0 outline-none
                  placeholder:text-neutral-60
                  hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                  transition-all duration-[250ms]
                "
              />

              <textarea
                rows={3}
                placeholder="Description de l'événement..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="
                  w-full p-4 text-sm rounded-xl
                  bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                  border-0 outline-none
                  placeholder:text-neutral-60
                  hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                  focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                  transition-all duration-[250ms]
                "
              />

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Kilométrage"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="
                    flex-1 p-4 text-sm rounded-xl
                    bg-neutral-95 shadow-[0_1px_3px_rgba(0,0,0,0.08)]
                    border-0 outline-none
                    placeholder:text-neutral-60
                    hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
                    focus:outline-none focus:border-0 focus:shadow-[0_2px_8px_rgba(0,47,107,0.15)]
                    transition-all duration-[250ms]
                  "
                />
                <span className="text-sm text-neutral-60">km</span>
              </div>
            </div>
          </div>

          <Divider />

          {/* État du véhicule */}
          <div>
            <p className="text-sm font-semibold text-neutral-40 uppercase tracking-wide mb-4">
              État du véhicule
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-10 mb-2">
                  Les airbags se sont-ils déclenchés ?
                </p>
                <div className="relative flex items-center rounded-xl p-1 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] w-full md:w-fit">
                  {/* Sliding background - only show after selection */}
                  {formData.airbagDeployed && (
                    <div
                      className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-accent/10 rounded-lg transition-all duration-300 ease-in-out"
                      style={{
                        left: formData.airbagDeployed === 'non' ? '4px' : 'calc(50% + 0px)',
                      }}
                    />
                  )}

                  <button
                    onClick={() => setFormData({ ...formData, airbagDeployed: 'non' })}
                    className={`
                      relative z-10 flex-1 md:flex-none px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold
                      ${formData.airbagDeployed === 'non' ? 'text-accent' : 'text-neutral-60 hover:text-neutral-40'}
                    `}
                  >
                    Non
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, airbagDeployed: 'oui' })}
                    className={`
                      relative z-10 flex-1 md:flex-none px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold
                      ${formData.airbagDeployed === 'oui' ? 'text-accent' : 'text-neutral-60 hover:text-neutral-40'}
                    `}
                  >
                    Oui
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-neutral-10 mb-2">
                  Le véhicule a-t-il été remorqué ?
                </p>
                <div className="relative flex items-center rounded-xl p-1 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] w-full md:w-fit">
                  {/* Sliding background - only show after selection */}
                  {formData.vehicleTowed && (
                    <div
                      className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-accent/10 rounded-lg transition-all duration-300 ease-in-out"
                      style={{
                        left: formData.vehicleTowed === 'non' ? '4px' : 'calc(50% + 0px)',
                      }}
                    />
                  )}

                  <button
                    onClick={() => setFormData({ ...formData, vehicleTowed: 'non' })}
                    className={`
                      relative z-10 flex-1 md:flex-none px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold
                      ${formData.vehicleTowed === 'non' ? 'text-accent' : 'text-neutral-60 hover:text-neutral-40'}
                    `}
                  >
                    Non
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, vehicleTowed: 'oui' })}
                    className={`
                      relative z-10 flex-1 md:flex-none px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold
                      ${formData.vehicleTowed === 'oui' ? 'text-accent' : 'text-neutral-60 hover:text-neutral-40'}
                    `}
                  >
                    Oui
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <Button variant="secondary" size="medium" onClick={handleClose} className="w-full md:w-auto">
              Annuler
            </Button>
            <Button variant="primary" size="medium" onClick={() => setStep(2)} className="w-full md:w-auto">
              Suivant
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-12 p-4 md:p-8">
          <p className="text-sm text-neutral-40">
            Choisissez comment vous souhaitez faire expertiser votre véhicule
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setFormData({ ...formData, inspectionType: 'photos' })}
              className={`
                p-8 rounded-lg border-2 transition-all duration-150
                hover:shadow-[0_0_0_2px_#002f6b_inset]
                ${formData.inspectionType === 'photos'
                  ? 'border-accent bg-accent/5'
                  : 'border-neutral-90 bg-white'
                }
              `}
            >
              <Camera size={40} className="text-accent mx-auto mb-4" />
              <h3 className="text-base font-bold text-neutral-10 mb-2">
                Expertise par photos
              </h3>
              <p className="text-sm text-neutral-60">
                Téléchargez des photos de votre véhicule pour une expertise à distance
              </p>
            </button>

            <button
              onClick={() => setFormData({ ...formData, inspectionType: 'on-site' })}
              className={`
                p-8 rounded-lg border-2 transition-all duration-150
                hover:shadow-[0_0_0_2px_#002f6b_inset]
                ${formData.inspectionType === 'on-site'
                  ? 'border-accent bg-accent/5'
                  : 'border-neutral-90 bg-white'
                }
              `}
            >
              <User size={40} className="text-accent mx-auto mb-4" />
              <h3 className="text-base font-bold text-neutral-10 mb-2">
                Expertise sur place
              </h3>
              <p className="text-sm text-neutral-60">
                Un expert se déplacera pour examiner votre véhicule
              </p>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <Button variant="secondary" size="medium" onClick={() => setStep(1)} className="w-full md:w-auto">
              Retour
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={handleConfirm}
              disabled={!formData.inspectionType}
              className="w-full md:w-auto"
            >
              Confirmer
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
