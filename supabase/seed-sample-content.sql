-- Sample content seed (free, hand-authored) for testing the content hub without
-- TMDB ingest or paid AI scoring. Covers the full safety spectrum so fail-safe
-- defaults (#4) and value-profile presets (#5) are visibly testable.
-- Idempotent: re-running does nothing for existing ids.

insert into public.content_catalog
  (id, tmdb_id, content_type, title, description, release_year, genres, tmdb_rating, tmdb_vote_count, runtime_minutes, age_rating, platforms)
values
  ('sample:series:1', 900001, 'series', 'Bluey', 'A lovable Blue Heeler puppy and her family play imaginative games.', 2018, '{animation,family,kids,comedy}', 8.4, 1200, 8, 'TV-Y', '{disney}'),
  ('sample:movie:2', 900002, 'movie', 'Toy Story', 'A cowboy doll is threatened by a new spaceman figure.', 1995, '{animation,family,comedy,kids}', 8.3, 18000, 81, 'G', '{disney}'),
  ('sample:movie:3', 900003, 'movie', 'Finding Nemo', 'A clownfish searches the ocean for his lost son.', 2003, '{animation,family,adventure}', 7.8, 19000, 100, 'G', '{disney}'),
  ('sample:movie:4', 900004, 'movie', 'Frozen', 'A fearless princess sets off to find her estranged sister.', 2013, '{animation,family,musical}', 7.3, 16000, 102, 'PG', '{disney}'),
  ('sample:movie:5', 900005, 'movie', 'Harry Potter and the Sorcerer''s Stone', 'A boy discovers he is a wizard and attends a magical school.', 2001, '{fantasy,adventure,family}', 7.9, 25000, 152, 'PG', '{prime,apple}'),
  ('sample:movie:6', 900006, 'movie', 'The Avengers', 'Earth''s mightiest heroes unite against a global threat.', 2012, '{action,adventure,scifi}', 7.7, 30000, 143, 'PG-13', '{disney}'),
  ('sample:series:7', 900007, 'series', 'Wednesday', 'Wednesday Addams navigates a strange new school and visions.', 2022, '{comedy,fantasy,mystery}', 8.1, 14000, 50, 'TV-14', '{netflix}'),
  ('sample:series:8', 900008, 'series', 'Stranger Things', 'Kids in a small town uncover supernatural mysteries.', 2016, '{drama,scifi,horror}', 8.6, 28000, 50, 'TV-14', '{netflix}'),
  ('sample:series:9', 900009, 'series', 'Breaking Bad', 'A chemistry teacher turns to manufacturing drugs.', 2008, '{drama,crime,thriller}', 9.5, 40000, 49, 'TV-MA', '{netflix}'),
  ('sample:series:10', 900010, 'series', 'The Witcher', 'A solitary monster hunter struggles in a turbulent world.', 2019, '{fantasy,action,drama}', 8.0, 17000, 60, 'TV-MA', '{netflix}'),
  ('sample:series:11', 900011, 'series', 'Squid Game', 'Cash-strapped players join deadly children''s games for a prize.', 2021, '{drama,thriller,action}', 7.8, 24000, 55, 'TV-MA', '{netflix}'),
  ('sample:movie:12', 900012, 'movie', 'Joker', 'A failed comedian descends into madness and crime.', 2019, '{crime,drama,thriller}', 8.1, 26000, 122, 'R', '{prime,hbo}')
on conflict (id) do nothing;

insert into public.content_scores
  (content_id, violence, language, sexual_content, fear_factor, substance_use, themes, recommended_min_age, guardian_safe_age, data_sources)
values
  ('sample:series:1',  0, 0, 0, 0, 0, '{"bullying":false,"darkThemes":false,"war":false,"romance":false,"drugs":false,"alcohol":false}', 0, 0, '{sample}'),
  ('sample:movie:2',   1, 0, 0, 1, 0, '{"bullying":true,"darkThemes":false,"war":false,"romance":false,"drugs":false,"alcohol":false}', 3, 3, '{sample}'),
  ('sample:movie:3',   1, 0, 0, 3, 0, '{"bullying":false,"darkThemes":false,"war":false,"romance":false,"drugs":false,"alcohol":false}', 5, 6, '{sample}'),
  ('sample:movie:4',   1, 0, 0, 2, 0, '{"bullying":false,"darkThemes":false,"war":false,"romance":true,"drugs":false,"alcohol":false}', 5, 5, '{sample}'),
  ('sample:movie:5',   3, 1, 0, 4, 0, '{"bullying":true,"darkThemes":true,"war":false,"romance":false,"drugs":false,"alcohol":false}', 8, 9, '{sample}'),
  ('sample:movie:6',   5, 2, 1, 4, 1, '{"bullying":false,"darkThemes":false,"war":true,"romance":true,"drugs":false,"alcohol":true}', 12, 12, '{sample}'),
  ('sample:series:7',  3, 2, 1, 5, 1, '{"bullying":true,"darkThemes":true,"war":false,"romance":true,"drugs":false,"alcohol":false}', 13, 14, '{sample}'),
  ('sample:series:8',  5, 3, 2, 7, 2, '{"bullying":true,"darkThemes":true,"war":false,"romance":true,"drugs":true,"alcohol":true}', 14, 15, '{sample}'),
  ('sample:series:9',  7, 7, 3, 6, 9, '{"bullying":false,"darkThemes":true,"war":false,"romance":false,"drugs":true,"alcohol":true}', 18, 18, '{sample}'),
  ('sample:series:10', 8, 6, 7, 6, 4, '{"bullying":false,"darkThemes":true,"war":true,"romance":true,"drugs":false,"alcohol":true}', 18, 18, '{sample}'),
  ('sample:series:11', 9, 7, 4, 8, 3, '{"bullying":true,"darkThemes":true,"war":false,"romance":false,"drugs":false,"alcohol":true}', 18, 18, '{sample}'),
  ('sample:movie:12',  8, 8, 2, 7, 6, '{"bullying":true,"darkThemes":true,"war":false,"romance":false,"drugs":true,"alcohol":true}', 18, 18, '{sample}')
on conflict (content_id) do nothing;
