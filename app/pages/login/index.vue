<script setup>
import { GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
const toast = useToast()
const {t} = useI18n()

definePageMeta({
  layoutTransition: true,
})
const { signIn, signOut, currentUser } = useAuth()

const signInGoogle = () => {
  signIn(new GoogleAuthProvider(), (error)=>{
    toast.add({title: t('loginFailed'),
      description: error})
  })
}
const signInGithub = () => {
  signIn(new GithubAuthProvider(), (error)=>{
    toast.add({title: t('loginFailed'),
      description: error})
  })
}
</script>

<template>
  <div>
    <div v-if="currentUser == null">
      <h1>{{ $t("login") }}</h1>
      <p>{{ $t('needLogin') }}</p>
      <p>{{ $t('loginType') }}</p>
      <p>{{ $t('noPrivacyData') }}</p>
      <div class="flex gap-4 m-4">
        <UButton type="button" role="button" @click="signInGoogle"> {{ $t('loginGoogle') }} <Icon name="uil:google" size="24px" /></UButton>
        <UButton type="button" role="button" @click="signInGithub"> {{ $t('loginGithub') }} <Icon name="uil:github" size="24px" /></UButton>
      </div>
    </div>
    <div v-else>
      <h1>{{ $t('account') }}</h1>
      <div class="flex gap-4 m-4">
        <UButton type="button" role="button" @click="signOut"> Sign Out </UButton>
      </div>
    </div>
    <section v-if="currentUser">
      <dl>
        <dt>{{ $t('name') }}</dt>
        <dd>{{ currentUser.displayName }}</dd>
      </dl>

    </section>
  </div>
</template>
