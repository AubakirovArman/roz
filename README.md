# Roz - Nederlandse AI Chatbot voor Jongeren

Roz is een menselijke Nederlandse chatbot speciaal ontworpen voor jongeren (16-25 jaar) in Nederland die zich overweldigd, angstig of vastgelopen voelen. Met geavanceerde AI-technologie biedt Roz een veilige en ondersteunende omgeving voor gesprekken.

## 🌟 Hoofdfuncties

### 💬 Intelligente Chat
- **Nederlandse AI Chatbot**: Gebruikt GPT-4 voor natuurlijke gesprekken in het Nederlands
- **Menselijke Interactie**: Warme, begripvolle en niet-oordelende communicatie
- **Contextbewust**: Onthoudt de gesprekscontext binnen een sessie
- **Emotionele Ondersteuning**: Speciaal getraind voor jongeren met angst en stress

### 🔊 Audio Functionaliteit
- **Text-to-Speech**: Ontvang antwoorden als audio
- **Meerdere Stemmen**: Kies uit 6 verschillende stemopties (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- **Kwaliteitsopties**: 3 TTS modellen beschikbaar (tts-1, tts-1-hd, gpt-4o-mini-tts)
- **Automatisch Afspelen**: Audio wordt automatisch afgespeeld
- **Herbeluisteren**: Ingebouwde audiospeler voor herhaald beluisteren

### 🔐 Veiligheid & Privacy
- **Sessie-gebaseerd**: Unieke sessiecode per gebruiker (geen inloggen vereist)
- **Geen Accounts**: Geen persoonlijke gegevens opgeslagen
- **Anoniem**: Volledige privacy gegarandeerd
- **Veilige Architectuur**: Code-gebaseerde sessies

### 📊 Feedback & Monitoring
- **Feedback Systeem**: Korte feedback formulier na elk gesprek
- **Dashboard**: Overzicht van feedback en gesprekken voor beheerders
- **Statistieken**: Gemiddelde beoordelingen en gesprekstelling
- **Kwaliteitscontrole**: Monitoring van gebruikerservaring

### 🎨 Moderne Interface
- **Responsief Ontwerp**: Werkt op alle apparaten
- **Dark/Light Mode**: Automatische thema detectie
- **Toegankelijk**: Ontworpen voor alle gebruikers
- **Intuïtief**: Eenvoudige en duidelijke interface

## 🛠 Technische Stack

- **Frontend**: Next.js 15 met React 19 en TypeScript
- **Styling**: Tailwind CSS voor moderne UI
- **AI**: OpenAI GPT-4 API voor chat
- **Audio**: OpenAI Text-to-Speech API
- **Data**: JSON-gebaseerde lokale opslag
- **Deployment**: Vercel-ready configuratie

## 📦 Installatie

### Vereisten
- Node.js 18 of hoger
- npm of yarn
- OpenAI API key

### Stap-voor-stap Installatie

1. **Clone de repository**:
```bash
git clone <repository-url>
cd roz
```

2. **Installeer dependencies**:
```bash
npm install
# of
yarn install
```

3. **Configureer environment variabelen**:
```bash
cp .env.local.example .env.local
```

4. **Voeg je OpenAI API key toe** aan `.env.local`:
```env
OPENAI_API_KEY=sk-your_openai_api_key_here
```

5. **Start de development server**:
```bash
npm run dev
# of
yarn dev
```

6. **Open de applicatie**:
Ga naar [http://localhost:3000](http://localhost:3000) in je browser

## 🚀 Gebruik

### Voor Gebruikers

1. **Toegang tot de Chat**:
   - Ga naar de hoofdpagina
   - Voer het toegangstoken in op de inlogpagina
   - Na succesvolle authenticatie krijg je toegang tot de chat

2. **Start een Gesprek**:
   - Begin direct met typen na authenticatie
   - Ontvang een unieke sessie-ID automatisch
   - Gebruik "Uitloggen" om het token te wijzigen of uit te loggen

2. **Audio Modus**:
   - Klik op "🔊 Audio UIT" om audio in te schakelen
   - Gebruik "⚙️ Instellingen" om stem en kwaliteit aan te passen
   - Audio wordt automatisch afgespeeld bij nieuwe berichten

3. **Gesprek Beëindigen**:
   - Klik op "Gesprek beëindigen"
   - Vul het korte feedback formulier in
   - Je feedback helpt Roz te verbeteren

### Voor Beheerders

1. **Dashboard Toegang**:
   - Ga naar `/dashboard`
   - Bekijk alle feedback en statistieken
   - Monitor gebruikerservaring

2. **Configuratie**:
   - Pas chatbot persona aan in `src/app/api/chat/route.ts`
   - Wijzig UI elementen in de component bestanden
   - Update TTS instellingen in `src/app/api/tts/route.ts`

## 🔧 API Documentatie

### Chat Endpoints

#### POST /api/chat
Verstuur een bericht naar Roz

**Request Body**:
```json
{
  "message": "Hallo Roz, ik voel me een beetje gestrest",
  "sessionId": "optional-session-id"
}
```

**Response**:
```json
{
  "response": "Hallo! Het spijt me te horen dat je je gestrest voelt...",
  "sessionId": "uuid-session-id"
}
```

#### GET /api/chat
Genereer nieuwe sessie ID

**Response**:
```json
{
  "sessionId": "new-uuid-session-id"
}
```

### Audio Endpoints

#### POST /api/tts
Genereer audio van tekst

**Request Body**:
```json
{
  "text": "Tekst om om te zetten naar audio",
  "voice": "alloy",
  "model": "tts-1"
}
```

**Response**: Audio bestand (audio/mpeg)

### Feedback Endpoints

#### POST /api/feedback
Verstuur gebruiker feedback

**Request Body**:
```json
{
  "sessionId": "session-uuid",
  "rating": 5,
  "comment": "Roz was heel behulpzaam!"
}
```

#### GET /api/feedback
Haal alle feedback op (voor dashboard)

**Response**:
```json
[
  {
    "sessionId": "session-uuid",
    "rating": 5,
    "comment": "Heel behulpzaam",
    "timestamp": "2024-01-01T12:00:00Z"
  }
]
```

## ⚙️ Configuratie

### Environment Variabelen

```env
# Verplicht
OPENAI_API_KEY=sk-your_openai_api_key_here

# Chat Toegangstoken (verplicht)
CHAT_ACCESS_TOKEN=roz-chat-2024

# Optioneel
NEXT_PUBLIC_APP_NAME=Roz
NEXT_PUBLIC_APP_DESCRIPTION=Nederlandse AI Chatbot voor Jongeren
```

### 🔐 Toegangsbeheer

De applicatie is beveiligd met een tokensysteem:
- Gebruikers moeten een geldig toegangstoken invoeren om toegang te krijgen tot de chat
- Het token wordt ingesteld via de `CHAT_ACCESS_TOKEN` omgevingsvariabele
- Na succesvolle authenticatie wordt het token opgeslagen in een cookie
- Gebruikers kunnen uitloggen via de "Uitloggen" knop in de interface

### Chatbot Persona Aanpassen

Bewerk het systeem prompt in `src/app/api/chat/route.ts`:

```typescript
const systemPrompt = `
Je bent Roz, een warme en begripvolle AI-assistent...
// Pas hier de persona aan
`;
```

### Audio Instellingen

**Beschikbare Stemmen**:
- `alloy`: Neutrale, vriendelijke stem
- `echo`: Heldere, professionele stem
- `fable`: Warme, expressieve stem
- `onyx`: Diepe, kalmerende stem
- `nova`: Levendige, energieke stem
- `shimmer`: Zachte, rustgevende stem

**Beschikbare Modellen**:
- `tts-1`: Standaard kwaliteit, sneller
- `tts-1-hd`: Hoge kwaliteit, langzamer
- `gpt-4o-mini-tts`: Compacte en efficiënte TTS

## 📁 Project Structuur

```
roz/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts      # Chat API endpoint
│   │   │   ├── tts/route.ts       # Text-to-Speech API
│   │   │   └── feedback/route.ts  # Feedback API
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Admin dashboard
│   │   ├── globals.css            # Globale stijlen
│   │   ├── layout.tsx             # App layout
│   │   └── page.tsx               # Hoofdpagina (chat)
│   └── components/
│       ├── AudioSettings.tsx      # Audio configuratie
│       └── FeedbackForm.tsx       # Feedback formulier
├── public/                        # Statische bestanden
├── data/
│   └── feedback.json             # Feedback opslag
├── .env.local                    # Environment variabelen
├── package.json                  # Dependencies
└── README.md                     # Deze documentatie
```

## 🚀 Deployment

### Vercel (Aanbevolen)

1. **Push naar GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Vercel Setup**:
   - Ga naar [vercel.com](https://vercel.com)
   - Verbind je GitHub repository
   - Voeg environment variabelen toe:
     - `OPENAI_API_KEY`: Je OpenAI API key

3. **Deploy**:
   - Vercel detecteert automatisch Next.js
   - Deploy wordt automatisch gestart
   - Je app is live binnen enkele minuten

### Andere Platforms

**Vereisten**:
- Node.js 18+ ondersteuning
- Environment variabelen configuratie
- Build commando: `npm run build`
- Start commando: `npm start`

**Docker Deployment**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Beveiliging & Privacy

### Privacy Principes
- **Geen Persoonlijke Data**: Geen namen, emails of andere identificeerbare informatie
- **Sessie-gebaseerd**: Alleen tijdelijke sessie-IDs
- **Lokale Opslag**: Feedback wordt lokaal opgeslagen
- **Geen Tracking**: Geen analytics of tracking cookies

### Beveiligingsmaatregelen
- **API Key Beveiliging**: OpenAI keys veilig opgeslagen in environment variabelen
- **Input Validatie**: Alle gebruikersinput wordt gevalideerd
- **Rate Limiting**: Bescherming tegen misbruik
- **HTTPS**: Versleutelde communicatie in productie

### GDPR Compliance
- Minimale data verzameling
- Transparante privacy policy
- Recht op vergetelheid (sessies zijn tijdelijk)
- Geen cookies voor tracking

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Manual Testing Checklist
- [ ] Chat functionaliteit werkt
- [ ] Audio mode kan worden in-/uitgeschakeld
- [ ] Verschillende stemmen werken
- [ ] Feedback formulier werkt
- [ ] Dashboard toont data correct
- [ ] Responsive design op mobiel
- [ ] Dark/light mode switching

## 🐛 Troubleshooting

### Veelvoorkomende Problemen

**"OpenAI API Error"**:
- Controleer of je API key correct is ingesteld
- Verificeer dat je OpenAI account credits heeft
- Check of de API key de juiste permissions heeft

**"Audio werkt niet"**:
- Controleer browser audio permissions
- Test verschillende TTS modellen
- Verificeer internet connectie

**"Build Errors"**:
- Run `npm install` opnieuw
- Controleer Node.js versie (18+)
- Clear cache: `npm run clean`

### Debug Mode

Voeg toe aan `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

### Logs Bekijken

**Development**:
```bash
npm run dev
# Logs verschijnen in terminal
```

**Production**:
```bash
npm run start
# Check Vercel dashboard voor logs
```

## 🤝 Bijdragen

### Development Setup

1. **Fork & Clone**:
```bash
git clone https://github.com/jouw-username/roz.git
cd roz
```

2. **Install & Setup**:
```bash
npm install
cp .env.local.example .env.local
# Voeg je API keys toe
```

3. **Development Branch**:
```bash
git checkout -b feature/nieuwe-functie
```

### Code Standards

- **TypeScript**: Gebruik strikte typing
- **ESLint**: Follow de configuratie
- **Prettier**: Code formatting
- **Commits**: Gebruik conventional commits

### Pull Request Process

1. Maak een feature branch
2. Implementeer je wijzigingen
3. Voeg tests toe indien nodig
4. Update documentatie
5. Submit pull request met duidelijke beschrijving

### Feature Requests

Open een issue met:
- Duidelijke beschrijving van de feature
- Use case en voordelen
- Mogelijke implementatie details

## 📈 Roadmap

### Korte Termijn (Q1 2024)
- [ ] Verbeterde audio kwaliteit
- [ ] Meer TTS stemmen
- [ ] Mobile app ondersteuning
- [ ] Offline mode

### Middellange Termijn (Q2-Q3 2024)
- [ ] Video chat ondersteuning
- [ ] Emotie detectie via camera
- [ ] Gepersonaliseerde gesprekken
- [ ] Multi-language ondersteuning

### Lange Termijn (Q4 2024+)
- [ ] AI coaching programma's
- [ ] Integratie met zorgverleners
- [ ] Advanced analytics
- [ ] Community features

## 📄 Licentie

MIT License - zie [LICENSE](LICENSE) bestand voor volledige details.

```
Copyright (c) 2024 Roz Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Support & Contact

### Community Support
- **GitHub Issues**: Voor bugs en feature requests
- **Discussions**: Voor vragen en community support
- **Wiki**: Voor uitgebreide documentatie

### Professional Support
Voor professionele ondersteuning of custom implementaties:
- Email: support@roz-ai.nl
- Website: [www.roz-ai.nl](https://www.roz-ai.nl)

### Contributing
We verwelkomen bijdragen van de community! Zie de [CONTRIBUTING.md](CONTRIBUTING.md) voor details.

---

**Gemaakt met ❤️ voor Nederlandse jongeren die ondersteuning nodig hebben.**
