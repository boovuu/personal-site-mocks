
COPY (SELECT to_json(t) FROM (SELECT id, industry, title, body, chain, tags, disclosure, attribution, proof_id, wide, position FROM cases ORDER BY position) t) TO '/tmp/mocks-work/generated/cases.json' (FORMAT JSON, ARRAY TRUE);
COPY (SELECT to_json(t) FROM (SELECT id, title, body FROM principles ORDER BY id) t) TO '/tmp/mocks-work/generated/principles.json' (FORMAT JSON, ARRAY TRUE);
COPY (SELECT to_json(t) FROM (SELECT code, title, body, link_label, href FROM exhibits) t) TO '/tmp/mocks-work/generated/exhibits.json' (FORMAT JSON, ARRAY TRUE);
