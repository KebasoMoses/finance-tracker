export const useAppToast = () => {
    const toast = useToast();
    return {
        toastSuccess: ({ title, description = null }) => {
            toast.add({
                title,
                description,
                icon: 'i-heroicons-check-circle',
                color: 'green',
                variant: 'success'
            })
        },
        toastError: ({ title, description = null }) => {
            toast.add({
                title,
                description,
                icon: 'i-heroicons-exclamation-circle',
                color: 'red',
                variant: 'danger'
            })
        }
    }
}