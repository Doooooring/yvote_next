/**
 * Incident — narrative report of a parse / scrape / apply error or
 * warning surfaced to the owner at /adminjae2's IncidentsLane.
 *
 * Mirrors yvote-api's `src/interface/incident/index.ts` (DB-backed
 * Incident table; not filesystem-backed as the original Phase 1.3 plan
 * proposed). Free-form questions a manager has for the owner go via
 * Telegram, NEVER through this table — see `feedback_q_and_a_policy`.
 *
 * Phase 6.3 of 2026-04-27-news-lifecycle-cross-repo.md.
 */

export enum IncidentSource {
  Scrape = 'scrape',
  Parse = 'parse',
  Apply = 'apply',
  Manager = 'manager',
  Conductor = 'conductor',
  Other = 'other',
}

export enum IncidentSeverity {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export enum IncidentStatus {
  Open = 'open',
  Dismissed = 'dismissed',
  Resolved = 'resolved',
}

export interface IncidentDetails {
  [key: string]: unknown;
}

export interface Incident {
  id: number;
  createdAt: string;
  source: IncidentSource;
  severity: IncidentSeverity;
  message: string;
  details?: IncidentDetails | null;
  status: IncidentStatus;
  dismissedAt?: string | null;
  newsId?: number | null;
  proposedActionId?: number | null;
}

export interface IncidentUpdate {
  status?: IncidentStatus;
  details?: IncidentDetails;
  message?: string;
}
