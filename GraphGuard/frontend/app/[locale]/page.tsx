import StoreProvider from './store/StoreProvider'
import PageContainer from './pageContainer'

export default function Page() {
  return (
    <StoreProvider>
      <PageContainer />
    </StoreProvider>
  )
}
