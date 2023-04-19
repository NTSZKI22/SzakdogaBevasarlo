<script>
	import { FacebookAuth } from '@beyonk/svelte-social-auth';
	import '../../app.css';
	import { get } from 'svelte/store';
	import axios from 'axios';
	import { goto } from '$app/navigation';

	let usernam = '';
	let password = '';
	let errorMessage = '';

	let isClicked = false;

	const API_BASE_URL = 'https://graph.facebook.com/v12.0';

	const login = async () => {
		const data = {
			email: usernam,
			password: password,
			username: usernam
		};
		console.log(data)
		try {
			const response = await axios.post('http://localhost:5173/api/login', data, {
				withCredentials: true
			});
			if (response.status === 200) {
				console.log('Siker!');
				isClicked = false;
				console.log(response.data.token);
				window.localStorage.setItem('token', response.data.token);
				goto('/');
			} else {
				errorMessage = 'Hiba történt!';
				console.log(response)
			}
		} catch {
			errorMessage = 'Hiba történt!';
			isClicked = false;
		}
	};
	const loginWithFacebook = async (email, username, password) => {
		const data = {
			username: username,
			email: email,
			password: password
		};
		try {
			const response = await axios.post('http://localhost:5173/api/login', data, {
				withCredentials: true
			});
			if (response.status === 200) {
				console.log('Siker!');
				isClicked = false;
				console.log(response.data.token);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
				window.localStorage.setItem('token', response.data.token);
				goto('/');
			} else {
				errorMessage = 'Hiba történt!';
			}
		} catch {
			errorMessage = 'Hiba történt!';
			isClicked = false;
		}
	};

	export async function getUserData(token) {
		const accessToken = token;

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const url = `${API_BASE_URL}/me?fields=id,name,email&access_token=${accessToken}`;
		const response = await axios.get(url);
		if (!response) {
			throw new Error('Failed to fetch user data');
		}

		const userData = await response.data;
		console.log(userData);
		loginWithFacebook(userData.email, userData.name, userData.id);
	}

	const dataChecking = () => {};
</script>

<div class="bg-grey-lighter min-h-screen flex flex-col">
	<div class="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
		<div class="bg-stone-50 px-6 py-10 rounded shadow-lg h-80 text-black w-full rounded-xl">
			<h1 class="mb-8 text-3xl text-center">Bejelentkezés</h1>
			<p class="text-xl text-red-500 text-center">{errorMessage}</p>
			<input
				bind:value={usernam}
				type="text"
				class="block border border-grey-light w-full p-3 rounded mb-4 font-bold text-gray-950"
				placeholder="Felhasználónév"
			/>
			<input
				bind:value={password}
				type="password"
				class="block border border-grey-light w-full p-3 rounded mb-4 font-bold text-gray-950"
				placeholder="Jelszó"
			/>
			<button
				type="submit"
				class="w-full text-center py-3 rounded bg-green text-white bg-orange-400 hover:bg-orange-600 focus:outline-none my-1"
				on:click={login}>Bejelentkezés</button
			>
		</div>

		<div class="text-stone-50 mt-6">
			Nincs még fiókod?
			<a class="no-underline border-b border-blue text-orange-500" href="/register">
				Regisztrálj!</a
			>
		</div>
		<FacebookAuth
			appId="531171802427733"
			on:auth-success={(e) => getUserData(e.detail.accessToken)}
		/>
	</div>
</div>
