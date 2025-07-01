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
  uuid: string;
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
  customerUuid: number;
  roomAccess: DealRoomAccessType;
};
