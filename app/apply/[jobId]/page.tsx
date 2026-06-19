import { AppProvider } from "@/components/app-context"
import { StoreProvider } from "@/components/store"
import { PublicJobApplication } from "@/components/screens/public-job-application"

interface PageProps {
  params: Promise<{
    jobId: string | string[]
  }>
}

export default async function ApplyPage({ params }: PageProps) {
  const resolvedParams = await params
  const jobId = Array.isArray(resolvedParams.jobId) ? resolvedParams.jobId[0] : resolvedParams.jobId

  return (
    <AppProvider>
      <StoreProvider>
        <PublicJobApplication jobId={jobId} />
      </StoreProvider>
    </AppProvider>
  )
}
