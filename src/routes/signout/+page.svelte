<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

    const signingout = () => {
        localStorage.removeItem('token')
        goto('/')
    }
onMount(async () => {
    if(!localStorage.getItem('token')){
        goto('/')
    }
})

</script>

<section>
	<div class="bg-grey-lighter min-h-screen flex flex-col">
		<div class="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
			<div class="bg-stone-50 px-6 py-10 rounded shadow-lg h-[160] text-black w-full rounded-xl">
				<h1 class="mb-8 text-3xl text-center font-bold">Kijelentkezés</h1>
				<p class="text-xl text-gray-950 text-center" >Biztosan Kijelentkezel?</p>
				<button
					type="submit"
					class="w-full text-center py-3 rounded bg-red-400 text-white bg-red-400 hover:bg-red-600 focus:outline-none my-1 font-bold"
					on:click={signingout}>Kijelentkezés</button
				>
			</div>
		</div>
	</div>
</section>
