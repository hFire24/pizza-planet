import { ref, onMounted } from "vue";
import { getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { dbPizzasRef } from "../firebase";

export default function usePizzas() {
    const allPizzas = ref([]);
    const message = ref('');
    async function getPizzas() {
        try {
            message.value = "";
            onSnapshot(dbPizzasRef, (docs) => {
                allPizzas.value = [];
                docs.forEach((doc) => {
                    const pizza = {
                        id: doc.id,
                        ...doc.data()
                    }
                    allPizzas.value.push(pizza);
                });
            });
        } catch(e) {
            message.value = "There was an error fetching pizzas, please reload the page.";
        }
    }
    onMounted(getPizzas);
    async function deletePizza(id) {
        try {
            message.value = "";
            const pizza = doc(dbPizzasRef, id);
            await deleteDoc(pizza);
        } catch(e) {
            message.value = "There was an error deleting the pizza, please try again."
        }
    }
    return {
        allPizzas,
        deletePizza,
        message
    }
}