export interface IEventResponse {
  status: number
  data: {
    id: string
    text: string
    imageUrl: string
    startTime: string
    endTime: string
    createdAt: string
  }
  success: boolean
  timeStamp: string
}
