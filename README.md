# Prompt Playground

A minimal React app for testing and comparing AI prompting techniques — built with Groq API and LLaMA 3.3.

## What it does

- Test 4 prompting techniques: Zero-shot, Few-shot, Chain-of-thought, ReAct
- Adjust temperature to control how creative the AI response is
- See the system prompt used for each technique
- Copy output with one click

## Tech stack

- React
- Groq SDK (free AI API)
- LLaMA 3.3 70B model

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/prompt-playground
cd prompt-playground
npm install
npm install groq-sdk
```

### 2. Add your API key

Create a `.env` file in the root folder:

```
REACT_APP_GROQ_API_KEY=gsk_your_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com)

### 3. Run the app

```bash
npm start
```


## Prompting techniques

| Technique | What it does |
|---|---|
| Zero-shot | Asks the AI directly with no examples |
| Few-shot | Gives examples before asking the question |
| Chain-of-thought | Asks the AI to think step by step |
| ReAct | AI reasons, acts, observes, then concludes |



