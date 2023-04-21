<script setup>
    import usePizzas from '../../composables/usePizzas';
    import { ref } from 'vue';
    const { allPizzas, deletePizza, message } = usePizzas();
    const showMenu = ref(true)
</script>
<template>
    <section class="admin_section">
        <header class="admin_section_header">
            <h3>Menu</h3>
            <small class="toggleBtn" @click="showMenu = !showMenu">{{ showMenu ? "Hide Menu" : "Show Menu" }}</small>
        </header>
        <p class="error" v-if="message">{{ message }}</p>
        <table v-show="showMenu">
            <thead>
                <tr>
                    <th>Pizza</th>
                    <th>Remove from menu</th>
                </tr>
            </thead>
            <tbody v-for="pizza in allPizzas" :key="pizza.id">
                <td>{{ pizza.name }}</td>
                <td>
                    <button @click="deletePizza(pizza.id)" type="button" class="btn_remove">&times;</button>
                </td>
            </tbody>
        </table>
    </section>
</template>