<script setup>
definePageMeta({
  layoutTransition: true,
})
const { signIn, signOut, currentUser } = useAuth()
</script>

<template>
  <div>
    <h1>Firebase Authentication Example</h1>
    <p class="lead">This example is a quick exercise to sign in with a google acount.</p>
    <div v-if="currentUser == null">
      <UButton type="button" role="button" @click="signIn"> Sign In </UButton>
    </div>
    <div v-else>
      <UButton type="button" role="button" @click="signOut"> Sign Out </UButton>
    </div>
    <section v-if="currentUser">
      <dl>
        <dt>displayName</dt>
        <dd>{{ currentUser.displayName }}</dd>
        <dt>email</dt>
        <dd>{{ currentUser.email }}</dd>
      </dl>
    </section>
  </div>
</template>
