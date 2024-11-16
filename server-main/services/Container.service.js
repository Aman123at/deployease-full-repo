import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs"

export default class ContainerService{
    getDevModeCommand=(gitURL,projectSlug,deployementID)=>{
        return `cd ../generate-build-server && \
        docker build -t ${projectSlug} . && docker run -d \
        -e REPO_URL=${gitURL} \
        -e PROJECT_ID=${projectSlug} \
        -e DEPLOYMENT_ID=${deployementID} \
        -e KAFKA_BROKER_URL=${process.env.KAFKA_BROKER_URL} \
        -e KAFKA_USERNAME=${process.env.KAFKA_USERNAME} \
        -e KAFKA_PASSWORD=${process.env.KAFKA_PASSWORD} \
        -e AWS_S_THREE_ACCESSKEYID=${process.env.AWS_S_THREE_ACCESSKEYID} \
        -e AWS_S_THREE_SECRETACCESSKEY=${process.env.AWS_S_THREE_SECRETACCESSKEY} \
        -e KAFKA_HOST_URL=${process.env.KAFKA_HOST_URL} ${projectSlug}
        `
    }
    getCommand=(gitURL,projectSlug,deployementID,mode='prod')=>{
        // Spin the container
        if(mode==='dev'){
            return this.getDevModeCommand(gitURL,projectSlug,deployementID)
        }else{

            const command = new RunTaskCommand({
                cluster: process.env.ECS_CLUSTER_ARN,
                taskDefinition: process.env.ECS_TASK_ARN,
                launchType: 'FARGATE',
                count: 1,
                networkConfiguration: {
                    awsvpcConfiguration: {
                        assignPublicIp: 'ENABLED',
                        subnets: process.env.TASK_SUBNETS.split(","),
                    }
                },
                overrides: {
                    containerOverrides: [
                        {
                            name: process.env.ECS_CONTAINER_NAME,
                            environment: [
                                { name: 'REPO_URL', value: gitURL },
                                { name: 'PROJECT_ID', value: projectSlug },
                                { name: 'DEPLOYMENT_ID', value: deployementID },
                                {name:'KAFKA_BROKER_URL',value:process.env.KAFKA_BROKER_URL},
                                {name:'KAFKA_HOST_URL',value:process.env.KAFKA_HOST_URL},
                                {name:'KAFKA_USERNAME',value:process.env.KAFKA_USERNAME},
                                {name:'KAFKA_PASSWORD',value:process.env.KAFKA_PASSWORD},
                                {name:'AWS_S_THREE_ACCESSKEYID',value:process.env.AWS_S_THREE_ACCESSKEYID},
                                {name:'AWS_S_THREE_SECRETACCESSKEY',value:process.env.AWS_S_THREE_SECRETACCESSKEY},
                            ]
                        }
                    ]
                }
            })
    
            return command
        }
    }

    getECSClient(){
        const ecsClient = new ECSClient({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: process.env.ECS_USER_ACCESS_KEY_ID,
                secretAccessKey: process.env.ECS_USER_SECRET_ACCESS_KEY
            }
        })
        return ecsClient
    }
}