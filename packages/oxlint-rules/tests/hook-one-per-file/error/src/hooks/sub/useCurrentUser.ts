export default function useCurrentUser(): { id: string } {
  return { id: 'u-1' }
}

function useSessionToken(): string {
  return 'token'
}
