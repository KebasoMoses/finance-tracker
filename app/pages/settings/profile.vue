<template>
    <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
        <UFormGroup class="mb-4" label="Full Name" name="name">
            <UInput v-model="state.name" />
        </UFormGroup>  

        <UFormGroup class="mb-4" label="Email Adress" name="email" help="You will receive confirmation on the both of new and old if you changed email adress">
            <UInput v-model="state.email" />
        </UFormGroup> 

        <UButton color="black" type="submit" :pending="pending" :disabled="pending">Save</UButton>
    </UForm>
</template>

<script setup>
import z from 'zod'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)
const state = ref({
    name: user.value.user_metadata?.full_name,
    email: user.value.email,
})

const schema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email(),
})

const saveProfile = async () => {
    pending.value = true
    const data = {
        full_name: state.value.name,
    }
    if (state.value.email !== user.value.email) {
        data.email = state.value.email
    }
    try {
        const { error } = supabase.auth.updateUser({data})
        if (error) throw error
        toastSuccess({
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully!'
        })
    } catch (error) {
        toastError({
            title: 'Profile Update Failed',
            description: error.message
        })
    } finally {
        pending.value = false
    }
}
</script>