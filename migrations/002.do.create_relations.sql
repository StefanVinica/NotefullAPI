ALTER TABLE note
  ADD COLUMN
    folder INTEGER REFERENCES folders(id)
    ON DELETE SET NULL;
