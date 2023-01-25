import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";

interface IKeyValueCardProps {
  label: string;
  value: string | number | ReactElement;
}

export default function KeyValueCard({ label, value }: IKeyValueCardProps) {
  return (
    <>
      {value && (
        <Card sx={{ maxWidth: "sm", m: 1 }}>
          <CardContent>
            <>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {label}
              </Typography>
              <Box>{value}</Box>
            </>
          </CardContent>
        </Card>
      )}
    </>
  );
}
