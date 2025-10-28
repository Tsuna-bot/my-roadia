import { useState, useRef, useEffect } from 'react';
import { Building, User, Clock, Calendar as CalendarIcon, Globe, ChevronDown, Check, LogOut, MapPin, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import EditableSection from './EditableSection';
import ValidatedInput from './ValidatedInput';
import AvatarUpload from './AvatarUpload';
import DatePicker from './DatePicker';
import Tabs from './Tabs';
import Tab from './Tab';
import TimePicker from './TimePicker';
import ToggleSwitch from './ToggleSwitch';

interface Absence {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface TimeSlot {
  id: string;
  open: string;
  close: string;
}

interface RepairerProfile {
  companyName: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  contactName: string;
  specialties: string[];
  openingHours: {
    [key: string]: { slots: TimeSlot[]; closed: boolean };
  };
  absences: Absence[];
  avatar?: string;
}

const initialProfile: RepairerProfile = {
  companyName: 'Garage Excellence Auto',
  siret: '12345678900012',
  address: '15 Avenue des Réparations',
  city: 'Paris',
  postalCode: '75015',
  phone: '0123456789',
  email: 'contact@excellence-auto.fr',
  contactName: 'Jean Dupont',
  specialties: ['Carrosserie', 'Mécanique', 'Peinture', 'Électrique'],
  openingHours: {
    lundi: { slots: [{ id: '1', open: '08:00', close: '18:00' }], closed: false },
    mardi: { slots: [{ id: '1', open: '08:00', close: '18:00' }], closed: false },
    mercredi: { slots: [{ id: '1', open: '08:00', close: '18:00' }], closed: false },
    jeudi: { slots: [{ id: '1', open: '08:00', close: '18:00' }], closed: false },
    vendredi: { slots: [{ id: '1', open: '08:00', close: '18:00' }], closed: false },
    samedi: { slots: [{ id: '1', open: '09:00', close: '12:00' }], closed: false },
    dimanche: { slots: [], closed: true },
  },
  absences: [
    { id: '1', startDate: '2025-12-24', endDate: '2025-12-31', reason: 'Congés de fin d\'année' },
  ],
};

const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function ProfileReparateur() {
  const [profile, setProfile] = useState<RepairerProfile>(initialProfile);
  const [editedCompanyInfo, setEditedCompanyInfo] = useState(initialProfile);
  const [editedContactInfo, setEditedContactInfo] = useState(initialProfile);
  const [editedOpeningHours, setEditedOpeningHours] = useState(initialProfile.openingHours);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editingAbsenceId, setEditingAbsenceId] = useState<string | null>(null);
  const [isAddingAbsence, setIsAddingAbsence] = useState(false);
  const [editingAbsenceData, setEditingAbsenceData] = useState<{[key: string]: Omit<Absence, 'id'>}>({});
  const [newAbsence, setNewAbsence] = useState<Omit<Absence, 'id'>>({
    startDate: '',
    endDate: '',
    reason: '',
  });
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

  const handleSaveOpeningHours = () => {
    setProfile({ ...profile, openingHours: editedOpeningHours });
  };

  const handleCancelOpeningHours = () => {
    setEditedOpeningHours(profile.openingHours);
  };

  const handleAvatarUpload = (file: File) => {
    console.log('Avatar uploaded:', file.name);
  };

  const handleAvatarRemove = () => {
    setProfile({ ...profile, avatar: undefined });
  };

  const handleStartAddAbsence = () => {
    setIsAddingAbsence(true);
    setNewAbsence({ startDate: '', endDate: '', reason: '' });
  };

  const handleSaveNewAbsence = () => {
    if (newAbsence.startDate && newAbsence.endDate) {
      const absence: Absence = {
        id: Date.now().toString(),
        ...newAbsence,
      };
      setProfile({ ...profile, absences: [...profile.absences, absence] });
      setNewAbsence({ startDate: '', endDate: '', reason: '' });
      setIsAddingAbsence(false);
    }
  };

  const handleCancelAddAbsence = () => {
    setNewAbsence({ startDate: '', endDate: '', reason: '' });
    setIsAddingAbsence(false);
  };

  const handleStartEditAbsence = (absence: Absence) => {
    setEditingAbsenceId(absence.id);
    setEditingAbsenceData({
      ...editingAbsenceData,
      [absence.id]: {
        startDate: absence.startDate,
        endDate: absence.endDate,
        reason: absence.reason,
      }
    });
  };

  const handleSaveEditAbsence = (id: string) => {
    const data = editingAbsenceData[id];
    if (data && data.startDate && data.endDate) {
      setProfile({
        ...profile,
        absences: profile.absences.map(a => a.id === id ? { ...a, ...data } : a)
      });
      setEditingAbsenceId(null);
      const newData = { ...editingAbsenceData };
      delete newData[id];
      setEditingAbsenceData(newData);
    }
  };

  const handleCancelEditAbsence = (id: string) => {
    setEditingAbsenceId(null);
    const newData = { ...editingAbsenceData };
    delete newData[id];
    setEditingAbsenceData(newData);
  };

  const handleDeleteAbsence = (id: string) => {
    setProfile({ ...profile, absences: profile.absences.filter(a => a.id !== id) });
  };

  const formatAbsenceDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
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
                Gérez les informations de votre entreprise
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
            {/* Tabs Navigation */}
            <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)} variant="fullWidth">
              <Tab icon={<Building size={20} />} label="Informations" />
              <Tab icon={<Clock size={20} />} label="Horaires" />
              <Tab icon={<CalendarIcon size={20} />} label="Absences" />
            </Tabs>

            {/* Tab 0: Informations */}
            {activeTab === 0 && (
              <div className="space-y-6 animate-fade-in">
                {/* Company Information */}
                <EditableSection
                  icon={<Building size={20} className="text-accent" />}
                  title="Informations de l'entreprise"
                  onSave={handleSaveCompanyInfo}
                  onCancel={handleCancelCompanyInfo}
                  children={
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-40 mb-1">
                          Nom de l'entreprise
                        </label>
                        <p className="text-base text-neutral-10">{profile.companyName}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-40 mb-1">
                          SIRET
                        </label>
                        <p className="text-base text-neutral-10">
                          {profile.siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4')}
                        </p>
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
                        label="Nom de l'entreprise"
                        required
                      />

                      <ValidatedInput
                        type="siret"
                        value={editedCompanyInfo.siret}
                        onChange={(value) => setEditedCompanyInfo({ ...editedCompanyInfo, siret: value })}
                        label="SIRET"
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
                          Téléphone
                        </label>
                        <p className="text-base text-neutral-10">
                          {profile.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}
                        </p>
                      </div>

                      <div className="md:col-span-2">
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
                        type="tel"
                        value={editedContactInfo.phone}
                        onChange={(value) => setEditedContactInfo({ ...editedContactInfo, phone: value })}
                        label="Téléphone"
                        required
                      />

                      <div className="md:col-span-2">
                        <ValidatedInput
                          type="email"
                          value={editedContactInfo.email}
                          onChange={(value) => setEditedContactInfo({ ...editedContactInfo, email: value })}
                          label="Email"
                          required
                        />
                      </div>
                    </div>
                  }
                />
              </div>
            )}

            {/* Tab 1: Horaires */}
            {activeTab === 1 && (
              <div className="animate-fade-in">
                <EditableSection
                  icon={<Clock size={20} className="text-accent" />}
                  title="Horaires d'ouverture"
                  onSave={handleSaveOpeningHours}
                  onCancel={handleCancelOpeningHours}
                  children={
                    <div className="space-y-4">
                      {daysOfWeek.map(day => (
                        <div key={day} className="flex items-center justify-between py-2 border-b border-neutral-95 last:border-0">
                          <span className="text-sm font-medium text-neutral-10 capitalize min-w-[100px]">{day}</span>
                          <div className="text-sm text-neutral-40">
                            {profile.openingHours[day].closed
                              ? 'Fermé'
                              : profile.openingHours[day].slots.map((slot) => (
                                  <div key={slot.id}>
                                    {slot.open} - {slot.close}
                                  </div>
                                ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                  editContent={
                    <div className="space-y-6">
                      {daysOfWeek.map(day => (
                        <div key={day} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-10 capitalize">{day}</span>
                            <ToggleSwitch
                              checked={editedOpeningHours[day].closed}
                              onChange={(checked) => {
                                const newHours = { ...editedOpeningHours };
                                newHours[day].closed = checked;
                                setEditedOpeningHours(newHours);
                              }}
                              label="Fermé"
                            />
                          </div>

                          {!editedOpeningHours[day].closed && (
                            <div className="space-y-2 pl-4">
                              {editedOpeningHours[day].slots.map((slot, index) => (
                                <div key={slot.id} className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <TimePicker
                                      value={slot.open}
                                      onChange={(value) => {
                                        const newHours = { ...editedOpeningHours };
                                        newHours[day].slots[index].open = value;
                                        setEditedOpeningHours(newHours);
                                      }}
                                    />
                                  </div>
                                  <span className="text-neutral-40">-</span>
                                  <div className="flex-1">
                                    <TimePicker
                                      value={slot.close}
                                      onChange={(value) => {
                                        const newHours = { ...editedOpeningHours };
                                        newHours[day].slots[index].close = value;
                                        setEditedOpeningHours(newHours);
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  }
                />
              </div>
            )}

            {/* Tab 2: Absences */}
            {activeTab === 2 && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-xl p-4 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-neutral-90">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-90">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <CalendarIcon size={16} className="text-accent md:w-5 md:h-5" />
                      </div>
                      <h2 className="text-sm md:text-lg font-semibold text-neutral-10">
                        Absences
                      </h2>
                    </div>

                    <button
                      onClick={handleStartAddAbsence}
                      className="flex items-center justify-center gap-1 w-10 h-10 md:w-auto md:h-auto md:px-6 md:py-2 rounded-full md:rounded-lg bg-accent hover:bg-accent-light text-white transition-colors text-sm font-medium"
                      aria-label="Ajouter une absence"
                    >
                      <Plus size={20} className="md:w-4 md:h-4" />
                      <span className="hidden md:inline">Ajouter une absence</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Existing absences */}
                    {profile.absences.map((absence) => (
                      <div
                        key={absence.id}
                        className="p-4 bg-neutral-95 rounded-xl"
                      >
                        {editingAbsenceId === absence.id ? (
                          /* Edit mode */
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-neutral-40 mb-1">
                                  Date de début *
                                </label>
                                <DatePicker
                                  value={editingAbsenceData[absence.id]?.startDate || ''}
                                  onChange={(value) =>
                                    setEditingAbsenceData({
                                      ...editingAbsenceData,
                                      [absence.id]: { ...editingAbsenceData[absence.id], startDate: value }
                                    })
                                  }
                                  placeholder="JJ/MM/AAAA"
                                  variant="white"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-neutral-40 mb-1">
                                  Date de fin *
                                </label>
                                <DatePicker
                                  value={editingAbsenceData[absence.id]?.endDate || ''}
                                  onChange={(value) =>
                                    setEditingAbsenceData({
                                      ...editingAbsenceData,
                                      [absence.id]: { ...editingAbsenceData[absence.id], endDate: value }
                                    })
                                  }
                                  placeholder="JJ/MM/AAAA"
                                  variant="white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-neutral-40 mb-1">
                                Motif (optionnel)
                              </label>
                              <input
                                type="text"
                                value={editingAbsenceData[absence.id]?.reason || ''}
                                onChange={(e) =>
                                  setEditingAbsenceData({
                                    ...editingAbsenceData,
                                    [absence.id]: { ...editingAbsenceData[absence.id], reason: e.target.value }
                                  })
                                }
                                placeholder="Ex: Congés, Formation..."
                                className="w-full px-4 py-2 text-sm text-neutral-10 rounded-lg bg-white border border-neutral-90 outline-none placeholder:text-neutral-60 hover:border-neutral-70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-[250ms]"
                              />
                            </div>

                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:justify-end pt-2">
                              <button
                                onClick={() => handleCancelEditAbsence(absence.id)}
                                className="w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-neutral-90 hover:bg-neutral-85 text-neutral-40 transition-all duration-150 text-sm font-medium"
                              >
                                <span>Annuler</span>
                              </button>
                              <button
                                onClick={() => handleSaveEditAbsence(absence.id)}
                                disabled={!editingAbsenceData[absence.id]?.startDate || !editingAbsenceData[absence.id]?.endDate}
                                className="w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-white transition-all duration-150 font-medium text-sm disabled:opacity-50"
                              >
                                <span>Valider</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* View mode */
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
                            {/* Content */}
                            <div className="flex-1 relative mb-4 md:mb-0">
                              {/* Delete button - top right on mobile, moved on desktop */}
                              <button
                                onClick={() => handleDeleteAbsence(absence.id)}
                                className="absolute top-0 right-0 md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-error/10 hover:bg-error/20 text-error transition-colors"
                                aria-label="Supprimer l'absence"
                              >
                                <Trash2 size={16} />
                              </button>

                              <div className="pr-10 md:pr-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <CalendarIcon size={16} className="text-accent flex-shrink-0" />
                                  <span className="text-sm font-semibold text-neutral-10">
                                    {formatAbsenceDate(absence.startDate)} → {formatAbsenceDate(absence.endDate)}
                                  </span>
                                </div>
                                {absence.reason && (
                                  <p className="text-xs text-neutral-60 pl-[28px]">{absence.reason}</p>
                                )}
                              </div>
                            </div>

                            {/* Desktop buttons container */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-start gap-2">
                              {/* Edit button - full width mobile / left on desktop */}
                              <button
                                onClick={() => handleStartEditAbsence(absence)}
                                className="w-full md:w-auto flex items-center justify-center gap-1 px-6 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent transition-colors text-sm font-medium h-[36px]"
                              >
                                <Edit size={16} />
                                <span>Modifier</span>
                              </button>

                              {/* Delete button - hidden on mobile, shown on desktop (right) */}
                              <button
                                onClick={() => handleDeleteAbsence(absence.id)}
                                className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-error/10 hover:bg-error/20 text-error transition-colors"
                                aria-label="Supprimer l'absence"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add new absence form */}
                    {isAddingAbsence && (
                      <div className="p-4 bg-neutral-95 rounded-xl">
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-neutral-40 mb-1">
                                Date de début *
                              </label>
                              <DatePicker
                                value={newAbsence.startDate}
                                onChange={(value) =>
                                  setNewAbsence({ ...newAbsence, startDate: value })
                                }
                                placeholder="JJ/MM/AAAA"
                                variant="white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-neutral-40 mb-1">
                                Date de fin *
                              </label>
                              <DatePicker
                                value={newAbsence.endDate}
                                onChange={(value) =>
                                  setNewAbsence({ ...newAbsence, endDate: value })
                                }
                                placeholder="JJ/MM/AAAA"
                                variant="white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-40 mb-1">
                              Motif (optionnel)
                            </label>
                            <input
                              type="text"
                              value={newAbsence.reason}
                              onChange={(e) =>
                                setNewAbsence({ ...newAbsence, reason: e.target.value })
                              }
                              placeholder="Ex: Congés, Formation..."
                              className="w-full px-4 py-2 text-sm text-neutral-10 rounded-lg bg-white border border-neutral-90 outline-none placeholder:text-neutral-60 hover:border-neutral-70 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-[250ms]"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:justify-end pt-2">
                            <button
                              onClick={handleCancelAddAbsence}
                              className="w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-neutral-90 hover:bg-neutral-85 text-neutral-40 transition-colors text-sm font-medium"
                            >
                              <span>Annuler</span>
                            </button>
                            <button
                              onClick={handleSaveNewAbsence}
                              disabled={!newAbsence.startDate || !newAbsence.endDate}
                              className="w-full md:w-auto flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-white transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                              <span>Valider</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {profile.absences.length === 0 && !isAddingAbsence && (
                      <p className="text-sm text-neutral-60 text-center py-6">
                        Aucune absence
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Hidden on mobile when activeTab is 1 or 2 */}
          <div className={`space-y-6 ${activeTab === 1 || activeTab === 2 ? 'hidden lg:block' : ''}`}>
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
                Réparateur agréé
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
                  <span className="text-sm text-neutral-40">
                    {profile.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}
                  </span>
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
