# Quickstart (/en/docs/zvec-grep/quickstart)



<div className="fd-steps">
  <div className="fd-step">
    ## Install [#1-install]

    Zvec-Grep requires Node.js 22 or newer:

    ```bash
    npm install -g @zvec/zvec-grep
    zg version
    ```
  </div>

  <div className="fd-step">
    ## Prepare a Sample Bookshelf [#2-prepare-a-sample-bookshelf]

    Download two public-domain books and index them with an English retrieval model:

    ```bash
    mkdir zg-mystery && cd zg-mystery
    curl --retry 3 --retry-all-errors --progress-bar -fL \
      -o alice-in-wonderland.txt https://raw.githubusercontent.com/GITenberg/Alice-s-Adventures-in-Wonderland_11/master/11.txt \
      -o sherlock-holmes.txt https://raw.githubusercontent.com/GITenberg/The-Memoirs-of-Sherlock-Holmes_834/master/834.txt

    zg index --embedding local/potion-retrieval-32m
    ```

    The explicit model overrides the code-oriented default because this workspace contains English prose.
  </div>

  <div className="fd-step">
    ## Search [#3-search]

    ### For Agents: Ask with OpenCode [#for-agents-ask-with-opencode]

    With [OpenCode](https://opencode.ai/) installed:

    ```bash
    zg install --target opencode --yes
    opencode run --model opencode/deepseek-v4-flash-free \
      "An unseen creature left a few marks. What did the detective infer? Cite local evidence."
    ```

    OpenCode chooses Zvec-Grep on its own; the prompt does not name a tool.

    <details>
      <summary>
        <strong>Example Agent result</strong>
      </summary>

      ```text
      ⚙ zvec_grep_zvec_grep_search {"root":".../zg-mystery","query":"An unseen creature left a few marks. What did the detective infer?","fts":["marks","unseen creature","inferred","detective"],"fuse":true}
      → Read sherlock-holmes.txt [offset=5440, limit=120]

      Answer:
      The detective is Sherlock Holmes in The Adventure of the Crooked Man.
      From the animal's marks, he inferred that:

      - it was not a familiar animal: the print had five pads and long nails;
      - it had a long body and very short legs;
      - it was carnivorous because it climbed toward a canary's cage;
      - it was probably an unusually large member of the weasel or stoat family.

      Evidence: sherlock-holmes.txt:5479-5516
      ```

      The wording may vary by Agent and model, but the cited evidence should be similar.
    </details>

    ### For Humans: Search Directly [#for-humans-search-directly]

    Use the CLI to search the same bookshelf yourself:

    ```bash
    zg query --human \
      "An unseen creature left a few marks. What did the detective infer?" \
      --limit 3
    ```

    Zvec-Grep should rank the relevant passages from `sherlock-holmes.txt` ahead of `alice-in-wonderland.txt` and include source locations you can verify.
  </div>
</div>

## More Resources [#more-resources]

* [Documentation Guide](../) — find the right page for your question.
* [CLI Reference](../cli/) — look up commands and options.
* [Troubleshooting](../troubleshooting/) — diagnose common problems.
