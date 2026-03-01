# AGENTS.md

This repository is a monorepo.

- For the API-related documentation, read [api/AGENTS.md](api/AGENTS.md).
- For the webapp documentation, read [web/AGENTS.md](web/AGENTS.md).
- Use [docs/ai/](docs/ai/) to keep track of our discussion as well as follow up questions and various todos.

IMPORTANT: If a prompt contains `[rpe]`, it means the user is asking for a reverse prompt engineering (RPE) of the prompt. In other words, they want to know how to create a prompt that would lead to the given output. You need to assume that on top of their main request the user is also asking:
```
    Before you start:
    -  What would you need to know to implement this properly?
    - "What information would you need to complete this task well?"
    - "What ambiguities should I clarify?"
    - "What should I specify that I haven't?"
```
And once you have all the information you need, rewrite the original request as a complete task specification. Something optimized for an LLM to understand and execute. You finish by asking the user to confirm that everything is correct before you proceed with the task.
