import { json } from "@sveltejs/kit"

import { getAllRecords } from "$lib/server/airtable.js"

export async function POST () {
    const jobs = await getAllRecords()
    return json(jobs)
}



