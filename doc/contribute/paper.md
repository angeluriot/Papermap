# 📄 How to add or edit papers?

Anyone can add or edit papers on the website, even if you don't have access to it! If you are a developer, you can also **[do it locally](/README.md#%EF%B8%8F-install)** and submit your changes yourself.

When adding a paper, you first need to enter its **DOI link** (or **title** and **year** if no DOI is available). The website will then try to automatically fill in some information (those marked with a `*` in this doc), the rest must be filled in manually.

Here is a list of the fields:

## Title*

The title of the paper.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>✍️ Text</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* If multiple versions exist, use the latest one (including changes like `RETRACTED: ...`)

## Authors*

The authors of the paper.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>📋 List of texts</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* At least `1`, no more than `4` (keep the original order)

## Year*

The year the paper was published.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td colspan="2">🔢 Number</td>
		</tr>
		<tr>
			<td><b>Range</b></td>
			<td><code>1500</code></td>
			<td>&lt;current year&gt;</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">✅ Yes</td>
		</tr>
	</tbody>
</table>

## Link*

A link to the paper.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>✍️ Text</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* A DOI link is preferred, use another link only if no DOI is available

## Has been published*

Whether the paper has been published in a journal or not.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>Yes</code><br/>
				<code>No (preprint)</code>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `Yes`: the paper has been published in a journal
	* `No (preprint)`: the paper is a preprint, it has not been published in a journal yet


## Journal*

The journal where the paper was published.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td colspan="2"><b>Has been published</b> = <code>Yes</code></td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>📰 Journal</td>
			<td><code>(Not found)</code></td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">✅ Yes</td>
		</tr>
	</tbody>
</table>

* Search for the journal using its name, if you can't find it, select `(Not found)`

## Retracted*

Whether the journal retracted the paper or not.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Has been published</b> = <code>Yes</code></td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>✅ Checkbox</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* If you don't know, leave it unchecked

## Citations*

The number of times the paper has been cited by other papers.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td colspan="2">🔢 Number</td>
		</tr>
		<tr>
			<td><b>Range</b></td>
			<td><code>0</code></td>
			<td><code>∞</code></td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">❌ No</td>
		</tr>
	</tbody>
</table>

* If the value has been automatically filled, keep it, even if you find a different one
* If it has not been filled and you cannot find the value, leave it empty

## Mostly critics

Whether the citations are mostly critics or not.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>✅ Checkbox</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* This is for specific cases of papers that are so criticized that they end up with lots of citations, if you don't know, leave it unchecked

## Previous consensus

The consensus in the literature at the time according to the paper about the map's question.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				It depends on the <b>map</b>, for example:<br/>
				<code>No consensus yet</code><br/>
				<code>No</code><br/>
				<code>Towards no</code><br/>
				<code>Towards yes</code><br/>
				<code>Yes</code><br/>
				<code>(No access)</code>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* If unclear, select `No consensus yet`
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## Paper result

The result / conclusion of the paper about the map's question.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Previous consensus</b> selected</td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				It depends on the <b>map</b> and the <b>previous consensus</b>,<br/>
				for example:<br/>
				<code>No</code><br/>
				<code>Yes but low confidence</code><br/>
				<code>Yes but small effect</code><br/>
				<code>Yes</code><br/>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The **previous consensus** needs to be selected first because the available options depend on it, for example if the **previous consensus** is  `No`, the **paper result** will not have a `Yes` option but a `Yes unlike literature` option instead

## Indirect result

Whether the conclusion of the paper about the map's question is based on indirect evidence or not.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Previous consensus</b> selected</td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>✅ Checkbox</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* If you don't know, leave it unchecked

## Quote

A short excerpt from the paper supporting the selected **paper result**.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>✍️ Text</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* You can use `[...]` to keep it short
* Do not put quotes around the text, they will be added automatically

## Review type

The type of literature review, if the paper is one.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>(Not a literature review)</code><br/>
				<code>Narrative review</code><br/>
				<code>Systematic review</code><br/>
				<code>Meta-analysis</code><br/>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `(Not a literature review)`: the paper is not a literature review
	* `Narrative review`: the paper is a qualitative summary of the existing literature on a particular topic
	* `Systematic review`: the paper is a comprehensive review of existing literature using a structured methodology to minimize bias
	* `Meta-analysis`: the paper is a statistical analysis that combines the results of multiple scientific studies
