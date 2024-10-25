// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: number,
      name: string,
      email: string,
      password: string,
      avatar: string,
      role: string,
      created_at: string,
      updated_at: string
    },

    tasks: {
      id: number,
      title: string,
      description: string,
      status: boolean,
      image: string,
      created_at: string,
      updated_at: string,

      user_id: number,
    },

    answers: {
        id: string,
        description: string,
        image: string,
        created_at: string,
        updated_at: string,
        
        user_id: number,
        task_id: number
    }
  }
}