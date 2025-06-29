export type Tenant = {
  id: number;
  name: string;
  avatar: string;
};

export const mockTenant: Tenant[] = [
  {
    id: 1,
    name: 'Tenant 1',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Tenant 2',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Tenant 3',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];
