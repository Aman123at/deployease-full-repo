import { BUILD_STATUS } from "../constants.js"

export const checkBuildStatus=(logs)=>{
    let status = ''
    for (let index = 0; index < logs.length; index++) {
        const log = logs[index];
        const logMsg = log.log
        if(status!==BUILD_STATUS.IN_PROGRESS && logMsg.includes('Build Started...')){
            status = BUILD_STATUS.IN_PROGRESS
        }
        if(status!==BUILD_STATUS.ACTIVE && logMsg.includes('Done')){
            status = BUILD_STATUS.ACTIVE
        }
        if(status!==BUILD_STATUS.ERROR && logMsg.includes('error:')){
            status = BUILD_STATUS.ERROR
        }
        
    }
    return status
}