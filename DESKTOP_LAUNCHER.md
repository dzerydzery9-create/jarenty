# AI Agent Builder Quick Start

## 🚀 Uruchamianie aplikacji

### Option 1: Z pulpitu (Najszybciej)
1. Kliknij **2x** na ikonę `AI-Agent-Builder` na pulpicie
2. Aplikacja uruchomi się automatycznie

### Option 2: Z terminala
```bash
cd /home/jarek/ai-agent-builder
npm run dev
```

### Option 3: Skrypt uruchamiający
```bash
bash /home/jarek/ai-agent-builder/launch.sh
```

## 📋 Pliki na pulpicie

- **AI-Agent-Builder.desktop** - Skrót do aplikacji (główny)
- **AI-Agent-Builder.svg** - Ikona aplikacji

## ⚙️ Konfiguracja środowiska

Przed pierwszym uruchomieniem, stwórz plik `.env` w folderze projektu:

```bash
cd /home/jarek/ai-agent-builder
cat > .env << 'EOF'
REACT_APP_OPENAI_API_KEY=twoj-klucz-openai
REACT_APP_CLAUDE_API_KEY=twoj-klucz-claude
REACT_APP_OLLAMA_BASE_URL=http://localhost:11434
EOF
```

## 🔧 Troubleshooting

### Jeśli ikona nie działa
1. Upewnij się że plik `.desktop` jest **wykonywalny**:
   ```bash
   chmod +x /home/jarek/Desktop/AI-Agent-Builder.desktop
   ```

2. Kliknij PPM na ikonę → Properties → Permissions → Make executable

### Jeśli aplikacja się nie uruchamia
1. Otwórz terminal
2. Uruchom ręcznie:
   ```bash
   bash /home/jarek/ai-agent-builder/launch.sh
   ```

### Jeśli brakuje zależności
```bash
cd /home/jarek/ai-agent-builder
npm install --legacy-peer-deps
```

## 📦 Zawartość pulpitu

Możesz również skopiować ikonę do systemowych katalogów:

```bash
# Dla aktualngo użytkownika
cp /home/jarek/ai-agent-builder/AI-Agent-Builder.desktop ~/.local/share/applications/

# Dla wyszukiwarki aplikacji systemowej
sudo cp /home/jarek/ai-agent-builder/AI-Agent-Builder.desktop /usr/share/applications/
```

## ❓ Potrzebujesz pomocy?

1. Sprawdź [README.md](../README.md) w głównym folderze projektu
2. Otwórz issue na GitHubie
3. Zaproponuj ulepszenia!

---

**Enjoy coding with AI! 🤖✨**
