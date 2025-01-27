const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connetti MongoDB
mongoose.connect('mongodb+srv://piggy:<db_password>@cluster0.cf9e2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema MongoDB
const monsterSchema = new mongoose.Schema({
    name: String,
    category: { 
        type: String, 
        enum: ['Classic', 'Ultra', 'Rehab', 'Nitro', 'Java', 'Super Fuel', 'Reserve', 'Dragon Tea', 'Punch', 'Juiced', 'Dedicate'] 
    },  // Aggiungi tutte le categorie qui
    owned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
});

const Monster = mongoose.model('Monster', monsterSchema);

// Ottieni tutte le Monster, ordinate per "order"
app.get('/monsters', async (req, res) => {
    try {
        const monsters = await Monster.find().sort('order'); // Ordina per "order"
        res.json(monsters);
    } catch (error) {
        console.error('Errore nel recupero delle monster:', error);
        res.status(500).json({ message: 'Errore nel recupero delle monster' });
    }
});

// Aggiorna lo stato "owned" di una Monster
app.put('/update-monster/:id', async (req, res) => {
    const { id } = req.params;
    const { owned } = req.body;

    try {
        await Monster.findByIdAndUpdate(id, { owned });
        res.json({ message: 'Monster aggiornata con successo!' });
    } catch (error) {
        console.error('Errore nell\'aggiornamento della monster:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento della monster' });
    }
});

// Aggiorna l'ordine delle Monster
app.put('/update-order', async (req, res) => {
    const { newOrder } = req.body; // Lista con gli ID in ordine

    try {
        // Aggiorna ogni monster con il nuovo ordine
        for (let i = 0; i < newOrder.length; i++) {
            const monsterId = newOrder[i];
            await Monster.findByIdAndUpdate(monsterId, { order: i });
        }

        res.json({ message: 'Ordine aggiornato con successo!' });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dell\'ordine:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'ordine' });
    }
});

// Endpoint per aggiungere una nuova Monster
app.post('/add-monster', async (req, res) => {
    try {
        const { name, category, owned } = req.body;

        // Crea una nuova Monster nel database
        const newMonster = new Monster({
            name,
            category,
            owned: owned || false, // Di default non è posseduta
        });

        await newMonster.save();
        res.status(201).json({ message: 'Monster aggiunta con successo!', monster: newMonster });
    } catch (error) {
        console.error('Errore durante l\'aggiunta della Monster:', error);
        res.status(500).json({ message: 'Errore durante l\'aggiunta della Monster.' });
    }
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
