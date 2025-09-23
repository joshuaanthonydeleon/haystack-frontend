import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  BrainCircuit,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileText,
  Globe2,
  Loader2,
  RefreshCw,
  Sparkles,
  Timer,
} from 'lucide-react'

import { AuthGuard } from '@/components/guards/AuthGuard'
import { Button } from '@/components/ui/button'
import { useVendorResearchDetail } from '@/queries/vendors'
import { VendorResearchStatus } from '@/types/api'
import type { ReactNode } from 'react'

const statusTokens: Record<
  VendorResearchStatus,
  { label: string; className: string; dotClassName: string }
> = {
  [VendorResearchStatus.pending]: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    dotClassName: 'bg-amber-500',
  },
  [VendorResearchStatus.in_progress]: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    dotClassName: 'bg-blue-500',
  },
  [VendorResearchStatus.completed]: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClassName: 'bg-emerald-500',
  },
  [VendorResearchStatus.failed]: {
    label: 'Failed',
    className: 'bg-rose-100 text-rose-700 border-rose-200',
    dotClassName: 'bg-rose-500',
  },
}

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const formatDuration = (start?: string, end?: string) => {
  if (!start || !end) return '—'
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return '—'
  const diffMs = Math.max(0, endTime - startTime)
  if (diffMs === 0) return '< 1 min'
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts: Array<string> = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (hours === 0 && minutes === 0 && seconds > 0) {
    parts.push(`${seconds}s`)
  }
  return parts.length > 0 ? parts.join(' ') : '< 1 min'
}

const isPrimitive = (value: unknown): value is string | number | boolean => {
  const type = typeof value
  return type === 'string' || type === 'number' || type === 'boolean'
}

const isValueEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => isValueEmpty(item))
  }
  if (typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>)
    return entries.length === 0 || entries.every((item) => isValueEmpty(item))
  }
  return false
}

const formatKey = (rawKey: string) => {
  return rawKey
    .replace(/[_-]/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase())
    .trim()
}

