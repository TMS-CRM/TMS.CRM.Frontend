export const DealProgress = {
  inProgress: { id: 'inProgress', label: 'In progress' },
  pending: { id: 'pending', label: 'Pending' },
  closed: { id: 'closed', label: 'Closed' },
} as const;

export const DealRoomAccess = {
  keysWithDoorman: { id: 'keysWithDoorman', label: 'Keys with doorman' },
  keysObtained: { id: 'keysObtained', label: 'Keys obtained' },
  keysNotRequired: { id: 'keysNotRequired', label: 'Keys not required(customer present)' },
};

export type DealProgressType = keyof typeof DealProgress;
export type DealRoomAccessType = keyof typeof DealRoomAccess;

export type Deal = {
  id: number;
  dealPicture: string;
  street: string;
  city: string;
  state: string;
  zipCode: number;
  roomArea: number;
  price: number;
  numberOfPeople: number;
  appointmentDate: string;
  progress: DealProgressType;
  specialInstructions: string;
  customerId: number;
  roomAccess: DealRoomAccessType;
};

export const mockDeals: Deal[] = [
  {
    id: 2,
    dealPicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    street: '47 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'closed',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysNotRequired',
  },
  {
    id: 3,
    dealPicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    street: '46 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'pending',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysNotRequired',
  },
  {
    id: 4,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '45 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-06-23T10:30:00.000Z',
    progress: 'pending',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysWithDoorman',
  },
  {
    id: 5,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '44 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-06-23T10:30:00.000Z',
    progress: 'closed',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysObtained',
  },
  {
    id: 6,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '43 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 6,
    roomAccess: 'keysWithDoorman',
  },
  {
    id: 7,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '42 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 7,
    roomAccess: 'keysObtained',
  },
  {
    id: 8,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '41 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 8,
    roomAccess: 'keysWithDoorman',
  },
  {
    id: 9,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '40 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 9,
    roomAccess: 'keysWithDoorman',
  },
  {
    id: 10,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '29 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysWithDoorman',
  },
  {
    id: 11,
    dealPicture: 'https://randomuser.me/api/portraits/men/4.jpg',
    street: '28 Spruce Drive',
    city: 'Quantico',
    state: 'PA',
    zipCode: 1234,
    roomArea: 100,
    price: 5750,
    numberOfPeople: 10,
    appointmentDate: '2025-11-23T10:30:00.000Z',
    progress: 'inProgress',
    specialInstructions: 'At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.',
    customerId: 1,
    roomAccess: 'keysWithDoorman',
  },
];
