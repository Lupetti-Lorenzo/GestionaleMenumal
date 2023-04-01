import { json } from "@sveltejs/kit"

import { getAllRecords } from "$lib/server/airtable.js"

export async function POST () {
    // const formDataId = await request.formData()
    // const filter = await formDataId.get('filter')?.valueOf()

    const jobs = await getAllRecords()

    console.log("jobs:"+JSON.stringify(jobs))

    return json(jobs)
}



