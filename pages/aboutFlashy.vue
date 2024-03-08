<template>
    <div id="profile">
      <div id="center-column">
        <div id="navBar">
          <NavBar />
        </div>
        <div class="container">
          <h1 class="header">Flashy</h1>
          <div class="about">
            Flashy er en interaktiv flashcard-app laget for å forbedre læring og minne. 
            Brukere kan enkelt opprette, administrere og interagere med et bredt spekter av læringssett. 
            Appen tilbyr både private og offentlige sett, samt funksjoner som gjør det mulig å merke vanskelige kort, 
            legge til bilder og engasjere seg med andre brukeres sett gjennom likes og kommentarer. 
            Med kraftige søke- og filtreringsfunksjoner, samt muligheten til å lagre favorittsett, 
            tilbyr Flashy en tilpassbar læringsopplevelse for enhver bruker. Med et intuitivt grensesnitt og 
            verktøy for profiladministrasjon, lagring og organisering, interaksjon med flashcards, 
            bildeintegrasjon, moderering og oversikt over populære sett, er Flashy det ideelle verktøyet for 
            alle læringssituasjoner.
            **Sikkert lurt å endre litt på denne teksten**
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavBar from '@/components/flashy/NavBar.vue';
  
  definePageMeta({
    middleware: 'auth',
  });
  </script>
  
  <style scoped>
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
  }
  
  .container {
    max-width: 800px;
    margin: auto;
    text-align: center;
  }
  
  .header {
    font-size: 40px;
    font-weight: bold;
    color: #cf1f3c;
    margin-bottom: 20px;
  }
  
  .about {
    font-size: 18px;
    text-align: center;
    margin-left: 50px;
    margin-right: 50px;
  }
  </style>
  