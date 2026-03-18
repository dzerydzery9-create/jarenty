# 🚀 AI Agent Builder - Jak Uruchomić (Naprawione!)

## ❌ Problem

Poprzedni launcher (Electron) nie działał prawidłowo. Przyczyna:
- Brak `main.js` dla Electron
- Problemy z Display/X11
- Złożona konfiguracja

## ✅ Rozwiązanie

Teraz aplikacja uruchamia się jako **Web App** (najnowsza wersja):
- Działa w każdej przeglądarce
- Szybsza do startu
- Bardziej niezawodna

---

## 🎯 Jak Uruchomić Teraz

### **Sposób 1: Klik na Pulpicie (Tym Razem Będzie!)**

1. **Kliknij 2x** na ikonę `AI-Agent-Builder` na pulpicie
2. **Czekaj** 10-15 sekund (pierwszym razem:

 buduje)
3. **Przęglądarka otworzy się** automatycznie
4. **Gotowe!** App będzie dostępna na `http://localhost:3000`

### **Sposób 2: Z Terminala (Gwarancja Pracy!)**

```bash
bash /home/jarek/ai-agent-builder/launch.sh
```

Lub bezpośrednio:
```bash
cd /home/jarek/ai-agent-builder
export BROWSER=none
export PORT=3000
npm start
```

---

## 🌐 Jak Otwórz W Przeglądarce Ręcznie

Jeśli przęglądarka się nie otworzy automatycznie:

1. **Otwórz przeglądarę** (Firefox, Chrome, itp.)
2. **Wpisz adres:** `http://localhost:3000`
3. **ENTER** i gotowe!

---

## 🤖 Funkcjonalność AI (Ollama Integration)

Aplikacja automatycznie:
- ✅ Startuje Ollama (jeśli nie uruchomiony)
- ✅ Podłącza się do modelów AI
- ✅ Wyświetla dostępne modele

### Dostępne Modele

```
deepseek-coder:1.3b  (776 MB)  - Ultra-fast code expert ⭐
gemma3:270m          (291 MB)  - Super-fast lightweight
```

### Jak Dodać Więcej Modeli

```bash
ollama pull phi:2.7b
ollama pull mistral:7b
ollama pull neural-chat:7b
```

---

## 📊 UI Components

```
┌─────────────────────────────────────────┐
│  💬 Chat │ 📁 Explorer │ 🔍 Search     │
├─────────────────────────────────────────┤
│ ┌──────────────────────────────────┐   │
│ │  📱 Main Editor Area             │   │
│ │  - Model Selector                │   │
│ │  - Chat Interface                │   │
│ │  - Command Palette (Ctrl+Shift+P)│   │
│ └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Terminal Output                        │
└─────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Aplikacja nie otwiera się

**Przyczyna 1: Port 3000 zajęty**
```bash
lsof -ti:3000 | xargs kill -9
bash /home/jarek/ai-agent-builder/launch.sh
```

**Przyczyna 2: Zmieniająca się przęglądarka**
```bash
# Otwórz ręcznie:
firefox http://localhost:3000
# lub
chromium http://localhost:3000
```

### Ollama nie odpowiada
```bash
# Sprawdź czy uruchomiony:
pgrep ollama

# Jeśli nie, uruchom:
ollama serve

# W innym terminalu:
ollama run deepseek-coder:1.3b
```

### Dziwne błędy JavaScript
```bash
# Wyczyść i przebuduj:
cd /home/jarek/ai-agent-builder
rm -rf node_modules build
npm install --legacy-peer-deps
npm start
```

---

## 📋 Szybkie Komendy

```bash
# Uruchom app
bash /home/jarek/ai-agent-builder/launch.sh

# Otwórz w przeglądarce
firefox http://localhost:3000

# Sprawdź logów
tail -f /tmp/ai-builder.log

# Zatrzymaj app
killall npm node

# Uruchom Ollama
ollama serve

# Załaduj model
ollama pull deepseek-coder:1.3b
```

---

## ✨ Co Się Zmąeniło

| Wcześniej | Teraz |
|-----------|-------|
| ❌ Electron Desktop App | ✅ Web App (React) |
| ❌ Problemy z Display | ✅ Każda przeglądarka |
| ❌ Powolny start | ✅ Szybki start (10s) |
| ❌ Skomplikowana konfiguracja | ✅ Prosta konfiguracja |

---

## 🎉 Teraz Powinna Działać!

Spróbuję jeszcze raz kliknąć na pulpicie - tym razem się uruchomi! ✅

**Jeśli dalej problem:** Użyj komendy w terminalu:
```bash
bash /home/jarek/ai-agent-builder/launch.sh
```
