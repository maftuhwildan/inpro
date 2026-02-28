export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ background: '#0f2b1f', color: '#e8f8ef', padding: 16 }}>Inpro PM</aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  )
}
