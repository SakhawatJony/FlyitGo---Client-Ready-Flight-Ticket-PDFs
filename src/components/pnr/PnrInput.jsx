import { TextField } from "@mui/material";

export default function PnrInput({ value, onChange, error, helperText }) {
  return (
    <TextField
      label="Paste GDS PNR"
      multiline
      minRows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      fullWidth
    />
  );
}
