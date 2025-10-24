-- Function to update board limit on plan change
CREATE OR REPLACE FUNCTION update_board_limit_on_plan_change()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If subscription plan changed to premium
  IF NEW.subscription_plan = 'premium' AND 
     (OLD.subscription_plan IS NULL OR OLD.subscription_plan = 'free') THEN
    NEW.boards_limit := 10000;  -- example high limit for premium
  -- If downgraded to free
  ELSIF NEW.subscription_plan = 'free' AND OLD.subscription_plan = 'premium' THEN
    NEW.boards_limit := 2;      -- default limit for free
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update board limit on plan change
CREATE TRIGGER update_board_limit
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_board_limit_on_plan_change();
