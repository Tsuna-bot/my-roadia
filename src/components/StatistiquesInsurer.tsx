import { TrendingUp } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function StatistiquesInsurer() {
  const handleOpenPowerBI = () => {
    // Ouvrir Power BI dans un nouvel onglet
    window.open('https://app.powerbi.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      {/* Header */}
      <h2 className="text-lg font-semibold text-neutral-10">
        Statistiques
      </h2>

      {/* Power BI Card */}
      <div className="group">
        <Card className="!border-0 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-[250ms] rounded-xl cursor-pointer">
          <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 md:w-16 h-14 md:h-16 rounded-md bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <TrendingUp size={32} className="md:w-9 md:h-9" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-neutral-10 mb-1">
                  Tableaux de bord Power BI
                </h3>
                <p className="text-sm text-neutral-40 leading-relaxed">
                  Consultez vos rapports détaillés et analyses des sinistres en temps réel
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="medium"
              onClick={handleOpenPowerBI}
              className="w-full sm:w-auto min-h-[48px] px-8"
            >
              Voir les statistiques
            </Button>
          </div>
        </div>
        </Card>
      </div>
    </div>
  );
}
