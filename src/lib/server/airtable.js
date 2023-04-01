import { AIRTABLEAPIKEY } from "$env/static/private"

const BASE_ID = "app7ewzg2nFqVNKMP"
const TABLE_NAME = "tbl8tkAV20GreqCwK"

export async function getAllRecords() {
  let allRecords = [];
  let offset = '';

  let loop = true
  while (loop) {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${AIRTABLEAPIKEY}`,
      },
    });

    const data = await res.json()
    //console.log(data)

    allRecords = allRecords.concat(data.records);

    if (!data.offset) {
      loop = false
      break
    }
    offset = data.offset;
  }

  return allRecords;
}