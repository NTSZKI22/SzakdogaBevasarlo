<script>
	import { goto } from '$app/navigation';
	import '../../app.css';
	import axios from 'axios';
	import routerNavigate from 'svelte-spa-router';
	import { FacebookAuth } from '@beyonk/svelte-social-auth';

	let username = '';
	let email = '';
	let password = '';
	let passwordConfirmation = '';
	let errorMessage = '';

	let isClicked = false;

	const dataChecking = async () => {
		if (!username || !email || !password || !passwordConfirmation) {
			errorMessage = 'Kérem töltse ki az összes mezőt!';
		} else {
			if (password != passwordConfirmation) {
				errorMessage = 'A két jelszó nem egyezik!';
			} else {
				if (password.length < 8) {
					errorMessage = 'A jelszónak minimum 8 karakter hosszúnak kell lennie!';
				} else {
					if (!email.includes('@') && !email.includes('.')) {
						errorMessage = 'Nem valós email cím!';
					} else {
						errorMessage = '';
						isClicked = true;
						register();
					}
				}
			}
		}
	};

	const register = async () => {
		const data = {
			username: username,
			email: email,
			password: password
		};
		try {
			const response = await axios.post('http://localhost:5173/api/register', data, {
				withCredentials: true
			});
			if (response.status === 201) {
				console.log('Siker!');
				isClicked = false;
				console.log(response.data.token);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
				window.localStorage.setItem('token', response.data.token);
				goto('/');
			} else if (response.status === 200) {
				errorMessage = 'Létezik ez a felhasználónév/email!';
			} else {
				errorMessage = 'Hiba történt!';
			}
		} catch {
			errorMessage = 'Hiba történt!';
			isClicked = false;
		}
	};
	const registerWithFacebook = async (email, username, password) => {
		const data = {
			username: username,
			email: email,
			password: password
		};
		try {
			const response = await axios.post('http://localhost:5173/api/register', data, {
				withCredentials: true
			});
			if (response.status === 201) {
				console.log('Siker!');
				isClicked = false;
				console.log(response.data.token);
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
				window.localStorage.setItem('token', response.data.token);
				goto('/');
			} else if (response.status === 200) {
				errorMessage = 'Létezik ez a felhasználónév/email!';
			} else {
				errorMessage = 'Hiba történt!';
			}
		} catch {
			errorMessage = 'Hiba történt!';
			isClicked = false;
		}
	};

	const API_BASE_URL = 'https://graph.facebook.com/v12.0';

	export async function getUserData(token) {
		const accessToken = token + '';

		if (!accessToken) {
			throw new Error('Access token not found');
		}

		const url = `${API_BASE_URL}/me?fields=id,name,email&access_token=${accessToken}`;
		const response = await axios.get(url);
		if (!response) {
			throw new Error('Failed to fetch user data');
		}

		const userData = await response.data;
		await registerWithFacebook(userData.email, userData.name, userData.id);
	}
</script>

<div class="bg-grey-lighter min-h-screen flex flex-col">
	<div
		class="container max-w-lg max-h-lg mx-auto flex-1 flex flex-col items-center justify-center px-2"
	>
		<form class="bg-stone-50 px-6 py-10 rounded shadow-lg text-black w-full rounded-xl">
			<h1 class="mb-8 text-3xl text-center font-bold text-gray-950">Regisztráció</h1>
			{#if errorMessage}
				<p class="text-sm text-red-500 text-center font-bold pb-10">{errorMessage}</p>
			{/if}
			<input
				bind:value={username}
				type="text"
				class="block border border-gray-600 w-full p-3 rounded mb-4 bg-stone-50 font-bold text-gray-950"
				placeholder="Felhasználónév"
			/>
			<input
				bind:value={email}
				type="text"
				class="block border border-gray-600 w-full p-3 rounded mb-4 bg-stone-50 font-bold text-gray-950"
				placeholder="Email cím"
			/>
			<input
				bind:value={password}
				type="password"
				class="block border border-gray-600 w-full p-3 rounded mb-4 bg-stone-50 font-bold text-gray-950"
				placeholder="Jelszó"
			/>
			<input
				bind:value={passwordConfirmation}
				type="password"
				class="block border border-gray-600 w-full p-3 rounded mb-4 bg-stone-50 font-bold text-gray-950"
				placeholder="Jelszó megerősítése"
			/>

			{#if !isClicked}
				<button
					type="submit"
					class="w-full text-center py-3 rounded bg-green text-white bg-orange-400 hover:bg-orange-600 focus:outline-none my-1"
					on:click={dataChecking}>Regisztráció</button
				>
			{:else}
				<button
					type="submit"
					disabled
					class="w-full text-center items-center justify-center py-3 rounded bg-green text-white bg-orange-400 focus:outline-none my-1"
				>
					<div class="text-center">
						<div role="status">
							<svg
								aria-hidden="true"
								class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span class="sr-only">Loading...</span>
						</div>
					</div></button
				>{/if}
		</form>

		<div class="text-stone-50 mt-6">
			Van már fiókod?
			<a class="no-underline text-orange-500" href="/login"> Jelentkezz be!</a>
		</div>
		<FacebookAuth
			appId="531171802427733"
			on:auth-success={(e) => getUserData(e.detail.accessToken)}
		/>
	</div>
</div>
