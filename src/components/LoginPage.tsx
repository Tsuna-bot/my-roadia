import { useState } from 'react';
import { Wrench, Building2, User } from 'lucide-react';
import Logo from './Logo';
import Card from './Card';

interface LoginPageProps {
  onLogin: (userType: 'reparateur' | 'assureur' | 'assure') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedProfile, setSelectedProfile] = useState<'reparateur' | 'assureur' | 'assure' | null>(null);

  const profiles = [
    {
      id: 'reparateur' as const,
      label: 'Réparateur',
      description: 'Accédez à vos dossiers de réparation',
      icon: Wrench,
    },
    {
      id: 'assureur' as const,
      label: 'Assureur',
      description: 'Gérez les expertises et sinistres',
      icon: Building2,
    },
    {
      id: 'assure' as const,
      label: 'Assuré',
      description: 'Suivez votre dossier de sinistre',
      icon: User,
    },
  ];

  const handleProfileClick = (profileId: 'reparateur' | 'assureur' | 'assure') => {
    setSelectedProfile(profileId);
    setTimeout(() => {
      onLogin(profileId);
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-98 px-4 md:px-16 py-12 md:py-[64px]">
      {/* Logo et titre */}
      <div className="mb-12 md:mb-[80px] text-center flex flex-col items-center gap-2 md:gap-6">
        <div className="w-[120px] md:w-[240px]">
          <Logo width={240} className="w-full h-auto" />
        </div>
        <p className="text-xs md:text-base text-neutral-40">
          Plateforme de gestion des expertises automobiles
        </p>
      </div>

      {/* Titre sélection */}
      <h1 className="text-base md:text-2xl font-semibold text-neutral-10 mb-6 md:mb-3xl">
        Sélectionnez votre profil
      </h1>

      {/* Cartes de profils */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-6 w-full max-w-[900px]">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          return (
            <button
              key={profile.id}
              onClick={() => handleProfileClick(profile.id)}
              className="
                flex-1
                rounded-lg
                transition-all duration-[250ms]
                md:hover:-translate-y-1
                active:scale-[0.98] md:active:scale-100
                focus-ring
              "
            >
              <Card
                className={`
                  w-full
                  ${selectedProfile === profile.id
                    ? 'border-2 border-accent'
                    : 'shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center p-6 md:p-16">
                  {/* Icône */}
                  <div className="
                    w-12 h-12 md:w-20 md:h-20
                    rounded-lg
                    bg-accent/10
                    flex items-center justify-center
                    mb-2 md:mb-6
                  ">
                    <Icon size={28} className="text-accent md:w-10 md:h-10" />
                  </div>

                  {/* Label */}
                  <h2 className="text-sm md:text-lg font-semibold text-neutral-10 mb-1 md:mb-2">
                    {profile.label}
                  </h2>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-neutral-60">
                    {profile.description}
                  </p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs md:text-sm text-neutral-60 mt-12 md:mt-[80px]">
        © 2025 myRoadia. Tous droits réservés.
      </p>
    </div>
  );
}
