export interface IEventData {
  id: string
  text: string
  imageUrl: string
  startTime: string
  endTime: string
  createdAt: string
}

export interface IEventResponse {
  status: number
  data: IEventData
  success: boolean
  timeStamp: string
}
