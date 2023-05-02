export const parseDate = (dateStr) => {
	const [year, month, day] = dateStr.split("-")
	return new Date(year, month, day).toLocaleDateString()
}

export const parseDateFromSlash = (dateStr) => {
	const [day, month, year] = dateStr.split("/")
	return `${year}-${month}-${day}`
}

// funzione che trasforma la data dal formato US yyyy-mm-dd a un formato piu leggibile in italiano dd-mm-yyyy

export const transformDate = (dateString) => {
	if (!dateString) return ""
	const parts = dateString.split("-")
	const year = parts[0]
	const month = parts[1]
	const day = parts[2]
	return `${day}-${month}-${year}`
}
