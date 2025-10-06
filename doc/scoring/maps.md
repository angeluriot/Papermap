# 🏆 How are maps scored?

This page explains how the top summary bar on map pages is generated in **Papermap**. For details on individual paper scoring, see **[Paper scoring](/doc/scoring/papers.md)**. Feel free to ask questions in the **[Discord server](https://discord.gg/eFdjRJe7WZ)**.

Each segment of the top summary bar corresponds to a group of conclusions. For example, `Yes but small effect` and `Yes unlike literature` might both belong to a broader group like `Yes but...`. Each group has a unique color, if two papers share a color, they belong to the same group.

Each group receives a score based on the scores of its papers:

```math
score_{group} = \sum_{paper~\in~group} {score_{paper}}^2
```

Group scores are then normalized so their sum represents the bar's total length.

One issue with this approach is that a map with just a few weak papers sharing the same conclusion could appear as a full (100%) consensus, when in reality it's still considered an open question. To mitigate this, a special group `More research needed` reserves a portion of the bar based on the overall number and quality of papers. If there are no papers, it occupies 100% of the bar, otherwise it's calculated as follows:

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
