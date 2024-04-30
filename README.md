# Exploring LLM Weirdness: A Quiz Game

This is the source code to the AI quiz game running at https://quiz.cord.com/. It's built with [Cord's AI SDK](https://docs.cord.com/chatbot-ai-sdk/getting-started). We didn't build it with the intent to release it, but it seems useful to do so, and so please do excuse the suboptimal code quality in places.

In order to run it locally:

1. Go to https://console.cord.com/, create a new project, and note down the project ID and secret.
2. Go to https://platform.openai.com/api-keys, create a new key, and note it down.
3. Run `npm install && cp .env.template .env`
4. Edit the `.env`: insert your Cord project ID into `CORD_APPLICATION_ID`, the Cord project secret into `CORD_API_SECRET`, and your OpenAI secret into `OPENAI_API_SECRET`.
5. Run `npm run dev`
6. [Install ngrok](https://ngrok.com/download) and run `ngrok tcp 3000` -- and note down the forwarding URL.
7. Go to https://console.cord.com/, select the project you created above, select "configuration" in the left-hand column, and the "events" tab at the top. Enter `http://` followed by the forwarding address followed by `/api/cord-webhook` into the "webhook URL". (That should result in something like: `http:///0.tcp.eu.ngrok.io:12345/api/cord-webhook`.) Make sure the box for "thread-message-added" is selected, and then press "save". You should see a green box pop up saying everything was fine. If not, [make sure the screen looks similar to the screenshot from our AI SDK getting started guide](https://docs.cord.com/chatbot-ai-sdk/getting-started#Configure-the-webhook-with-Cord-2) and try again (although note that the very end of the "webhook url" needs to be different for this AI Quiz game than it is for the app on that page!)
8. Open up http://localhost:3000 in a web browser and try the game!
