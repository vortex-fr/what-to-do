export type CategoryId =
  | 'culture'
  | 'gastronomie'
  | 'sport'
  | 'famille'
  | 'business';

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  gradient: string; // css gradient
  from: string;
  to: string;
  solid: string;
  icon: string; // lucide name handled in component
  sub: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'culture',
    label: 'Culture & Loisirs',
    short: 'Culture',
    from: '#ff9d6c',
    to: '#ff5e8a',
    solid: '#ff7a85',
    gradient: 'linear-gradient(120deg, #ff9d6c 0%, #ff5e8a 100%)',
    icon: 'Mic',
    sub: [
      'Concerts',
      'Festivals',
      'Théâtre & Spectacles',
      'Cinéma',
      'Expositions',
      'Musées',
      'Humour & Stand-up',
      'Danse',
      'Littérature & Conférences',
      'Jeux & Gaming',
      'Animations locales',
      'Traditions & Folklore suisse',
    ],
  },
  {
    id: 'gastronomie',
    label: 'Gastronomie & Vie nocturne',
    short: 'Gastro & Night',
    from: '#a05cd5',
    to: '#7029a8',
    solid: '#8b3fb8',
    gradient: 'linear-gradient(120deg, #a05cd5 0%, #6d2299 100%)',
    icon: 'Beer',
    sub: [
      'Restaurants & Tables',
      'Bars & Clubs',
      'Dégustations & Vins',
      'Food trucks & Marchés',
      'Brunchs',
      'Soirées à thème',
      'Afterworks',
      'Festivals culinaires',
    ],
  },
  {
    id: 'sport',
    label: 'Sport & Outdoor',
    short: 'Sport',
    from: '#5b9df0',
    to: '#3b5fd4',
    solid: '#4a7fd4',
    gradient: 'linear-gradient(120deg, #5b9df0 0%, #3b5fd4 100%)',
    icon: 'Bike',
    sub: [
      'Running & Trail',
      'Randonnée',
      'Vélo & VTT',
      'Sports nautiques',
      'Ski & Montagne',
      'Fitness & Yoga',
      'Sports d\'équipe',
      'Compétitions',
      'Escalade',
    ],
  },
  {
    id: 'famille',
    label: 'Famille & Communauté',
    short: 'Famille',
    from: '#54d2c8',
    to: '#3aa9c9',
    solid: '#43c0c6',
    gradient: 'linear-gradient(120deg, #5fdcc9 0%, #36a7c5 100%)',
    icon: 'Store',
    sub: [
      'Marchés & Brocantes',
      'Ateliers enfants',
      'Parcs & Loisirs',
      'Événements caritatifs',
      'Vie de quartier',
      'Bénévolat',
      'Animations seniors',
      'Fêtes locales',
    ],
  },
  {
    id: 'business',
    label: 'Business & Formation',
    short: 'Business',
    from: '#46c8a8',
    to: '#2f9d8a',
    solid: '#3bb59a',
    gradient: 'linear-gradient(120deg, #5ad0a8 0%, #2c9d8d 100%)',
    icon: 'Lightbulb',
    sub: [
      'Salons professionnels',
      'Conférences business',
      'Startups & tech',
      'Ateliers & workshops',
      'Formations',
      'Emploi & recrutement',
      'Immobilier',
      'Finance & crypto',
      'Innovation & IA',
    ],
  },
];

export const CAT_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export const REGIONS = [
  // Suisse romande
  'Lausanne',
  'Genève',
  'Riviera',
  'Montreux',
  'Vevey',
  'Nyon',
  'Fribourg',
  'Neuchâtel',
  'La Chaux-de-Fonds',
  'Valais',
  'Sion',
  'Yverdon',
  'Jura',
  // Suisse alémanique
  'Zürich',
  'Berne',
  'Bâle',
  'Lucerne',
  'Saint-Gall',
  'Zoug',
  'Coire',
  // Suisse italienne
  'Lugano',
  'Bellinzone',
];
