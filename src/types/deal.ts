export const DealProgress = {
  InProgress: { id: 'InProgress', label: 'In progress' },
  Pending: { id: 'Pending', label: 'Pending' },
  Closed: { id: 'Closed', label: 'Closed' },
} as const;

export const DealRoomAccess = {
  KeysWithDoorman: {
    id: 'KeysWithDoorman',
    label: 'Keys with Doorman',
  },
  KeysInLockbox: {
    id: 'KeysInLockbox',
    label: 'Keys in Lockbox',
  },
  KeysObtained: {
    id: 'KeysObtained',
    label: 'Keys Obtained',
  },
  KeysNotRequired: {
    id: 'KeysNotRequired',
    label: 'Keys Not Required',
  },
  Other: {
    id: 'Other',
    label: 'Other',
  },
};

export type DealProgressType = keyof typeof DealProgress;
export type DealRoomAccessType = keyof typeof DealRoomAccess;

export type Deal = {
  uuid: string;
  customerUuid: string;
  imageUrl: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  roomArea: number;
  price: number;
  numberOfPeople: number;
  appointmentDate: string;
  progress: DealProgressType;
  specialInstructions: string;
  roomAccess: DealRoomAccessType;
};

export type DealWithCustomer = {
  uuid: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phone: string;
    uuid: string;
  };
  imageUrl: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  roomArea: number;
  price: number;
  numberOfPeople: number;
  appointmentDate: string;
  progress: DealProgressType;
  specialInstructions: string;
  roomAccess: DealRoomAccessType;
};
