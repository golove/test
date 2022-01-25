<script lang="ts" setup>
import { reactive } from 'vue';
const msg = reactive([]);

function sendMsg(){
window.ipcRenderer.send('renderMsg','ping');
 window.ipcRenderer.on('mainMsg',(e,a)=>{
    msg.push(a);
  });
}
</script>
<template>
  <button
    @click="sendMsg"
  >
    send
  </button>
  <p>ping -> {{ msg }}</p>
</template>
