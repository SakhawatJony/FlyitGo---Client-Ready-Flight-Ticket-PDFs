import { Button } from "@mui/material";

export default function ParseButton({ onParse, disabled }) {
  return (
    <Button variant="contained" onClick={onParse} disabled={disabled}>
      Generate Ticket
    </Button>
  );
}
