export interface ProfileAPI {
  id: string
  fullName: string
  bio: string
  birthDate: Date | string
  avatarUrl: string
  latitude: number
  longitude: number
  phone: string
  createdAt: Date | string
  updatedAt: Date | string
  user: {
    id: string
    name: string
    email: string
  }
}
