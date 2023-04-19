<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { push } from 'svelte-spa-router';
	import { goto } from '$app/navigation';
	import '../app.css';
	import Card from '$lib/components/Card.svelte';
	import Header from './Header.svelte';
	import { page } from '$app/stores';

	let authorized = false;
	let userId = '';
	let username = '';

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			try {
				const response = await axios.post('http://localhost:5173/api/jwt/verify', {
					withCredentials: true
				});
				if (response.status === 200) {
					console.log(response);
					authorized = true;
					userId = response.data.id;
					username = response.data.user.username;
					//await goto('/' + userId);
				} else {
					console.log('Hiba történt!');
					authorized = false;
				}
			} catch (error) {
				console.log(error);
			}
		}
	});
</script>

<svelte:head>
	<title>Online Bevásárlólista</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if authorized}
		<h1 class="text-4xl text-orange-600">
			Üdvözöllek az Online Bevásárlólista weboldalon
			<br />
			<strong>{username}</strong>!
		</h1>
		<br class="gap-y-10" />
		<Card />
	{:else}
		<h1 class="text-5xl text-stone-50">Üdvözöllek az Online Bevásárlólista weboldalon!</h1>
		<h2 class="text-amber-50 pt-4">
			Nincs fiókod? <a href="/register"
				><strong class="text-orange-500">Regisztrálj egyet!</strong></a
			>
		</h2>
		<Card />
	{/if}
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
</style>
