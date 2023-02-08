import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IImageCard } from "../content/LandingPage";

export default function ImageCard({ title, image, value, alt }: IImageCard) {
  return (
    <Card sx={{ maxWidth: 345, my: 2, boxShadow: 4 }}>
      <CardMedia component="img" alt={alt} image={image} />
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
