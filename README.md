# Highlight Assistant

## What is it

An exploration into using an LLM as an _assistant_ for the comprehension of some _text_. 

A somewhat common 'workflow' I use is to take an excerpt (a sentence, or paragraph as an example) when reading and pass it to the LLM to ask queries. I'll do this for a multitude of reasons such as reframing, explanation, identifying sources, and further reading.

Highlight Assistant helps with this by preloading an LLM with the context of what is being read and providing a utility to _highlight_ (target) a section of text that you are specifically curious about. It then becomes easy to fire off questions about this in particular.

![Demonstration of highlighting text and asking for an explanation from an LLM](./docs/video/demo.gif)

## Getting started

### Prerequisites

- [Node.js v24](https://nodejs.org/en/download)

### Steps

1. Install dependencies: `npm install`.
2. Copy the `.env.example` file to `.env` and populate your OpenAI API key.
3. Run the application: `npm run dev`
4. View the application on [http://localhost:3000](http://localhost:3000)

### OpenAI API Key

Your API key only needs _write_ permission for `/v1/responses`. 

The organisation that this key belongs to [needs to be verified](https://help.openai.com/en/articles/10910291-api-organization-verification). This is due to the response streaming being used with the `gpt-5-mini` model. This is correct at the time of writing (15th Aug 2025). You may be able to bypass this by changing the model used in the [assistantCard file](./src/components/assistantCard.tsx).

## Usage

When viewing the application you will see an excerpt from David Deutsch's [The Beginning of Infinity](https://en.wikipedia.org/wiki/The_Beginning_of_Infinity). Read this text and gain an understanding. Given that this is just a tiny subset of a much larger topic, and that the [concepts can be hard to grok](https://stephenwhitt.wordpress.com/2011/12/03/the-beginning-of-infinity-chapter-eight/), it is natural you may have questions around the text which would aid comprehension.

### Highlight mode

You can enter _highlight mode_ by pressing the `h` key, or using the floating button in the bottom left of the page.

With this mode enabled, any text in the main body that you highlight should have a green hue. You can highlight a single section at a time.

## Using the assistant

Once you have highlighted a section you are curious about, you should see a small popover appear close to the text. Within the popover is an _Ask_ button. Pressing this button will display the assistant card in the top right of your screen.

This card contains an input field you can use to ask a question to an LLM. The prompt will contain prior information around the text you are reading and the section you have highlighted. You can immediately ask your question without having to provide surrounding context.

This card holds a chat history allowing back and forth messaging over the given topic and chained questioning. Have fun!