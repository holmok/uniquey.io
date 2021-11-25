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
