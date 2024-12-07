<template>
    <div>
        <div class="font-bold" :class="[color]">{{ title }}</div>
        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="isLoading" />
            <div v-else>
                {{ currency }}
            </div>
        </div>
        <div>
            <USkeleton class="h-6 w-full" v-if="isLoading" />
            <div v-else class="flex space-x-1 items-center text-sm">
                <UIcon :name="icon" class="w-6 h-6" :class="{'green': trendingUp, 'red': !trendingUp}"/>  
                <div class="text-gray-500 dark:text-gray-400">
                    {{ percentageTrend }} VS last Period
                </div> 
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    amount: Number, 
    lastAmount: Number,
    color: String,
    isLoading: Boolean
})

const { amount } = toRefs(props)

const trendingUp = computed(()=> props.amount >= props.lastAmount)
const icon = computed(()=> trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down')

const percentageTrend = computed(()=>{
    if (props.amount === 0 || props.lastAmount === 0) {
        return '♾️%'
    }
    const bigger = Math.max(props.amount, props.lastAmount)
    const smaller = Math.min(props.amount, props.lastAmount)

    return `${Math.ceil((bigger - smaller) / smaller * 100)}%`
})

const {currency} = useCurrency(amount)
</script>

<style scoped>
.green {
    @apply text-green-500 dark:text-green-400;
}

.red {
    @apply text-red-500 dark:text-red-400;
}   
</style>