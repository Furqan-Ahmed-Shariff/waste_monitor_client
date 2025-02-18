'use server'
import { Validation } from '@/lib';
import { cookies } from 'next/headers';


export async function ImageComponent(prevState: any, formData: any) {
    if (prevState.id) {
        const cookieStore = await cookies()
        let auth_token = 'Bearer ' + String(cookieStore.get('access').value)
        const { value } = formData;
        const data = {
            id: prevState.id,
            category: value, // Use the button value as category
            validated: true,
        };
        let response = await fetch('http://localhost/validate/',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': auth_token
                },
                method: "POST",
                body: JSON.stringify(data)
            }
        )
    }
    let s = await Validation()
    return {
        id: s.id,
        category: s.category,
        photo: s.photo,
        validated: s.validated,
        newType: 'none',
    }
}