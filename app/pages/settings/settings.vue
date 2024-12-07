<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
    <UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
      <USelect :options="transactionsViewOptions" v-model="state.transactionView" />
    </UFormGroup>

    <UFormGroup label="Theme Mode" class="mb-4" help="Choose how you would like your website color experience">
      <USelect :options="modes" v-model="state.mode" />
    </UFormGroup>


    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>


<script setup>
import { z } from 'zod'
import { transactionsViewOptions } from '~/constants'
import { modes } from '~/constants'	
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)
const state = ref({
  transactionView: user.value.user_metadata?.transaction_view ?? transactionsViewOptions[1],
  mode: user.value.user_metadata?.mode ?? modes[2]
})
const schema = z.object({
  transactionView: z.enum(transactionsViewOptions),
  mode: z.enum(modes)
})

const saveSettings = async () => {
  pending.value = true

  try {
    const { error } = await supabase.auth.updateUser(
      {
        data: {
          transaction_view: state.value.transactionView,
          mode: state.value.mode
        },
      }
    )
    if (error) throw error
    toastSuccess({
      title: 'Settings updated',
    })
  } catch (error) {
    toastError({
      title: 'Error updating settings',
      description: error.message,
    })
  } finally {
    pending.value = false
  }
}
</script>