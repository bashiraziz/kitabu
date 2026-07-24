import { StoreProvider } from '@/lib/store'
import { AppShell } from '@/components/app/AppShell'

export default function AppPage() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  )
}
