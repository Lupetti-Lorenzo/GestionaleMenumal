<script>
	import * as Pancake from '@sveltejs/pancake';
	import { jobsStore } from '$lib/client/jobsStore.js';

	// prende n(weeks) e jobs e restituisce n colonne che sono le settimane con tot registrazioni  in formato [{range, count}]
	const getWeeksCounts = (jobs, weeks = 8) => {
		let weeksCount = [];
		const today = new Date();
		const endDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000); // adjust for timezone offset
		for (let i = 1; i < weeks + 1; i++) {
			const startDate = new Date(
				endDate.getTime() - i * 7 * 24 * 60 * 60 * 1000
			).toLocaleDateString();
			let newEndDate = new Date(endDate.getTime() - (i - 1) * 7 * 24 * 60 * 60 * 1000);
			if (i !== 1) newEndDate.setDate(newEndDate.getDate() - 1); // se e diverso dalla settimana corrente tolgo un giorno alla fine per non overlappare le settimane
			newEndDate = newEndDate.toLocaleDateString();

			const range = `${startDate}-${newEndDate}`;
			const count = jobs.filter((item) => {
				const jobDate = parseDate(item.fields['dataRegistrazioneIT']);
				return jobDate >= startDate && jobDate <= newEndDate;
			}).length;
			// const  [labelStart, labelEnd]  = range.split("-")
			// const newRange = labelEnd.slice(0, 2)
			weeksCount.push({ range, count });
		}
		return weeksCount;

		function parseDate(dateStr) {
			const [day, month, year] = dateStr.split('-');
			return new Date(year, month, day).toLocaleDateString();
		}
	};

	const getMaxCount = (weeksCount) => {
		weeksCount = weeksCount.reverse();
		let maxCount = 0;
		let maxRange = '';
		for (const { range, count } of weeksCount) {
			if (count > maxCount) {
				maxCount = count;
				maxRange = range;
			}
		}
		return maxCount;
	};

    // CHART DATAS
	$: chartData = getWeeksCounts($jobsStore.jobs);
	$: data = chartData.map((week, i) => ({ x: i, y: week.count }));
	$: vertMaxVal = getMaxCount(chartData);
	const barWidth = 0.95; // or use border-left for a more consistent result
	const xAxisAdjustment = -0.5;
</script>

<!-- Titolo -->
<h1 class="mt-4 mb-2 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5x">
	Andamento Registrazioni
</h1>
<h2 class="mb-4 text-xl font-extrabold leading tracking-tight text-gray-900 md:text-1xl lg:text-2x">
	Ultimi 2 mesi
</h2>



<div class="chart mb-8">
	<Pancake.Chart x1={xAxisAdjustment} x2={data.length - 1} y1={0} y2={vertMaxVal}>
		<Pancake.Box x1={xAxisAdjustment} x2={data.length + xAxisAdjustment} y2={vertMaxVal}>
			<div class="axes" />
		</Pancake.Box>

		<Pancake.Grid vertical count={data.length} let:value>
			<span class="x label">{value}</span>
		</Pancake.Grid>

		<Pancake.Grid horizontal count={3} let:value>
			<span class="y label">{value}</span>
		</Pancake.Grid>

		<Pancake.Columns {data} width={barWidth}>

			<div class="column" />
		</Pancake.Columns>
	</Pancake.Chart>
</div>

<style>
	.chart {
		height: 300px;
		width: 600px;
		padding: 3em 2em 2em 3em;
		box-sizing: border-box;
	}

	.axes {
		width: 100%;
		height: 100%;
		border-left: 2px solid rgb(31 41 55);
		border-bottom: 2px solid rgb(31 41 55);
		opacity: 0.7;
	}

	.label {
		opacity: 0.7;
	}

	.y.label {
		position: absolute;
		left: -2.5rem;
		width: 2rem;
		text-align: right;
		bottom: -0.5em;
	}

	.x.label {
		position: absolute;
		width: 4rem;
		left: -2rem;
		bottom: -2rem;
		font-family: sans-serif;
		text-align: center;
	}

	.column {
		height: 100%;
		background-color: rgb(31 41 55);
	}
</style>
