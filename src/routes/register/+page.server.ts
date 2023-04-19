/* import { Actions, redirect } from "@sveltejs/kit"
import axios from "axios";

export const actions: Actions = {
    default: async ({ locals, request }) => {
        console.log('request')
        const data = Object.fromEntries(await request.formData()) as {
            email: string,
            username: string,
            password: string
        }
        console.log(data)
        try {
            const response = await axios.post('http://localhost:5173/api/register', data, {
                withCredentials: true
            });
            if (response.status === 201) {
                console.log('Siker!');
                console.log(response.data.token);
                axios.defaults.headers.common['Authorization'] = 'Bearer' + response.data.token;
            } else if (response.status === 200) {

            } else {

            }
        }catch (e){
            console.log(data)
            throw e
        }

        throw redirect(303, '/main')
    
}
} */
