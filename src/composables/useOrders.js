import { onMounted, ref, onUnmounted } from "vue"
import { orderBy, query, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { dbOrdersRef } from "../firebase";

export default function useOrders() {
    const allOrders = ref([]);
    const message = ref('');
    const unsubsubscribeFromOrders = ref();

    async function getOrders() {
        try {
            const queryData = query(dbOrdersRef, orderBy('createdAt'));
            const unsubscribe = onSnapshot(queryData, (docs) => {
                allOrders.value = [];
                docs.forEach((doc) => {
                    const order = {
                        id: doc.id,
                        ...doc.data()
                    }
                    allOrders.value.push(order);
                });
            });
            unsubsubscribeFromOrders.value = unsubscribe;        
        }
        catch (e) {

        }
    }
    async function deleteOrder(id) {
        try {
            message.value = "";
            const order = doc(dbOrdersRef, id);
            await deleteDoc(order);
            getOrders();
        } catch(e) {
            message.value = "There was an error deleting the order, please try again."
        }
    }
    onMounted(getOrders)
    onUnmounted(() => {
        console.log('unmounted');
        unsubsubscribeFromOrders.value()
    })

    return { allOrders, deleteOrder, message };
}