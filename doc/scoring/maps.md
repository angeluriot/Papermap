# 🏆 How maps are scored?

This section explains how the top summary bar on map pages is generated in **Papermap**. To see how individual papers are scored, please check the **[Papers scoring](/doc/scoring/papers.md)** section. Feel free to ask in the **[Discord server](https://discord.gg/eFdjRJe7WZ)** if you have any questions.

Each part of the top summary bar is a group of conclusions, for example `Yes but small effect` and `Yes unlike literature` can both be in the same group: `Yes but...`. Each group has a unique color, if two papers have the same color they are part of the same group.

Each group gets a score based on the score of its papers:

```math
score_{group} = \sum_{paper~\in~group} {score_{paper}}^2
```

The group scores are then normalized so the sum represents the total length of the bar.

An issue with this approach is that it can lead to situations where a map has like 3 papers with a low score but since they all have the same conclusion it is getting 100% in the summary bar, giving the impression of a very strong consensus when in reality it is considered an open question. To mitigate this, there is a special group called `More research needed` that takes a proportion of the bar based on the overall number and quality of the papers in the map, if there isn't a single paper it takes 100% of the bar, otherwise it's calculated as follows:

```math
score_{more~research~needed} = \min \left( \frac{\max \left( 5 - \sum\limits_{paper~\in~map} \min \left( {score_{paper}}^5, score_{paper} \right), 0 \right)}{5} , 0.95 \right)
```

Examples:

<table>
	<tbody>
		<tr>
			<th align="center" colspan="2" rowspan="2"></th>
			<td align="center" colspan="6"><b>Score of all papers</b></td>
		</tr>
		<tr>
			<th align="center"><b>0</b></th>
			<th align="center"><b>0.2</b></th>
			<th align="center"><b>0.4</b></th>
			<th align="center"><b>0.6</b></th>
			<th align="center"><b>0.8</b></th>
			<th align="center"><b>1</b></th>
		</tr>
		<tr>
			<td rowspan="7"><b>Number of papers</b></td>
			<th align="center"><b>0</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
		<tr>
			<th align="center"><b>5</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">92%</td>
			<td align="center">67%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<th align="center"><b>10</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">84%</td>
			<td align="center">34%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<th align="center"><b>20</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">69%</td>
			<td align="center">0%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<th align="center"><b>50</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">90%</td>
			<td align="center">22%</td>
			<td align="center">0%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<th align="center"><b>100</b></th>
			<td align="center">95%</td>
			<td align="center">95%</td>
			<td align="center">80%</td>
			<td align="center">0%</td>
			<td align="center">0%</td>
			<td align="center">0%</td>
		</tr>
	</tbody>
</table>
