const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connetti MongoDB
mongoose.connect('mongodb+srv://piggy:monster1441@cluster0.cf9e2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Connesso a MongoDB Atlas con successo!");
    })
    .catch((error) => {
        console.error("Errore nella connessione a MongoDB Atlas", error);
    });

// Schema MongoDB
const monsterSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String,
        enum: ['Classic', 'Ultra', 'Rehab', 'Nitro', 'Java', 'Super Fuel', 'Reserve', 'Dragon Tea', 'Punch', 'Juiced', 'Dedicate']
    },
    owned: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
});

const Monster = mongoose.model('Monster', monsterSchema);

// Ottieni tutte le Monster, ordinate per "order"
app.get('/monsters', async (req, res) => {
    try {
        const monsters = await Monster.find().sort('order');
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
    const { newOrder } = req.body;

    try {
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

        const newMonster = new Monster({
            name,
            category,
            owned: owned || false,
        });

        await newMonster.save();
        res.status(201).json({ message: 'Monster aggiunta con successo!', monster: newMonster });
    } catch (error) {
        console.error('Errore durante l\'aggiunta della Monster:', error);
        res.status(500).json({ message: 'Errore durante l\'aggiunta della Monster.' });
    }
});

// Esporta l'app per Vercel
module.exports = app;
