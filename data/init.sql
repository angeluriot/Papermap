DROP TABLE IF EXISTS journals;

CREATE TABLE journals (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	publisher TEXT,
	link TEXT,
	score REAL,
	metric_h REAL,
	metric_if REAL,
	metric_cs REAL,
	metric_sjr REAL,
	metric_snip REAL,
	metric_ef REAL,
	metric_ai REAL,
	metric_self REAL,
	metric_rti REAL,
	metric_top REAL,
	metric_alt REAL,
	score_h REAL,
	score_if REAL,
	score_cs REAL,
	score_sjr REAL,
	score_snip REAL,
	score_ef REAL,
	score_ai REAL,
	score_self REAL,
	score_rti REAL,
	score_top REAL,
	score_alt REAL
);

COPY journals(
	id,
	title,
	publisher,
	link,
	score,
	metric_h,
	metric_if,
	metric_cs,
	metric_sjr,
	metric_snip,
	metric_ef,
	metric_ai,
	metric_self,
	metric_rti,
	metric_top,
	metric_alt,
	score_h,
	score_if,
	score_cs,
	score_sjr,
	score_snip,
	score_ef,
	score_ai,
	score_self,
	score_rti,
	score_top,
	score_alt
)
FROM '/docker-entrypoint-initdb.d/journals.csv'
WITH (
	FORMAT csv,
	HEADER true
);
