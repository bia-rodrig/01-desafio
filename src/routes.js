import {randomUUID} from 'node:crypto'
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js'
import { getFormattedData } from './utils/get_data.js'


const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) =>{
            const { search } = req.query
            const tasks = database.select('tasks', search ?{
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            console.log(req.body)
            const {title, description} = req.body

            if (!title){
                return res.writeHead(400).end(JSON.stringify({message: 'Necessário informar um title'}))
            }

            if (!description){
                return res.writeHead(400).end(JSON.stringify({message: 'Necessario informar uma descrição'}))
            }        

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: getFormattedData(),
                updated_at: getFormattedData()
            }

            console.log(task)

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title){
                return res.writeHead(400).end(JSON.stringify({message: 'Necessário informar um title'}))
            }

            if (!description){
                return res.writeHead(400).end(JSON.stringify({message: 'Necessário informar uma descrição'}))
            }
            
            const [id_exists] = database.select('tasks', { id })

            if (!id_exists){
                return res.writeHead(404).end()
            }

            const updated_at = getFormattedData()

            database.update('tasks', id, {title, description, updated_at})

            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const [id_exists] = database.select('tasks', { id })

            if (!id_exists){
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const [id_exists] = database.select('tasks', { id })

            if (!id_exists){
                return res.writeHead(404).end()
            }

            const completed_at = getFormattedData()
            const resp = database.complete('tasks', id, completed_at)

            if (resp === 'erro'){
                return res.writeHead(400).end(JSON.stringify({message: 'Tarefa já completada'}))
            }

            return res.writeHead(201).end()
        }
    }

]