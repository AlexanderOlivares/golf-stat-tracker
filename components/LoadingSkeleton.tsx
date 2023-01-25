import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Card } from "@mui/material";

export default function LoadingSkeleton() {
  return (
    <Card sx={{ maxWidth: "sm", m: 1, height: 285, width: 332 }}>
      <Skeleton sx={{ margin: "auto", my: 2 }} variant="rectangular" height={25} width={225} />
      <Skeleton sx={{ margin: "auto", my: 2 }} variant="rectangular" width={125} height={45} />
      <Skeleton sx={{ margin: "auto" }} variant="rectangular" width={305} height={135} />
    </Card>
  );
}
