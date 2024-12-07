export const useFetchTransactions = (period) => {
    const pending = ref(false)
    const supabase = useSupabaseClient();
    const transactions = ref([]);

    const incomeTotal = computed(() => {
        return transactions.value.filter(t => t.type === 'Income').reduce((acc, cur) => acc + cur.amount, 0)
    })
    const expenseTotal = computed(() => {
        return transactions.value.filter(t => t.type === 'Expense').reduce((acc, cur) => acc + cur.amount, 0)
    })
    const investmentTotal = computed(() => {
        return transactions.value.filter(t => t.type === 'Investment').reduce((acc, cur) => acc + cur.amount, 0)
    })
    const savingsTotal = computed(() => {
        return transactions.value.filter(t => t.type === 'Saving').reduce((acc, cur) => acc + cur.amount, 0)
    })
    const incomeCount = computed(() => {
        return transactions.value.filter(t => t.type === 'Income').length
    })
    const expenseCount = computed(() => {
        return transactions.value.filter(t => t.type === 'Expense').length
    })


    const fetchTransactions = async() => {
        pending.value = true
        try {
            const { data } = await useAsyncData(`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`, async() => {
                const { data, error } = await supabase.from('transactions').select()
                    .order('created_at', { ascending: false })
                    .gte('created_at', period.value.from.toISOString())
                    .lte('created_at', period.value.to.toISOString())
                if (error) {
                    return []
                }
                return data
            })
            return data.value
        } finally {
            pending.value = false
        }
    }

    const refresh = async() => {
        return transactions.value = await fetchTransactions()
    }

    watch(period, async() => {
        await refresh(), { immediate: true }
    })

    const transactionsGroupedByDate = computed(() => {
        let grouped = {}

        for (const transaction of transactions.value) {
            const date = transaction.created_at.split('T')[0]
            if (!grouped[date]) {
                grouped[date] = []
            }
            grouped[date].push(transaction)
        }
        return grouped
    })


    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupedByDate
            },
            incomeTotal,
            expenseTotal,
            investmentTotal,
            savingsTotal,
            incomeCount,
            expenseCount
        },
        refresh,
        pending
    }
}