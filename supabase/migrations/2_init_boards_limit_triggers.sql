-- Function to check board limits against profile
CREATE OR REPLACE FUNCTION check_board_limit()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_month text;
  monthly_count integer;
  user_limit integer;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(NOW(), 'YYYY-MM');
  
  -- Get user's board limit from profile
  SELECT boards_limit INTO user_limit 
  FROM public.profiles 
  WHERE user_id = NEW.user_id;
  
  -- Get current month's board count
  SELECT boards_created INTO monthly_count
  FROM public.usage_tracking
  WHERE user_id = NEW.user_id 
  AND year_month = current_month;

  -- If no row exists yet, treat count as 0
  IF monthly_count IS NULL THEN
    monthly_count := 0;
  END IF;

  -- Check if limit would be exceeded
  IF monthly_count >= user_limit THEN
      RAISE EXCEPTION 'Monthly board limit of % reached', user_limit;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to check limit before board insertion
CREATE TRIGGER enforce_board_limit
  BEFORE INSERT ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION check_board_limit();
