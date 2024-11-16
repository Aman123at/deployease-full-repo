import {createClient } from '@clickhouse/client'
import { ApiError } from '../utils/ApiError.js'
export default class ClickHouseService{
    constructor(){
        this.client =  createClient({
            url:process.env.CLICKHOUSE_URL,
            database:'default',
            username:process.env.CLICKHOUSE_USERNAME,
            password:process.env.CLICKHOUSE_PASSWORD
        }) 
    }
    
    getClient(){
        return this.client
    }

     retrieveLogs=async(deploymentId)=>{
        try {
            
            const data = await this.client.query({query:`SELECT * FROM log_events WHERE deployment_id='${deploymentId}'`})
            return data.json()
        } catch (error) {
            console.log("Unable to retrieve logs : ",error)
            throw new ApiError(500,`Unable to retrieve logs : ${error}`)
        }
    }
    
}