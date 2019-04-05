import { dynamo } from '../config/aws'

export function makeID() {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

export async function getAll(queryParams) {
    let items = []
    let ExclusiveStartKey

    do {
        const resp = await dynamo.queryAsync({
            ...queryParams,
            ExclusiveStartKey,
        })

        if (resp.Items) {
            items = items.concat(resp.Items)
        }

        ExclusiveStartKey = resp.LastEvaluatedKey
    } while (ExclusiveStartKey)

    return items
}
