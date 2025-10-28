import { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Mail, CreditCard, Shield, Globe, ChevronDown, Check, LogOut, Calendar, Settings } from 'lucide-react';
import EditableSection from './EditableSection';
import ValidatedInput from './ValidatedInput';
import AvatarUpload from './AvatarUpload';
import Toggle from './Toggle';
import Dialog from './Dialog';

interface InsuredProfile {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  birthDate: string;
  licenseNumber: string;
  licenseDate: string;
  insuranceCompany: string;
  policyNumber: string;
  policyStartDate: string;
  policyEndDate: string;
  avatar?: string;
  acceptsRecycledParts: boolean;
}

const initialProfile: InsuredProfile = {
  firstName: 'Jean',
  lastName: 'Martin',
  address: '12 rue de la République',
  city: 'Paris',
  postalCode: '75001',
  phone: '0612345678',
  email: 'jean.martin@example.com',
  birthDate: '1985-03-15',
  licenseNumber: 'B123456789',
  licenseDate: '2003-06-20',
  insuranceCompany: 'AXA Assurances',
  policyNumber: 'AX-2024-789456',
  policyStartDate: '2025-01-01',
  policyEndDate: '2025-12-31',
  acceptsRecycledParts: false,
};

export default function ProfileAssure() {
  const [profile, setProfile] = useState<InsuredProfile>(initialProfile);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState(initialProfile);
  const [editedContactInfo, setEditedContactInfo] = useState(initialProfile);
  const [editedDriverInfo, setEditedDriverInfo] = useState(initialProfile);
  const [editedInsuranceInfo, setEditedInsuranceInfo] = useState(initialProfile);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRecycledPartsValue, setPendingRecycledPartsValue] = useState(false);

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

  const handleSavePersonalInfo = () => {
    setProfile(editedPersonalInfo);
  };

  const handleCancelPersonalInfo = () => {
    setEditedPersonalInfo(profile);
  };

  const handleSaveContactInfo = () => {
    setProfile(editedContactInfo);
  };

  const handleCancelContactInfo = () => {
    setEditedContactInfo(profile);
  };

  const handleSaveDriverInfo = () => {
    setProfile(editedDriverInfo);
  };

  const handleCancelDriverInfo = () => {
    setEditedDriverInfo(profile);
  };

  const handleSaveInsuranceInfo = () => {
    setProfile(editedInsuranceInfo);
  };

  const handleCancelInsuranceInfo = () => {
    setEditedInsuranceInfo(profile);
  };

  const handleAvatarUpload = (file: File) => {
    console.log('Avatar uploaded:', file.name);
  };

  const handleAvatarRemove = () => {
    setProfile({ ...profile, avatar: undefined });
  };

  const handleRecycledPartsChange = (value: boolean) => {
    setPendingRecycledPartsValue(value);
    setShowConfirmDialog(true);
  };

  const handleConfirmRecycledParts = () => {
    setProfile({ ...profile, acceptsRecycledParts: pendingRecycledPartsValue });
    setShowConfirmDialog(false);
  };

  const handleCancelRecycledParts = () => {
    setShowConfirmDialog(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
                Gérez vos informations personnelles
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
            {/* Personal Information */}
            <EditableSection
              icon={<User size={20} className="text-accent" />}
              title="Informations personnelles"
              onSave={handleSavePersonalInfo}
              onCancel={handleCancelPersonalInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Prénom</label>
                    <p className="text-base text-neutral-10">{profile.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Nom</label>
                    <p className="text-base text-neutral-10">{profile.lastName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date de naissance</label>
                    <p className="text-base text-neutral-10">{formatDate(profile.birthDate)}</p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput
                    type="text"
                    value={editedPersonalInfo.firstName}
                    onChange={(value) => setEditedPersonalInfo({ ...editedPersonalInfo, firstName: value })}
                    label="Prénom"
                    required
                  />
                  <ValidatedInput
                    type="text"
                    value={editedPersonalInfo.lastName}
                    onChange={(value) => setEditedPersonalInfo({ ...editedPersonalInfo, lastName: value })}
                    label="Nom"
                    required
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      value={editedPersonalInfo.birthDate}
                      onChange={(e) => setEditedPersonalInfo({ ...editedPersonalInfo, birthDate: e.target.value })}
                      className="w-full p-4 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]"
                    />
                  </div>
                </div>
              }
            />

            {/* Contact Information */}
            <EditableSection
              icon={<MapPin size={20} className="text-accent" />}
              title="Coordonnées"
              onSave={handleSaveContactInfo}
              onCancel={handleCancelContactInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Adresse</label>
                    <p className="text-base text-neutral-10">{profile.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Code postal</label>
                    <p className="text-base text-neutral-10">{profile.postalCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Ville</label>
                    <p className="text-base text-neutral-10">{profile.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Téléphone</label>
                    <p className="text-base text-neutral-10">{profile.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Email</label>
                    <p className="text-base text-neutral-10">{profile.email}</p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <ValidatedInput
                      type="text"
                      value={editedContactInfo.address}
                      onChange={(value) => setEditedContactInfo({ ...editedContactInfo, address: value })}
                      label="Adresse"
                      required
                    />
                  </div>
                  <ValidatedInput
                    type="text"
                    value={editedContactInfo.postalCode}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, postalCode: value })}
                    label="Code postal"
                    required
                  />
                  <ValidatedInput
                    type="text"
                    value={editedContactInfo.city}
                    onChange={(value) => setEditedContactInfo({ ...editedContactInfo, city: value })}
                    label="Ville"
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

            {/* Driver Information */}
            <EditableSection
              icon={<CreditCard size={20} className="text-accent" />}
              title="Permis de conduire"
              onSave={handleSaveDriverInfo}
              onCancel={handleCancelDriverInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Numéro de permis</label>
                    <p className="text-base text-neutral-10">{profile.licenseNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date d'obtention</label>
                    <p className="text-base text-neutral-10">{formatDate(profile.licenseDate)}</p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ValidatedInput
                    type="text"
                    value={editedDriverInfo.licenseNumber}
                    onChange={(value) => setEditedDriverInfo({ ...editedDriverInfo, licenseNumber: value })}
                    label="Numéro de permis"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date d'obtention</label>
                    <input
                      type="date"
                      value={editedDriverInfo.licenseDate}
                      onChange={(e) => setEditedDriverInfo({ ...editedDriverInfo, licenseDate: e.target.value })}
                      className="w-full p-4 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]"
                    />
                  </div>
                </div>
              }
            />

            {/* Insurance Information */}
            <EditableSection
              icon={<Shield size={20} className="text-accent" />}
              title="Informations d'assurance"
              onSave={handleSaveInsuranceInfo}
              onCancel={handleCancelInsuranceInfo}
              children={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Compagnie d'assurance</label>
                    <p className="text-base text-neutral-10">{profile.insuranceCompany}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Numéro de police</label>
                    <p className="text-base text-neutral-10">{profile.policyNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Période de validité</label>
                    <p className="text-base text-neutral-10">
                      Du {formatDate(profile.policyStartDate)} au {formatDate(profile.policyEndDate)}
                    </p>
                  </div>
                </div>
              }
              editContent={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <ValidatedInput
                      type="text"
                      value={editedInsuranceInfo.insuranceCompany}
                      onChange={(value) => setEditedInsuranceInfo({ ...editedInsuranceInfo, insuranceCompany: value })}
                      label="Compagnie d'assurance"
                      required
                    />
                  </div>
                  <ValidatedInput
                    type="text"
                    value={editedInsuranceInfo.policyNumber}
                    onChange={(value) => setEditedInsuranceInfo({ ...editedInsuranceInfo, policyNumber: value })}
                    label="Numéro de police"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date de début</label>
                    <input
                      type="date"
                      value={editedInsuranceInfo.policyStartDate}
                      onChange={(e) => setEditedInsuranceInfo({ ...editedInsuranceInfo, policyStartDate: e.target.value })}
                      className="w-full p-4 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-40 mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={editedInsuranceInfo.policyEndDate}
                      onChange={(e) => setEditedInsuranceInfo({ ...editedInsuranceInfo, policyEndDate: e.target.value })}
                      className="w-full p-4 text-sm rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-neutral-98 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:shadow-[0_0_0_2px_#002f6b_inset]"
                    />
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
                userName={`${profile.firstName} ${profile.lastName}`}
                onUpload={handleAvatarUpload}
                onRemove={handleAvatarRemove}
              />
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90">
              <h3 className="text-sm md:text-lg font-bold text-neutral-10 mb-1 text-center">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-xs text-neutral-60 mb-6 text-center">
                Assuré
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
