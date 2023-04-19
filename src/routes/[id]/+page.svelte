<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import '../../app.css';
	import Card from '$lib/components/Card.svelte';
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
					console.log(response.data);
					userId = response.data.id;
					username = response.data.user.username;
				} else {
					console.log('Hiba történt!');
					await goto('/');
				}
			} catch (error) {
				console.log(error);
				await goto('/');
			}
		} else {
			await goto('/');
		}
	});
</script>

<section>
	<h1 class="text-4xl text-orange-600">
		Üdvözöllek az Online Bevásárlólista weboldalon <strong>{username}</strong>!
	</h1>
	<p>{userId}</p>
	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
	<br class="gap-y-10" />
	<Card />
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
