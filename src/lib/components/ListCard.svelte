<script lang="ts">
	import { each } from "svelte/internal";
    import moment from 'moment'
	import { goto } from "$app/navigation";

    export let name: string;
    export let content: string[];
    export let id: string;
    export let importance: string;
    export let expiresat: string;

    const expiresatFormatted = moment(expiresat).format('YYYY-MM-DD')
</script>

<div class="max-w-lg rounded shadow-lg bg-stone-50">
	<img class="w-full" src="https://www.cdc.gov/diabetes/images/managing/grocery-shopping-SM.png?_=17886" alt={name} />
	<div class="px-6 py-4">
		<div class="font-bold text-3xl mb-2">{name || 'Bevásárlólista'}</div>
		<p class="text-gray-700 text-base">
			{#each content as contItem}
                <div class="font-semibold">{contItem}</div>
            {/each}
		</p>
	</div>
	<div class="px-6 pt-4 pb-2">
		<span
			class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
			>{expiresatFormatted}</span
		>
		<span
			class="inline-block bg-green-500 rounded-full px-3 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
			><button on:click={() => goto(('/lists/share/'+id))}>Megosztás</button></span
		>
        <span
			class="inline-block bg-orange-500 rounded-full px-3 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
			><button on:click={() => goto(('/lists/'+id))}>Módosítás</button></span
		>
		<span
			class="inline-block bg-red-500 rounded-full px-3 py-3 text-sm font-semibold text-gray-700 mr-2 mb-2"
			><button on:click={() => goto(('/lists/delete/'+id))}>Törlés</button></span
		>
	</div>
</div>
