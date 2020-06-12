<template>
  <div>
    <div id="nav">
      <router-link to="/labelml/fabric">Fabric</router-link>|
      <router-link to="/labelml/LabelHome">LabelHome</router-link>|
      <router-link to="/labelml/LabelHome">LabelEdit</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'Labelml'
}
</script>