const renderValue = (value: unknown, depth = 0): ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-slate-500">—</span>
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return <span className="text-slate-500">—</span>
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return (
        <a
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 break-all"
        >
          {trimmed}
        </a>
      )
    }
    return <span className="text-sm text-slate-700">{trimmed}</span>
  }

  if (typeof value === 'number') {
    return <span className="text-sm font-medium text-slate-700">{value.toLocaleString()}</span>
  }

  if (typeof value === 'boolean') {
    return (
      <span className={value ? 'text-sm font-medium text-emerald-600' : 'text-sm font-medium text-slate-600'}>
        {value ? 'Yes' : 'No'}
      </span>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-slate-500">No entries</span>
    }

    if (value.every((item) => isPrimitive(item))) {
      return (
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          {value.map((item, index) => (
            <li key={index} className="leading-relaxed">
              {typeof item === 'string' ? item : String(item)}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="space-y-4">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Entry {index + 1}
            </p>
            <div className="mt-2 text-sm text-slate-700">{renderValue(item, depth + 1)}</div>
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, entryValue]) => !isValueEmpty(entryValue),
    )

    if (entries.length === 0) {
      return <span className="text-slate-500">No structured data provided</span>
    }

    const gridClass = depth === 0 ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3'

    return (
      <div className={gridClass}>
        {entries.map(([key, entryValue]) => (
          <div
            key={key}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {formatKey(key)}
            </p>
            <div className="mt-2 text-sm text-slate-700">
              {renderValue(entryValue, depth + 1)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <span className="text-sm text-slate-700">{String(value)}</span>
}

const countDataPoints = (value: unknown) => {
  if (value === null || value === undefined) return 0
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length
  }
  return 1
}

const VendorResearchInsightsPage = () => {
  const { vendorId, researchId } = Route.useParams()
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useVendorResearchDetail(vendorId, researchId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading research insights…</p>
        </div>
      </div>
    )
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg space-y-5 rounded-2xl border border-red-200 bg-red-50 px-8 py-10 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Insights unavailable</h1>
            <p className="text-sm text-gray-600">
              {error instanceof Error
                ? error.message
                : data?.error ?? 'Unable to load the enhanced research details.'}
            </p>
          </div>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </div>
    )
  }

  const record = data.data
  const status = statusTokens[record.status]
  const vendorName = record.vendor.companyName || `Vendor ${vendorId}`

  const insightsSummary = [
    {
      label: 'AI insight clusters',
      value: countDataPoints(record.deepResearchInsights),
      icon: BrainCircuit,
    },
    {
      label: 'Profile enrichments',
      value: countDataPoints(record.extractedProfile),
      icon: FileText,
    },
    {
      label: 'Website signals',
      value: countDataPoints(record.websiteSnapshot),
      icon: Eye,
    },
    {
      label: 'Artifact bundles',
      value: countDataPoints(record.rawResearchArtifacts),
      icon: Database,
    },
  ]

  const detailSections = [
    {
      key: 'deepResearchInsights',
      title: 'AI intelligence breakdown',
      description: 'Layered insights derived by the research agent, including positioning, strengths, and market signals.',
      icon: BrainCircuit,
      payload: record.deepResearchInsights,
    },
    {
      key: 'extractedProfile',
      title: 'Enriched vendor profile',
      description: 'Structured profile enrichment pulled from external sources to complement the internal vendor record.',
      icon: FileText,
      payload: record.extractedProfile,
    },
    {
      key: 'websiteSnapshot',
      title: 'Website intelligence',
      description: 'Live crawl highlights from the vendor’s digital presence, emphasizing product, messaging, and trust signals.',
      icon: Eye,
      payload: record.websiteSnapshot,
    },
    {
      key: 'rawResearchArtifacts',
      title: 'Research artifacts',
      description: 'Foundational artifacts, transcripts, and supporting evidence captured during the research run.',
      icon: Database,
      payload: record.rawResearchArtifacts,
    },
    {
      key: 'metadata',
      title: 'Execution metadata',
      description: 'System-level metadata captured during the research job, including environment and orchestration flags.',
      icon: Sparkles,
      payload: record.metadata,
    },
  ]

  const statCards = [
    {
      label: 'Requested',
      value: formatDateTime(record.requestedAt),
      icon: Calendar,
    },
    {
      label: 'Started',
      value: formatDateTime(record.startedAt),
      icon: Clock,
    },
    {
      label: 'Completed',
      value: formatDateTime(record.completedAt),
      icon: CheckCircle,
    },
    {
      label: 'Run duration',
      value: formatDuration(record.startedAt, record.completedAt),
      icon: Timer,
    },
    {
      label: 'LLM model',
      value: record.llmModel ?? '—',
      icon: Bot,
    },
    {
      label: 'Website',
      value: record.websiteUrl ?? '—',
      icon: Globe2,
      isLink: !!record.websiteUrl,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin/vendors/$vendorId/research/$researchId" params={{ vendorId, researchId }}>
                <ArrowLeft className="w-4 h-4" />
                Run summary
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/vendors/$vendorId/research" params={{ vendorId }}>
                Research overview
              </Link>
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh insights
          </Button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl text-white">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Research #{record.id}</p>
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                {vendorName}
              </h1>
              <p className="text-sm text-white/70 max-w-2xl">
                AI-driven research outcomes, curated into an executive-ready briefing for due diligence and vendor evaluation.
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${status.className}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${status.dotClassName}`} />
              {status.label}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon
              const content = card.isLink && typeof card.value === 'string' ? (
                <a
                  href={card.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-200 hover:text-white break-all"
                >
                  {card.value}
                </a>
              ) : (
                <span className="text-sm font-semibold text-white">{card.value}</span>
              )

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/70">{card.label}</p>
                      {content}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insightsSummary.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-white/70">{item.label}</span>
                    <Icon className="w-4 h-4 text-white/70" />
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {record.errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <div>
                <p className="font-semibold">Run reported an error</p>
                <p className="mt-1 text-rose-600">{record.errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {detailSections.map((section) => {
            const Icon = section.icon
            const hasContent = !isValueEmpty(section.payload)

            return (
              <section
                key={section.key}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-700">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-[12rem]">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {section.title}
                    </h2>
                    <p className="text-sm text-slate-600">{section.description}</p>
                  </div>
                </div>
                <div className="px-6 py-6 text-sm text-slate-700">
                  {hasContent ? (
                    renderValue(section.payload)
                  ) : (
                    <p className="text-sm italic text-slate-500">
                      No data points were returned for this segment during the research run.
                    </p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute(
  '/admin/vendors/$vendorId/research/$researchId/details',
)({
  component: () => (
    <AuthGuard requiredRole="admin">
      <VendorResearchInsightsPage />
    </AuthGuard>
  ),
})
