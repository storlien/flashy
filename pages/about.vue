<template>
  <NavBar />
  <div id="profile">
    <div class="grid">
      <div></div>
      <div id="center-column">
        <div class="container">
          <h1 class="header">Flashy</h1>
          <div class="about">
            <span>
              Flashy er en interaktiv flashcard-app laget for å forbedre læring og minne.
              Brukere kan enkelt opprette, administrere og interagere med et bredt spekter av læringssett.
            </span>
            <br />
            <br>
            <span>
              Appen tilbyr både private og offentlige sett, samt funksjoner som gjør det mulig å merke vanskelige kort,
              legge til bilder og engasjere seg med andre brukeres sett gjennom likes og kommentarer.
              Med kraftige søke- og filtreringsfunksjoner, samt muligheten til å lagre favorittsett,
              tilbyr Flashy en tilpassbar læringsopplevelse for enhver bruker.
            </span>
            <br>
            <br>
            <span>
              Med et intuitivt grensesnitt og
              verktøy for profiladministrasjon, lagring og organisering, interaksjon med flashcards,
              bildeintegrasjon, moderering og oversikt over populære sett, er Flashy det ideelle verktøyet for
              alle læringssituasjoner.
            </span>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: 1fr 2fr 1fr;
}

#profile {
  display: grid;
  position: relative;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 1fr;
  border-radius: 10px;
  overflow: hidden;
}

#center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: 2px solid #f0f0f0;
  padding: 20px 50px;
}

.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.header {
  font-size: 30px;
  font-weight: bold;
  color: #dd1d4a;
  margin-bottom: 20px;
}

.about {
  font-size: 18px;
  text-align: center;
  margin-left: 50px;
  margin-right: 50px;
}
</style>

<script setup lang="ts"> 

definePageMeta({
  middleware: 'auth',
});

</script>