import { AppProvider } from "@/components/app-context"
import { StoreProvider } from "@/components/store"
import { PublicJobApplication } from "@/components/screens/public-job-application"

interface PageProps {
  params: {
    jobId: string | string[]
  }
}

export default function ApplyPage({ params }: PageProps) {
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId

  return (
    <AppProvider>
      <StoreProvider>
        <PublicJobApplication jobId={jobId} />
      </StoreProvider>
    </AppProvider>
  )
}
