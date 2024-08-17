<script setup>
import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

definePageMeta({
  layoutTransition: true,
})
const { signIn, signOut, currentUser } = useAuth()

const signInGoogle = () => {
  signIn(new GoogleAuthProvider())
}
const signInGithub = () => {
  signIn(new GithubAuthProvider())
}

</script>

<template>
  <div>
    <div v-if="currentUser == null">
      <h1>ログイン</h1>
      <p class="lead">GoogleアカウントかGithubアカウントでログインできます。</p>
      <UButton type="button" role="button" @click="signInGoogle"> Sign In with Google </UButton>
      <UButton type="button" role="button" @click="signInGithub"> Sign In with GitHub</UButton>
    </div>
    <div v-else>
      <h1>アカウント</h1>
      <UButton type="button" role="button" @click="signOut"> Sign Out </UButton>
    </div>
    <section v-if="currentUser">
      <dl>
        <dt>表示名</dt>
        <dd>{{ currentUser.displayName }}</dd>
      </dl>
    </section>
  </div>
</template>
