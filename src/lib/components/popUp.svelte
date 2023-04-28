<script>
    
    import { popUpStore } from "$lib/client/popUpStore"
    import JobState from "./jobState.svelte"
    import DatePicker from "$lib/components/datePicker.svelte"
    import { CODICI_STATODB_MENUMAL } from "$lib/constants"
    import { authUser } from "$lib/client/auth"
    

    const closePopUp = () => $popUpStore.open = false

    // document.querySelector("body").addEventListener("click")
    // variabili contenute nello store popUp
    $: open = $popUpStore.open
    $: whichPopUp = $popUpStore.whichPopUp
    $: dbState = $popUpStore.statoDb
    $: jobName = $popUpStore.jobName
    // $: registerDate = $popUpStore.registerDate
    const registerDate = "2023-04-28"

    let newState = dbState // contente il valore selezionato del nuovo stato bindato al selector
    var codiciArray = Object.keys(CODICI_STATODB_MENUMAL).map((key) => {return { id: key, value: CODICI_STATODB_MENUMAL[key]}})

    //date picker
    let newDate = registerDate // data bindata al datepicker
    const en = {
        days: "Su|Mo|Tu|We|Th|Fr|Sa".split("|"),
        months: "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split('|'),
        start: 0,
    }

    async function changeState() {
        // far apparire loader e interrompere l'interazione
        // const formData = await new FormData()
        // formData.id = $authUser
        // formData.newState = newState
        // formData.newDate = newDate
        // formData.job = jobName

        // const res = await fetch("api/changeJobState", {
        //     method: 'POST',
        //     body: formData
        // });

        // const response = await res.json()
        // console.log(JSON.stringify(response))
        closePopUp()
    }
</script>

{#if open}
    <!-- POPUP TAILWIND CSS -->
    <div tabindex="-1"  class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center justify-center align-center">
        <div class="relative w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div class="ml-4 flex items-start justify-between p-4 border-b rounded-t">
                    <h3 class="text-xl font-semibold text-gray-900">
                        {jobName}  <JobState {dbState}/>
                    </h3>
                    <h2 class="ml-7 text-xl font-semibold text-gray-900">{whichPopUp=="full" ? "Cambia stato" : "Estendi trial"}</h2>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" on:click|preventDefault="{closePopUp}">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                {#if whichPopUp=="full"}
                    <div class="p-7 space-y-6">
                        <h3 class="text-xl font-semibold text-gray-900">Registrato il {registerDate}</h3>
                        <span class="text-xl mr-3 font-semibold text-gray-900">Nuovo stato</span>
                        <select bind:value={newState} on:change="{() => newDate = registerDate}">
                            {#each codiciArray as codice}
                                <option value={codice.id}>
                                    {codice.value}
                                </option>
                            {/each}
                        </select>
                        <br>
                        <!-- DatePicker, lo mostro solo se aggiorno lo stato a trial o manuale -->
                        {#if newState == "1" || newState == "3"}
                            <span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
                            <input type="text" bind:value={newDate} class="mt-4 mb-2 pl-1"/>
                            <DatePicker bind:value={newDate} locale={en}/>
                        {/if}
                    </div>
                {:else if whichPopUp=="trial"}
                    <div class="p-7 space-y-6">
                        <h3 class="text-xl font-semibold text-gray-900 ">Registrato il {registerDate}</h3>
                        <span class="text-xl mr-2 font-semibold text-gray-900">Nuova scadenza</span>
                        <input type="text" bind:value={newDate} class="mt-4 mb-2 pl-1" />
                        <DatePicker bind:value={newDate} locale={en}/>
                    </div>
                {/if}
                
                <!-- Modal footer -->
                <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <button on:click|preventDefault={changeState} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Completa</button>
                    <button on:click|preventDefault={closePopUp} type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10" on:click|preventDefault={closePopUp}>Annulla</button>
                </div>
            </div>
        </div>
    </div>
{/if}