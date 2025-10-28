// Base de données mock centralisée pour tous les dossiers

export interface VehiclePhoto {
  id: string;
  url: string;
  caption?: string;
  uploadDate: string;
  thumbnail?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  documentType: string;
  size: number;
  uploadDate: string;
  url: string;
}

export interface FolderData {
  id: string;
  reference: string;
  status: 'examen-initial' | 'reparations' | 'validation' | 'estimation';
  progress: number;
  createdDate: string;
  dueDate: string;
  expertName: string;
  client: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  insurance?: {
    company: string;
    contractNumber: string;
    phone: string;
    email: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: string;
    plate: string;
    vin: string;
  };
  mission: {
    type: string;
    description: string;
    estimatedCost: string;
    examDate: string;
  };
  timeline: Array<{
    date: string;
    label: string;
    completed: boolean;
    requiresPhotos?: boolean;
  }>;
  photos: VehiclePhoto[];
  documents: UploadedDocument[];
}

export interface PricingRate {
  id: string;
  name: string;
  typeTarif: 'main-oeuvre' | 'pieces' | 'expertise' | 'deplacement';
  groupementAssurance: string;
  assurance: string;
  dateApplicative: string;
  devise: 'EUR' | 'USD' | 'GBP';
  natureAccord: 'convention' | 'accord-cadre' | 'tarif-libre';
  referenceAccord: string;
  aPartirDeJours: number;
  fraisGardiennage: boolean;
  reglementDirectReparateur: boolean;
  // Étape 2 - Tolerie
  tolerieT1?: number;
  tolerieT2?: number;
  tolerieT3?: number;
  // Étape 3 - Mécanique
  mecaniqueM1?: number;
  mecaniqueM2?: number;
  mecaniqueM3?: number;
  // Étape 4 - Electricité
  electriciteE1?: number;
  electriciteE2?: number;
  electriciteE3?: number;
  // Étape 5 - Sellerie
  sellerieS1?: number;
  sellerieS2?: number;
  sellerieS3?: number;
  // Étape 6 - Peinture
  peintureP1?: number;
  peintureP2?: number;
  // Étape 7 - Débosselage
  debosselageAvecPeinture?: number;
  debosselageSansPeinture?: number;
  // Étape 8 - Ingrédients
  ingredientsOpaque?: number;
  ingredientsVernis?: number;
  ingredientsNacre?: number;
  ingredientsAutre?: number;
  // Étape 9 - Coûts supplémentaires
  gardiennageJournalierTTC?: number;
  remplacementVehicule?: number;
  description: string;
  unitPrice: number;
  unit: 'heure' | 'km' | 'forfait' | 'piece';
  tva: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export const mockPricingRates: PricingRate[] = [
  {
    id: '1',
    name: 'Heure de main d\'oeuvre - Carrosserie',
    typeTarif: 'main-oeuvre',
    groupementAssurance: 'Axa Group',
    assurance: 'Axa France',
    dateApplicative: '2025-01-01',
    devise: 'EUR',
    natureAccord: 'convention',
    referenceAccord: 'CONV-AXA-2025-001',
    aPartirDeJours: 0,
    fraisGardiennage: false,
    reglementDirectReparateur: true,
    description: 'Tarif horaire standard pour les travaux de carrosserie',
    unitPrice: 65.00,
    unit: 'heure',
    tva: 20,
    isActive: true,
    createdDate: '2024-01-15',
    lastModified: '2025-03-10',
  },
  {
    id: '2',
    name: 'Heure de main d\'oeuvre - Peinture',
    typeTarif: 'main-oeuvre',
    groupementAssurance: 'Axa Group',
    assurance: 'Axa France',
    dateApplicative: '2025-01-01',
    devise: 'EUR',
    natureAccord: 'convention',
    referenceAccord: 'CONV-AXA-2025-001',
    aPartirDeJours: 0,
    fraisGardiennage: false,
    reglementDirectReparateur: true,
    description: 'Tarif horaire pour les travaux de peinture et finition',
    unitPrice: 75.00,
    unit: 'heure',
    tva: 20,
    isActive: true,
    createdDate: '2024-01-15',
    lastModified: '2025-03-10',
  },
  {
    id: '3',
    name: 'Expertise véhicule léger',
    typeTarif: 'expertise',
    groupementAssurance: 'Generali Group',
    assurance: 'Generali France',
    dateApplicative: '2025-02-01',
    devise: 'EUR',
    natureAccord: 'accord-cadre',
    referenceAccord: 'AC-GEN-2025-003',
    aPartirDeJours: 0,
    fraisGardiennage: false,
    reglementDirectReparateur: false,
    description: 'Forfait expertise complète pour véhicule de tourisme',
    unitPrice: 150.00,
    unit: 'forfait',
    tva: 20,
    isActive: true,
    createdDate: '2024-02-01',
    lastModified: '2025-02-20',
  },
  {
    id: '4',
    name: 'Déplacement - Zone 1 (< 30 km)',
    typeTarif: 'deplacement',
    groupementAssurance: 'Axa Group',
    assurance: 'Axa France',
    dateApplicative: '2025-01-01',
    devise: 'EUR',
    natureAccord: 'convention',
    referenceAccord: 'CONV-AXA-2025-001',
    aPartirDeJours: 0,
    fraisGardiennage: false,
    reglementDirectReparateur: true,
    description: 'Frais de déplacement pour intervention jusqu\'à 30 km',
    unitPrice: 1.20,
    unit: 'km',
    tva: 20,
    isActive: true,
    createdDate: '2024-01-20',
    lastModified: '2025-01-15',
  },
  {
    id: '5',
    name: 'Frais de gardiennage',
    typeTarif: 'deplacement',
    groupementAssurance: 'Allianz Group',
    assurance: 'Allianz France',
    dateApplicative: '2025-03-01',
    devise: 'EUR',
    natureAccord: 'tarif-libre',
    referenceAccord: 'TL-ALZ-2025-012',
    aPartirDeJours: 7,
    fraisGardiennage: true,
    reglementDirectReparateur: false,
    description: 'Frais de gardiennage à partir du 7ème jour',
    unitPrice: 15.00,
    unit: 'forfait',
    tva: 20,
    isActive: true,
    createdDate: '2024-01-20',
    lastModified: '2025-01-15',
  },
];

export const mockFolders: FolderData[] = [
  {
    id: 'insured-1',
    reference: '#2025-0342',
    status: 'examen-initial',
    progress: 45,
    createdDate: '15 octobre 2025',
    dueDate: "Aujourd'hui",
    expertName: 'Expert Martin',
    client: {
      name: 'Jean Martin',
      phone: '+33 6 12 34 56 78',
      email: 'jean.martin@example.com',
      address: '12 rue de la République, 75001 Paris',
    },
    insurance: {
      company: 'AXA Assurances',
      contractNumber: 'AX-2024-789456',
      phone: '01 40 25 26 27',
      email: 'sinistres@axa.fr',
    },
    vehicle: {
      brand: 'Renault',
      model: 'Clio',
      year: '2020',
      plate: 'AB-123-CD',
      vin: 'VF1RJ123456789012',
    },
    mission: {
      type: 'Expertise après sinistre',
      description: 'Collision arrière avec un autre véhicule. Dommages visibles sur le pare-choc et le hayon.',
      estimatedCost: '2 450 €',
      examDate: '18 octobre 2025',
    },
    timeline: [
      { date: '16 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '17 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '18 oct 2025', label: 'Complétion d\'un dossier à distance', completed: false, requiresPhotos: true },
      { date: 'À venir', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Cession', completed: false },
    ],
    photos: [
      {
        id: 'p1-1',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+arrière+Renault+Clio',
        caption: 'Vue arrière complète - Renault Clio',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Pare-choc+arrière+endommagé',
        caption: 'Pare-choc arrière - Dommages visibles',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Fissure+côté+gauche',
        caption: 'Détail de la fissure côté gauche',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Hayon+arrière',
        caption: 'Hayon arrière - Vue latérale',
        uploadDate: '16 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd1-1',
        name: 'Constat_amiable_2025-0342.pdf',
        type: 'application/pdf',
        documentType: 'constat',
        size: 245600,
        uploadDate: '15 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd1-2',
        name: 'Devis_reparation_preliminaire.pdf',
        type: 'application/pdf',
        documentType: 'devis',
        size: 152000,
        uploadDate: '17 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '1',
    reference: '#2025-0342',
    status: 'examen-initial',
    progress: 75,
    createdDate: '15 octobre 2025',
    dueDate: "Aujourd'hui",
    expertName: 'Expert Martin',
    client: {
      name: 'Marie Dubois',
      phone: '+33 6 12 34 56 78',
      email: 'marie.dubois@example.com',
      address: '12 rue de la République, 75001 Paris',
    },
    insurance: {
      company: 'AXA Assurances',
      contractNumber: 'AX-2024-789456',
      phone: '01 40 25 26 27',
      email: 'sinistres@axa.fr',
    },
    vehicle: {
      brand: 'Renault',
      model: 'Clio IV',
      year: '2020',
      plate: 'AB-123-CD',
      vin: 'VF1RJ123456789012',
    },
    mission: {
      type: 'Expertise après sinistre',
      description: 'Collision arrière avec un autre véhicule. Dommages visibles sur le pare-choc et le hayon.',
      estimatedCost: '2 450 €',
      examDate: '18 octobre 2025',
    },
    timeline: [
      { date: '16 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '17 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '18 oct 2025', label: 'Planification d\'un examen', completed: false },
      { date: 'À venir', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Cession', completed: false },
    ],
    photos: [
      {
        id: 'p1-1',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+arrière+Renault+Clio+IV',
        caption: 'Vue arrière complète - Renault Clio IV',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Pare-choc+arrière+endommagé',
        caption: 'Pare-choc arrière - Dommages visibles',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Fissure+côté+gauche',
        caption: 'Détail de la fissure côté gauche',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Hayon+arrière',
        caption: 'Hayon arrière - Vue latérale',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-5',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Renault+Clio+2020',
        caption: 'Vue d\'ensemble du véhicule - Renault Clio',
        uploadDate: '16 oct 2025',
      },
      {
        id: 'p1-6',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+3/4+avant',
        caption: 'Vue 3/4 avant',
        uploadDate: '16 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd1-1',
        name: 'Constat_amiable_2025-0342.pdf',
        type: 'application/pdf',
        documentType: 'constat',
        size: 245600,
        uploadDate: '15 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd1-2',
        name: 'Devis_reparation_preliminaire.pdf',
        type: 'application/pdf',
        documentType: 'devis',
        size: 152000,
        uploadDate: '17 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '2',
    reference: '#2025-0341',
    status: 'reparations',
    progress: 45,
    createdDate: '10 octobre 2025',
    dueDate: 'Demain',
    expertName: 'Expert Dupont',
    client: {
      name: 'Jean Martin',
      phone: '+33 6 98 76 54 32',
      email: 'jean.martin@example.com',
      address: '45 avenue des Champs-Élysées, 75008 Paris',
    },
    vehicle: {
      brand: 'Peugeot',
      model: '308',
      year: '2019',
      plate: 'CD-456-EF',
      vin: 'VF3LC9HZ0HS123456',
    },
    mission: {
      type: 'Réparation carrosserie',
      description: 'Rayures profondes sur portière avant gauche suite à un accrochage en parking. Nécessite ponçage et peinture.',
      estimatedCost: '1 850 €',
      examDate: '12 octobre 2025',
    },
    timeline: [
      { date: '10 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '11 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '12 oct 2025', label: 'Complétion d\'un dossier à distance', completed: true },
      { date: '13 oct 2025', label: 'Examen initial', completed: true },
      { date: '14 oct 2025', label: 'Réparations', completed: false },
    ],
    photos: [
      {
        id: 'p2-1',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+latérale+Peugeot+308',
        caption: 'Vue latérale gauche - Peugeot 308',
        uploadDate: '11 oct 2025',
      },
      {
        id: 'p2-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Portière+avant+rayée',
        caption: 'Portière avant gauche - Rayures profondes',
        uploadDate: '11 oct 2025',
      },
      {
        id: 'p2-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Dommages+portière',
        caption: 'Gros plan des dommages sur la portière',
        uploadDate: '11 oct 2025',
      },
      {
        id: 'p2-4',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Zone+endommagée',
        caption: 'Zone endommagée - Vue rapprochée',
        uploadDate: '11 oct 2025',
      },
      {
        id: 'p2-5',
        url: 'https://placehold.co/1200x800/e0e0e0/ff9500?text=Après+ponçage',
        caption: 'Après ponçage - Zone en cours de réparation',
        uploadDate: '14 oct 2025',
      },
      {
        id: 'p2-6',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Peugeot+308+2019',
        caption: 'Vue d\'ensemble 3/4 avant - Peugeot 308',
        uploadDate: '11 oct 2025',
      },
      {
        id: 'p2-7',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Détail+carrosserie',
        caption: 'Détail de la carrosserie et finitions',
        uploadDate: '11 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd2-1',
        name: 'Rapport_expertise_initial.pdf',
        type: 'application/pdf',
        documentType: 'rapport-expertise',
        size: 512000,
        uploadDate: '12 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd2-2',
        name: 'Facture_pieces_detachees.pdf',
        type: 'application/pdf',
        documentType: 'facture',
        size: 89000,
        uploadDate: '14 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd2-3',
        name: 'Carte_grise.jpg',
        type: 'image/jpeg',
        documentType: 'carte-grise',
        size: 1240000,
        uploadDate: '10 oct 2025',
        url: 'https://placehold.co/800x600/e0e0e0/002f6b?text=Carte+Grise+Peugeot+308',
      },
    ],
  },
  {
    id: '3',
    reference: '#2025-0340',
    status: 'estimation',
    progress: 10,
    createdDate: '8 octobre 2025',
    dueDate: 'Dans 2 jours',
    expertName: 'Expert Leroy',
    client: {
      name: 'Sophie Bernard',
      phone: '+33 7 11 22 33 44',
      email: 'sophie.bernard@example.com',
      address: '78 boulevard Saint-Germain, 75006 Paris',
    },
    vehicle: {
      brand: 'Citroën',
      model: 'C3',
      year: '2021',
      plate: 'GH-789-IJ',
      vin: 'VF7SX9HZC12345678',
    },
    mission: {
      type: 'Estimation valeur véhicule',
      description: 'Estimation pour revente du véhicule. Contrôle général de l\'état, kilométrage et historique d\'entretien.',
      estimatedCost: '450 €',
      examDate: '20 octobre 2025',
    },
    timeline: [
      { date: '8 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '9 oct 2025', label: 'Étude de la mission', completed: false },
      { date: 'À venir', label: 'Complétion d\'un dossier à distance', completed: false },
      { date: 'À venir', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Réparations', completed: false },
    ],
    photos: [
      {
        id: 'p3-1',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Vue+avant+Citroën+C3',
        caption: 'Vue avant 3/4 - Citroën C3',
        uploadDate: '8 oct 2025',
      },
      {
        id: 'p3-2',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+latérale+C3',
        caption: 'Vue latérale complète',
        uploadDate: '8 oct 2025',
      },
      {
        id: 'p3-3',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Kilométrage+45000km',
        caption: 'Tableau de bord - Kilométrage 45 000 km',
        uploadDate: '8 oct 2025',
      },
      {
        id: 'p3-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Côté+droit+C3',
        caption: 'Vue latérale droite',
        uploadDate: '8 oct 2025',
      },
      {
        id: 'p3-5',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Intérieur+Citroën+C3',
        caption: 'Intérieur - État général',
        uploadDate: '8 oct 2025',
      },
      {
        id: 'p3-6',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+arrière+C3',
        caption: 'Vue arrière - Citroën C3',
        uploadDate: '8 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd3-1',
        name: 'Attestation_assurance.pdf',
        type: 'application/pdf',
        documentType: 'attestation-assurance',
        size: 178000,
        uploadDate: '8 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '4',
    reference: '#2025-0339',
    status: 'validation',
    progress: 85,
    createdDate: '5 octobre 2025',
    dueDate: 'Aujourd\'hui',
    expertName: 'Expert Moreau',
    client: {
      name: 'Pierre Dubois',
      phone: '+33 6 55 44 33 22',
      email: 'pierre.dubois@example.com',
      address: '12 rue de la Paix, 69001 Lyon',
    },
    vehicle: {
      brand: 'BMW',
      model: 'Série 3',
      year: '2022',
      plate: 'KL-123-MN',
      vin: 'WBA8E9G58HNU12345',
    },
    mission: {
      type: 'Réparation collision',
      description: 'Collision frontale à faible vitesse. Pare-choc avant, calandre et phares endommagés. Airbag non déclenché.',
      estimatedCost: '3 200 €',
      examDate: '6 octobre 2025',
    },
    timeline: [
      { date: '5 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '5 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '6 oct 2025', label: 'Planification d\'un examen', completed: true },
      { date: '6 oct 2025', label: 'Examen initial', completed: true },
      { date: '7 oct 2025', label: 'Cession', completed: false },
    ],
    photos: [
      {
        id: 'p4-1',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Collision+avant+BMW+Série+3',
        caption: 'Vue avant - Dommages collision frontale',
        uploadDate: '5 oct 2025',
      },
      {
        id: 'p4-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Pare-choc+endommagé',
        caption: 'Pare-choc avant endommagé',
        uploadDate: '5 oct 2025',
      },
      {
        id: 'p4-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Calandre+cassée',
        caption: 'Calandre et phare gauche cassés',
        uploadDate: '5 oct 2025',
      },
      {
        id: 'p4-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+3/4+BMW+Série+3',
        caption: 'Vue 3/4 avant - BMW Série 3',
        uploadDate: '5 oct 2025',
      },
      {
        id: 'p4-5',
        url: 'https://placehold.co/1200x800/e0e0e0/ff9500?text=Pièces+détachées',
        caption: 'Pièces de rechange commandées',
        uploadDate: '7 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd4-1',
        name: 'Constat_amiable_2025-0339.pdf',
        type: 'application/pdf',
        documentType: 'constat',
        size: 298000,
        uploadDate: '5 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd4-2',
        name: 'Devis_garage_BMW.pdf',
        type: 'application/pdf',
        documentType: 'devis',
        size: 124000,
        uploadDate: '6 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd4-3',
        name: 'Bon_commande_pieces.pdf',
        type: 'application/pdf',
        documentType: 'facture',
        size: 87000,
        uploadDate: '7 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '5',
    reference: '#2025-0338',
    status: 'examen-initial',
    progress: 60,
    createdDate: '3 octobre 2025',
    dueDate: 'Dans 3 jours',
    expertName: 'Expert Rousseau',
    client: {
      name: 'Marie Lefebvre',
      phone: '+33 7 22 33 44 55',
      email: 'marie.lefebvre@example.com',
      address: '56 avenue Victor Hugo, 31000 Toulouse',
    },
    vehicle: {
      brand: 'Volkswagen',
      model: 'Golf',
      year: '2020',
      plate: 'OP-456-QR',
      vin: 'WVWZZZ1KZCW123456',
    },
    mission: {
      type: 'Bris de glace',
      description: 'Pare-brise fissuré suite à impact de gravillons. Fissure de 15cm partant du coin inférieur droit.',
      estimatedCost: '420 €',
      examDate: '4 octobre 2025',
    },
    timeline: [
      { date: '3 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '3 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '4 oct 2025', label: 'Complétion d\'un dossier à distance', completed: true },
      { date: '4 oct 2025', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Réparations', completed: false },
    ],
    photos: [
      {
        id: 'p5-1',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Pare-brise+fissuré+VW+Golf',
        caption: 'Pare-brise - Fissure visible',
        uploadDate: '3 oct 2025',
      },
      {
        id: 'p5-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Détail+fissure+15cm',
        caption: 'Détail de la fissure (15cm)',
        uploadDate: '3 oct 2025',
      },
      {
        id: 'p5-3',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+avant+VW+Golf',
        caption: 'Vue avant - Volkswagen Golf',
        uploadDate: '3 oct 2025',
      },
      {
        id: 'p5-4',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Impact+gravillons',
        caption: 'Point d\'impact des gravillons',
        uploadDate: '3 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd5-1',
        name: 'Declaration_sinistre.pdf',
        type: 'application/pdf',
        documentType: 'declaration',
        size: 156000,
        uploadDate: '3 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd5-2',
        name: 'Photos_complementaires.jpg',
        type: 'image/jpeg',
        documentType: 'photo',
        size: 2100000,
        uploadDate: '4 oct 2025',
        url: 'https://placehold.co/800x600/e0e0e0/cc0000?text=Photos+complémentaires+bris+glace',
      },
    ],
  },
  {
    id: '6',
    reference: '#2025-0337',
    status: 'reparations',
    progress: 30,
    createdDate: '1 octobre 2025',
    dueDate: 'Dans 5 jours',
    expertName: 'Expert Petit',
    client: {
      name: 'Luc Garnier',
      phone: '+33 6 77 88 99 00',
      email: 'luc.garnier@example.com',
      address: '89 boulevard de la Liberté, 59000 Lille',
    },
    vehicle: {
      brand: 'Audi',
      model: 'A4',
      year: '2021',
      plate: 'ST-789-UV',
      vin: 'WAUZZZ8K8DA123456',
    },
    mission: {
      type: 'Rayures profondes',
      description: 'Acte de vandalisme - rayures sur tout le côté droit du véhicule. Nécessite reprise complète de la peinture.',
      estimatedCost: '2 750 €',
      examDate: '2 octobre 2025',
    },
    timeline: [
      { date: '1 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '2 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '2 oct 2025', label: 'Planification d\'un examen', completed: true },
      { date: '3 oct 2025', label: 'Examen initial', completed: true },
      { date: '4 oct 2025', label: 'Cession', completed: false },
    ],
    photos: [
      {
        id: 'p6-1',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Rayures+côté+droit+Audi+A4',
        caption: 'Côté droit - Rayures profondes',
        uploadDate: '1 oct 2025',
      },
      {
        id: 'p6-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Portière+avant+droite',
        caption: 'Portière avant droite - Dommages',
        uploadDate: '1 oct 2025',
      },
      {
        id: 'p6-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Portière+arrière+droite',
        caption: 'Portière arrière droite - Rayures',
        uploadDate: '1 oct 2025',
      },
      {
        id: 'p6-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+générale+Audi+A4',
        caption: 'Vue générale - Audi A4',
        uploadDate: '1 oct 2025',
      },
      {
        id: 'p6-5',
        url: 'https://placehold.co/1200x800/e0e0e0/ff9500?text=Préparation+peinture',
        caption: 'Surface préparée pour peinture',
        uploadDate: '4 oct 2025',
      },
      {
        id: 'p6-6',
        url: 'https://placehold.co/1200x800/e0e0e0/ff9500?text=Ponçage+en+cours',
        caption: 'Ponçage en cours',
        uploadDate: '4 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd6-1',
        name: 'Depot_plainte_vandalisme.pdf',
        type: 'application/pdf',
        documentType: 'autre',
        size: 234000,
        uploadDate: '1 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd6-2',
        name: 'Rapport_expertise_2025-0337.pdf',
        type: 'application/pdf',
        documentType: 'rapport-expertise',
        size: 445000,
        uploadDate: '2 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd6-3',
        name: 'Devis_peinture_carrosserie.pdf',
        type: 'application/pdf',
        documentType: 'devis',
        size: 167000,
        uploadDate: '3 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '7',
    reference: '#2025-0336',
    status: 'estimation',
    progress: 25,
    createdDate: '28 septembre 2025',
    dueDate: 'Dans 1 semaine',
    expertName: 'Expert Laurent',
    client: {
      name: 'Nathalie Bonnet',
      phone: '+33 7 44 55 66 77',
      email: 'nathalie.bonnet@example.com',
      address: '34 rue Gambetta, 33000 Bordeaux',
    },
    vehicle: {
      brand: 'Mercedes-Benz',
      model: 'Classe C',
      year: '2023',
      plate: 'WX-234-YZ',
      vin: 'WDD2050091F123456',
    },
    mission: {
      type: 'Estimation pré-achat',
      description: 'Vérification complète avant achat d\'occasion. Contrôle mécanique, carrosserie, historique et valeur de reprise.',
      estimatedCost: '350 €',
      examDate: '2 octobre 2025',
    },
    timeline: [
      { date: '28 sep 2025', label: 'Réception de la mission', completed: true },
      { date: '29 sep 2025', label: 'Étude de la mission', completed: false },
      { date: 'À venir', label: 'Planification d\'un examen', completed: false },
      { date: 'À venir', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Cession', completed: false },
    ],
    photos: [
      {
        id: 'p7-1',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Mercedes+Classe+C+2023',
        caption: 'Vue 3/4 avant - Mercedes Classe C',
        uploadDate: '28 sep 2025',
      },
      {
        id: 'p7-2',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Profil+gauche+Mercedes',
        caption: 'Vue latérale gauche',
        uploadDate: '28 sep 2025',
      },
      {
        id: 'p7-3',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Intérieur+Classe+C',
        caption: 'Habitacle - État général',
        uploadDate: '28 sep 2025',
      },
      {
        id: 'p7-4',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Kilométrage+28500km',
        caption: 'Tableau de bord - 28 500 km',
        uploadDate: '28 sep 2025',
      },
      {
        id: 'p7-5',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Moteur+Mercedes',
        caption: 'Compartiment moteur',
        uploadDate: '28 sep 2025',
      },
    ],
    documents: [
      {
        id: 'd7-1',
        name: 'Carnet_entretien.pdf',
        type: 'application/pdf',
        documentType: 'autre',
        size: 892000,
        uploadDate: '28 sep 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd7-2',
        name: 'Historique_vehicule.pdf',
        type: 'application/pdf',
        documentType: 'autre',
        size: 201000,
        uploadDate: '28 sep 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  {
    id: '8',
    reference: '#2025-0335',
    status: 'validation',
    progress: 75,
    createdDate: '25 septembre 2025',
    dueDate: 'Demain',
    expertName: 'Expert Vincent',
    client: {
      name: 'Thomas Mercier',
      phone: '+33 6 11 22 33 44',
      email: 'thomas.mercier@example.com',
      address: '67 rue de la République, 13001 Marseille',
    },
    vehicle: {
      brand: 'Toyota',
      model: 'Yaris',
      year: '2018',
      plate: 'AB-567-CD',
      vin: 'VNKKJ3D31JA123456',
    },
    mission: {
      type: 'Choc arrière',
      description: 'Collision en chaîne sur autoroute. Hayon enfoncé, feu arrière droit cassé, pare-choc arrière à remplacer.',
      estimatedCost: '1 650 €',
      examDate: '26 septembre 2025',
    },
    timeline: [
      { date: '25 sep 2025', label: 'Réception de la mission', completed: true },
      { date: '26 sep 2025', label: 'Étude de la mission', completed: true },
      { date: '26 sep 2025', label: 'Complétion d\'un dossier à distance', completed: true },
      { date: '27 sep 2025', label: 'Examen initial', completed: true },
      { date: '28 sep 2025', label: 'Réparations', completed: false },
    ],
    photos: [
      {
        id: 'p8-1',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Choc+arrière+Toyota+Yaris',
        caption: 'Vue arrière - Dommages collision',
        uploadDate: '25 sep 2025',
      },
      {
        id: 'p8-2',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Hayon+enfoncé',
        caption: 'Hayon enfoncé',
        uploadDate: '25 sep 2025',
      },
      {
        id: 'p8-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Feu+arrière+cassé',
        caption: 'Feu arrière droit cassé',
        uploadDate: '25 sep 2025',
      },
      {
        id: 'p8-4',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+3/4+arrière+Yaris',
        caption: 'Vue 3/4 arrière - Toyota Yaris',
        uploadDate: '25 sep 2025',
      },
      {
        id: 'p8-5',
        url: 'https://placehold.co/1200x800/e0e0e0/ff9500?text=Pièces+neuves',
        caption: 'Pièces de rechange neuves',
        uploadDate: '27 sep 2025',
      },
    ],
    documents: [
      {
        id: 'd8-1',
        name: 'Constat_collision_chaine.pdf',
        type: 'application/pdf',
        documentType: 'constat',
        size: 412000,
        uploadDate: '25 sep 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd8-2',
        name: 'Devis_garage_Toyota.pdf',
        type: 'application/pdf',
        documentType: 'devis',
        size: 198000,
        uploadDate: '27 sep 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd8-3',
        name: 'Photos_accident_autoroute.jpg',
        type: 'image/jpeg',
        documentType: 'photo',
        size: 1890000,
        uploadDate: '25 sep 2025',
        url: 'https://placehold.co/800x600/e0e0e0/cc0000?text=Photos+accident+autoroute',
      },
    ],
  },
  {
    id: '9',
    reference: '#2025-0343',
    status: 'estimation',
    progress: 35,
    createdDate: '18 octobre 2025',
    dueDate: 'Aujourd\'hui',
    expertName: 'Expert Durand',
    client: {
      name: 'Laurent Petit',
      phone: '+33 6 88 99 00 11',
      email: 'laurent.petit@example.com',
      address: '23 avenue Jean Jaurès, 44000 Nantes',
    },
    insurance: {
      company: 'Allianz France',
      contractNumber: 'AL-2025-456789',
      phone: '01 49 77 45 00',
      email: 'sinistres@allianz.fr',
    },
    vehicle: {
      brand: 'Ford',
      model: 'Focus',
      year: '2021',
      plate: 'EF-890-GH',
      vin: 'WF0AXXGCDA1234567',
    },
    mission: {
      type: 'Expertise à distance',
      description: 'Dommages légers sur portière avant droite suite à accrochage parking. Expertise à distance demandée par l\'assureur.',
      estimatedCost: '980 €',
      examDate: '19 octobre 2025',
    },
    timeline: [
      { date: '18 oct 2025', label: 'Réception de la mission', completed: true },
      { date: '18 oct 2025', label: 'Étude de la mission', completed: true },
      { date: '19 oct 2025', label: 'Complétion d\'un dossier à distance', completed: false },
      { date: 'À venir', label: 'Examen initial', completed: false },
      { date: 'À venir', label: 'Réparations', completed: false },
    ],
    photos: [
      {
        id: 'p9-1',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Portière+avant+Ford+Focus',
        caption: 'Portière avant droite - Dommages visibles',
        uploadDate: '18 oct 2025',
      },
      {
        id: 'p9-2',
        url: 'https://placehold.co/1200x800/e0e0e0/666666?text=Vue+3/4+avant+Ford',
        caption: 'Vue 3/4 avant - Ford Focus',
        uploadDate: '18 oct 2025',
      },
      {
        id: 'p9-3',
        url: 'https://placehold.co/1200x800/e0e0e0/cc0000?text=Détail+impact',
        caption: 'Détail de l\'impact sur la portière',
        uploadDate: '18 oct 2025',
      },
      {
        id: 'p9-4',
        url: 'https://placehold.co/1200x800/e0e0e0/002f6b?text=Ford+Focus+2021',
        caption: 'Vue générale du véhicule',
        uploadDate: '18 oct 2025',
      },
    ],
    documents: [
      {
        id: 'd9-1',
        name: 'Constat_parking_2025-0343.pdf',
        type: 'application/pdf',
        documentType: 'constat',
        size: 189000,
        uploadDate: '18 oct 2025',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'd9-2',
        name: 'Photos_initiales_client.jpg',
        type: 'image/jpeg',
        documentType: 'photo',
        size: 1450000,
        uploadDate: '18 oct 2025',
        url: 'https://placehold.co/800x600/e0e0e0/cc0000?text=Photos+client+Ford+Focus',
      },
    ],
  },
];

// Fonction helper pour récupérer un dossier par son ID
export function getFolderById(id: string): FolderData | undefined {
  return mockFolders.find((folder) => folder.id === id);
}

// Fonction helper pour récupérer un dossier par sa référence
export function getFolderByReference(reference: string): FolderData | undefined {
  return mockFolders.find((folder) => folder.reference === reference);
}

// Fonction helper pour obtenir le statut actuel basé sur la timeline
export function getCurrentStatus(folder: FolderData): string {
  // Trouver la première étape non complétée
  const currentStep = folder.timeline.find(step => !step.completed);

  // Si toutes les étapes sont complétées, retourner la dernière étape
  if (!currentStep) {
    const lastStep = folder.timeline[folder.timeline.length - 1];
    return lastStep?.label || 'Complété';
  }

  return currentStep.label;
}

// Fonction helper pour calculer le pourcentage de progression basé sur la timeline
export function calculateProgress(folder: FolderData): number {
  const totalSteps = folder.timeline.length;
  const completedSteps = folder.timeline.filter(step => step.completed).length;

  // Calculer le pourcentage : (étapes complétées / total étapes) * 100
  // On arrondit au nombre entier le plus proche
  return Math.round((completedSteps / totalSteps) * 100);
}