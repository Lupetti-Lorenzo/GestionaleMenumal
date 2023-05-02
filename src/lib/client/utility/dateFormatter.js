export const parseDate = (dateStr) => {
	const [year, month, day] = dateStr.split("-")
	return new Date(year, month, day).toLocaleDateString()
}

export const parseDateFromSlash = (dateStr) => {
	const [day, month, year] = dateStr.split("/")
	return `${year}-${month}-${day}`
}
