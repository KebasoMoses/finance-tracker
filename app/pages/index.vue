<template>
    <div class="p-4">
        <section class="flex justify-between items-center mb-10">
            <h1 class="text-4xl font-extrabold">Summary</h1>
            <div>
                <USelectMenu :options="transactionsViewOptions" v-model="selectedView" />
            </div>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
            <Trend title="Income" color="green" :amount="incomeTotal" :lastAmount="previousIncomeTotal" :is-loading="pending"/>
            <Trend title="Expense" color="red" :amount="expenseTotal" :lastAmount="previousExpenseTotal" :is-loading="pending" />
            <Trend title="Investments" color="green" :amount="investmentTotal" :lastAmount="previousInvestmentTotal" :is-loading="pending" />
            <Trend title="Saving" color="red" :amount="savingsTotal" :lastAmount="previousSavingsTotal" :is-loading="pending" />
        </section>

        <section>
            <div class="flex justify-between mb-10">
                <div class="">
                    <h2 class="text-2xl font-extrabold">Transactions</h2>
                    <p class="text-gray-500 dark:text-gray-400">You have {{ incomeCount }} Incomes and {{ expenseCount }} expenses this period.</p>
                </div>
                <div>
                    <TransactionModal v-model="isAddTransactionModalOpen" @saved="refresh()" />
                    <UButton color="white" variant="solid" label="Add" icon="i-heroicons-plus-circle" @click="isAddTransactionModalOpen = true" />
                </div>
            </div>
        </section>

        <section v-if="!pending">
            <div v-for="(transactionsOnDay, date) in byDate" :key="date">
                <DailyTransactionSummary :transactions="transactionsOnDay" :date="date" />
                <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction" @deleted="refresh()" @edited="refresh()" />
            </div>
        </section>
        <section v-else>
            <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i"/>
        </section>
    </div>
</template>

<script setup>
import { transactionsViewOptions } from '~/constants';
const user = useSupabaseUser()
const isAddTransactionModalOpen = ref(false)
const selectedView = ref(user.value.user_metadata?.transaction_view ?? transactionsViewOptions[1])
const { current, previous } = useSelectedTimePeriod(selectedView)
const colorMode = useColorMode()
colorMode.preference = user.value.user_metadata?.mode ?? 'system'
watch(user, (value) => {
    colorMode.preference = value.user_metadata?.mode ?? 'system'
})

const { refresh, pending, transactions:{
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    investmentTotal,
    savingsTotal,
    grouped: {
        byDate
    }
}} = useFetchTransactions(current)

const { refresh: refreshPrevious, transactions:{
    incomeTotal: previousIncomeTotal,
    expenseTotal : previousExpenseTotal,
    investmentTotal : previousInvestmentTotal,
    savingsTotal : previousSavingsTotal,
}} = useFetchTransactions(previous)

await Promise.all([refresh(), refreshPrevious()])


// console.log(transactionsGroupedByDate.value)
</script>