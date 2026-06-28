-- =====================================================================
-- Mfadholi.Dev Academy — Helper Functions
-- =====================================================================

create or replace function increment_total_students(course_id_input uuid)
returns void as $$
begin
  update courses set total_students = total_students + 1 where id = course_id_input;
end;
$$ language plpgsql security definer;

-- Recompute course_progress.progress_percent based on completed lessons
create or replace function recompute_course_progress(p_user_id uuid, p_course_id uuid)
returns void as $$
declare
  total_lessons integer;
  completed_lessons integer;
  new_percent integer;
begin
  select count(*) into total_lessons from lessons where course_id = p_course_id;

  select count(*) into completed_lessons
  from lesson_progress
  where user_id = p_user_id and course_id = p_course_id and is_completed = true;

  if total_lessons = 0 then
    new_percent := 0;
  else
    new_percent := round((completed_lessons::numeric / total_lessons::numeric) * 100);
  end if;

  update course_progress
  set progress_percent = new_percent,
      is_completed = (new_percent >= 100),
      completed_at = case when new_percent >= 100 then now() else completed_at end
  where user_id = p_user_id and course_id = p_course_id;
end;
$$ language plpgsql security definer;
