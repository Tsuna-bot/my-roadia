import { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Building, Shield, Globe, ChevronDown, Check, LogOut } from 'lucide-react';
import EditableSection from './EditableSection';
import ValidatedInput from './ValidatedInput';
import AvatarUpload from './AvatarUpload';

interface InsurerProfile {
  companyName: string;
  siren: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  contactName: string;
  contactTitle: string;
  agencyCode: string;
  region: string;
  autoApprovalLimit: number;
  avatar?: string;
}

const initialProfile: InsurerProfile = {
  companyName: 'AXA Assurances',
  siren: '987654321',
  address: '25 Avenue de la République',
  city: 'Lyon',
  postalCode: '69003',
  phone: '0412345678',
  email: 'christophe.mithieux@axa.fr',
  contactName: 'Christophe Mithieux',
  contactTitle: 'Responsable Gestion Sinistres',
  agencyCode: 'AXA-LYO-003',
  region: 'Auvergne-Rhône-Alpes',
  autoApprovalLimit: 5000,
};

export default function ProfileAssureur() {
  const [profile, setProfile] = useState<InsurerProfile>(initialProfile);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState(initialProfile);
  const [editedContactInfo, setEditedContactInfo] = useState(initialProfile);
  const [editedSettings, setEditedSettings] = useState(initialProfile);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  const handleSaveCompanyInfo = () => {
    setProfile(editedCompanyInfo);
  };

  const handleCancelCompanyInfo = () => {
    setEditedCompanyInfo(profile);
  };

  const handleSaveContactInfo = () => {
    setProfile(editedContactInfo);
  };

  const handleCancelContactInfo = () => {
    setEditedContactInfo(profile);
  };

  const handleSaveSettings = () => {
    setProfile(editedSettings);
  };

  const handleCancelSettings = () => {
    setEditedSettings(profile);
  };

  const handleAvatarUpload = (file: File) => {
    console.log('Avatar uploaded:', file.name);
    // TODO: Upload to server
  };

  const handleAvatarRemove = () => {
    setProfile({ ...profile, avatar: undefined });
  };

  return (
    <div className="w-full">
      <div className="max-w-[1920px] mx-auto p-4 md:p-16 bg-neutral-98">
        {/* Header */}
        <div className="mb-6 md:mb-12">
          <div className="flex flex-col gap-4">
            {/* Title Row */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-neutral-10 leading-tight mb-1">
                Mon profil
              </h1>
              <p className="text-sm md:text-base text-neutral-60">
                Gérez les informations de votre agence
              </p>
            </div>

            {/* Actions Row - Desktop: compact buttons on right, Mobile: full width cards below */}
            <div className="flex md:hidden flex-col gap-2">
              {/* Logout button - Mobile full width */}
              <button
                onClick={() => {
                  console.log('Déconnexion');
                }}
                className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error font-medium text-sm rounded-lg transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-error/20"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>

              {/* Language selector - Mobile full width */}
              <div ref={languageMenuRef} className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-full px-4 py-2 flex items-center justify-between gap-1 bg-white hover:bg-neutral-95 rounded-lg transition-colors duration-150 text-sm font-medium text-neutral-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-accent" />
                    <span>Langue : {language === 'fr' ? 'Français' : 'English'}</span>
                  </div>
                  <ChevronDown size={16} className={`text-neutral-60 transition-transform duration-150 ${showLanguageMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-neutral-85 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                    <button
                      onClick={() => {
                        setLanguage('fr');
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-neutral-95 transition-colors duration-150 text-sm text-neutral-10"
                    >
                      Français
                      {language === 'fr' && <Check size={14} className="text-accent" />}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-neutral-95 transition-colors duration-150 text-sm text-neutral-10"
                    >
                      English
                      {language === 'en' && <Check size={14} className="text-accent" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop buttons - compact on right */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language selector */}
              <div ref={languageMenuRef} className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="px-4 py-2 flex items-center justify-start gap-1 bg-white hover:bg-neutral-95 rounded-lg transition-colors duration-150 text-sm font-medium text-neutral-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90"
                >
                  <Globe size={16} className="text-accent" />
                  <span>{language === 'fr' ? 'FR' : 'EN'}</span>
                  <ChevronDown size={14} className={`text-neutral-60 transition-transform duration-150 ${showLanguageMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLanguageMenu && (
                  <div className="absolute top-full mt-1 right-0 z-50 bg-white border border-neutral-85 rounded-lg shadow-lg overflow-hidden animate-fade-in min-w-[120px]">
                    <button
                      onClick={() => {
                        setLanguage('fr');
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-neutral-95 transition-colors duration-150 text-sm text-neutral-10"
                    >
                      Français
                      {language === 'fr' && <Check size={14} className="text-accent" />}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-2 flex items-center justify-between hover:bg-neutral-95 transition-colors duration-150 text-sm text-neutral-10"
                    >
                      English
                      {language === 'en' && <Check size={14} className="text-accent" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  console.log('Déconnexion');
                }}
                className="px-4 py-2 flex items-center justify-start gap-1 bg-error/10 hover:bg-error/20 text-error font-medium text-sm rounded-lg transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Information */}
            <EditableSection
              icon={<Building size={20} className="text-accent" />}
              title="Informations de l'agence"
              onSave={handleSaveCompanyInfo}
              onCancel={handleCancelCompanyInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Compagnie d'assurance
                    </label>
                    <p className="text-base text-neutral-10">{profile.companyName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      SIREN
                    </label>
                    <p className="text-base text-neutral-10">{profile.siren.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Code agence
                    </label>
                    <p className="text-base text-neutral-10">{profile.agencyCode}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Région
                    </label>
                    <p className="text-base text-neutral-10">{profile.region}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Adresse
                    </label>
                    <p className="text-base text-neutral-10">{profile.address}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Code postal
                    </label>
                    <p className="text-base text-neutral-10">{profile.postalCode}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Ville
                    </label>
                    <p className="text-base text-neutral-10">{profile.city}</p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput
                    type="text"
                    value={editedCompanyInfo.companyName}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, companyName: value })}
                    label="Compagnie d'assurance"
                    required
                  />

                  <ValidatedInput
                    type="siren"
                    value={editedCompanyInfo.siren}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, siren: value })}
                    label="SIREN"
                    required
                  />

                  <ValidatedInput
                    type="text"
                    value={editedCompanyInfo.agencyCode}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, agencyCode: value })}
                    label="Code agence"
                    required
                  />

                  <ValidatedInput
                    type="text"
                    value={editedCompanyInfo.region}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, region: value })}
                    label="Région"
                    required
                  />

                  <div className="md:col-span-2">
                    <ValidatedInput
                      type="text"
                      value={editedCompanyInfo.address}
                      onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, address: value })}
                      label="Adresse"
                      required
                    />
                  </div>

                  <ValidatedInput
                    type="text"
                    value={editedCompanyInfo.postalCode}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, postalCode: value })}
                    label="Code postal"
                    required
                  />

                  <ValidatedInput
                    type="text"
                    value={editedCompanyInfo.city}
                    onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, city: value })}
                    label="Ville"
                    required
                  />
                </div>
              }
            />

            {/* Contact Information */}
            <EditableSection
              icon={<User size={20} className="text-accent" />}
              title="Informations de contact"
              onSave={handleSaveContactInfo}
              onCancel={handleCancelContactInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Nom du contact
                    </label>
                    <p className="text-base text-neutral-10">{profile.contactName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Fonction
                    </label>
                    <p className="text-base text-neutral-10">{profile.contactTitle}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Téléphone
                    </label>
                    <p className="text-base text-neutral-10">{profile.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">
                      Email
                    </label>
                    <p className="text-base text-neutral-10">{profile.email}</p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput
                    type="text"
                    value={editedContactInfo.contactName}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, contactName: value })}
                    label="Nom du contact"
                    required
                  />

                  <ValidatedInput
                    type="text"
                    value={editedContactInfo.contactTitle}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, contactTitle: value })}
                    label="Fonction"
                    required
                  />

                  <ValidatedInput
                    type="tel"
                    value={editedContactInfo.phone}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, phone: value })}
                    label="Téléphone"
                    required
                  />

                  <ValidatedInput
                    type="email"
                    value={editedContactInfo.email}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, email: value })}
                    label="Email"
                    required
                  />
                </div>
              }
            />

            {/* Settings */}
            <EditableSection
              icon={<Shield size={20} className="text-accent" />}
              title="Paramètres de validation"
              onSave={handleSaveSettings}
              onCancel={handleCancelSettings}
              children={
                <div>
                  <label className="block text-sm font-medium text-neutral-40 mb-1">
                    Limite d'approbation automatique
                  </label>
                  <p className="text-xs text-neutral-60 mb-2">
                    Les dossiers dont le montant est inférieur à cette limite seront automatiquement approuvés
                  </p>
                  <p className="text-base text-neutral-10">{profile.autoApprovalLimit.toLocaleString('fr-FR')} €</p>
                </div>
              }
              editContent={
                <div>
                  <label className="block text-sm font-medium text-neutral-40 mb-1">
                    Limite d'approbation automatique
                  </label>
                  <p className="text-xs text-neutral-60 mb-2">
                    Les dossiers dont le montant est inférieur à cette limite seront automatiquement approuvés
                  </p>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      value={editedSettings.autoApprovalLimit}
                      onChange={(e) => setEditedSettings({ ...editedSettings, autoApprovalLimit: parseFloat(e.target.value) })}
                      className="w-full p-4 pr-12 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-60 text-sm">€</span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Avatar */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90">
              <AvatarUpload
                currentAvatar={profile.avatar}
                userName={profile.contactName}
                onUpload={handleAvatarUpload}
                onRemove={handleAvatarRemove}
              />
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90">
              <h3 className="text-sm md:text-lg font-bold text-neutral-10 mb-1 text-center">
                {profile.companyName}
              </h3>
              <p className="text-sm text-neutral-60 mb-1 text-center">
                {profile.contactName}
              </p>
              <p className="text-xs text-neutral-60 mb-6 text-center">
                {profile.contactTitle}
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-neutral-60 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-40">
                    {profile.address}, {profile.postalCode} {profile.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-neutral-60 flex-shrink-0" />
                  <span className="text-sm text-neutral-40">{profile.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-neutral-60 flex-shrink-0" />
                  <span className="text-sm text-neutral-40">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
