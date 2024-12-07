export const useAvatarUrl = () => {
    const user = useSupabaseUser()
    const superbase = useSupabaseClient()

    const getPublicUrl = () => {
        const { data } = superbase.storage.from('avatars').getPublicUrl(user.value?.user_metadata?.avatar_url)
        return data.publicUrl
    }
    const url = ref(getPublicUrl())

    watch(user, () => url.value = getPublicUrl(), { immediate: true })


    return { url }
}