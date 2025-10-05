# 📃 How to add or edit papers?

Anyone can add or edit papers on the website, even if you don't have access to it! If you are a developer, you can also **[do it locally](/README.md#%EF%B8%8F-install)** and submit your changes yourself. Feel free to join the **[Discord server](https://discord.gg/eFdjRJe7WZ)** if you need help.

On the page of a map, click on the `✏️` button to activate the edit mode, then an `✒️ Edit` and a `🗑️ Delete` button will appear on each paper in addition to a `➕` button at the bottom right of the page.

When adding a paper (by clicking on the `➕` button), you first need to enter its **DOI link** (or **title** and **year** if no DOI is available). The website will then try to automatically fill in some information (those marked with a `*` in this doc), the rest must be filled in manually.

Here is a list of the fields:

## 📋 Summary

* **[Title*](#title)**
* **[Is an institutional report](#is-an-institutional-report)**
	* [Institution name](#institution-name)
	* [Institution acronym](#institution-acronym)
* **[Authors*](#authors)**
* **[Year*](#year)**
* **[Link*](#link)**
* **[Has been published*](#has-been-published)**
	* [Journal*](#journal)
	* [Retracted*](#retracted)
* **[Citations*](#citations)**
* **[Previous consensus](#previous-consensus)**
* **[Paper result](#paper-result)**
* **[Indirect result](#indirect-result)**
* **[Quote](#quote)**
* **[Review type](#review-type)**
	* [Review of reviews](#review-of-reviews)
	* [Number of papers included](#number-of-papers-included)
	* [Minor topic](#minor-topic)
* **[Study type](#study-type)**
	* [Blinding method](#blinding-method)
* **[Sample size](#sample-size)**
* **[P-value](#p-value)**
* **[Conflict of interest](#conflict-of-interest)**
* **[Notes](#notes)**

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

## Is an institutional report

Whether the paper is a report from an institution (a health agency or a government authority for example).

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
				<code>No</code>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>✅ Yes</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `Yes`: the paper is a report from an institution (a health agency or a government authority for example)
	* `No`: the paper is not a report from an institution

## Institution name

The name of the institution that authored the paper.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Is an institutional report</b> = <code>Yes</code></td>
		</tr>
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

* For example: "European Food Safety Authority"

## Institution acronym

The acronym (or abbreviation) of the institution that authored the paper.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Is an institutional report</b> = <code>Yes</code></td>
		</tr>
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

* For example: "EFSA"

## Authors*

The authors of the paper (if not an institution).

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td><b>Is an institutional report</b> = <code>No</code></td>
		</tr>
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
				<code>No</code>
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
	* `No`: the paper is a preprint (or an institutional report), it has not been published in a journal yet


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
			<td colspan="2">✅ Yes</td>
		</tr>
	</tbody>
</table>

* If it has not been automatically filled and you cannot find the value, put `0`

## Previous consensus

The consensus in the literature at the time according to the paper about the map question.

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
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>
				❌ No but with justification:<br/>
				<code>(Not specified)</code><br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* If unclear, select `No consensus yet`
* If the paper does not mention previous work, select `(Not specified)`
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## Paper result

The result / conclusion of the paper about the map question.

<table>
	<tbody>
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

* The selected **previous consensus** can have an effect on the available options, for example if the **previous consensus** is  `No`, the **paper result** will not have a `Yes` option but a `Yes unlike literature` option instead

## Indirect result

Whether the conclusion of the paper about the map question is based on indirect evidence or not.

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
				<code>Review</code><br/>
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
	* `Review`: the paper is a reanalysis or commentary on existing literature
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
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* If the number of papers included is not specified, give an approximation
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## Minor topic

Whether the question of the map is the main subject of the review or only a small portion of the papers included are actually used to answer it.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td>
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

* If you don't know, leave it unchecked

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
				<code>In vitro study</code><br/>
				<code>Case report</code><br/>
				<code>Animal study</code><br/>
				<code>Ecological study</code><br/>
				<code>Cross-sectional study</code><br/>
				<code>Case-control study</code><br/>
				<code>Cohort study</code><br/>
				<code>Clinical trial</code><br/>
				<code>Randomized controlled trial</code><br/>
				<code>Other type</code><br/>
				<code>(Diverse observational studies)</code> (only for literature reviews)<br/>
				<code>(Diverse clinical trials)</code> (only for literature reviews)<br/>
				<code>(Diverse human studies)</code> (only for literature reviews)<br/>
				<code>(Diverse types)</code> (only for literature reviews)<br/>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>
				❌ No but with justification:<br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `In vitro study`: an experiment conducted in a controlled environment outside of a living organism
	* `Case report`: a report describing observations from a single patient or a small group of patients
	* `Animal study`: an experiment conducted on non-human living organisms (often mice or rats)
	* `Ecological study`: an analysis of data collected from populations or groups rather than individuals
	* `Cross-sectional study`: an analysis of population data at a given point in time
	* `Case-control study`: a observational study comparing individuals with a condition to those without it
	* `Cohort study`: a study that follows a group of individuals over time to observe outcomes
	* `Clinical trial`: an experiment assessing the effects of an intervention under controlled conditions
	* `Randomized controlled trial`: a clinical trial where participants are randomly assigned to a control or an experimental group for a fair comparison
	* `(Diverse observational studies)`: the paper is a literature review that includes various observational studies (case reports, ecological studies, cross-sectional studies, case-control studies, or cohort studies)
	* `(Diverse clinical trials)`: the paper is a literature review that includes various clinical trials with or without randomization
	* `(Diverse human studies)`: the paper is a literature review that includes various human studies (clinical trials and observational studies)
	* `(Diverse types)`: the paper is a literature review that includes studies of various types
* If the paper is a literature review, use the most common type of study in the reviewed papers
* If the paper is a literature review of literature reviews, use the initial non-review papers
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## Blinding method

The blinding method used in the study (if any).

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td>
				<b>Study type</b> = <code>Randomized controlled trial</code> or <code>(Diverse clinical trials)</code> or <code>(Diverse human studies)</code> or <code>(Diverse types)</code>
			</td>
		</tr>
		<tr>
			<td><b>Type</b></td>
			<td>👆 Choice</td>
		</tr>
		<tr>
			<td><b>Options</b></td>
			<td>
				<code>None</code><br/>
				<code>Participants</code> (only for RCT)<br/>
				<code>Participants and investigators</code> (only for RCT)<br/>
				<code>(Diverse blinding)</code> (only for literature reviews)<br/>
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>
				❌ No but with justification:<br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `None`: no blinding method mentioned in the paper
	* `Participants`: participants were unaware of their group assignment to avoid placebo effects and response bias
	* `Participants and investigators`: both participants and investigators were unaware of group assignments to avoid placebo effects and bias in treatment administration or outcome assessment
	* `(Diverse blinding)`: diverse blinding strategies were employed across studies (none, single-blind, or double-blind)
* If the investigators were blinded but not the participants, select `None`
* If the paper is a literature review, use the most common blinding method in the reviewed papers, or `(Diverse blinding)` if the paper includes studies with various blinding methods
* If the paper is a literature review of literature reviews, use the initial non-review papers
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## Sample size

The number of participants in the study.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td colspan="2">
				<b>Study type</b> ≠ <code>In vitro study</code>
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
				<code>(Not specified)</code><br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* If the paper is a literature review, use the total number of participants in the reviewed papers
* If the paper is a literature review of literature reviews, use the total number of participants in the initial non-review papers
* If the sample size is not specified, select `(Not specified)`
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

## P-value

The chance of observing the same results if there is no real effect, a low p-value indicates that the results are statistically significant.

<table>
	<tbody>
		<tr>
			<td><b>Condition</b></td>
			<td colspan="2">
				<b>Paper result</b> compatible with p-value AND <b>Review type</b> ≠ <code>Narative review</code> OR <code>Systematic review</code>
			</td>
		</tr>
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
				<code>(Not specified)</code><br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* This field only applies to papers that report a statistically significant effect, if the paper concludes that there is no significant effect, this field will not be available
* If multiple p-values are reported, use the one that is the most relevant to the map question
* If the p-value is not specified, select `(Not specified)`
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

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
			</td>
		</tr>
		<tr>
			<td><b>Required</b></td>
			<td>
				❌ No but with justification:<br/>
				<code>(No access)</code><br/>
			</td>
		</tr>
	</tbody>
</table>

* The options are:
	* `None`: the authors declared no conflict of interest and no external sources contradict this
	* `Some links`: some authors had links to biased persons or organizations in the past
	* `Yes but opposite results`: the authors or funders have conflicting interests but the results are the opposite of what would benefit them
	* `Yes`: the authors or funders have conflicting interests that may have influenced the conclusion
* If the paper does not mention any conflict of interest, select `None`
* If the authors lied, select `Yes` and add a **[note](#notes)** with a link to a source that proves it
* If you don't have access to the full text of the paper and the abstract does not help, select `(No access)`

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
								<code>Very negative</code><br/>
								<code>Negative</code><br/>
								<code>Neutral</code><br/>
								<code>Positive</code><br/>
								<code>Very positive</code><br/>
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
* **Impact** is a subjective assessment of the information's effect on the paper's credibility or its impact on the map question:
	* `Very negative` is for information that highly reduces the credibility of the paper or its impact on the map question (for example if it has been proven that the authors falsified their results or if there's a major calculation error that completely changes the conclusion)
	* `Negative` is for information that may reduce the credibility of the paper or its impact on the map question (for example if there are criticisms about the quality of the data used in the paper or issues with the authors' previous work)
	* `Neutral` is for information that does not significantly affect the credibility of the paper or its impact on the map question
	* `Positive` is for information that may increase the credibility of the paper or its impact on the map question
	* `Very positive` is for information that highly increases the credibility of the paper or its impact on the map question (for example if an observational study is based on data from groups which were initially randomly assigned)
* Do not add notes about things that are already covered by the other fields
* The maximum number of notes is `5`

<br/>

When all fields are filled, click on the `Add the paper` button if you are adding a new paper, or on the `Edit the paper` button if you are editing an existing paper.

The added / edited paper will then appear in semi-transparent and the number above the `➤` button will increase by `1`.

To send your changes, click on the `➤` button and fill the fields in the form that appears:

* `Comment`: optional information about your changes *(optional)*

* `Discord username`: for the `Contributor` role on the **[Papermap discord](https://discord.gg/eFdjRJe7WZ)** *(optional)*

Then click on the `Submit` button, this will redirect you to GitHub Pull Request created by a bot with your changes.

If you did this locally, you will have an `Apply locally` button to apply the changes to your local copy of the repository that you can then commit and push yourself to create the Pull Request.

Once the Pull Request created, it will be reviewed by a maintainer and merged if everything is correct.

If you encounter any issues, feel free to ask in the **[Discord server](https://discord.gg/eFdjRJe7WZ)**.
