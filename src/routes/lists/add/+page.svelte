<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import '../../../app.css';
	import Select from 'svelte-select';
	import moment from 'moment';
	import { element } from 'svelte/internal';
	let listId = $page.params.id;
	let username = '';

	let name: string;
	let importance: string;
	let content: string[];
	let expiresat: string;
	let expiresatFormatted = moment(expiresat).format('YYYY-MM-DD');

	type ShopList = {
		text: string;
		status: boolean;
	};

	let newItem = '';

	let todoList = [];

	function addToList(newItem) {
		todoList = [...todoList, { text: newItem, status: false }];

		newItem = '';
	}

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			try {
				const response = await axios.post('http://localhost:5173/api/jwt/verify', {
					withCredentials: true
				});
				if (response.status === 200) {
					console.log(response.data);
					username = response.data.user.username;
				} else {
					console.log('Hiba történt!');
				}
			} catch (error) {
				console.log(error);
			}
		} else {
		}
	});

	const add = async () => {
		try {
			content = [];
			todoList.forEach((element) => {
				if (element.status != true) {
					content.push(element.text);
				}
			});
			console.log(content);
			const data = {
				name: name,
				expiresat: moment(expiresatFormatted).toISOString(),
				content: content
			};
			const response = await axios.post('http://localhost:5173/api/lists/add', data, {
				withCredentials: true
			});
			if (response.status === 201) {
				console.log(response.data);
			} else {
				console.log('Hiba történt!');
			}
		} catch {
			console.log('Hiba történt!');
		}
	};
</script>

<section>
	<div class="bg-grey-lighter min-h-screen flex flex-col">
		<div class="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
			<div class="bg-stone-50 px-6 py-10 rounded shadow-lg h-[160] text-black w-full rounded-xl">
				<h1 class="mb-8 text-3xl text-center font-bold">Létrehozás</h1>
				<p class="text-xl text-red-500 text-center" />
				<input
					bind:value={name}
					type="text"
					class="block border border-grey-light w-full p-3 rounded mb-4 font-bold text-gray-950"
					placeholder="Lista neve"
				/>
				<input
					bind:value={newItem}
					type="text"
					placeholder="Új vennivaló.."
					class="block border border-grey-light w-full p-3 rounded mb-4 font-bold text-gray-950"
				/>
				<button
					on:click={addToList(newItem)}
					class="w-full text-center py-3 rounded bg-green text-white bg-green-400 hover:bg-green-600 focus:outline-none my-1 font-bold"
					>Add</button
				>

				<br class="mb-10" />
				{#each todoList as item, index}
					<input bind:checked={item.status} type="checkbox" />
					<span class:checked={item.status} class="font-semibold text-md">{item.text}</span>
					<br />
				{/each}
				<br class="mb-2" />
				<input
					bind:value={expiresatFormatted}
					type="text"
					class="block border border-grey-light w-full p-3 rounded mb-4 font-bold text-gray-950"
					placeholder="Lejárati dátum"
				/>
				<button
					type="submit"
					class="w-full text-center py-3 rounded bg-green text-white bg-orange-400 hover:bg-orange-600 focus:outline-none my-1 font-bold"
					on:click={add}>Hozzáadás</button
				>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	.checked {
		text-decoration: line-through;
	}
</style>