* If the paper is a literature review but you don't know the type, select `Narrative review`
* If several types are mentioned, select the last one (for example, if it is a systematic review and a meta-analysis, select `Meta-analysis`)

## Review of reviews

Whether most of the reviewed papers are literature reviews or not (if the paper is a literature review).

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td colspan="2">
				<b>Review type</b> selected and ≠ <code>(Not a literature review)</code>
			</td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>✅ Checkbox</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

## Number of papers included

The number of papers included in the literature review (if the paper is one).

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td colspan="2">
				<b>Review type</b> selected and ≠ <code>(Not a literature review)</code>
			</td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td colspan="2">🔢 Number</td>
		</tr>
		<tr>
			<td><b>Range</b></td>
			<td><code>1</code></td>
			<td><code>∞</code></td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">
				❌ No but with justification:<br/>
				<code>No access</code><br/>
				<code>Not specified</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* If you don't have access to the full text of the paper and the abstract does not help, select `No access`
* If the number of papers included is not specified, select `Not specified`

## Study type

The type of study / experiment described in the paper (or the reviewed papers if it's a literature review).

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>Case report</code><br/>
				<code>Ecological study</code><br/>
				<code>Cross-sectional study</code><br/>
				<code>Case-control study</code><br/>
				<code>Cohort study</code><br/>
				<code>Clinical trial</code><br/>
				<code>Randomized controlled trial</code><br/>
				<code>Blinded randomized controlled trial</code><br/>
				<code>(Diverse types)</code> (only for literature reviews)<br/>
				<code>(Diverse observational studies)</code> (only for literature reviews)<br/>
				<code>(Diverse clinical trials)</code> (only for literature reviews)<br/>
				<code>(No access)</code><br/>
				<code>(Not specified)</code><br/>
				<code>(No specific type)</code>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `Case report`: a report describing observations from a single patient or a small group of patients
	* `Ecological study`: an analysis of data collected from populations or groups rather than individuals
	* `Cross-sectional study`: an analysis of population data at a given point in time
	* `Case-control study`: a observational study comparing individuals with a condition to those without it
	* `Cohort study`: a study that follows a group of individuals over time to observe outcomes
	* `Clinical trial`: an experiment assessing the effects of an intervention under controlled conditions
	* `Randomized controlled trial`: a clinical trial where participants are randomly assigned to a control or an experimental group for a fair comparison
	* `Blinded randomized controlled trial`: a randomized controlled trial where participants and/or researchers are unaware of group assignments to reduce bias
	* `(Diverse observational studies)`: the paper is a literature review that includes various observational studies (case reports, ecological studies, cross-sectional studies, case-control studies or cohort studies)
	* `(Diverse clinical trials)`: the paper is a literature review that includes various clinical trials with or without randomization or blinding
	* `(Diverse types)`: the paper is a literature review that includes studies of various types
	* `(No access)`: you don't have access to the full text of the paper and the abstract does not help
	* `(Not specified)`: the type of study is not specified in the paper
	* `(No specific type)`: the study does not fit into any category
* If the paper is a literature review, use the most common type of study in the reviewed papers
* If the paper is a literature review of literature reviews, use the initial non-review papers

## Subjects

The subjects on which the experiments were performed.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>In vitro</code><br/>
				<code>Animals</code><br/>
				<code>Humans</code><br/>
				<code>(Diverse subjects)</code> (only for literature reviews)<br/>
				<code>(No access)</code><br/>
				<code>(Not specified)</code><br/>
				<code>(Not applicable)</code>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `In vitro`: experiments conducted in a controlled environment outside of a living organism
	* `Animals`: experiments conducted on non‑human living organisms (often mice or rats)
	* `Humans`: experiments conducted on human subjects
	* `(Diverse subjects)`: the paper is a literature review that includes studies on various subjects (only for literature reviews)
	* `(No access)`: you don't have access to the full text of the paper and the abstract does not help
	* `(Not specified)`: the subjects on which the experiments were performed are not specified in the paper
	* `(Not applicable)`: the experiment does not involve any subjects
* If the paper is a literature review, use the most common subjects in the reviewed papers, or `(Diverse subjects)` if the paper includes studies on various subjects
* If the paper is a literature review of literature reviews, use the initial non-review papers

## Sample size

The number of participants in the study.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td colspan="2">🔢 Number</td>
		</tr>
		<tr>
			<td><b>Range</b></td>
			<td><code>1</code></td>
			<td><code>∞</code></td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">
				❌ No but with justification:<br/>
				<code>No access</code><br/>
				<code>Not specified</code><br/>
				<code>Not applicable</code>
			</td>
		</tr>
	</tbody>
</table>

* If the paper is a literature review, use the total number of participants in the reviewed papers
* If the paper is a literature review of literature reviews, use the total number of participants in the initial non-review papers
* If you don't have access to the full text of the paper and the abstract does not help, select `No access`
* If the sample size is not specified, select `Not specified`
* If the study does not involve any participants, select `Not applicable`

## P-value

The chance of observing the same results if there is no real effect, a low p-value indicates that the results are statistically significant.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td colspan="2">🔢 Number</td>
		</tr>
		<tr>
			<td><b>Range</b></td>
			<td><code>0</code></td>
			<td><code>1</code></td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td colspan="2">
				❌ No but with justification:<br/>
				<code>No access</code><br/>
				<code>Not specified</code><br/>
				<code>Not applicable</code>
			</td>
		</tr>
	</tbody>
</table>

* If multiple p-values are reported, use the one that is the most relevant to the map's question
* This field only applies to papers that report a statistically significant effect, if the paper concludes that there is no significant effect, select `Not applicable`
* If you don't have access to the full text of the paper and the abstract does not help, select `No access`
* If the p-value is not specified, select `Not specified`
* If the paper is a literature review and does not contain a meta-analysis, it will probably not provide a p-value, if so, select `Not applicable`

## Conflict of interest

Whether the authors of the paper have any conflict of interest.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>None</code><br/>
				<code>Some links</code><br/>
				<code>Yes</code><br/>
				<code>Yes but opposite results</code><br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `None`: the authors declared no conflict of interest and no external sources contradict this
	* `Some links`: some authors had links to biased persons or organizations in the past
	* `Yes but opposite results`: the authors or funders have conflicting interests but the results are the opposite of what would benefit them
	* `Yes`: the authors or funders have conflicting interests that may have influenced the conclusion
	* `(No access)`: you don't have access to the full text of the paper and the abstract does not help
* If the paper does not mention any conflict of interest, select `None`
* If the authors lied, select `Yes` and add a **[note](#notes)** with a link to the source that proves it

## Notes

Additional information about the paper.

<table>
	<tbody>
		<tr>
			<td><b>Type</b></td>
			<td>📒 List of notes</td>
		</tr>
		<tr>
			<td><b>Note fields</b></td>
			<td>
				<table>
					<tbody>
						<tr>
							<td>Title</td>
							<td>✍️ Text</td>
						</tr>
						<tr>
							<td>Description</td>
							<td>✍️ Text</td>
						</tr>
						<tr>
							<td>Link</td>
							<td>✍️ Text</td>
						</tr>
						<tr>
							<td>Impact</td>
							<td>
								👆 Choice:<br/>
								<code>Extremely negative</code><br/>
								<code>Negative</code><br/>
								<code>Neutral</code><br/>
								<code>Positive</code><br/>
								<code>Extremely positive</code><br/>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>❌ No</td>
		</tr>
	</tbody>
</table>

* **Title** is a very short overview of information
* **Description** is a short description of the information
* **Link** is optional, it can be used if the information does not come from the paper
* **Impact** is a subjective assessment of the information's effect on the paper's credibility or its impact on the map's question:
	* `Extremely negative` is for information that drastically reduces the credibility of the paper or its impact on the map's question (for example if it has been proven that the authors falsified their results or if there's a major calculation error that completely changes the conclusion)
	* `Very negative` is for information that highly reduces the credibility of the paper or its impact on the map's question (for example if the authors are controversial and have done poor research in the past)
	* `Negative` is for information that may reduce the credibility of the paper or its impact on the map's question (for example if there are criticisms about the quality of the data used in the paper)
	* `Neutral` is for information that does not significantly affect the credibility of the paper or its impact on the map's question
	* `Positive` is for information that may increase the credibility of the paper or its impact on the map's question
	* `Very positive` is for information that highly increases the credibility of the paper or its impact on the map's question (for example if an observational study is based on data from groups which were initially randomly assigned)
	* `Extremely positive` is for information that drastically increases the credibility of the paper or its impact on the map's question (there is probably no such case)
* Do not add notes about things that are already covered by the other fields
* The maximum number of notes is `5`
