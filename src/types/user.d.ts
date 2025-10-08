export type UsersAPI = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  createdAt: string;
  isRegistered: boolean;
  profile: {
    avatarUrl: string;
  };
};

export type UserDetailAPI = {
  id?: string;
  name: string;
  email: string;
  verified: boolean;
  isRegistered: boolean;
  createdAt: Date | string;
  profile: {
    id: string;
    fullName: string;
    bio: string | null;
    birthDate: string;
    avatarUrl: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
  };
};
