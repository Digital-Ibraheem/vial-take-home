export interface IFormData {
  id: string
  question: string
  answer: string
  queries?: IQuery[]
}

export interface ICountedFormData {
  total: number
  formData: IFormData[]
}

export interface IQuery {
  id: string
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  status: string
  formDataId: string
  formData?: IFormData
}

export interface ICountedQueries {
  total: number
  queries: IQuery[]
}

export interface ICreateQuery {
  title: string
  description?: string | null
  status?: string  // Made optional since it defaults to OPEN
  formDataId: string
}

export interface IUpdateQuery {
  title?: string
  description?: string | null
  status?: string
}
