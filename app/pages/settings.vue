<template>
    <div class="grid grid-cols-6 gap-8 m-4">
        <div class="col-span-2">
            <UVerticalNavigation :links="links" />
        </div>
        <div class="col-span-4"> 
            <NuxtPage />
        </div>
    </div>
</template>

<script setup>

const links = [
    {
        label: 'Profile',
        to: '/settings/profile'
    },
    {
        label: 'Avatar',
        to: '/settings/avatar'
    },
    {
        label: 'Settings',
        to: '/settings/settings'
    }
]

</script>