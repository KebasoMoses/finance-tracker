<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                {{ isEditing ? 'Edit' : 'Add' }} Transaction
            </template>
            <UForm :state="state" :schema="schema" @submit="save" ref="form">
                <UFormGroup label="Transaction Type" :required="true" name="type" class="mb-4">
                    <USelect :disabled="isEditing" placeholder="Select the Transaction Type" :options="types" v-model="state.type" />
                </UFormGroup>
                <UFormGroup :required="true" label="Amount" name="amount" class="mb-4">
                    <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
                </UFormGroup>
                <UFormGroup :required="true" label="Transaction Date" name="created_at" class="mb-4">
                    <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
                </UFormGroup>
                <UFormGroup hint="Optional" label="Description" name="description" class="mb-4">
                    <UInput placeholder="This is the description" v-model="state.description" />
                </UFormGroup>
                <UFormGroup label="Category" :required="true" name="category" class="mb-4" v-if="state.type === 'Expense'">
                    <USelect placeholder="Category" :options="categories" v-model="state.category" />
                </UFormGroup>

                <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
            </UForm>
        </UCard>
    </UModal>
</template>


<script setup>
import { categories } from '~/constants'
import { types } from '~/constants'
import { z } from 'zod'
const { toastSuccess, toastError } = useAppToast()
const superbase = useSupabaseClient()
const isLoading = ref(false)
const props = defineProps({
    modelValue: Boolean,
    transaction: {
        type: Object,
        default: false
    }
})
const isEditing = computed(() => !!props.transaction)
const defaultSchema = z.object({
    amount: z.number().positive('Amount must be more than 0'),
    created_at: z.string(),
    description: z.string().optional(),
})
const incomeSchema = z.object({
    type: z.literal('Income'),
})
const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(categories)
})
const investmentSchema = z.object({
    type: z.literal('Investment')
})
const savingSchema = z.object({
    type: z.literal('Saving')
})
const schema = z.intersection(
    z.discriminatedUnion('type', [
        incomeSchema,
        expenseSchema,
        investmentSchema,
        savingSchema
    ]),
    defaultSchema
)
const initialStates = isEditing ? {
    type: props.transaction.type,
    amount: props.transaction.amount,
    created_at: props.transaction.created_at?.split('T')[0],
    description: props.transaction.description,
    category: props.transaction.category,
} : {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
}
const state = ref({ ...initialStates })
const resetForm = () => {
    Object.assign(state.value, initialStates)
    form.value.clear()
}
const form = ref()
const save = async () => {
    console.log('Form submitted');
    if (form.value.errors.length) return
    try {
        isLoading.value = true
        const { error } = await superbase.from('transactions')
        .upsert({...state.value, id: props.transaction?.id})
        if(!error){
            toastSuccess({title: 'Transaction saved'})
            isOpen.value = false
            emit('saved')
            return
        }
        throw error
    }catch (error){
        console.error(error)
        toastError({title: 'Transaction not saved', description: error.message})
    }finally{
        isLoading.value = false
    }
}
const emit = defineEmits(['update:modelValue', 'saved'])
const isOpen = computed({
    get: ()=> props.modelValue,
    set: (value) => {
        if(!value){
            resetForm()
        }
        emit ('update:modelValue', value)
    }
})
</script>