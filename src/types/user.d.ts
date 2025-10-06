export type UsersAPI = {
  id: string
  name: string
  email: string
  verified: boolean
  createdAt: string
  isRegistered: boolean
  profile: {
    avatarUrl: string
  }
}

