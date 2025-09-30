# 🏅 How papers are scored?

This section explains how the scores for papers are calculated in **Papermap**. Feel free to ask in the **[Discord server](https://discord.gg/eFdjRJe7WZ)** if you have any questions.

To calculate the score of a paper, the first step is to evaluate each of the following attributes on a scale from `0` to `1`:

## 📋 Summary

* **[Year](#year)**
* **[Journal](#journal)**
* **[Citations](#citations)**
* **[Direct / indirect results](#direct--indirect-results)**
* **[Review](#review)**
* **[Study type](#study-type)**
* **[Blinding method](#blinding-method)**
* **[Sample size](#sample-size)**
* **[P-value](#p-value)**
* **[Conflict of interest](#conflict-of-interest)**
* **[Notes](#notes)**
* **[Publication bias](#publication-bias)**

## [Year](/doc/contribute/papers.md#year)

#### Why?

Recent papers are more likely to contain up-to-date references and use modern methodologies.

#### How?

The year score is calculated linearly from the publication year of the paper with a minimum of `1950` and a maximum of the current year:

```math
score_{year} = \min\!\left(\max\!\left(\dfrac{year-1950}{year_{now}-1950},\, 0\right),\, 1\right)
```

#### Examples (2025)

<table>
	<tbody>
		<tr>
			<td><b>Year</b></td>
			<td align="center">≤1950</td>
			<td align="center">1960</td>
			<td align="center">1970</td>
			<td align="center">1980</td>
			<td align="center">1990</td>
			<td align="center">2000</td>
			<td align="center">2010</td>
			<td align="center">2020</td>
			<td align="center">≥2025</td>
		</tr>
		<tr>
			<td><b>Year score</b></td>
			<td align="center">0</td>
			<td align="center">0.13</td>
			<td align="center">0.27</td>
			<td align="center">0.4</td>
			<td align="center">0.53</td>
			<td align="center">0.67</td>
			<td align="center">0.8</td>
			<td align="center">0.93</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>

## [Journal](/doc/contribute/papers.md#journal)

#### Why?

Publishing in high-quality journals often indicates that the research has undergone rigorous peer review and meets high standards of scientific integrity.

#### How?

The journal score is calculated based on 11 metrics, more details in **[the dedicated repository](https://github.com/angeluriot/Papermap-data#-metrics)**.

* If the paper wasn't published or if the journal wasn't found in the Papermap database, the journal score is set to `0`

* If the paper is an institutional report and the initial journal score would reduce the overall paper score, the journal score is ignored

#### Examples

Here are the top 10 journals with the highest scores:

<table>
	<thead>
		<tr>
			<th align="center">Rank</th>
			<th align="center">Journal</th>
			<th align="center">Journal Score</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td align="center">1</td>
			<th align="left"><a href="https://www.nature.com">Nature</a></th>
			<td align="center">0.98</td>
		</tr>
		<tr>
			<td align="center">2</td>
			<th align="left"><a href="https://www.nejm.org/">New England Journal of Medicine</a></th>
			<td align="center">0.97</td>
		</tr>
		<tr>
			<td align="center">3</td>
			<th align="left"><a href="https://www.cell.com/cell/home">Cell</a></th>
			<td align="center">0.97</td>
		</tr>
		<tr>
			<td align="center">4</td>
			<th align="left"><a href="https://acsjournals.onlinelibrary.wiley.com/journal/15424863">CA: A Cancer Journal for Clinicians</a></th>
			<td align="center">0.97</td>
		</tr>
		<tr>
			<td align="center">5</td>
			<th align="left"><a href="https://www.thelancet.com/journals/lancet/home">The Lancet</a></th>
			<td align="center">0.96</td>
		</tr>
		<tr>
			<td align="center">6</td>
			<th align="left"><a href="https://www.nature.com/nm/">Nature Medicine</a></th>
			<td align="center">0.96</td>
		</tr>
		<tr>
			<td align="center">7</td>
			<th align="left"><a href="https://www.cell.com/immunity/home">Immunity</a></th>
			<td align="center">0.96</td>
		</tr>
		<tr>
			<td align="center">8</td>
			<th align="left"><a href="https://www.cell.com/cancer-cell/home">Cancer Cell</a></th>
			<td align="center">0.96</td>
		</tr>
		<tr>
			<td align="center">9</td>
			<th align="left"><a href="https://www.nature.com/nbt/">Nature Biotechnology</a></th>
			<td align="center">0.96</td>
		</tr>
		<tr>
			<td align="center">10</td>
			<th align="left"><a href="https://www.science.org/journal/science">Science</a></th>
			<td align="center">0.96</td>
		</tr>
	</tbody>
</table>

## [Citations](/doc/contribute/papers.md#citations)

#### Why?

Highly cited papers are often considered more influential and impactful in their respective fields.

#### How?

The citation score is calculated using the number of citations the paper has received in a nonlinear way:

```math
score_{citations} = \dfrac{\dfrac{citations}{50}}{\dfrac{citations}{50} + 1}
```

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>Citations</b></td>
			<td align="center">0</td>
			<td align="center">10</td>
			<td align="center">25</td>
			<td align="center">50</td>
			<td align="center">100</td>
			<td align="center">250</td>
			<td align="center">500</td>
			<td align="center">1,000</td>
			<td align="center">2,500</td>
			<td align="center">5,000</td>
		</tr>
		<tr>
			<td><b>Citations score</b></td>
			<td align="center">0</td>
			<td align="center">0.17</td>
			<td align="center">0.33</td>
			<td align="center">0.5</td>
			<td align="center">0.67</td>
			<td align="center">0.83</td>
			<td align="center">0.91</td>
			<td align="center">0.95</td>
			<td align="center">0.98</td>
			<td align="center">0.99</td>
		</tr>
	</tbody>
</table>

### [Direct / indirect results](/doc/contribute/papers.md#indirect-result)

#### Why?

Papers that base their conclusions on indirect evidence (for example, finding that A cause C which is correlated with B to conclude that A cause B) are generally considered less robust than those that provide direct evidence (finding that A cause B directly).

#### How?

The direct / indirect score is set to `1` if the paper provides direct evidence for its conclusions, and `0` otherwise.

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>Direct / indirect</b></td>
			<td align="center">Indirect</td>
			<td align="center">Direct</td>
		</tr>
		<tr>
			<td><b>Direct / indirect score</b></td>
			<td align="center">0</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>

## Review

#### Why?

Literature reviews and meta-analyses are generally considered more robust evidence than individual studies, as they synthesize findings from multiple sources.

#### How?

The review score is calculated in two parts:
* **[Review type](/doc/contribute/papers.md#review-type)**:
	* `0` for reviews
	* `0.3` for narrative reviews
	* `0.8` for systematic reviews
	* `1` for meta-analyses

* **[Number of papers included](/doc/contribute/papers.md#number-of-papers-included)**:
	* This part is calculated using the number of papers included in the review in a nonlinear way (taking into account **[reviews](/doc/contribute/papers.md#review-of-reviews)**, **[estimate](/doc/contribute/papers.md#number-of-papers-included)**, and **[minor topic](/doc/contribute/papers.md#minor-topic)**):
	```math
	\widehat{review_{count}} = review_{count}
	\times \begin{cases} 5 & \text{if}~~reviews \\ 1 & \text{else} \end{cases}
	\times \begin{cases} 0.75 & \text{if}~~estimate \\ 1 & \text{else} \end{cases}
	\times \begin{cases} 0.25 & \text{if}~~minor~topic \\ 1 & \text{else} \end{cases}
	```
	```math
	score_{review_{count}} = \dfrac{\dfrac{\widehat{review_{count}}}{30}}{\dfrac{\widehat{review_{count}}}{30} + 1}
	```

	* If the number of papers included is not accessible, it is set to `5`

Both parts are then multiplied to get the final review score.

* If the paper is not a literature review, the review score is ignored

#### Examples

<table>
	<tbody>
		<tr>
			<td rowspan="3"></td>
			<td align="center" colspan="8"><b>Number of papers included</b></td>
		</tr>
		<tr>
			<td align="center">0</td>
			<td align="center">10</td>
			<td align="center">20</td>
			<td align="center">30</td>
			<td align="center">50</td>
			<td align="center">100</td>
			<td align="center">500</td>
			<td align="center">1000</td>
		</tr>
		<tr>
			<th align="center" colspan="8">Score</th>
		</tr>
		<tr>
			<td>Review</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
		</tr>
		<tr>
			<td>Narrative review</td>
			<td align="center">0</td>
			<td align="center">0.01</td>
			<td align="center">0.12</td>
			<td align="center">0.15</td>
			<td align="center">0.19</td>
			<td align="center">0.23</td>
			<td align="center">0.28</td>
			<td align="center">0.29</td>
		</tr>
		<tr>
			<td>Systematic review</td>
			<td align="center">0</td>
			<td align="center">0.2</td>
			<td align="center">0.32</td>
			<td align="center">0.4</td>
			<td align="center">0.5</td>
			<td align="center">0.62</td>
			<td align="center">0.75</td>
			<td align="center">0.78</td>
		</tr>
		<tr>
			<td>Meta-analysis</td>
			<td align="center">0</td>
			<td align="center">0.25</td>
			<td align="center">0.4</td>
			<td align="center">0.5</td>
			<td align="center">0.62</td>
			<td align="center">0.77</td>
			<td align="center">0.94</td>
			<td align="center">0.97</td>
		</tr>
	</tbody>
</table>

## [Study type](/doc/contribute/papers.md#study-type)

#### Why?

The type of study can influence its reliability and applicability. For example, randomized controlled trials are generally considered more robust than observational studies.

#### How?

The study type score is set based on the type of study, if the map's question is about causation or correlation, and if the map's question makes randomization possible:

* If the map's question makes the study type irrelevant, the study type score is ignored

* If the paper is a literature review that includes multiple study types, the type scores are first averaged, then a correction is applied towards the best type score based on the number of papers included in the review:

	```math
	score_{type} = \mathbf{\overline{scores_{type}}} + 0.4 \times score_{review_{count}} \times (\max(\mathbf{scores_{type}}) - \mathbf{\overline{scores_{type}}})
	```

	The goal of this correction is to avoid penalizing large diverse reviews (for example, a review of 1,000 papers that includes both RCTs and non-randomized clinical trials probably have more RCTs than a review of 10 RCTs, so the large one should not be penalized compared to the small one)

* If the type of study is not accessible, the score is set to `0.3`

#### Examples

<table>
	<thead>
		<tr>
			<th></th>
			<th align="center">Default</th>
			<th align="center">No randomization</th>
			<th align="center">No causation</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><b>Other</b></td>
			<td align="center">0</td>
			<td align="center">0</td>
			<td align="center">0</td>
		</tr>
		<tr>
			<td><b>In vitro study</b></td>
			<td align="center">0.2</td>
			<td align="center">0.2</td>
			<td align="center">0.2</td>
		</tr>
		<tr>
			<td><b>Case report</b></td>
			<td align="center">0.2</td>
			<td align="center">0.25</td>
			<td align="center">0.3</td>
		</tr>
		<tr>
			<td><b>Animal study</b></td>
			<td align="center">0.3</td>
			<td align="center">0.3</td>
			<td align="center">0.3</td>
		</tr>
		<tr>
			<td><b>Ecological sStudy</b></td>
			<td align="center">0.3</td>
			<td align="center">0.4</td>
			<td align="center">0.6</td>
		</tr>
		<tr>
			<td><b>Cross-sectional study</b></td>
			<td align="center">0.4</td>
			<td align="center">0.6</td>
			<td align="center">0.8</td>
		</tr>
		<tr>
			<td><b>Case-control study</b></td>
			<td align="center">0.4</td>
			<td align="center">0.6</td>
			<td align="center">0.8</td>
		</tr>
		<tr>
			<td><b>Cohort study</b></td>
			<td align="center">0.5</td>
			<td align="center">0.8</td>
			<td align="center">0.9</td>
		</tr>
		<tr>
			<td><b>Clinical trial</b></td>
			<td align="center">0.5</td>
			<td align="center">0.8</td>
			<td align="center">0.9</td>
		</tr>
		<tr>
			<td><b>Randomized controlled trial</b></td>
			<td align="center">1</td>
			<td align="center">1</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>

## [Blinding method](/doc/contribute/papers.md#blinding-method)

#### Why?

Blinding helps to avoid placebo effects and reduce bias in treatment administration or outcome assessment.

#### How?

The blinding score is set based on the blinding method used in the study.

* If the map's question makes the blinding method irrelevant or unfeasible, the blinding score is ignored

* If the paper is a literature review that includes multiple blinding methods, the blinding scores are first averaged, then a correction is applied towards the best blinding score based on the number of papers included in the review:

	```math
	score_{blinding} = \mathbf{\overline{scores_{blinding}}} + 0.4 \times score_{review_{count}} \times (\max(\mathbf{scores_{blinding}}) - \mathbf{\overline{scores_{blinding}}})
	```

	The goal of this correction is to avoid penalizing large diverse reviews (for example, a review of 1,000 papers that includes both blinded and non-blinded RCTs probably have more blinded RCTs than a review of 10 blinded RCTs, so the large one should not be penalized compared to the small one)

* If the blinding method is not accessible, the score is set to `0.3`

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>Blinding method</b></td>
			<td align="center">None</td>
			<td align="center">Single</td>
			<td align="center">Double</td>
		</tr>
		<tr>
			<td><b>Blinding score</b></td>
			<td align="center">0</td>
			<td align="center">0.5</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>

## [Sample size](/doc/contribute/papers.md#sample-size)

#### Why?

Larger sample sizes generally provide more reliable and generalizable results, reducing the impact of random variation.

#### How?

The sample size score is calculated using the number of subjects in the study in a nonlinear way:

```math
score_{sample~size} = \dfrac{\dfrac{sample~size}{scale}}{\dfrac{sample~size}{scale} + 1}~\left(\text{with}~scale = \begin{cases} 60 & \text{if}~~RCT \\ 600 & \text{else} \end{cases}\right)
```

* If the map's question makes the sample size irrelevant or if the paper is an in vitro study, the sample size score is ignored

* If the sample size is not accessible or not specified, the score is set to `0.25` and `0` respectively, except for reviews where an estimate is calculated based on the number of papers included in the review:

	```math
	score_{sample~size} = score_{review_{count}} + 0.3 \times (1 - score_{review_{count}})
	```

#### Examples

<table>
	<tbody>
		<tr>
			<td colspan="2"><b>Sample size</b></td>
			<td align="center">0</td>
			<td align="center">25</td>
			<td align="center">50</td>
			<td align="center">100</td>
			<td align="center">500</td>
			<td align="center">1,000</td>
			<td align="center">5,000</td>
			<td align="center">10,000</td>
		</tr>
		<tr>
			<td rowspan="2"><b>Sample size score</b></td>
			<td><b>Non-RCTs</b></td>
			<td align="center">0</td>
			<td align="center">0.04</td>
			<td align="center">0.08</td>
			<td align="center">0.14</td>
			<td align="center">0.45</td>
			<td align="center">0.62</td>
			<td align="center">0.89</td>
			<td align="center">0.94</td>
		</tr>
		<tr>
			<td><b>RCTs</b></td>
			<td align="center">0</td>
			<td align="center">0.29</td>
			<td align="center">0.45</td>
			<td align="center">0.62</td>
			<td align="center">0.89</td>
			<td align="center">0.94</td>
			<td align="center">0.99</td>
			<td align="center">0.99</td>
		</tr>
	</tbody>
</table>

## [P-value](/doc/contribute/papers.md#p-value)

#### Why?

P-values provide a measure of the statistical significance of the study's findings, with lower p-values indicating stronger evidence against the null hypothesis.

#### How?

The p-value score is calculated using the p-value reported in the study in a nonlinear way:

```math
score_p = \left(1 - \min\!\left(\max\!\left(\dfrac{p \times \begin{cases} 0.5 & \text{if~~“< ...”} \\ 1 & \text{else} \end{cases}}{0.05},\, 0\right),\, 1\right)\right)^5
```

* If the result of the paper is not statistically significant, the p-value score is ignored

* If the p-value is not accessible or not specified, the score is set to `0.25` and `0` respectively

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>P-value</b></td>
			<td align="center">0.05</td>
			<td align="center">&lt;0.05</td>
			<td align="center">0.01</td>
			<td align="center">&lt;0.01</td>
			<td align="center">0.001</td>
			<td align="center">&lt;0.001</td>
			<td align="center">0.0001</td>
		</tr>
		<tr>
			<td><b>P-value score</b></td>
			<td align="center">0</td>
			<td align="center">0.03</td>
			<td align="center">0.33</td>
			<td align="center">0.59</td>
			<td align="center">0.9</td>
			<td align="center">0.95</td>
			<td align="center">0.99</td>
		</tr>
	</tbody>
</table>

## [Conflict of interest](/doc/contribute/papers.md#conflict-of-interest)

#### Why?

A conflict of interest can introduce bias into the study's design, conduct, or reporting, potentially affecting the credibility of the findings.

#### How?

The conflict of interest score is set based on the presence and importance of any conflicts of interest disclosed in the paper.

* If the conflict of interest part is not accessible, the score is set to `0.7`

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>Conflict of interest</b></td>
			<td align="center">None</td>
			<td align="center">Some links</td>
			<td align="center">Yes but opposite results</td>
			<td align="center">Yes</td>
		</tr>
		<tr>
			<td><b>Conflict of interest score</b></td>
			<td align="center">1</td>
			<td align="center">0.5</td>
			<td align="center">0.8</td>
			<td align="center">0</td>
		</tr>
	</tbody>
</table>

## [Notes](/doc/contribute/papers.md#notes)

#### Why?

Some information doesn't fit into the predefined categories but can still be important for evaluating the quality or the relevance of a paper regarding the map's question.

#### How?

Each note has an impact on the final score set by hand.

#### Examples

<table>
	<tbody>
		<tr>
			<td><b>Note impact</b></td>
			<td align="center">Very negative</td>
			<td align="center">Negative</td>
			<td align="center">Neutral</td>
			<td align="center">Positive</td>
			<td align="center">Very positive</td>
		</tr>
		<tr>
			<td><b>Note score</b></td>
			<td align="center">0</td>
			<td align="center">0.35</td>
			<td align="center">0.5</td>
			<td align="center">0.65</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>



## Publication bias

#### Why?

Studies with positive or significant results are more likely to be published than those with negative or non-significant findings.

#### How?

The publication bias score is set to `1` if the paper has negative or non-significant results, and `0` otherwise.

### Examples

<table>
	<tbody>
		<tr>
			<td><b>Publication bias</b></td>
			<td align="center">Positive / significant results</td>
			<td align="center">Negative / non-significant results</td>
		</tr>
		<tr>
			<td><b>Publication bias score</b></td>
			<td align="center">0</td>
			<td align="center">1</td>
		</tr>
	</tbody>
</table>

<br/>

# 🧮 Final score calculation

A paper always starts with a base score of `1`, then each of the above attributes (if not ignored) will impact it positively or negatively based on their score like so:


<table>
	<tbody>
		<tr>
			<td rowspan="3" colspan="2"></td>
			<td align="center" colspan="11"><b>Attribute score</b><br/>(examples, real values are continuous)</td>
		</tr>
		<tr>
			<td align="center">0</td>
			<td align="center">0.1</td>
			<td align="center">0.2</td>
			<td align="center">0.3</td>
			<td align="center">0.4</td>
			<td align="center">0.5</td>
			<td align="center">0.6</td>
			<td align="center">0.7</td>
			<td align="center">0.8</td>
			<td align="center">0.9</td>
			<td align="center">1</td>
		</tr>
		<tr>
			<th align="center" colspan="11">Impact on paper score</th>
		</tr>
		<tr>
			<td rowspan="2"><b>Year</b></td>
			<td><b>Not a review</b></td>
			<td align="center">-10%</td>
			<td align="center">-9%</td>
			<td align="center">-8%</td>
			<td align="center">-7%</td>
			<td align="center">-6%</td>
			<td align="center">-5%</td>
			<td align="center">-4%</td>
			<td align="center">-3%</td>
			<td align="center">-2%</td>
			<td align="center">-1%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td><b>Review</b></td>
			<td align="center">-20%</td>
			<td align="center">-18%</td>
			<td align="center">-16%</td>
			<td align="center">-14%</td>
			<td align="center">-12%</td>
			<td align="center">-10%</td>
			<td align="center">-8%</td>
			<td align="center">-6%</td>
			<td align="center">-4%</td>
			<td align="center">-2%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Journal</b></td>
			<td align="center">-50%</td>
			<td align="center">-44%</td>
			<td align="center">-38%</td>
			<td align="center">-32%</td>
			<td align="center">-26%</td>
			<td align="center">-20%</td>
			<td align="center">-14%</td>
			<td align="center">-8%</td>
			<td align="center">-2%</td>
			<td align="center">+4%</td>
			<td align="center">+10%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Citations</b></td>
			<td align="center">-10%</td>
			<td align="center">-8%</td>
			<td align="center">-6%</td>
			<td align="center">-4%</td>
			<td align="center">-2%</td>
			<td align="center">0%</td>
			<td align="center">+2%</td>
			<td align="center">+4%</td>
			<td align="center">+6%</td>
			<td align="center">+8%</td>
			<td align="center">+10%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Direct / Indirect</b></td>
			<td align="center">-50%</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Review</b></td>
			<td align="center">0%</td>
			<td align="center">+10%</td>
			<td align="center">+20%</td>
			<td align="center">+30%</td>
			<td align="center">+40%</td>
			<td align="center">+50%</td>
			<td align="center">+60%</td>
			<td align="center">+70%</td>
			<td align="center">+80%</td>
			<td align="center">+90%</td>
			<td align="center">+100%</td>
		</tr>
		<tr>
			<td rowspan="2"><b>Study type</b></td>
			<td><b>Effect</b></td>
			<td align="center">-60%</td>
			<td align="center">-54%</td>
			<td align="center">-48%</td>
			<td align="center">-42%</td>
			<td align="center">-36%</td>
			<td align="center">-30%</td>
			<td align="center">-24%</td>
			<td align="center">-18%</td>
			<td align="center">-12%</td>
			<td align="center">-6%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td><b>No effect</b></td>
			<td align="center">-55%</td>
			<td align="center">-50%</td>
			<td align="center">-44%</td>
			<td align="center">-38%</td>
			<td align="center">-33%</td>
			<td align="center">-27%</td>
			<td align="center">-22%</td>
			<td align="center">-17%</td>
			<td align="center">-11%</td>
			<td align="center">-5%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td rowspan="2"><b>Blinding method</b></td>
			<td><b>Effect</b></td>
			<td align="center">-30%</td>
			<td align="center">-27%</td>
			<td align="center">-24%</td>
			<td align="center">-21%</td>
			<td align="center">-18%</td>
			<td align="center">-15%</td>
			<td align="center">-12%</td>
			<td align="center">-9%</td>
			<td align="center">-6%</td>
			<td align="center">-3%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td><b>No effect</b></td>
			<td align="center">-25%</td>
			<td align="center">-22%</td>
			<td align="center">-20%</td>
			<td align="center">-18%</td>
			<td align="center">-15%</td>
			<td align="center">-12%</td>
			<td align="center">-10%</td>
			<td align="center">-7%</td>
			<td align="center">-5%</td>
			<td align="center">-3%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td rowspan="2"><b>Sample size</b></td>
			<td><b>Effect</b></td>
			<td align="center">-10%</td>
			<td align="center">-8%</td>
			<td align="center">-7%</td>
			<td align="center">-5%</td>
			<td align="center">-4%</td>
			<td align="center">-2%</td>
			<td align="center">-1%</td>
			<td align="center">+1%</td>
			<td align="center">+2%</td>
			<td align="center">+4%</td>
			<td align="center">+5%</td>
		</tr>
		<tr>
			<td><b>No effect</b></td>
			<td align="center">-30%</td>
			<td align="center">-26%</td>
			<td align="center">-22%</td>
			<td align="center">-18%</td>
			<td align="center">-14%</td>
			<td align="center">-10%</td>
			<td align="center">-6%</td>
			<td align="center">-2%</td>
			<td align="center">+2%</td>
			<td align="center">+6%</td>
			<td align="center">+10%</td>
		</tr>
		<tr>
			<td colspan="2"><b>P-value</b></td>
			<td align="center">-20%</td>
			<td align="center">-17%</td>
			<td align="center">-14%</td>
			<td align="center">-11%</td>
			<td align="center">-8%</td>
			<td align="center">-5%</td>
			<td align="center">-2%</td>
			<td align="center">+1%</td>
			<td align="center">+4%</td>
			<td align="center">+7%</td>
			<td align="center">+10%</td>
		</tr>
		<tr>
			<td rowspan="2"><b>Conflict of interest</b></td>
			<td><b>Not a narrative review</b></td>
			<td align="center">-50%</td>
			<td align="center">-45%</td>
			<td align="center">-40%</td>
			<td align="center">-35%</td>
			<td align="center">-30%</td>
			<td align="center">-25%</td>
			<td align="center">-20%</td>
			<td align="center">-15%</td>
			<td align="center">-10%</td>
			<td align="center">-5%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td><b>Narrative review</b></td>
			<td align="center">-60%</td>
			<td align="center">-54%</td>
			<td align="center">-48%</td>
			<td align="center">-42%</td>
			<td align="center">-36%</td>
			<td align="center">-30%</td>
			<td align="center">-24%</td>
			<td align="center">-18%</td>
			<td align="center">-12%</td>
			<td align="center">-6%</td>
			<td align="center">0%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Notes</b></td>
			<td align="center">-50%</td>
			<td align="center">-40%</td>
			<td align="center">-30%</td>
			<td align="center">-20%</td>
			<td align="center">-10%</td>
			<td align="center">0%</td>
			<td align="center">+10%</td>
			<td align="center">+20%</td>
			<td align="center">+30%</td>
			<td align="center">+40%</td>
			<td align="center">+50%</td>
		</tr>
		<tr>
			<td colspan="2"><b>Publication bias</b></td>
			<td align="center">-10%</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">-</td>
			<td align="center">0%</td>
		</tr>
	</tbody>
</table>

* Only the first and last columns are hand-picked, the others are linearly interpolated

* The year part has a higher impact on reviews because it's more important for a review to be up-to-date than for an original experiment

* The study type part has a higher impact when the paper finds an effect because any sufficiently strong bias can cause a false positive, but to cause a false negative, only a bias that specifically masks the effect can do so

* The blinding method part has a higher impact when the paper finds an effect because lack of blinding can introduce placebo effects that can create false positives, but it's less likely to cause false negatives

* The sample size part has a higher impact when the paper finds no effect because a small sample size is not really a problem when finding an effect if the p-value is significant, but a small sample size can easily miss a real effect (by failing to achieve statistical significance) and cause a false negative

* The conflict of interest part has a higher impact for narrative reviews because their conclusions depends heavily on the selection and interpretation of the included studies, which is easier to bias than original experiment results, systematic reviews, or meta-analyses

* The notes part is applied for each note individually

This calculation is designed so that a paper with every green flag has a score around `1`, but it can go higher if it also has exceptionally good attributes such as thousands of citations or publication in one of the most prestigious journals. Literature reviews with many included papers can also reach a score above `1` even if they don't have perfect attributes, as they provide more robust evidence.

If you want to see how this calculation is implemented, you can check the **[source code](/src/lib/scoring/paper.ts)**.

If you have any feedback or suggestions about this calculation, please tell us in the **[Papermap Discord server](https://discord.gg/eFdjRJe7WZ)** or make a pull request directly.

<br/>

# 📊 Statistics

You can see the distribution of paper scores and individual attributes values / scores on the **[Statistics](https://papermap.org/statistics)** page of the website.
