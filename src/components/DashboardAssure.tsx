import { Car, FileText } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function DashboardAssure() {
  const myClaims = [
    {
      id: 'claim-1',
      reference: 'SIN-2024-001',
      date: '15 Oct 2024',
      status: 'En cours',
      vehicle: 'Peugeot 308',
      description: 'Collision arrière',
    },
    {
      id: 'claim-2',
      reference: 'SIN-2024-002',
      date: '10 Oct 2024',
      status: 'Terminé',
      vehicle: 'Renault Clio',
      description: 'Bris de glace',
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 flex flex-col gap-4 md:gap-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-10 mb-1">
          Mes dossiers
        </h1>
        <p className="text-base text-neutral-60">
          Suivez l'avancement de vos déclarations
        </p>
      </div>

      {/* Action card - Nouveau sinistre */}
      <Card
        className="bg-accent/5 border-accent"
      >
        <div className="p-4 md:p-12">
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <FileText size={40} className="text-accent" />
            <div>
              <h2 className="text-lg font-semibold text-neutral-10 mb-1">
                Déclarer un nouveau sinistre
              </h2>
              <p className="text-sm text-neutral-60">
                Commencez une nouvelle déclaration en quelques étapes
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="large"
            className="w-full"
          >
            <FileText size={18} />
            Nouvelle déclaration
          </Button>
        </div>
      </Card>

      {/* Mes sinistres */}
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl font-semibold text-neutral-10">
          Mes sinistres
        </h2>

      <div className="flex flex-col gap-4">
        {myClaims.map((claim) => (
          <button
            key={claim.id}
            className="w-full rounded-lg transition-all duration-[250ms] hover:-translate-y-0.5 focus-ring"
          >
            <Card className="w-full hover:bg-neutral-98">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Car size={32} className="text-accent" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-neutral-10 mb-1">
                        {claim.reference}
                      </h3>
                      <p className="text-sm text-neutral-60">
                        {claim.vehicle} - {claim.description}
                      </p>
                      <p className="text-xs text-neutral-70">
                        {claim.date}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`
                      px-6 py-1 rounded-sm text-sm font-medium
                      ${claim.status === 'Terminé'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                      }
                    `}
                  >
                    {claim.status}
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
}
