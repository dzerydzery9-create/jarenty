# ⚠️ System Zawiesza Się - ROZWIĄZANIE

## 🔴 Problem

System zawiesza się gdy uruchamiam ciężkie modele (7B+).

**Przyczyna:**
- Twój system: **7.6 GB RAM**
- Modele 7B potrzebują: **10-14 GB RAM**
- Wynik: **System swapuje jak szalony** → **kompletne zawieszenie**

---

## ✅ ROZWIĄZANIE - Użyj Tylko Lekkichudów Modeli

### 🚀 Bezpieczne Modele (Dla 7.6 GB RAM):

| Model | Rozmiar | Szybkość | Przeznaczenie |
|-------|---------|----------|--|
| **gemma3:270m** | 270 MB | ⚡⚡⚡⚡ ULTRA | Najszybszy - dla dialogów |
| **deepseek-coder:1.3b** | 1.3 GB | ⚡⚡⚡ BARDZO | Programowanie - polecany |
| **phi:2.7b** | 2.7 GB | ⚡⚡ SZYBKO | Ogólny - na krawędziach |

### 🚫 Niebezpieczne Modele (UNIKAJ!):

| Model | Rozmiar | Problem |
|-------|---------|---------|
| mistral:7b | 7 GB | ❌ System freeze |
| neural-chat:7b | 7 GB | ❌ System freeze |
| codellama:7b | 7 GB | ❌ System freeze |
| orca-mini:3b | 3 GB | ⚠️ Ryzykowne |

---

## 🔧 Jak Uruchomić Bez Zawieszenia

### Metoda 1: Użyj Optymalizowanego Launchera (POLECANE)

```bash
bash /home/jarek/ai-agent-builder/launch-safe.sh
```

**Co robi:**
- ✅ Limituje Ollama do 5 GB RAM
- ✅ Limituje Node do 512 MB
- ✅ Ustawia limity na wątki
- ✅ Automatycznie otwiera przeglądarkę

### Metoda 2: Główny Launcher (Również Optymalizowany)

```bash
bash /home/jarek/ai-agent-builder/launch.sh
```

**Już zawiera:**
- ✅ Limity RAM dla Ollamy (5 GB)
- ✅ Limity CPU
- ✅ Ograniczenia na wątki

---

## 📊 Szybka Porównanie Modeli

### Dla SZYBKOŚCI 🏃:
```
1. gemma3:270m     (270 MB)   ← START Z TEGO!
2. deepseek-coder  (1.3 GB)   ← POLECANY
3. phi:2.7b        (2.7 GB)   ← OK
```

### Dla KODOWANIA 💻:
```
1. deepseek-coder:1.3b        ← NAJLEPSZY
2. gemma3:270m + poradnik      ← OK
```

### Dla CZATÓW 💬:
```
1. gemma3:270m                 ← NAJSZYBSZY
2. phi:2.7b                    ← DOBRZE
```

---

## 🛑 CO ROBIĆ GDY SYSTEM SIĘ ZAWIESZA

### Scenariusz 1: System już zawisł

1. **Ctrl+Alt+F2** - Przełącz na terminal TTY
2. Wpisz login i hasło
3. Zatrzymaj procesy:
   ```bash
   killall ollama npm node
   ```
4. **Ctrl+Alt+F7** - Wróć do GUI

### Scenariusz 2: Profilaktyka (Rób to)

1. **Zamknij VS Code** (używa 1-2 GB RAM)
2. **Zamknij nepotrzebne aplikacje**
3. **Użyj launch-safe.sh:**
   ```bash
   bash /home/jarek/ai-agent-builder/launch-safe.sh
   ```

---

## 📋 Jakie Modele Masz Zainstalowane

```bash
ollama list
```

**Output:**
```
NAME                   SIZE
deepseek-coder:1.3b    776 MB   ✅ BEZPIECZNY
gemma3:270m            291 MB   ✅ BEZPIECZNY
```

---

## 🎯 KROKI AKCJI (Zrób TO TERAZ)

### 1️⃣ Zatrzymaj Wszystkie Procesy
```bash
killall ollama npm node 2>/dev/null
sleep 2
```

### 2️⃣ Uruchom Bezpieczny Launcher
```bash
bash /home/jarek/ai-agent-builder/launch-safe.sh
```

### 3️⃣ Czekaj na Start (10 sekund)
- Przęglądarka otworzy się sama
- Będzie `http://localhost:3000`

### 4️⃣ Testuj z gemma3:270m
- W aplikacji wybierz: `gemma3:270m`
- Poczuj różnicę - ultraszybki!

### 5️⃣ Jeśli Chcesz Więcej Modeli
```bash
# BEZPIECZNE (< 3 GB):
ollama pull orca-mini:3b
ollama pull phi:2.7b

# NIEBEZPIECZNE (UNIKAJ):
# ollama pull mistral:7b
# ollama pull neural-chat:7b
# ollama pull codellama:7b
```

---

## 💡 PORADY PRO

### Tip 1: Używaj gemma3 Gdy Potrzebujesz Szybkości
- 270 MB - zmieści się na RAMie kilka razy
- Odpowiadaj natychmiast
- Idealnie do chatbota

### Tip 2: deepseek-coder do Kodowania
- 1.3 GB - bezpiecznie się zmieści
- Doskonały dla programistów
- Lepsze rozumienie kodu niż gemma3

### Tip 3: Zamykaj VS Code Przed Uruchomieniem
```bash
killall code   # lub
pkill -f "VS Code"
```

### Tip 4: Monitoruj RAM W Czasie Rzeczywistym
```bash
watch -n 1 free -h
```

### Tip 5: Ustaw Większy Swap Na Dysku
```bash
# Sprawdź aktualny swap:
free -h | grep -i swap

# Jeśli chcesz zwiększyć (artykuł na Internecie pokaże jak)
```

---

## 📞 Troubleshooting

### Błąd: "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
bash /home/jarek/ai-agent-builder/launch-safe.sh
```

### Błąd: "Ollama connection failed"
```bash
# Sprawdzausługę Ollama:
curl http://localhost:11434/api/tags

# Jeśli nie działa, zaraz restartuj:
killall ollama
sleep 2
ollama serve
```

### Błąd: "Model not found"
```bash
# Sprawdź jakie modele masz:
ollama list

# Zainstaluj bezpieczny:
ollama pull gemma3:270m
```

---

## ✨ FINALNE POLECENIE (Kopiuj Wklej)

```bash
killall ollama npm node 2>/dev/null ; sleep 2 ; bash /home/jarek/ai-agent-builder/launch-safe.sh
```

**To:**
1. Zabija stare procesy
2. Czeka 2 sekundy
3. Startuje bezpieczny launcher

---

**Powinna działać teraz bez zawieszenia! 🚀**

Używaj `gemma3:270m` dla najlepszej wydajności na Twoim systemie.
