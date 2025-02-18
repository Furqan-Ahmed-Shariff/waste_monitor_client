'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { jwtDecode } from 'jwt-decode'

export async function login(prevState: any, formData: FormData) {
    let user = { username: formData.get('username'), password: formData.get('password') }
    const cookieStore = await cookies()
    let response = await fetch('http://localhost/validate/token/',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(user)
        }
    )

    if (response.status === 200) {
        let json_data = await response.json()
        setTimeout(refresh_token, 4 * 60 * 1000)
        cookieStore.set('access', json_data.access)
        cookieStore.set('refresh', json_data.refresh)
        revalidatePath('/dashboard')
        redirect(`/dashboard`)
    }
    else {
        return {
            error: true,
        }
    }

}

async function refresh_token() {
    const cookieStore = await cookies()
    let refresh = { refresh: cookieStore.get('refresh') }
    let response = await fetch('http://localhost/validate/token/refresh',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(refresh)
        }
    )

    let json_data = await response.json()
    cookieStore.set('access', json_data.access)
    cookieStore.set('refresh', json_data.refresh)
    setTimeout(refresh_token, 4 * 60 * 1000)
}

export async function getDecodedAccessToken() {
    const cookieStore = await cookies()
    try {
        const acc_token = cookieStore.get('access')
        return jwtDecode(acc_token.value);
    } catch (Error) {
        return null;
    }
}

export async function Validation() {
    const cookieStore = await cookies()
    let auth_token = 'Bearer ' + String(cookieStore.get('access').value)
    let response = await fetch('http://localhost/validate/',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': auth_token
            },
            method: "GET",
        }
    )
    if (response.status !== 204) {
        let resp_json = await response.json()
        return resp_json
    }
    return {
        photo: "/media/test/default.jpg"
    }
    // await fetch
}