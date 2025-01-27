(async function addMonster() {
    const API_URL = 'http://localhost:5000/add-monster'; // URL del backend

    // Dati della Monster da aggiungere
    const newMonster = {
        name: 'Ultra Sunrise',
        category: 'Ultra',
        owned: false,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMonster),
        });

        if (!response.ok) throw new Error('Errore nella richiesta');
        const result = await response.json();
        console.log('Monster aggiunta con successo:', result);
    } catch (error) {
        console.error('Errore:', error);
    }
})();
