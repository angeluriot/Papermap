# 🏆 How maps are scored?

This section explains how the top summary bar on map pages is generated in **Papermap**. To see how individual papers are scored, please check the **[Papers scoring](/doc/scoring/papers.md)** section. Feel free to ask in the **[Discord server](https://discord.gg/eFdjRJe7WZ)** if you have any questions.

Each part of the top summary bar is a group of conclusions, for example `Yes but small effect` and `Yes unlike literature` can both be in the same group: `Yes but...`. Each group has a unique color, if two papers have the same color they are part of the same group.

Each group gets a score based on the score of its papers:

```math
score_{group} = \sum_{paper~\in~group} {score_{paper}}^2
```

The group scores are then normalized so the sum represents the total length of the bar.

An issue with this approach is that it can lead to situations where a map with only a small number of papers with a low score has a conclusion group getting 100% in the summary bar, . To mitigate this, there is also a special group called `More research needed`.
