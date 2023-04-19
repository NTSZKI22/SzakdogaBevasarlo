<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';

	let fp;
	let date = null;

    export let expiresatFormatted: string;

	const flatpickrOptions = {
		element: '#my-picker',
		enableTime: true,
		altInput: true,
		wrap: true,
		altFormat: 'F j, Y',
		dateFormat: 'Y-m-d',

		onClose: function (selectedDates, dateStr, instance) {
			console.log('n');
		},
		onOpen: function () {
			console.log('opened');
            console.log(date)
		}
	};
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
	<link
		rel="stylesheet"
		type="text/css"
		href="https://npmcdn.com/flatpickr/dist/themes/material_green.css"
	/>
</svelte:head>

<Flatpickr options={flatpickrOptions} bind:value={date} element="#my-picker" bind:fp>
	<div class="mb-5 w-64">
		<label for="datepicker" class="font-bold mb-1 text-gray-700 block"> Select Date </label>
		<div class="flatpickr relative" id="my-picker">
			<input
				type="text"
				placeholder={expiresatFormatted}
				data-input
				class="w-full pl-4 pr-10 py-3 leading-none rounded-lg shadow-sm
        focus:outline-none focus:shadow-outline text-gray-600 font-medium"
			/>

			<div class="absolute top-0 right-0 px-3 py-2">
				<svg
					on:click={() => {
						if (fp) {
							fp.open();
						}
					}}
					class="h-6 w-6 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0
            00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
		</div>
	</div>
</Flatpickr>
