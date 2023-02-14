import Head from "next/head";

import { useState } from "react";
import styles from "./index.module.css";

import { calcCostFromTokens, models } from "../utils/models";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState();
  const [tokens, setTokens] = useState();
  const [modelName, setModelName] = useState(models[2].name);
  let [context, setContext] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    console.log(context);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptInput,
          modelName: modelName,
          context: context,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result.choices[0].text);
      setTokens(data.result.usage.total_tokens);
      context.push({ a: data.result.choices[0].text, q: promptInput });

      setContext(context);
      setPromptInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function changeModel(event) {
    setModelName(models[parseInt(event.target.value)].name);
  }

  return (
    <div>
      <Head>
        <title>ZackGPT</title>
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h1>Welcome to ZackGPT... The Create Engine</h1>
        <h3>Need help with something? Ask me.</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="model-change">Change AI Model Used </label>
          <select
            id="model-change"
            name="model-change"
            onChange={changeModel}
            defaultValue="2"
          >
            <option value="0">Davinci - Best</option>
            <option value="1">Curie</option>
            <option value="2">Babbage</option>
            <option value="3">Ada - Fastest</option>
          </select>
          <input
            type="text"
            name="prompt"
            placeholder="Enter an prompt"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <input type="submit" value="Send Prompt" />
        </form>
        <div className={styles.result}>{result}</div>
        <p>
          Used {tokens} tokens, costing {calcCostFromTokens(tokens, modelName)}{" "}
          cents
        </p>
      </main>
    </div>
  );
}
