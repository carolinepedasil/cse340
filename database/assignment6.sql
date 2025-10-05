CREATE TABLE IF NOT EXISTS public.reviews (
  review_id SERIAL PRIMARY KEY,
  inv_id INTEGER NOT NULL REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES public.account(account_id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_inv_id ON public.reviews(inv_id);
