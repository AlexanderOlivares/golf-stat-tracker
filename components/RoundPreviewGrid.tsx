import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IRoundPreview } from "../pages/[username]/profile";

interface IRoundPreviewProps {
  roundPreview: IRoundPreview[];
}

const columns: GridColDef[] = [
  {
    field: "Date",
    headerName: "Date",
    width: 90,
    valueGetter: (params: GridValueGetterParams) => `${params.row.round_date || ""}`,
  },
  {
    field: "Course",
    headerName: "Course",
    width: 150,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.course_name || ""}`,
  },
  {
    field: "Score",
    headerName: "Score",
    width: 150,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.score || ""}`,
  },
  {
    field: "FW Hit",
    headerName: "FW Hit",
    width: 150,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.fairwaysHit || ""}`,
  },
  {
    field: "GIR",
    headerName: "GIR",
    type: "number",
    width: 110,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.greensInReg || ""}`,
  },
  {
    field: "3-Putts",
    headerName: "3-Putts",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) => `${params.row.threePutts || ""}`,
  },
  {
    field: "Total Putts",
    headerName: "Total Putts",
    type: "number",
    width: 110,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.totalPutts || ""}`,
  },
];

const RoundPreviewGrid: React.FC<IRoundPreviewProps> = ({ roundPreview }: IRoundPreviewProps) => {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        getRowId={row => row.round_id}
        rows={roundPreview}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // checkboxSelection
        // disableSelectionOnClick
        // experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default RoundPreviewGrid;
