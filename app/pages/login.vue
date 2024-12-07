<template>
    <UCard v-if="!success">
        <template #header>
            Sign-in to Finance Tracker
        </template>

        <form @submit.prevent="handleLogin">
            <UFormGroup name="email" label="email" class="mb-4" :required="true" help="You will reveive an email with the confirmation link.">
                <UInput type="email" placeholder="Email" v-model="email" />
            </UFormGroup>

            <UButton variant="solid" color="black" label="Sign Up" type="submit" :loading="pending" />
        </form> 

    </UCard>

    <UCard v-else>
        <template #header>
            Email has been Sent.
        </template>

        <div class="text-center">
            <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign in.</p>
            <p>
                <strong>The link will expire in five minutes.</strong>
            </p>
        </div>
    </UCard>
</template>


<script setup>
const success = ref(false);
const pending = ref(false);
const email = ref('');
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient();
const redirect_url = useRuntimeConfig().public.baseUrl;

useRedirectIfAuthenticated();

const handleLogin = async () => {
    pending.value = true;
    try {
        const {
            error
        } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: `${redirect_url}/confirm`
            },
        })
        if (error) {
            toastError({
                title: 'Error',
                description: error.message,
            })
        }else{
            success.value = true;
        }
    }finally{
        pending.value = false;
    }
}
</script>