<template>
    <div>
        <h1>Firebase Authentication Example</h1>
        <p class="lead">This example is a quick exercise to sign in with a google acount.</p>
        <div v-if="currentUser == null">
            <UButton type="button" role="button" @click="signIn">
                Sign In
            </UButton>
        </div>
        <div v-else>
            <UButton type="button" role="button" @click="signOutUser">
                Sign Out
            </UButton>
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

<script>
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';

export default {
    data: () => ({
        currentUser: null
    }),
    mounted() {
        onAuthStateChanged(getAuth(), (user) => {
            if (user != null) {
                this.currentUser = user;
            } else {
                this.currentUser = null;
            }
        });
    },
    methods: {
        signIn() {
            var provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((auth) => {
                    console.log("login", auth.user);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("faild to login", errorCode, errorMessage);
                });
        },
        signOutUser() {
            signOut(getAuth());
        }
    }
}
</script>