export interface ClientResponse<T> {
  data: T
  status: number
  statusText: string
}

export interface HeathCheckResponse {
  name: string
  status: string
  timestamp: string
  host: string
  environment: string
}

export interface UniqueyRandomRequest {
  length?: number
  characters?: string
  count: number
}

export interface UniqueyRandomGoodResponse {random: string[]}
export interface UniqueyRandomErrorResponse {message: string}

export type UniqueyRandomResponse = (UniqueyRandomGoodResponse | UniqueyRandomErrorResponse) & {isError: boolean}
