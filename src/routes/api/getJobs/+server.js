import { json } from "@sveltejs/kit"

import { getAllRecords } from "$lib/server/airtable.js"

export async function GET() {
	const jobs = await getAllRecords()
	return json(jobs)
}
